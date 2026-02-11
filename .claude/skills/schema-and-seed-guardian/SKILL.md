---
name: schema-and-seed-guardian
description: 当你修改数据库结构或种子生成脚本时，请务必阅读并遵循此指南，以防止性能问题、数据一致性崩溃和部署失败。新 Schema 应在 apps/type 中创建。
---

# Schema and Seed Guardian

> **[MIGRATION NOTICE]** Schema 定义位置正在迁移中:
>
> - **旧位置 (Legacy)**: `apps/admin/server/db/schemas` - 仅供只读参考，不要添加新 Schema
> - **新位置 (Active)**: `apps/type/src/business/**/schema.ts` - **所有新 Schema 必须在此创建**
>
> **重要**: 当你需要添加新列或新表时，应在 `apps/type` 项目中创建 Zod Schema + Drizzle Table，而非在 `apps/admin/server/db/schemas` 中。

本技能总结了项目在数据库架构变更和种子数据生成方面的血泪经验。请在进行相关开发时严格查阅以下 Checklist。

## I. Database Schema 变更规范

**在修改或新增 Schema 定义时**:

- **新 Schema**: 在 `apps/type/src/business/**/schema.ts` 中创建
- **现有 Schema (Legacy)**: 在 `apps/admin/server/db/schemas/*.ts` 中维护（仅限已存在的表）

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

在编写或修改 Seed 生成逻辑时 (`apps/admin/server/db/seed-sql/*.ts`)：

### 1. 性能陷阱 (Performance)

**风险**：在 SQL 参数替换，或循环拼接字符串时使用低效算法。
**案例**：`toFullSql` 曾因 O(N\*M) 的 `split` 实现导致 CPU 100% 卡死。
**规范**：

- 禁止在循环中做昂贵的字符串操作。
- SQL 参数替换必须使用 Regex 或专门的 builder。
- 批量插入（Batch Insert）优于单条循环插入。

### 2. ID 映射与外键解析 (Data Integrity)

**风险**：Mock 数据使用自然键（如姓名 "张三"）引用，而数据库使用 UUID。
**后果**：`idMap.get("hp_owners", "张三")` 失败（因为 idMap 可能只存了 ID 注册时的 Mock ID），导致插入 NULL 到非空外键，引发 Crash。
**规范**：

- **建立 Name Lookup**：如果 Mock 数据通过 Name 关联，必须在生成主表时，额外维护一个 `Map<Name, UUID>`。
- **防御性编程 (Defensive Programming)**：
  ```typescript
  const ownerId = nameMap.get(item.ownerName) || idMap.get("hp_owners", item.ownerName);
  if (!ownerId) {
  	console.warn(`Skipping record: Owner ${item.ownerName} not found`);
  	return null; // 必须处理 null/undefined，以配合 .filter(Boolean) 移除无效记录
  }
  ```

### 3. 日期格式 (Data Types)

**风险**：Mock 数据使用 `2024-01` 或 `2024年Q1` 等非标准格式。
**后果**：PostgreSQL Date 类型解析失败，脚本崩溃。
**规范**：

- 入库前必须清洗日期格式，统一转换为 `YYYY-MM-DD`。

### 4. 依赖完整性 (Execution Order)

**风险**：仅生成子模块 Seed 时，因依赖模块未运行导致 `IdMap` 为空。
**规范**：

- 即使只生成子模块，脚本框架也必须**空运行**所有依赖模块的生成逻辑（注册 ID 但不输出 SQL），以填充内存中的 `IdMap`。

### 5. 清理机制 (File Management)

**规范**：

- 每次生成前，必须清理 (`Wipe`) 输出目录，防止旧文件名（如 `01-old.sql`）与新文件名（`02-new.sql`）并存导致的数据冲突。当使用 `db:generate-seed` 时，确保脚本执行了清理动作。
