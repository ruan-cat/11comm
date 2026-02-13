# Nitro API 开发参考示例

本参考文档提供了在本项目中使用 Nitro 开发服务端 API 的代码示例和标准。

## 1. API 处理器结构 (标准模板)

每个 API 处理器文件 **必须** 遵循此结构。重点：**必须使用 `JsonVO` 类型注解标注响应变量**。

```typescript
import { defineHandler, readBody } from "nitro/h3";
import { db } from "server/db";
import { users } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	try {
		/** 获取参数 (POST 请求读取 Body，建议断言为 any 以便后续清洗) */
		const body = (await readBody(event)) as any;

		/** 业务逻辑 (Database Query) */
		const [result] = await db.select().from(users).where(eq(users.id, body.id));

		if (!result) {
			/** 使用 JsonVO<null> 类型注解约束 404 响应 */
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "用户不存在",
				data: null,
			};
			return notFoundResponse;
		}

		/** 使用 JsonVO<typeof result> 类型注解约束成功响应 */
		const response: JsonVO<typeof result> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: result,
		};
		return response;
	} catch (error: any) {
		console.error("[API Error]", error);

		/** 使用 JsonVO<null> 类型注解约束错误响应 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
```

## 2. 响应格式规范

所有 API **必须** 返回标准化的 JSON 结构。类型定义来源于 `@01s-11comm/type`，是**唯一事实来源 (Single Source of Truth)**。

### 2.1 JsonVO - 通用响应包装类型

```typescript
/**
 * 前后端数据对接数据对象
 * @description 来源: apps/type/src/common/index.ts
 */
interface JsonVO<T> {
	/** 状态码 */
	code: number;
	/** 提示消息 */
	message: string;
	/** 数据对象 */
	data: T;
	/** 时间戳 */
	timestamp?: number;
	/** 请求是否成功 */
	success?: boolean;
	/** 错误信息（仅在请求失败时返回） */
	error?: string;
	/** 错误堆栈（仅在开发环境下返回，生产环境不暴露） */
	stack?: string;
}
```

### 2.2 PageDTO - 分页列表响应类型

```typescript
/**
 * 分页数据传输对象
 * @description 来源: apps/type/src/common/index.ts
 */
interface PageDTO<T> {
	/** 数据列表 */
	list: T[];
	/** 总记录数 */
	total: number;
	/** 当前页码 (1-based) */
	pageIndex: number;
	/** 每页大小 */
	pageSize: number;
	/** 总页数 */
	totalPages: number;
}
```

### 2.3 分页列表返回示例

```json
{
	"success": true,
	"code": 200,
	"message": "查询成功",
	"data": {
		"list": [{ "id": "uuid-1", "name": "Admin" }],
		"total": 100,
		"pageIndex": 1,
		"pageSize": 10,
		"totalPages": 10
	}
}
```

### 2.4 单条数据返回示例

```json
{
	"success": true,
	"code": 200,
	"message": "查询成功",
	"data": { "id": "uuid-1", "name": "Admin", "createdAt": "2025-01-01T00:00:00Z" }
}
```

### 2.5 错误返回示例

```json
{
	"success": false,
	"code": 500,
	"message": "操作失败",
	"data": null,
	"error": "Database connection timeout",
	"stack": "(仅开发环境返回) Error: Database connection timeout\n    at ..."
}
```

## 3. CRUD 标准模板

### 3.1 列表查询 (list.post.ts)

```typescript
import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	configName: z.string().optional(),
});

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex → page，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			configName: body.configName === "" ? undefined : body.configName,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];
		if (query.configName) {
			conditions.push(like(dtConfigs.configName, `%${query.configName}%`));
		}

		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtConfigs)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select()
			.from(dtConfigs)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(dtConfigs.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		/**
		 * 使用 JsonVO<PageDTO<...>> 类型注解约束成功响应
		 * (typeof data)[number] 自动推断 Drizzle 查询结果的行类型
		 */
		const response: JsonVO<PageDTO<(typeof data)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: data,
				total,
				pageSize: query.pageSize,
				pageIndex: query.page,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[List] Error:", error);

		/** 使用 JsonVO<null> 类型注解约束错误响应 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
```

### 3.2 创建 (create.post.ts)

```typescript
import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigs, insertDtConfigSchema } from "@01s-11comm/type";
import type { NewDtConfig, JsonVO } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	try {
		const body = (await readValidatedBody(event, insertDtConfigSchema.parse)) as unknown as NewDtConfig;
		const [newRecord] = await db.insert(dtConfigs).values(body).returning();

		/** 使用 JsonVO<typeof newRecord> 类型注解约束成功响应 */
		const response: JsonVO<typeof newRecord> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: newRecord,
		};
		return response;
	} catch (error: any) {
		console.error("[Create] Error:", error);

		/** 使用 JsonVO<null> 类型注解约束错误响应 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "创建失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
```

### 3.3 更新 (update.post.ts)

```typescript
import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigs, updateDtConfigSchema } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	try {
		const body = await readValidatedBody(event, updateDtConfigSchema.parse);
		const { id, ...updateData } = body;

		const [updatedRecord] = await db.update(dtConfigs).set(updateData).where(eq(dtConfigs.id, id)).returning();

		if (!updatedRecord) {
			/** 使用 JsonVO<null> 类型注解约束 404 响应 */
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return notFoundResponse;
		}

		/** 使用 JsonVO<typeof updatedRecord> 类型注解约束成功响应 */
		const response: JsonVO<typeof updatedRecord> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: updatedRecord,
		};
		return response;
	} catch (error: any) {
		console.error("[Update] Error:", error);

		/** 使用 JsonVO<null> 类型注解约束错误响应 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "更新失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
```

### 3.4 删除 (delete.post.ts)

```typescript
import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

/** 请求体验证 schema */
const bodySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as any;
		const { id } = bodySchema.parse(body);

		const [deletedRecord] = await db.delete(dtConfigs).where(eq(dtConfigs.id, id)).returning();

		if (!deletedRecord) {
			/** 使用 JsonVO<null> 类型注解约束 404 响应 */
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return notFoundResponse;
		}

		/** 使用 JsonVO<null> 类型注解约束成功响应（删除操作无返回数据） */
		const response: JsonVO<null> = {
			success: true,
			code: 200,
			message: "删除成功",
			data: null,
		};
		return response;
	} catch (error: any) {
		console.error("[Delete] Error:", error);

		/** 使用 JsonVO<null> 类型注解约束错误响应 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "删除失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
```

### 3.5 详情 (detail.get.ts)

```typescript
import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	try {
		const rawQuery = getQuery(event);
		const query = querySchema.parse(rawQuery);

		const [record] = await db.select().from(dtConfigs).where(eq(dtConfigs.id, query.id)).limit(1);

		if (!record) {
			/** 使用 JsonVO<null> 类型注解约束 404 响应 */
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return notFoundResponse;
		}

		/** 使用 JsonVO<typeof record> 类型注解约束成功响应 */
		const response: JsonVO<typeof record> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: record,
		};
		return response;
	} catch (error: any) {
		console.error("[Detail] Error:", error);

		/** 使用 JsonVO<null> 类型注解约束错误响应 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
```

## 4. Drizzle ORM 常用操作

- **查询 (Select)**: `await db.select().from(table).where(...)`
- **插入 (Insert)**: `await db.insert(table).values({...}).returning()`
- **更新 (Update)**: `await db.update(table).set({...}).where(...)`
- **删除 (Delete)**: `await db.delete(table).where(...)`

**注意**：除非绝对必要，**禁止**直接编写原始 SQL 语句。请始终使用查询构建器 (Query Builder)。

## 5. 错误处理 (Error Handling)

### 5.1 强制要求

所有 API Handler **必须**使用 `try-catch` 包裹全部业务逻辑。**禁止**依赖 Nitro 全局异常处理器作为唯一的错误捕获手段。

### 5.2 错误响应结构

catch 块 **必须** 返回符合 `JsonVO<null>` **类型注解**的错误响应变量，包含 `error` 和 `stack` 字段：

```typescript
catch (error: any) {
	console.error("[模块名 操作名] Error:", error);

	/** 使用 JsonVO<null> 类型注解约束错误响应 */
	const errorResponse: JsonVO<null> = {
		success: false,
		code: 500,
		message: "操作失败",
		data: null,
		error: error.message || String(error),
		stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
	};
	return errorResponse;
}
```

### 5.3 业务逻辑异常 (404 等)

对于可预见的业务错误（如 ID 不存在），使用 `JsonVO<null>` 类型注解约束：

```typescript
if (!record) {
	const notFoundResponse: JsonVO<null> = {
		success: false,
		code: 404,
		message: "记录不存在",
		data: null,
	};
	return notFoundResponse;
}
```
