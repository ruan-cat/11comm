---
name: nitro-api-development
description: 使用 Nitro v3 框架和 H3 编写服务端 API 的技能。适用于后端接口开发、Mock 数据迁移到 Neon 数据库、以及编写符合 Drizzle ORM 标准的查询逻辑。当需要开发新的 CRUD 接口或修复现有后端逻辑时使用此技能。
license: MIT
---

# Nitro API 开发技能 (Nitro API Development)

本技能指导在 `apps/admin/server` 目录下使用 **Nitro** 框架开发服务端 API。

## 核心原则 (Core Principles)

1.  **框架 (Framework)**: 使用 **Nitro v3** 和 **H3** 事件处理器 (`defineHandler`)。
2.  **数据库 (Database)**: 强制使用 **Drizzle ORM** 进行所有数据库交互。**严禁使用 Mock JSON 文件**。
3.  **响应格式 (Response Format)**: 必须严格遵循 `JsonVO` 和 `PageDTO` 结构返回 `{ code, msg, data }`。
4.  **无状态 (Stateless)**: 保持 API 处理器无状态，所有数据持久化必须通过数据库。

## 开发工作流 (Development Workflow)

1.  **定义路由 (Define Route)**: 在 `apps/admin/server/api/` 创建文件。文件路径即 API 路由 (例如 `api/users.ts` -> `/api/users`)。
2.  **实现处理器 (Implement Handler)**: 使用 `defineHandler` 定义处理函数。
3.  **查询数据库 (Query Database)**: 导入 `db` (`@/server/db`) 和 schema (`@/server/db/schema`)。
4.  **返回数据 (Return Data)**: 确保返回对象符合标准 JSON 格式。

## 参考文档 (References)

- **API 语法速查**: [api-reference.md](references/api-reference.md) - H3 常用函数 (getQuery, readBody) 及模式。
- **代码示例**: [examples.md](references/examples.md) - 标准的 CRUD 处理器示例和 JSON 响应结构。
- **迁移指南**: [mock-to-neon-migration.md](references/mock-to-neon-migration.md) - 如何将旧的 Mock 接口迁移到真实的 Neon 数据库。
- **Mock 模式参考** (Legacy): [mock-mode.md](references/mock-mode.md) - Legacy Mock 模式的完整开发规范（仅用于维护现有接口）。

## 常见陷阱 (Common Pitfalls)

- **错误的导入**: 必须始终使用别名 `@/server/db` 和 `@/server/db/schema`。
- **遗漏 Await**: 数据库操作是异步的，必须使用 `await`。
- **错误的响应结构**: 前端组件依赖 `{ code, msg, data }` 结构。直接返回数据数组会导致 UI 崩溃。
- **使用原始 SQL**: 除非万不得已，禁止使用 `sql` 模板字符串。请使用 Drizzle 的查询构建器 (Query Builder)。
