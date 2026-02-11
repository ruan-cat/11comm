---
name: project-schema-registry
description: 项目数据库schema架构综合指南，包含架构原则、编写标准（Trinity Pattern）和详细的领域参考。用于定义新表、修改schema或理解数据模型时使用。
---

# 项目 Schema 注册表 (Project Schema Registry)

本技能提供项目数据库 Schema 架构、编写标准和特定领域数据定义的权威指南。

## 统一 Schema 架构（Single Source of Truth）

`apps/type` 包是所有数据定义的 Single Source of Truth（唯一事实来源）。对于每个业务实体，它**必须**导出三种产物：

1.  **Drizzle Table**: 原始数据库表定义（例如 `communities`）。
2.  **Zod Schemas**: 用于 Insert、Select 和 Update 操作的运行时验证对象（例如 `insertCommunitySchema`）。
3.  **TypeScript Types**: 从 Drizzle 或 Zod schemas 推断的静态类型（例如 `type NewCommunity`）。

### 关键要求 (Key Requirements)

- **统一定义**: 开发者必须从 `@01s-11comm/type` 导入表、schemas 和类型。
- **业务路径组织**: Schema 文件必须位于 `apps/type/src/business/<domain>/<module>/schema.ts`。
- **全栈验证**:
  - **后端**: `apps/admin/server` **必须**使用导出的 Zod schemas 验证 API 请求体。
  - **前端**: `apps/admin/src` **必须**使用导出的 Zod schemas 验证表单。

## Schema 编写标准（Trinity Pattern）

每个 `schema.ts` 文件**必须**严格遵循 **Trinity Pattern（三位一体模式）**：

### 第 A 部分：数据库表定义 (Part A: Database Table Definition)

- 使用 `pgTable` 定义表。
- 使用 `primaryId()` 定义 UUID 主键。
- 使用 `...timestamps` 添加标准的 `created_at` / `updated_at` 字段。
- 使用 `.references(() => otherTable.id)` 定义外键。
- **命名规范**: 变量名必须是复数形式（例如 `opMerchants`）。

### 第 B 部分：Zod 运行时 Schemas (Part B: Zod Runtime Schemas)

- **Insert Schema**: 使用 `createInsertSchema(table)`。
  - 使用回调细化字段：`(schema) => schema.min(1)`。
  - 省略自动管理的字段：`.omit({ id: true, createdAt: true, updatedAt: true })`。
  - **命名规范**: `insert<Entity>Schema`（例如 `insertOpMerchantSchema`）。
- **Select Schema**: 使用 `createSelectSchema(table)`。
  - **不要**使用 `.extend()` 覆盖字段（避免类型不兼容）。
  - **命名规范**: `select<Entity>Schema`（例如 `selectOpMerchantSchema`）。
- **Update Schema**: 手动使用 `z.object({...})`。
  - **混合模式**: **不要**使用 `insertSchema.partial()`。显式定义。
  - `id` 字段是必需的（`z.string().uuid()`）。
  - 其他字段为可选。
  - **命名规范**: `update<Entity>Schema`（例如 `updateOpMerchantSchema`）。

### 第 C 部分：TypeScript 类型 (Part C: TypeScript Types)

- **Select Type**: `typeof table.$inferSelect`（名称：`<Entity>`）
- **Insert Type**: `typeof table.$inferInsert`（名称：`New<Entity>`）
- **Update Type**: `z.infer<typeof update<Entity>Schema>`（名称：`Update<Entity>`）

## 领域参考文档 (Domain References)

特定业务领域的详细 schema 定义可在 `references/` 目录中找到：

- **Community**: [community.md](references/community.md) - 社区、公告、建筑结构、房屋装修。
- **Contract**: [contract.md](references/contract.md) - 合同、租赁协议。
- **Core**: [core.md](references/core.md) - 核心系统表。
- **Dev**: [dev.md](references/dev.md) - 开发和系统配置表。
- **Expense**: [expense.md](references/expense.md) - 账单、费用、支付。
- **House Property**: [house-property.md](references/house-property.md) - 物业单元、业主。
- **Operation**: [operation.md](references/operation.md) - 运营数据。
- **Parking**: [parking.md](references/parking.md) - 停车场、车辆。
- **Patrol**: [patrol.md](references/patrol.md) - 安保巡逻路线和日志。
- **Repairs**: [repairs.md](references/repairs.md) - 报修请求和工单。
- **Report**: [report.md](references/report.md) - 报表数据结构。
- **Setting**: [setting.md](references/setting.md) - 系统设置。

## 通用枚举 (Common Enums)

所有 PostgreSQL 枚举必须在 `apps/type/src/common/enums.ts` 中定义，以确保全局唯一性和复用。
