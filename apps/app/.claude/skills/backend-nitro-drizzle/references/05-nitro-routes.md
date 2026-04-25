# Nitro 文件路由系统

> 本文档介绍 Nitro v3 的文件系统路由，以及如何构建 RESTful API。

---

## 1. 路由约定

### 1.1. 基本规则

Nitro 使用文件系统路由，`routes/` 目录下的文件自动映射为 API 路由。

| 文件路径                              | HTTP 方法 | URL 路径                |
| :------------------------------------ | :-------: | :---------------------- |
| `routes/api/test.ts`                  | 所有方法  | `/api/test`             |
| `routes/api/test.get.ts`              |    GET    | `/api/test`             |
| `routes/api/test.post.ts`             |   POST    | `/api/test`             |
| `routes/api/[id].ts`                  | 所有方法  | `/api/:id`              |
| `routes/api/[id].get.ts`              |    GET    | `/api/:id`              |
| `routes/api/user/[id]/profile.get.ts` |    GET    | `/api/user/:id/profile` |

### 1.2. 目录结构示例

```plain
routes/
├── api/
│   ├── health.get.ts           # GET /api/health
│   ├── repair/
│   │   ├── list.get.ts         # GET /api/repair/list
│   │   ├── create.post.ts      # POST /api/repair/create
│   │   ├── [id].get.ts         # GET /api/repair/:id
│   │   ├── [id].put.ts         # PUT /api/repair/:id
│   │   └── [id].delete.ts      # DELETE /api/repair/:id
│   └── notice/
│       ├── list.get.ts         # GET /api/notice/list
│       └── [id].get.ts         # GET /api/notice/:id
```

---

## 2. 定义路由处理器

### 2.1. 基本处理器

```typescript
// routes/api/health.get.ts
import { defineHandler } from "nitro/h3";

export default defineHandler(() => {
	return {
		success: true,
		message: "API is running",
		timestamp: Date.now(),
	};
});
```

### 2.2. 异步处理器

```typescript
// routes/api/repair/list.get.ts
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";
import { repairOrders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { success } from "@/utils/response";

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const db = useDb(config.databaseUrl);

	const list = await db.select().from(repairOrders).orderBy(desc(repairOrders.createdAt));

	return success(list);
});
```

---

## 3. 获取请求数据

### 3.1. 路径参数

```typescript
// routes/api/repair/[id].get.ts
import { defineHandler, getRouterParam } from "nitro/h3";

export default defineHandler(async (event) => {
	// 获取路径参数
	const id = getRouterParam(event, "id");

	if (!id) {
		throw createError({
			statusCode: 400,
			message: "缺少 ID 参数",
		});
	}

	// 使用 id 查询数据...
	return { id };
});
```

### 3.2. 查询参数

```typescript
// routes/api/repair/list.get.ts
import { defineHandler, getQuery } from "nitro/h3";

export default defineHandler(async (event) => {
	// 获取查询参数: /api/repair/list?status=pending&page=1
	const query = getQuery(event);

	const status = query.status as string | undefined;
	const page = parseInt(query.page as string) || 1;
	const pageSize = parseInt(query.pageSize as string) || 10;

	// 使用查询参数...
	return { status, page, pageSize };
});
```

### 3.3. 请求体

```typescript
// routes/api/repair/create.post.ts
import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";

// 定义验证 Schema
const createSchema = z.object({
	title: z.string().min(1, "标题不能为空"),
	description: z.string().optional(),
	address: z.string().optional(),
	contact: z.string().optional(),
	phone: z.string().optional(),
	priority: z.number().min(1).max(5).optional(),
});

export default defineHandler(async (event) => {
	// 读取请求体
	const body = await readBody(event);

	// 验证数据
	const validated = createSchema.parse(body);

	// 使用验证后的数据...
	return { success: true, data: validated };
});
```

### 3.4. 请求头

```typescript
// routes/api/protected.get.ts
import { defineHandler, getHeader } from "nitro/h3";

export default defineHandler((event) => {
	const authorization = getHeader(event, "Authorization");
	const contentType = getHeader(event, "Content-Type");

	return { authorization, contentType };
});
```

---

## 4. 错误处理

### 4.1. 抛出 HTTP 错误

```typescript
import { defineHandler, createError } from "nitro/h3";

export default defineHandler(async (event) => {
	const id = getRouterParam(event, "id");

	const order = await getOrderById(id);

	if (!order) {
		throw createError({
			statusCode: 404,
			message: "工单不存在",
		});
	}

	return { success: true, data: order };
});
```

### 4.2. Zod 验证错误处理

```typescript
import { defineHandler, readBody, createError } from "nitro/h3";
import { z, ZodError } from "zod";

const schema = z.object({
	title: z.string().min(1),
});

export default defineHandler(async (event) => {
	const body = await readBody(event);

	try {
		const validated = schema.parse(body);
		// 处理数据...
	} catch (error) {
		if (error instanceof ZodError) {
			const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
			throw createError({
				statusCode: 400,
				message: `参数验证失败: ${messages.join("; ")}`,
			});
		}
		throw error;
	}
});
```

---

## 5. 完整的 CRUD 示例

### 5.1. 获取列表

```typescript
// routes/api/repair/list.get.ts
import { defineHandler, getQuery, createError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";
import { repairOrders } from "@/db/schema";
import { eq, desc, like, and, count } from "drizzle-orm";
import { success, paginated } from "@/utils/response";

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const db = useDb(config.databaseUrl);

	// 获取查询参数
	const query = getQuery(event);
	const status = query.status as string | undefined;
	const search = query.search as string | undefined;
	const page = parseInt(query.page as string) || 1;
	const pageSize = parseInt(query.pageSize as string) || 10;

	// 构建查询条件
	const conditions = [];
	if (status) {
		conditions.push(eq(repairOrders.status, status));
	}
	if (search) {
		conditions.push(like(repairOrders.title, `%${search}%`));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	// 查询数据
	const data = await db
		.select()
		.from(repairOrders)
		.where(whereClause)
		.orderBy(desc(repairOrders.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	// 查询总数
	const [{ total }] = await db.select({ total: count() }).from(repairOrders).where(whereClause);

	return paginated(data, { page, pageSize, total });
});
```

### 5.2. 获取详情

```typescript
// routes/api/repair/[id].get.ts
import { defineHandler, getRouterParam, createError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";
import { repairOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { success } from "@/utils/response";

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const db = useDb(config.databaseUrl);

	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({ statusCode: 400, message: "缺少 ID 参数" });
	}

	const [order] = await db.select().from(repairOrders).where(eq(repairOrders.id, id)).limit(1);

	if (!order) {
		throw createError({ statusCode: 404, message: "工单不存在" });
	}

	return success(order);
});
```

### 5.3. 创建记录

```typescript
// routes/api/repair/create.post.ts
import { defineHandler, readBody, createError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";
import { repairOrders } from "@/db/schema";
import { z, ZodError } from "zod";
import { success } from "@/utils/response";

const createSchema = z.object({
	title: z.string().min(1, "标题不能为空"),
	description: z.string().optional(),
	category: z.enum(["水电", "门窗", "电梯", "公共设施", "其他"]).optional(),
	address: z.string().optional(),
	contact: z.string().optional(),
	phone: z.string().optional(),
	priority: z.number().min(1).max(5).optional(),
});

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const db = useDb(config.databaseUrl);

	const body = await readBody(event);

	// 验证请求数据
	let validated;
	try {
		validated = createSchema.parse(body);
	} catch (error) {
		if (error instanceof ZodError) {
			const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
			throw createError({
				statusCode: 400,
				message: `参数验证失败: ${messages.join("; ")}`,
			});
		}
		throw error;
	}

	// 插入数据
	const [newOrder] = await db.insert(repairOrders).values(validated).returning();

	return success(newOrder, "创建成功");
});
```

### 5.4. 更新记录

```typescript
// routes/api/repair/[id].put.ts
import { defineHandler, readBody, getRouterParam, createError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";
import { repairOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z, ZodError } from "zod";
import { success } from "@/utils/response";

const updateSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	status: z.enum(["pending", "assigned", "processing", "completed", "cancelled"]).optional(),
	priority: z.number().min(1).max(5).optional(),
	assigneeId: z.string().optional(),
	assigneeName: z.string().optional(),
});

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const db = useDb(config.databaseUrl);

	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({ statusCode: 400, message: "缺少 ID 参数" });
	}

	const body = await readBody(event);

	// 验证请求数据
	let validated;
	try {
		validated = updateSchema.parse(body);
	} catch (error) {
		if (error instanceof ZodError) {
			const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
			throw createError({
				statusCode: 400,
				message: `参数验证失败: ${messages.join("; ")}`,
			});
		}
		throw error;
	}

	// 更新数据
	const [updatedOrder] = await db
		.update(repairOrders)
		.set({
			...validated,
			updatedAt: new Date(),
			...(validated.status === "completed" ? { completedAt: new Date() } : {}),
		})
		.where(eq(repairOrders.id, id))
		.returning();

	if (!updatedOrder) {
		throw createError({ statusCode: 404, message: "工单不存在" });
	}

	return success(updatedOrder, "更新成功");
});
```

### 5.5. 删除记录

```typescript
// routes/api/repair/[id].delete.ts
import { defineHandler, getRouterParam, createError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { useDb } from "@/db/client";
import { repairOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { success } from "@/utils/response";

export default defineHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const db = useDb(config.databaseUrl);

	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({ statusCode: 400, message: "缺少 ID 参数" });
	}

	const [deletedOrder] = await db.delete(repairOrders).where(eq(repairOrders.id, id)).returning();

	if (!deletedOrder) {
		throw createError({ statusCode: 404, message: "工单不存在" });
	}

	return success(null, "删除成功");
});
```

---

## 6. 中间件

### 6.1. 全局中间件

```typescript
// middleware/log.ts
import { defineEventHandler } from "nitro/h3";

export default defineEventHandler((event) => {
	console.log(`[${new Date().toISOString()}] ${event.method} ${event.path}`);
	// 不返回任何内容，继续执行后续处理器
});
```

### 6.2. 路由特定中间件

```typescript
// middleware/api/auth.ts (只对 /api/** 路由生效)
import { defineEventHandler, createError, getHeader } from "nitro/h3";

export default defineEventHandler((event) => {
	// 只检查需要认证的路由
	if (event.path.startsWith("/api/admin")) {
		const token = getHeader(event, "Authorization");

		if (!token) {
			throw createError({
				statusCode: 401,
				message: "未授权访问",
			});
		}
	}
});
```

---

## 7. 下一步

路由开发完成后，继续阅读：

1. [06-integration.md](./06-integration.md) - uni-app 前后端集成
