---
name: nitro-api-development
description: 使用 Nitro v3 框架和 H3 编写服务端 API 的技能。适用于后端接口开发、Mock 数据迁移到 Neon 数据库、以及编写符合 Drizzle ORM 标准的查询逻辑。当需要开发新的 CRUD 接口或修复现有后端逻辑时使用此技能。
license: MIT
---

# Nitro API 开发技能 (Nitro API Development)

本技能指导在 `apps/api/server` 目录下使用 **Nitro** 框架开发服务端 API。旧 `apps/admin/server` 仅作为 legacy source 或兼容参考，不再作为长期权威服务端与 DB 运维入口。

## 1. 核心原则 (Core Principles)

1.  **框架 (Framework)**: 使用 **Nitro v3** 和 **H3** 事件处理器 (`defineHandler`)。
2.  **数据库 (Database)**: 强制使用 **Drizzle ORM** 进行所有数据库交互。**严禁使用 Mock JSON 文件**。
3.  **响应格式 (Response Format)**: 必须严格遵循 `JsonVO` 和 `PageDTO` 结构返回 `{ success, code, message, data }`。这两个类型**必须**从 `@01s-11comm/type` 导入。
4.  **错误处理 (Error Handling)**: 所有 Handler **必须**使用 `try-catch` 包裹全部业务逻辑，catch 块返回标准化错误响应。
5.  **无状态 (Stateless)**: 保持 API 处理器无状态，所有数据持久化必须通过数据库。

## 2. 开发工作流 (Development Workflow)

1.  **定义路由 (Define Route)**: 在 `apps/api/server/routes/api/` 创建文件。文件路径即 API 路由 (例如 `api/users.post.ts` -> `/api/users`)。旧 `apps/admin/server/api/` 只用于对照 legacy source。
2.  **实现处理器 (Implement Handler)**: 使用 `defineHandler` 定义处理函数，**必须**使用 `try-catch` 包裹。
3.  **导入类型约束 (Import Types)**: **必须**导入 `import type { JsonVO } from "@01s-11comm/type"`（列表接口额外导入 `PageDTO`）。
4.  **查询数据库 (Query Database)**: 通过 `useDb(event)` 获取 Drizzle 实例，并从 `@01s-11comm/type` 导入 schema。
5.  **返回数据 (Return Data)**: 确保返回对象严格符合 `JsonVO<T>` 结构（`{ success, code, message, data }`）。

## 3. 参考文档 (References)

- **API 语法速查**: [api-reference.md](references/api-reference.md) - H3 常用函数 (getQuery, readBody) 及模式。
- **代码示例**: [examples.md](references/examples.md) - 标准的 CRUD 处理器示例和 JSON 响应结构。
- **参数处理**: [request-params-handling.md](references/request-params-handling.md) - **[New]** 详解 `readBody` 使用、参数清洗 (空字符串/pageIndex 映射) 及错误捕获模式。
- **多平台数据库连接**: [cloudflare-env-database.md](references/cloudflare-env-database.md) - **[关键]** Cloudflare Worker 与 Vercel 平台下的环境变量获取机制、Drizzle+Neon 数据库连接模式，以及 `event.req.runtime.cloudflare.env` 的正确使用方式。

## 4. 返回值类型约束 (Response Type Constraint)

### 4.1 核心原则：必须使用类型注解标注响应变量

仅 `import type { JsonVO }` 是**不够的**——这只是一个死导入，TypeScript **不会**检查返回值结构。

**必须**将 `JsonVO` 用作响应变量的**类型注解 (type annotation)**，让 TypeScript 编译器在编译期验证字段结构。

```typescript
// ❌ 错误：仅导入类型，直接返回字面量 → 形同虚设，TypeScript 不做任何检查
import type { JsonVO } from "@01s-11comm/type";
return { success: true, code: 200, msg: "ok", data: result }; // msg 拼错也不会报错

// ✅ 正确：用类型注解标注响应变量 → TypeScript 会严格检查每个字段
import type { JsonVO } from "@01s-11comm/type";
const response: JsonVO<typeof result> = { success: true, code: 200, message: "ok", data: result };
return response; // 如果字段名/类型不符合 JsonVO，编译期立即报错
```

### 4.2 按端点类型的类型注解规则

| 端点类型                         |               类型注解写法               |
| :------------------------------- | :--------------------------------------: |
| 分页列表（list）                 | `JsonVO<PageDTO<(typeof data)[number]>>` |
| 单条数据（detail/create/update） |         `JsonVO<typeof result>`          |
| 无数据返回（delete）             |              `JsonVO<null>`              |
| 错误响应（catch 块）             |              `JsonVO<null>`              |

> `(typeof data)[number]` 自动从 Drizzle 查询结果数组推断行类型，无需额外导入实体类型。

### 4.3 成功响应写法

```typescript
/** 列表接口 */
const response: JsonVO<PageDTO<(typeof data)[number]>> = {
	success: true,
	code: 200,
	message: "查询成功",
	data: { list: data, total, pageSize: query.pageSize, pageIndex: query.page, totalPages },
};
return response;

/** 单条数据接口 */
const response: JsonVO<typeof result> = {
	success: true,
	code: 200,
	message: "操作成功",
	data: result,
};
return response;
```

### 4.4 错误响应写法

`JsonVO` 类型包含可选的 `error` 和 `stack` 字段，专门用于错误场景。`error` 携带错误信息，`stack` 仅在开发环境暴露：

```typescript
const errorResponse: JsonVO<null> = {
	success: false,
	code: 500,
	message: "操作失败",
	data: null,
	error: error.message || String(error),
	stack: error.stack,
};
return errorResponse;
```

## 5. 时间字段格式化 (Timestamp Formatting)

### 5.1 核心原则

数据库 Schema 中的时间字段使用 Drizzle `timestamp` 类型，TypeScript 推断为 `Date` 类型。前端展示需要 `string` 类型。

**API Handler 负责时间字段的格式化转换**。

### 5.2 字段映射规范

| DB 字段 (Drizzle) | 前端字段 (ListItem) | 转换规则                                |
| :---------------- | :------------------ | :-------------------------------------- |
| `createTime`      | `createTime`        | `Date` → `string` (YYYY-MM-DD HH:mm:ss) |
| `updateTime`      | `updateTime`        | `Date` → `string` (YYYY-MM-DD HH:mm:ss) |
| `deletedAt`       | -                   | **移除**（不展示）                      |

### 5.3 使用 formatDateTime 工具函数

**必须**从 `server/utils/format-date` 导入 `formatDateTime` 函数，**禁止**在 Handler 内重复定义格式化函数。

```typescript
// ✅ 正确：导入工具函数
import { formatDateTime } from "server/utils/format-date";

// ❌ 错误：在 Handler 内定义重复的格式化函数
function formatDateTime(date: Date): string {
	const pad = (n: number) => n.toString().padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}...`;
}
```

### 5.4 列表接口数据映射示例

```typescript
import { formatDateTime } from "server/utils/format-date";

// 查询数据库（返回 Date 类型）
const data = await db
	.select({
		id: table.id,
		name: table.name,
		createTime: table.createTime,
		updateTime: table.updateTime,
	})
	.from(table);

// 映射到前端类型（转换为 string 类型）
const list: XxxListItem[] = data.map((item) => ({
	id: item.id,
	name: item.name,
	createTime: formatDateTime(item.createTime),
	updateTime: formatDateTime(item.updateTime),
}));
```

### 5.5 工具函数 API

| 函数             | 参数                                                                     | 返回值   | 用途                           |
| :--------------- | :----------------------------------------------------------------------- | :------- | :----------------------------- |
| `formatDateTime` | `date: Date \| string \| number \| null \| undefined, fallback?: string` | `string` | 格式化为 `YYYY-MM-DD HH:mm:ss` |
| `formatDate`     | 同上                                                                     | `string` | 格式化为 `YYYY-MM-DD`          |

**工具函数源码**: `apps/admin/server/utils/format-date.ts`

## 6. 常见陷阱 (Common Pitfalls)

- **错误的 H3 导入路径（⚠️ 高频错误）**: 所有 H3 函数（`createError`、`defineHandler`、`defineMiddleware`、`readBody`、`getQuery` 等）**必须**从 `"nitro/h3"` 导入，**严禁**从 `"h3"` 直接导入。从 `"h3"` 导入将导致运行时模块解析失败。
  ```typescript
  import { createError } from "nitro/h3"; // ✅ 正确
  import { createError } from "h3"; // ❌ 运行时报错
  ```
- **缺失类型导入**: 必须始终导入 `import type { JsonVO } from "@01s-11comm/type"` 约束返回值结构。
- **错误的路径别名导入**: 必须始终使用 `server/db` 和 `server/db/schema`（项目未配置 `@/server` 别名）。
- **错误的响应字段**: 前端组件依赖 `{ success, code, message, data }` 结构（即 `JsonVO`）。使用 `msg` 而非 `message`，或缺失 `success` 字段，会导致前端解析异常。
- **缺失 try-catch**: 所有 Handler **必须**使用 `try-catch` 包裹，catch 块返回标准化错误响应。
- **遗漏 Await**: 数据库操作是异步的，必须使用 `await`。
- **使用原始 SQL**: 除非万不得已，禁止使用 `sql` 模板字符串。请使用 Drizzle 的查询构建器 (Query Builder)。
- **重复定义格式化函数**: 必须使用 `server/utils/format-date` 中的工具函数，禁止在 Handler 内重复定义 `formatDateTime`。

### 6.1. defineHandler 不支持 HTTP 方法对象格式

Nitro v3 文件路由中，文件名已经代表了 HTTP 方法，**不支持** H3 某些旧版本的对象格式写法：

```typescript
// ❌ 错误（文件名虽然是 post.ts，但这种写法在 Nitro v3 不支持）
export default defineHandler({
  async post(event, body) { ... },
});

// ✅ 正确（文件名 post.ts 已代表 POST 方法，直接在 handler 内读取 body）
export default defineHandler(async (event) => {
  const body = await readBody<MyInput>(event);
  return handleXxx(event, body);
});
```

### 6.2. useDb(event: H3Event) 必须传 event

**所有需要调用数据库的服务端工具函数**，必须将 `event: H3Event` 作为第一个参数，并透传给 `useDb(event)`。

这是 Cloudflare Worker 环境的强制约束——`process.env` 在 Worker 顶层作用域为空，必须通过 event 透传获取：

```typescript
// ❌ 错误
export async function getMigrationStats(): Promise<...> {
  const db = useDb(); // 类型错误，Cloudflare 环境无法获取 DATABASE_URL
}

// ✅ 正确（透传 event）
export async function getMigrationStats(event: H3Event): Promise<...> {
  const db = useDb(event);
  // ...
}

// 调用时
export default defineHandler(async (event) => {
  const result = await getMigrationStats(event);
});
```

**设计原则**：所有 `server/utils/` 下的工具函数，只要涉及数据库操作，必须接收 `event: H3Event` 参数。

### 6.3. H3 v2 彻底废弃 event.request / event.response

Nitro v3 使用的 H3 v2 **移除了** `event.request` 和 `event.response`，必须使用 `nitro/h3` 提供的函数：

```typescript
// ❌ 旧写法（H3 v1）
const ip = event.request.headers.get("x-forwarded-for");
event.response.headers.set("X-RateLimit-Limit", "100");

// ✅ 新写法（H3 v2）
import { getRequestHeader, setResponseHeader } from "nitro/h3";
const ip = getRequestHeader(event, "x-forwarded-for");
setResponseHeader(event, "X-RateLimit-Limit", "100");
```

### 6.4. Nitro plugin hooks 回调参数是 HTTPEvent

Nitro 插件的 hook 回调接收的是原始 `HTTPEvent`，需要强制转换为 `H3Event`：

```typescript
import type { H3Event } from "nitro/h3";

nitroApp.hooks.hook("request", async (rawEvent) => {
	const event = rawEvent as H3Event; // 必须强制转换
	const path = event.path;
});
```

### 6.5. Drizzle ORM 跨包 schema 类型问题

当 `update().set()` 遇到跨包类型不匹配时，可接受使用 `as any` 进行类型断言：

```typescript
// 可接受
await db
	.update(smStaff)
	.set({ neonAuthId } as any)
	.where(eq(smStaff.id, id));
```

### 6.6. JsonVO 必须从 @01s-11comm/type 导入

```typescript
// ✅ 正确
import type { JsonVO } from "@01s-11comm/type";

// ❌ 错误 - 会缺少 success 字段，导致前端解析异常
import type { JsonVO } from "@ruan-cat/utils/vueuse";
```

### 6.7. Neon Auth 客户端类型

```typescript
import { createAuthClient } from "@neondatabase/auth";
import type { NeonAuthPublicApi } from "@neondatabase/auth";
export type AuthClientType = NeonAuthPublicApi<any>;
```

## 7. 类型回填 (Type Recovery)

当 `readValidatedBody` 的类型推导不足以满足 Drizzle `values()` 的严格类型要求时，必须显式回填 Insert 类型。

### 必须遵循

- 使用 `@01s-11comm/type` 导出的 `New<Entity>` 类型
- 禁止依赖 `readValidatedBody<NewX>` 泛型写法

### 写入示例

```typescript
const body = (await readValidatedBody(event, insertSchema.parse)) as unknown as NewX;
const result = await db.insert(table).values(body).returning();
```

## 8. 多平台数据库连接 (Multi-Platform Database Connection)

> **本节是本项目在 Cloudflare Worker 环境下排查真实严重 Bug 后沉淀的核心经验。所有涉及数据库连接的代码都必须遵守本节规范。**

### 8.1. 核心原则：永远通过 `useDb(event)` 获取数据库实例

**严禁**在模块顶层或全局作用域直接创建 Drizzle 数据库连接实例：

```typescript
// ❌ 错误：模块顶层创建，Cloudflare Worker 环境下 process.env 为空
const db = drizzle(neon(process.env.DATABASE_URL!));

// ✅ 正确：在每个 handler 内通过 event 动态获取
export default defineHandler(async (event) => {
	const db = useDb(event); // 内部自动处理多平台环境变量
	return await db.select().from(table);
});
```

### 8.2. Cloudflare Worker 的核心陷阱

在 Nitro v3 + Cloudflare Worker 环境中，**`event.context.cloudflare.env` 不存在**。
正确路径必须是 **`event.req.runtime?.cloudflare?.env`**（Nitro v3 官方确认路径）。

生产环境真实日志验证：

```log
"req.runtime exists": true,
"req.runtime keys": ["name", "cloudflare"],
"req.runtime.cloudflare.env keys": ["NITRO_DATABASE_URL", "comm_admin_11__DATABASE_URL", "ASSETS"]
```

### 8.3. 关键构建配置

使用 `cloudflare:workers` 动态导入时，**必须**在 `nitro.config.ts` 中声明 external，
否则 Vite 在 `vite:build:prod` 阶段会因无法解析该 CF 专属运行时模块而构建失败：

```typescript
// nitro.config.ts
export default defineConfig({
	rollupConfig: {
		external: ["cloudflare:workers"],
	},
});
```

**详细内容请参考**：[cloudflare-env-database.md](references/cloudflare-env-database.md)
