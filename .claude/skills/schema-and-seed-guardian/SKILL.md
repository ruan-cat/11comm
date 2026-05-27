---
name: schema-and-seed-guardian
description: 当你修改数据库结构或种子生成脚本时，请务必阅读并遵循此指南，以防止性能问题、数据一致性崩溃和部署失败。新 Schema 应在 apps/type 中创建。
---

# Schema and Seed Guardian

> **[MIGRATION NOTICE]** Schema 定义位置正在迁移中:
>
> - **旧位置 (Legacy)**: `apps/admin/server/db/schemas` - 仅供只读参考，新 Schema 应在 `apps/type/src/business/{domain}/{module}/schema.ts` 中创建
> - **新位置 (Active)**: `apps/type/src/business/**/schema.ts` - **所有新 Schema 必须在此创建**
> - **迁移入口 (Active)**: Drizzle Kit 配置、`drizzle/**` 迁移目录、`db:*` 脚本、Neon readiness/drift 诊断和受控迁移执行归 `apps/api`；`apps/admin` 只作为 legacy source 或兼容参考。
>
> **重要**: 当你需要添加新列或新表时，应在 `apps/type/src/business/{domain}/{module}/schema.ts` 中创建 Zod Schema + Drizzle Table。

本技能总结了项目在数据库架构变更和种子数据生成方面的血泪经验。请在进行相关开发时严格查阅以下 Checklist。

## I. Database Schema 变更规范

**在修改或新增 Schema 定义时**:

- **新 Schema**: 在 `apps/type/src/business/**/schema.ts` 中创建
- **现有 Schema (Legacy)**: 在 `apps/type/src/business/{domain}/{module}/schema.ts` 中维护（仅限已存在的表）

### 1. 软删除与唯一索引 (Critical)

**风险**：如果表使用了软删除（即存在 `deletedAt` 字段），**绝对禁止**使用普通的 `.uniqueIndex()`。
**后果**：用户删除了记录 A，尝试重新创建相同关键信息的记录 B 时，会被数据库的唯一索引拦截（因为它包含已删除的记录）。
**规范**：
必须为唯一索引添加部分条件 (`WHERE deleted_at IS NULL`)。通过 `drizzle-orm` 的 `.where(isNull(table.deletedAt))` 实现。

```typescript
// 错误示例
uniqueIndex("idx_code").on(table.code);

// 正确示例
import { isNull } from "drizzle-orm";
// ...
(table) => [uniqueIndex("idx_code").on(table.code).where(isNull(table.deletedAt))];
```

### 2. 物理外键约束 (Important)

**风险**：仅定义 `...Id` 字段而不建立 `.references()`。
**后果**：产生孤儿数据，应用层逻辑复杂化。
**规范**：
除非是多态关联（一个字段对应多张表），否则**必须**使用 `.references(() => otherTable.id)` 建立物理外键。

### 3. 反向/循环依赖 (Architecture)

**规范**：

- 严格遵守分层架构（Common -> Setting/Community -> HouseProperty -> Parking/Contract -> Expense/Patrol）。
- 避免在底层模块（如 HouseProperty）中引入高层模块（如 Expense）的表定义。
- 如遇业务闭环（如发票引用支付，支付引用发票），请断开其中一侧的物理外键依赖，改用逻辑校验，或引入更高层模块。

---

## II. Seed 数据生成脚本开发规范

### Seed 脚本规范 (Direct Seed)

在编写或修改 Seed 模块时 (`apps/admin/server/db/seed/modules/*.seed.ts`)：

#### 规范 1: 使用类型安全的直接插入

- 使用 Drizzle Insert 类型定义数据，TypeScript 编译器会在 schema 变更后自动报错
- 使用 `db.insert(table).values([...])` 直接插入
- 禁止使用 `as any` 类型断言

#### 规范 2: 使用 sid() 生成确定性 UUID

- `sid(scope, key)` 基于 uuid v5 生成确定性 ID
- 跨模块引用时使用相同的 `sid()` 调用确保外键一致
- 例如：`communityId: sid("community", "sunshine")` 在所有模块中生成相同的 UUID

#### 规范 3: 枚举值直接使用英文

- 直接写 `"enabled"` 而非 `toStatusEnum("启用")`
- 直接写 `"approved"` 而非 `toAuditStatusEnum("已通过")`

#### 规范 4: 命令使用

- `pnpm -F @01s-11comm/api db:generate` — 从 `apps/type` schema 生成 Drizzle 迁移
- `pnpm -F @01s-11comm/api db:migrate` — 通过统一 API 子包执行受控迁移

以上迁移命令应通过 `apps/api` 的 DB 运维入口执行。历史 `apps/admin` seed/reset 脚本若仍存在，只能按 legacy source 或兼容路径处理；在 `apps/api` 提供专门 seed/reset 能力前，不得把 admin seed/reset 误写成新的长期权威项目。
