## Why

当前项目面临“类型断裂 (Type Disconnect)”的问题，即后端数据库定义与前端/共享类型定义之间由于物理隔离导致的不一致：

- `apps/admin` 使用 Drizzle ORM 定义了数据库的“单一事实来源 (Source of Truth)”。
- `apps/type` 手动维护 TypeScript 接口，经常与实际的 DB Schema 不同步。
- 缺乏共享的运行时验证逻辑，导致在 Nitro (后端) 和 Vue (前端) 中重复编写校验规则。

我们需要将 `apps/type` 转型为**统一 Schema 注册中心 (Unified Schema Registry)**，使其作为单一事实来源。它应该从同一个定义中统一导出 Drizzle Tables (用于 DB 操作)、Zod Schemas (用于运行时校验) 和 TypeScript Types (用于静态分析)。

## What Changes

我们将把 `apps/type` 从一个纯类型库重构为一个包含 Schema 定义的运行时库。

1.  **架构升级**: 升级 `apps/type` 以支持运行时依赖 (`drizzle-orm`, `zod`, `drizzle-zod`)。
2.  **Schema 迁移**: 遵循严格的“业务路径 (Business Path)”规范，将 Drizzle Schema 从 `apps/admin/server/db/schemas` 迁移到 `apps/type/src/business/...`。
3.  **消费方更新**: 更新 `apps/admin` 服务端 (Nitro) 和 客户端 (Vue) 以消费来自 `apps/type` 的 Schema。

## Capabilities

### New Capabilities

- `unified-schema-registry`: 在 `apps/type` 内建立的中心化系统，按业务领域组织，从单一事实来源提供数据库表定义、Zod 验证 Schemas 和静态 TypeScript 类型。

### Modified Capabilities

<!-- 现有系统功能需求未变更，这是一次重构。 -->

## Impact

- **apps/type**:
  - 新增 `dependencies`: `drizzle-orm`, `zod`, `drizzle-zod`。
  - 变更文件结构：在业务目录中包含 `schema.ts`。
- **apps/admin**:
  - 移除 `server/db/schemas`。
  - 更新 `drizzle.config.ts` 指向 `apps/type`。
  - 更新 API 处理器和 Vue 表单以使用共享的 Zod Schemas。
