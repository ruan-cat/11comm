<!--
  有价值的报告 不予删除
  核心结论： tRPC 不适合本项目，不应该参与本项目的类型项目的改造。
 -->

# tRPC vs 共享 Schema：全栈类型统一方案深度分析

## 1. 摘要

用户提出对 **tRPC** (TypeScript Remote Procedure Call) 的关注。经过分析，虽然 tRPC 是实现全栈类型安全的顶级工具，但对于当前的 Vue Pure Admin + Nitro + Drizzle 架构，引入 tRPC 属于**高成本、高侵入性**的改造。

我们推荐采用 **"Shared Schema" (共享模式)**：利用 `apps/type` 共享 Zod Schema 和 TS 类型。这能以 20% 的成本获得 80% 的全栈类型安全收益，且不破坏现有架构。

---

## 2. 什么是 tRPC？

tRPC 是一个旨在**移除 API 接口定义**的库。它允许你像调用本地函数一样调用后端 API，并自动推导类型。

- **传统模式 (REST/GraphQL)**:
  - 后端：定义路由 `/api/users`，返回 JSON。
  - 前端：手动定义 `interface User { ... }`，调用 `fetch('/api/users')`。
  - _痛点_：前后端类型断裂。

- **tRPC 模式**:
  - 后端：定义一个 Router `appRouter`。
  - 前端：导入 `AppRouter` 类型（不是代码，是类型）。
  - 调用：`trpc.users.list.query()`。
  - _优势_：完全的类型推导，点击跳转定义直达后端代码。

---

## 3. 为什么本项目目前不推荐引入 tRPC？

尽管 tRPC 很强大，但在本项目 (`01s-11comm`) 引入它面临以下挑战：

### 3.1 架构侵入性过高 (High Intrusion)

- **传输层重写**：tRPC 有自己的 Client 和 Server 适配器。
- **现有基建废弃**：必须废弃 `apps/admin/src/utils/http/index.ts` 中精心编写的 Axios 封装（包含 Token 刷新、错误拦截、NProgress 进度条、ApiFox Mock 兼容等）。你需要用 **tRPC Links** 重新实现这一切。
- **后端重构**：需要将 Nitro 的文件路由 (`server/api/*.ts`) 重构为 tRPC 的单一路由树 (`server/trpc/router.ts`)。虽然 Nitro 支持 tRPC，但这意味着完全改变后端的写法。

### 3.2 技术栈适配成本

- **Vue 生态**：tRPC 在 React 生态（Next.js）中是一等公民。虽然有 `trpc-nuxt` 或 `trpc-vue-query`，但整合度和文档丰富度不如 React。
- **学习曲线**：团队成员需要学习 Procedure, Query, Mutation, Context, Middleware 等 tRPC 特有概念。

---

## 4. 推荐方案：Shared Schema (共享模式)

我们建议的方案（已在评估报告中提出）是 **"基于 Zod 的共享 Schema"**。

### 4.1 工作原理

1.  **定义 (apps/type)**:
    ```typescript
    import { z } from "zod";
    export const UserSchema = z.object({ id: z.string(), name: z.string() });
    export type User = z.infer<typeof UserSchema>;
    ```
2.  **后端 (Nitro)**:
    ```typescript
    import { UserSchema } from "@01s-11comm/type";
    // 运行时校验输入
    const body = await readValidatedBody(event, UserSchema.parse);
    ```
3.  **前端 (Vue)**:
    ```typescript
    import { UserSchema, type User } from '@01s-11comm/type';
    // 静态类型提示
    const user: User = { ... };
    // 运行时表单校验
    const rules = toTypedSchema(UserSchema);
    ```

### 4.2 对比总结

| 特性             | tRPC 方案                    | Shared Schema 方案 (推荐)  |
| :--------------- | :--------------------------- | :------------------------- |
| **API 调用方式** | `trpc.user.get.query()`      | `http.get('/api/user')`    |
| **类型安全**     | 100% (端到端自动推导)        | 80% (通过共享文件保证一致) |
| **重构成本**     | 🔴 极高 (重写 HTTP 层和后端) | 🟢 低 (仅增加类型导入)     |
| **运行时依赖**   | Client SDK + Server Adapter  | Zod + Drizzle              |
| **灵活性**       | 🔒 锁定在 tRPC 协议          | 🔓 兼容任意 HTTP 客户端    |
| **现有代码兼容** | 需重写现有 API               | 可与现有 API 并存          |

## 5. 结论

**tRPC 是"全家桶"，而 Shared Schema 是"积木"。**

考虑到项目已经处于开发中期，拥有成熟的 Axios 封装 (`PureHttp`) 和 Nitro 后端结构，**引入 tRPC 的改造成本远大于收益**。

我们通过将数据库定义 (Drizzle) 和验证规则 (Zod) 放入 `apps/type` 并共享给前后端，已经能解决 "后端改字段，前端不知道" 的核心痛点，实现了极高性价比的全栈类型安全。
