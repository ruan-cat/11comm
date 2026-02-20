---
name: nitro-api-development
description: 使用 Nitro v3 框架和 H3 编写服务端 API 的技能。适用于后端接口开发、Mock 数据迁移到 Neon 数据库、以及编写符合 Drizzle ORM 标准的查询逻辑。当需要开发新的 CRUD 接口或修复现有后端逻辑时使用此技能。
license: MIT
---

# Nitro API 开发技能 (Nitro API Development)

本技能指导在 `apps/admin/server` 目录下使用 **Nitro** 框架开发服务端 API。

## 1. 核心原则 (Core Principles)

1.  **框架 (Framework)**: 使用 **Nitro v3** 和 **H3** 事件处理器 (`defineHandler`)。
2.  **数据库 (Database)**: 强制使用 **Drizzle ORM** 进行所有数据库交互。**严禁使用 Mock JSON 文件**。
3.  **响应格式 (Response Format)**: 必须严格遵循 `JsonVO` 和 `PageDTO` 结构返回 `{ success, code, message, data }`。这两个类型**必须**从 `@01s-11comm/type` 导入。
4.  **错误处理 (Error Handling)**: 所有 Handler **必须**使用 `try-catch` 包裹全部业务逻辑，catch 块返回标准化错误响应。
5.  **无状态 (Stateless)**: 保持 API 处理器无状态，所有数据持久化必须通过数据库。

## 2. 开发工作流 (Development Workflow)

1.  **定义路由 (Define Route)**: 在 `apps/admin/server/api/` 创建文件。文件路径即 API 路由 (例如 `api/users.ts` -> `/api/users`)。
2.  **实现处理器 (Implement Handler)**: 使用 `defineHandler` 定义处理函数，**必须**使用 `try-catch` 包裹。
3.  **导入类型约束 (Import Types)**: **必须**导入 `import type { JsonVO } from "@01s-11comm/type"`（列表接口额外导入 `PageDTO`）。
4.  **查询数据库 (Query Database)**: 导入 `db`（`server/db`）与 schema（`@01s-11comm/type`）。
5.  **返回数据 (Return Data)**: 确保返回对象严格符合 `JsonVO<T>` 结构（`{ success, code, message, data }`）。

## 3. 参考文档 (References)

- **API 语法速查**: [api-reference.md](references/api-reference.md) - H3 常用函数 (getQuery, readBody) 及模式。
- **代码示例**: [examples.md](references/examples.md) - 标准的 CRUD 处理器示例和 JSON 响应结构。
- **参数处理**: [request-params-handling.md](references/request-params-handling.md) - **[New]** 详解 `readBody` 使用、参数清洗 (空字符串/pageIndex 映射) 及错误捕获模式。
- **迁移指南**: [mock-to-neon-migration.md](references/mock-to-neon-migration.md) - 如何将旧的 Mock 接口迁移到真实的 Neon 数据库。
- **Mock 模式参考** (Legacy): [mock-mode.md](references/mock-mode.md) - Legacy Mock 模式的完整开发规范（仅用于维护现有接口）。

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

- **缺失类型导入**: 必须始终导入 `import type { JsonVO } from "@01s-11comm/type"` 约束返回值结构。
- **错误的路径别名导入**: 必须始终使用别名 `@/server/db` 和 `@/server/db/schema`。
- **错误的响应字段**: 前端组件依赖 `{ success, code, message, data }` 结构（即 `JsonVO`）。使用 `msg` 而非 `message`，或缺失 `success` 字段，会导致前端解析异常。
- **缺失 try-catch**: 所有 Handler **必须**使用 `try-catch` 包裹，catch 块返回标准化错误响应。
- **遗漏 Await**: 数据库操作是异步的，必须使用 `await`。
- **使用原始 SQL**: 除非万不得已，禁止使用 `sql` 模板字符串。请使用 Drizzle 的查询构建器 (Query Builder)。
- **重复定义格式化函数**: 必须使用 `server/utils/format-date` 中的工具函数，禁止在 Handler 内重复定义 `formatDateTime`。

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
