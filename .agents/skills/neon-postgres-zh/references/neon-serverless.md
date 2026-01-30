# Neon Serverless 驱动

在 Serverless 环境中使用 `@neondatabase/serverless` 驱动连接 Neon 数据库的模式和最佳实践。该驱动支持通过 **HTTP** 进行快速的单次查询，或通过 **WebSocket** 实现 `node-postgres` 兼容性和交互式事务。

官方文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/serverless/serverless-driver
```

## 安装

```bash
# 使用 npm
npm install @neondatabase/serverless

# 使用 JSR
bunx jsr add @neon/serverless
```

**注意：** 1.0.0+ 版本需要 **Node.js v19 或更高版本**。

对于依赖 `pg` 但希望使用 Neon 基于 WebSocket 的连接池的项目：

```json
"dependencies": {
  "pg": "npm:@neondatabase/serverless@^0.10.4"
},
"overrides": {
  "pg": "npm:@neondatabase/serverless@^0.10.4"
}
```

## 连接字符串

始终使用环境变量：

```typescript
// 用于 HTTP 查询
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);

// 用于 WebSocket 连接
import { Pool } from "@neondatabase/serverless";
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
```

**切勿硬编码凭据：**

```typescript
// 避免这样做
const sql = neon("postgres://username:password@host.neon.tech/neondb");
```

## 使用 `neon` 函数进行 HTTP 查询

适用于 Serverless/Edge 环境中的简单、“一次性”查询。使用 HTTP `fetch` - 是单次查询最快的方法。

### 参数化查询

使用带标签的模板字面量进行安全的参数插值：

```typescript
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
```

对于手动构建的查询：

```typescript
const [post] = await sql.query("SELECT * FROM posts WHERE id = $1", [postId]);
```

**切勿拼接用户输入：**

```typescript
// 避免：SQL 注入风险
const [post] = await sql("SELECT * FROM posts WHERE id = " + postId);
```

### 配置选项

```typescript
// 将行作为数组而不是对象返回
const sqlArrayMode = neon(process.env.DATABASE_URL!, { arrayMode: true });
const rows = await sqlArrayMode`SELECT id, title FROM posts`;
// rows -> [[1, "First Post"], [2, "Second Post"]]

// 获取完整结果，包括行数和字段元数据
const sqlFull = neon(process.env.DATABASE_URL!, { fullResults: true });
const result = await sqlFull`SELECT * FROM posts LIMIT 1`;
// result -> { rows: [...], fields: [...], rowCount: 1, ... }
```

## 使用 `Pool` 和 `Client` 进行 WebSocket 连接

用于 `node-postgres` 兼容性、交互式事务或会话支持。

### WebSocket 配置

对于 Node.js v21 及更早版本：

```typescript
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Node.js < v22 必需
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
```

### Serverless 生命周期管理

在同一次调用中创建、使用并关闭连接池：

```typescript
// Vercel Edge Functions 示例
export default async (req: Request, ctx: ExecutionContext) => {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

	try {
		const { rows } = await pool.query("SELECT * FROM users");
		return new Response(JSON.stringify(rows));
	} catch (err) {
		console.error(err);
		return new Response("Database error", { status: 500 });
	} finally {
		ctx.waitUntil(pool.end());
	}
};
```

**避免**在处理程序外部创建全局 `Pool` 实例。

## 事务

### HTTP 事务

用于在单个非交互式事务中运行多个查询：

```typescript
const [newUser, newProfile] = await sql.transaction(
	[
		sql`INSERT INTO users(name) VALUES(${name}) RETURNING id`,
		sql`INSERT INTO profiles(user_id, bio) VALUES(${userId}, ${bio})`,
	],
	{
		isolationLevel: "ReadCommitted",
		readOnly: false,
	},
);
```

### 交互式事务

用于具有条件逻辑的复杂事务：

```typescript
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const client = await pool.connect();
try {
	await client.query("BEGIN");
	const {
		rows: [{ id }],
	} = await client.query("INSERT INTO users(name) VALUES($1) RETURNING id", [name]);
	await client.query("INSERT INTO profiles(user_id, bio) VALUES($1, $2)", [id, bio]);
	await client.query("COMMIT");
} catch (err) {
	await client.query("ROLLBACK");
	throw err;
} finally {
	client.release();
	await pool.end();
}
```

## 环境特定的优化

```javascript
// 对于 Vercel Edge Functions，指定最近的区域
export const config = {
	runtime: "edge",
	regions: ["iad1"], // 离你的 Neon DB 最近的区域
};

// 对于 Cloudflare Workers，考虑使用 Hyperdrive
// https://neon.com/blog/hyperdrive-neon-faq
```

## ORM 集成

有关 Drizzle ORM 与 serverless 驱动的集成，请参阅 `neon-drizzle.md`。

### Prisma

```typescript
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon, PrismaNeonHTTP } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

const connectionString = process.env.DATABASE_URL;
neonConfig.webSocketConstructor = ws;

// HTTP 适配器
const adapterHttp = new PrismaNeonHTTP(connectionString!, {});
export const prismaClientHttp = new PrismaClient({ adapter: adapterHttp });

// WebSocket 适配器
const adapterWs = new PrismaNeon({ connectionString });
export const prismaClientWs = new PrismaClient({ adapter: adapterWs });
```

### Kysely

```typescript
import { Pool } from "@neondatabase/serverless";
import { Kysely, PostgresDialect } from "kysely";

const dialect = new PostgresDialect({
	pool: new Pool({ connectionString: process.env.DATABASE_URL }),
});

const db = new Kysely({ dialect });
```

**注意：** 不要将 `neon()` 函数传递给期望 `node-postgres` 兼容 `Pool` 的 ORM。

## 错误处理

```javascript
// 连接池错误处理
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on("error", (err) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

// 查询错误处理
try {
	const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
	if (!post) {
		return new Response("Not found", { status: 404 });
	}
} catch (err) {
	console.error("Database query failed:", err);
	return new Response("Server error", { status: 500 });
}
```
