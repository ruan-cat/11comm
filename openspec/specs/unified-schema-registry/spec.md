# Unified Schema Registry Standard

本规范定义了全栈共享 Schema 的组织与使用标准，确保 `apps/type` 成为项目唯一的真相来源 (Single Source of Truth)。

## Requirements

### Requirement: 统一 Schema 定义 (Unified Schema Definition)

`apps/type` 包 MUST 为每个业务实体导出三种不同的工件：

1.  **Drizzle Table**: 原始数据库表定义 (例如 `community`)。
2.  **Zod Schemas**: 用于 Insert (插入), Select (查询), 和 Update (更新) 操作的运行时验证对象 (例如 `insertCommunitySchema`)。
3.  **TypeScript Types**: 从 Drizzle 或 Zod Schema 推导出的静态类型 (例如 `type NewCommunity`)。

#### Scenario: Schema 使用

- **WHEN** 开发者从 `@01s-11comm/type` 导入时
- **THEN** 他们可以访问 `community` (Table), `insertCommunitySchema` (Zod), 和 `NewCommunity` (Type)。

### Requirement: 业务路径组织 (Business Path Organization)

Schema 文件 MUST 位于 `apps/type` 中特定的业务领域目录下。

#### Scenario: 定位 Schema

- **WHEN** 寻找 `Community` Schema 时
- **THEN** 它应该在 `apps/type/src/business/property-manage/community-manage/schema.ts` (或类似的业务路径) 中被找到。

### Requirement: 后端验证 (Backend Validation)

后端 (`apps/admin/server`) MUST 使用导出的 Zod Schemas 来验证 API 请求体。

#### Scenario: 验证创建请求

- **WHEN** 调用 `POST /api/community/create` 时
- **THEN** 处理器调用 `readValidatedBody(event, insertCommunitySchema.parse)`
- **AND** 如果数据无效，自动拒绝并返回 400 错误。

### Requirement: 前端验证 (Frontend Validation)

前端 (`apps/admin/src`) MUST 使用导出的 Zod Schemas 来验证表单。

#### Scenario: 表单提交

- **WHEN** 用户提交 Community 表单时
- **THEN** 前端在发送请求前使用 `insertCommunitySchema` 验证数据。
