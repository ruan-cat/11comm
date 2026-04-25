# Neon + Drizzle 设置

> 本文档介绍如何配置 Neon Postgres 数据库和 Drizzle ORM。

---

## 1. 创建 Neon 项目

### 1.1. 注册和创建项目

1. 访问 [Neon Console](https://console.neon.tech/)
2. 使用 GitHub 或邮箱注册/登录
3. 点击 "New Project" 创建新项目
4. 选择区域 (推荐选择离你最近的)
5. 记下项目名称和数据库名称

### 1.2. 获取连接字符串

1. 在项目仪表板中，找到 **Connection Details** 面板
2. 选择 **Pooled connection** (推荐用于 Serverless)
3. 复制连接字符串，格式如下：

```plain
postgresql://user:password@ep-xxx-xxx-123456.region.aws.neon.tech/neondb?sslmode=require
```

### 1.3. 配置环境变量

```env
# .env
NITRO_DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
```

---

## 2. 安装依赖

```bash
# Drizzle ORM 核心
pnpm add drizzle-orm

# Neon Serverless 驱动
pnpm add @neondatabase/serverless

# 开发工具
pnpm add -D drizzle-kit
```

---

## 3. 配置 Drizzle

### 3.1. drizzle.config.ts

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	// Schema 文件位置 (支持 glob 模式)
	schema: "./lib/db/schema/*.ts",

	// 迁移文件输出目录
	out: "./lib/db/migrations",

	// 数据库类型
	dialect: "postgresql",

	// 数据库连接
	dbCredentials: {
		url: process.env.NITRO_DATABASE_URL!,
	},

	// 严格模式 (推荐)
	strict: true,

	// 详细输出
	verbose: true,
});
```

### 3.2. 添加脚本到 package.json

```json
{
	"scripts": {
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate",
		"db:push": "drizzle-kit push",
		"db:studio": "drizzle-kit studio",
		"db:drop": "drizzle-kit drop"
	}
}
```

| 命令          | 用途                              |
| :------------ | :-------------------------------- |
| `db:generate` | 根据 schema 生成迁移文件          |
| `db:migrate`  | 执行迁移文件到数据库              |
| `db:push`     | 直接推送 schema 到数据库 (开发用) |
| `db:studio`   | 启动可视化数据库管理界面          |
| `db:drop`     | 删除迁移文件                      |

---

## 4. 创建 Drizzle 客户端

### 4.1. 数据库客户端

```typescript
// lib/db/client.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// 导入所有 schema
import * as repairSchema from "./schema/repair";
import * as noticeSchema from "./schema/notice";

// 合并所有 schema
const schema = {
	...repairSchema,
	...noticeSchema,
};

// 数据库实例缓存
let _db: ReturnType<typeof createDb> | null = null;

/**
 * 创建数据库连接
 * @param databaseUrl - Neon 数据库连接字符串
 */
function createDb(databaseUrl: string) {
	const sql = neon(databaseUrl);
	return drizzle(sql, { schema });
}

/**
 * 获取数据库实例 (带缓存)
 * @param databaseUrl - 数据库连接字符串
 * @example const db = useDb(config.databaseUrl)
 */
export function useDb(databaseUrl: string) {
	if (!_db) {
		_db = createDb(databaseUrl);
	}
	return _db;
}

/** 数据库实例类型 */
export type Database = ReturnType<typeof createDb>;
```

### 4.2. Schema 索引文件

```typescript
// lib/db/schema/index.ts
export * from "./repair";
export * from "./notice";
```

---

## 5. 定义数据库 Schema

### 5.1. 维修工单表

```typescript
// lib/db/schema/repair.ts
import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/** 维修工单表 */
export const repairOrders = pgTable("repair_orders", {
	// 主键 (UUID v4 自动生成)
	id: uuid("id").primaryKey().defaultRandom(),

	// 工单信息
	title: text("title").notNull(),
	description: text("description"),
	category: text("category", {
		enum: ["水电", "门窗", "电梯", "公共设施", "其他"],
	}).default("其他"),

	// 状态
	status: text("status", {
		enum: ["pending", "assigned", "processing", "completed", "cancelled"],
	})
		.notNull()
		.default("pending"),

	// 优先级 (1-5, 5最高)
	priority: integer("priority").default(3),

	// 联系信息
	address: text("address"),
	contact: text("contact"),
	phone: text("phone"),

	// 处理人
	assigneeId: text("assignee_id"),
	assigneeName: text("assignee_name"),

	// 时间戳
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	completedAt: timestamp("completed_at"),
});

// 类型导出
export type RepairOrder = typeof repairOrders.$inferSelect;
export type NewRepairOrder = typeof repairOrders.$inferInsert;
```

### 5.2. 公告表

```typescript
// lib/db/schema/notice.ts
import { pgTable, text, uuid, timestamp, boolean } from "drizzle-orm/pg-core";

/** 公告表 */
export const notices = pgTable("notices", {
	id: uuid("id").primaryKey().defaultRandom(),

	// 公告内容
	title: text("title").notNull(),
	content: text("content").notNull(),
	summary: text("summary"),

	// 分类
	category: text("category", {
		enum: ["通知", "公告", "活动", "紧急"],
	}).default("通知"),

	// 状态
	isPublished: boolean("is_published").default(false),
	isTop: boolean("is_top").default(false),

	// 作者
	authorId: text("author_id"),
	authorName: text("author_name"),

	// 时间
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 类型导出
export type Notice = typeof notices.$inferSelect;
export type NewNotice = typeof notices.$inferInsert;
```

---

## 6. 生成和执行迁移

### 6.1. 生成迁移文件

```bash
pnpm db:generate

# 输出示例:
# [✓] 2 table(s) detected
# [✓] Generated migration: 0000_initial_schema.sql
```

### 6.2. 查看生成的 SQL

```sql
-- lib/db/migrations/0000_initial_schema.sql
CREATE TABLE IF NOT EXISTS "repair_orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "category" text DEFAULT 'other',
  "status" text DEFAULT 'pending' NOT NULL,
  "priority" integer DEFAULT 3,
  "address" text,
  "contact" text,
  "phone" text,
  "assignee_id" text,
  "assignee_name" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "completed_at" timestamp
);

CREATE TABLE IF NOT EXISTS "notices" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "summary" text,
  "category" text DEFAULT 'notice',
  "is_published" boolean DEFAULT false,
  "is_top" boolean DEFAULT false,
  "author_id" text,
  "author_name" text,
  "published_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

### 6.3. 执行迁移

```bash
pnpm db:migrate

# 输出示例:
# [✓] Running migration: 0000_initial_schema.sql
# [✓] Migration completed successfully
```

### 6.4. 使用 Drizzle Studio 查看数据

```bash
pnpm db:studio

# 打开 https://local.drizzle.studio 查看数据库
```

---

## 7. 在路由中使用数据库

### 7.1. 基本查询示例

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

## 8. 常见问题

### 8.1. 连接超时

**问题**: 数据库连接超时

**解决**: 确保使用 Pooled connection 字符串，并检查网络连接

### 8.2. SSL 错误

**问题**: SSL certificate problem

**解决**: 确保连接字符串包含 `?sslmode=require`

### 8.3. 迁移冲突

**问题**: 迁移文件与数据库状态不一致

**解决**:

```bash
# 开发环境可以使用 push 直接同步
pnpm db:push

# 或者重新生成迁移
pnpm db:drop
pnpm db:generate
pnpm db:migrate
```

---

## 9. 下一步

数据库设置完成后，继续阅读：

1. [04-drizzle-operations.md](./04-drizzle-operations.md) - Drizzle CRUD 操作
2. [05-nitro-routes.md](./05-nitro-routes.md) - Nitro 文件路由
