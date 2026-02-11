# Core Schema Reference

This reference documents the technical core infrastructure tables.

## Common Schema Module

系统 SHALL 在 `apps/admin/server/db/schemas/common.ts` 提供公共的 schema 基础设施模块。

### Scenario: Export primary key helper

- **WHEN** 开发者需要定义表的主键字段
- **THEN** 系统提供 `primaryId()` 函数返回 UUID 类型的主键定义

### Scenario: Export timestamp fields

- **WHEN** 开发者需要为表添加时间戳字段
- **THEN** 系统提供 `timestamps` 对象包含 `createdAt` 和 `updatedAt` 字段定义

### Scenario: Export soft delete field

- **WHEN** 开发者需要为表添加软删除支持
- **THEN** 系统提供 `softDelete` 对象包含 `deletedAt` 字段定义

### Scenario: Export remark field helper

- **WHEN** 开发者需要为表添加备注字段
- **THEN** 系统提供 `remarkField()` 函数返回 text 类型的备注字段定义

## Common Enum Definitions

系统 SHALL 在 `schemas/common.ts` 中定义全局通用的 PostgreSQL 枚举类型。

### Scenario: Status enum definition

- **WHEN** 多个表需要使用启用/禁用状态
- **THEN** 系统提供 `statusEnum` 枚举类型包含 `enabled` 和 `disabled` 值

### Scenario: Gender enum definition

- **WHEN** 多个表需要使用性别字段
- **THEN** 系统提供 `genderEnum` 枚举类型包含 `male` 和 `female` 值

### Scenario: Audit status enum definition

- **WHEN** 多个表需要使用审核状态
- **THEN** 系统提供 `auditStatusEnum` 枚举类型包含 `pending`、`approved`、`rejected` 值

## Schema Entry Point

系统 SHALL 在 `apps/admin/server/db/schema.ts` 提供统一的 schema 导出入口。

### Scenario: Export all module schemas

- **WHEN** Drizzle Kit 执行 `db:generate` 命令
- **THEN** `schema.ts` 文件导出所有模块的表定义和枚举类型

### Scenario: Re-export common utilities

- **WHEN** 其他代码需要使用公共辅助函数
- **THEN** `schema.ts` 文件重新导出 `common.ts` 中的所有内容

## Database Connection Module

系统 SHALL 在 `apps/admin/server/db/index.ts` 提供数据库连接实例。

### Scenario: Create Neon database connection

- **WHEN** 服务端代码需要执行数据库操作
- **THEN** `index.ts` 导出 `db` 实例，使用 Neon Serverless 驱动连接

### Scenario: Export schema with connection

- **WHEN** 开发者需要使用关系查询功能
- **THEN** `db` 实例初始化时包含完整的 schema 定义

## UUID Primary Key Standard

系统 SHALL 所有表使用 UUID 作为主键。

### Scenario: Primary key format

- **WHEN** 新建任何数据库表
- **THEN** 主键字段名为 `id`，类型为 UUID，使用 `defaultRandom()` 自动生成

### Scenario: Primary key constraint

- **WHEN** 定义主键字段
- **THEN** 字段带有 `primaryKey()` 约束，确保唯一性

## Timestamp Fields Standard

系统 SHALL 所有表包含标准时间戳字段。

### Scenario: Created at field

- **WHEN** 新建任何数据库表
- **THEN** 表包含 `created_at` 字段，类型为 timestamp，默认值为当前时间，不可为空

### Scenario: Updated at field

- **WHEN** 新建任何数据库表
- **THEN** 表包含 `updated_at` 字段，类型为 timestamp，默认值为当前时间，更新时自动刷新

## Naming Convention Compliance

系统 SHALL 遵循统一的命名约定。

### Scenario: Table name format

- **WHEN** 定义数据库表
- **THEN** 表名使用 snake_case 格式，包含模块前缀，使用复数形式

### Scenario: Column name format

- **WHEN** 定义表字段
- **THEN** 数据库列名使用 snake_case 格式，TypeScript 属性使用 camelCase 格式
