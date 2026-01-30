# Neon 与 Drizzle 集成

使用 **Drizzle ORM** 与 **Neon** Postgres 的集成模式、配置和优化。

获取官方文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/guides/drizzle
```

## 选择正确的驱动

Drizzle ORM 适用于多种 Postgres 驱动程序。有关完整的决策树，请参阅 `connection-methods.md`。

| 平台                    | TCP 支持 | 连接池              | 推荐驱动                   |
| ----------------------- | -------- | ------------------- | -------------------------- |
| Vercel (Fluid)          | 是       | `@vercel/functions` | `pg` (node-postgres)       |
| Cloudflare (Hyperdrive) | 是       | Hyperdrive          | `pg` (node-postgres)       |
| Cloudflare Workers      | 否       | 否                  | `@neondatabase/serverless` |
| Netlify Functions       | 否       | 否                  | `@neondatabase/serverless` |
| Deno Deploy             | 否       | 否                  | `@neondatabase/serverless` |
| Railway / Render        | 是       | 内置                | `pg` (node-postgres)       |

## 连接设置

### 1. 使用 node-postgres 的 TCP (长时间运行的服务器)

最适合 Railway, Render, 传统 VPS。

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg dotenv
```

```typescript
// src/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });
```

### 2. 带有连接池的 Vercel Fluid Compute

```bash
npm install drizzle-orm pg @vercel/functions
npm install -D drizzle-kit @types/pg
```

```typescript
// src/db.ts
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
attachDatabasePool(pool);

export const db = drizzle({ client: pool, schema });
```

### 3. HTTP 适配器 (无 TCP 的边缘环境)

适用于 Cloudflare Workers, Netlify Edge, Deno Deploy。**不**支持交互式事务。

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```

```typescript
// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

### 4. WebSocket 适配器 (带有事务的边缘环境)

```bash
npm install drizzle-orm @neondatabase/serverless ws
npm install -D drizzle-kit dotenv @types/ws
```

```typescript
// src/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws; // Node.js < v22 需要

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

## Drizzle 配置

```typescript
// drizzle.config.ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
	schema: "./src/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
```

## 迁移

```bash
# 生成迁移
npx drizzle-kit generate

# 应用迁移
npx drizzle-kit migrate
```

## 模式定义

```typescript
// src/schema.ts
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	role: text("role").default("user").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export const postsTable = pgTable("posts", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Post = typeof postsTable.$inferSelect;
export type NewPost = typeof postsTable.$inferInsert;
```

## 查询模式

### 批量插入

```typescript
export async function batchInsertUsers(users: NewUser[]) {
	return db.insert(usersTable).values(users).returning();
}
```

### 预处理语句

```typescript
import { sql } from "drizzle-orm";

export const getUsersByRolePrepared = db
	.select()
	.from(usersTable)
	.where(sql`${usersTable.role} = $1`)
	.prepare("get_users_by_role");

// 用法: getUsersByRolePrepared.execute(['admin'])
```

### 事务

```typescript
export async function createUserWithPosts(user: NewUser, posts: NewPost[]) {
	return await db.transaction(async (tx) => {
		const [newUser] = await tx.insert(usersTable).values(user).returning();

		if (posts.length > 0) {
			await tx.insert(postsTable).values(
				posts.map((post) => ({
					...post,
					userId: newUser.id,
				})),
			);
		}

		return newUser;
	});
}
```

## 使用 Neon 分支

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const getBranchUrl = () => {
	const env = process.env.NODE_ENV;
	if (env === "development") return process.env.DEV_DATABASE_URL;
	if (env === "test") return process.env.TEST_DATABASE_URL;
	return process.env.DATABASE_URL;
};

const sql = neon(getBranchUrl()!);
export const db = drizzle({ client: sql });
```

## 错误处理

```typescript
export async function safeNeonOperation<T>(operation: () => Promise<T>): Promise<T> {
	try {
		return await operation();
	} catch (error: any) {
		if (error.message?.includes("connection pool timeout")) {
			console.error("Neon connection pool timeout");
		}
		throw error;
	}
}
```

## 最佳实践

1. **连接管理** - 有关特定平台的指导，请参阅 `connection-methods.md`
2. **Neon 功能** - 利用分支进行开发/测试 (请参阅 `features.md`)
3. **查询优化** - 批量操作，使用预处理语句
4. **模式设计** - 利用 Postgres 特性，使用适当的索引
