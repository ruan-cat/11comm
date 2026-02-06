## Why

当前项目 (`01s-11comm`) 采用前后端分离的开发模式，面临由于物理隔离导致的 **"类型断裂 (Type Disconnect)"** 问题：

1.  **双重维护成本**：
    - `apps/admin` (Server) 使用 Drizzle ORM 定义数据库结构的 "单一事实来源"。
    - `apps/type` (Shared) 手动维护 TypeScript 接口，经常与 DB Schema 不同步。
2.  **运行时验证缺失**：
    - 前端和后端通过纯 TS 类型通信，缺乏运行时的 Payload 校验。
    - Nitro 后端需要手动编写额外的校验逻辑，或者面临数据结构风险。
3.  **架构演进受阻**：
    - 现有的纯静态类型库无法支撑 tRPC 或其他需要运行时 Schema 的高级框架。

根据 `2026-02-06-full-stack-type-transformation-assessment.md` 等一系列深度评估报告，我们需要对 `apps/type` 进行根本性的架构升级。

## What Changes

我们将把 `apps/type` 从一个 **纯静态类型库 (Static Type Library)** 重构为一个 **全栈统一 Schema 注册中心 (Unified Schema Registry)**。

核心变更包括：

1.  **项目性质变更**: `apps/type` 将引入运行时依赖 (`drizzle-orm`, `zod`, `drizzle-zod`)，成为一个同构逻辑库。
2.  **单一事实来源 (SSOT)**: 所有的数据库表定义 (Table Definitions) 将从 `apps/admin` 迁移至 `apps/type`。
3.  **三位一体 Schema**: 每个业务实体的 Schema 文件将同时导出：
    - **Database**: Drizzle Table 对象 (用于 SQL 操作)
    - **Validation**: Zod Schemas (用于 API/Form 校验)
    - **Types**: TypeScript Interfaces (用于静态分析)，由 Zod 自动推导。
4.  **业务路径下沉**: 严格遵循 "Business Path" 规范，Scheam 文件将分散在 `src/business/<domain>/<module>/schema.ts` 中，而不是集中在 `db` 目录。

## Capabilities

### New Capabilities

- **Runtime Schema Sharing**: 后端 (Nitro) 和 前端 (Vue) 共享同一套 Zod Schema，确保校验规则完全一致（如：校验必填、最大长度、正则格式）。
- **Auto-Inferred Types**: 只要修改了数据库表定义，前端的 TS 类型自动更新，无需人工同步。
- **Safe API Handling**: 后端可以使用 `readValidatedBody(event, Schema.parse)` 极其简洁地处理安全的请求体解析。

### Modified Capabilities

- **apps/type**: 从 `devDependencies` 升级为 `dependencies` 提供者。
- **apps/admin**: 移除 `server/db/schemas`，改为引用 `@01s-11comm/type`。

## Impact

- **Performance**: 前端 Bundle Size 会略微增加 (引入 Zod)，但换取了极高的开发效率和安全性，符合评估结论。
- **Migration**: 采用 "Shadow Migration (影子迁移)" 策略，在不破坏现有 build 的前提下并行构建新 Schema，最后进行平滑切换。
