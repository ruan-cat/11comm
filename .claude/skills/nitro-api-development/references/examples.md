# Nitro API 开发参考示例

本参考文档提供了在本项目中使用 Nitro 开发服务端 API 的代码示例和标准。

## API 处理器结构 (标准模板)

每个 API 处理器文件 **必须** 遵循此结构：

```typescript
import { defineHandler, getQuery, readBody, createError } from "nitro/h3";
import { db } from "@/server/db"; // 必须使用别名 @/server/db
import { users } from "@/server/db/schema"; // 必须使用别名 @/server/db/schema
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	// 1. 获取参数 (Get Parameters)
	const query = getQuery(event);
	// POST 请求读取 Body
	const body = await readBody(event);

	// 2. 业务逻辑 (Business Logic - Database Query)
	const result = await db.select().from(users).where(eq(users.id, query.id));

	if (!result.length) {
		throw createError({ statusCode: 404, message: "User not found" });
	}

	// 3. 返回标准响应 (Return Standard Response)
	return {
		code: 200,
		msg: "操作成功",
		data: result[0],
	};
});
```

## 响应格式规范 (JsonVO)

所有 API **必须** 返回标准化的 JSON 结构。

**通用响应接口**：

```typescript
interface JsonVO<T> {
	code: number;
	msg: string;
	data: T;
}
```

**分页列表响应接口**：

```typescript
interface PageDTO<T> {
	list: T[];
	total: number;
	pageSize: number;
	currentPage: number;
}
```

**返回示例**：

```json
{
	"code": 200,
	"msg": "操作成功",
	"data": {
		"list": [{ "id": 1, "name": "Admin" }],
		"total": 100,
		"pageSize": 10,
		"currentPage": 1
	}
}
```

## Drizzle ORM 常用操作

- **查询 (Select)**: `await db.select().from(table).where(...)`
- **插入 (Insert)**: `await db.insert(table).values({...}).returning()`
- **更新 (Update)**: `await db.update(table).set({...}).where(...)`
- **删除 (Delete)**: `await db.delete(table).where(...)`

**注意**：除非绝对必要，**禁止**直接编写原始 SQL 语句。请始终使用查询构建器 (Query Builder)。

## 错误处理 (Error Handling)

- 使用 `h3` 提供的 `createError` 抛出 HTTP 错误。
- 对于特定业务逻辑错误，可以使用 `try/catch` 包裹，但在大多数情况下，可以让全局异常处理器捕获错误。

```typescript
import { createError } from "nitro/h3";

if (!user) {
	throw createError({
		statusCode: 404,
		statusMessage: "User not found",
	});
}
```
