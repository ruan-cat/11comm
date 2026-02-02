# 连接方式

根据部署平台和运行环境，选择适合 Neon Postgres 数据库的最佳连接方式的指南。

获取官方文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/connect/choose-connection
```

## 决策树

遵循此流程确定正确的连接方式：

### 1. 你使用的语言是什么？

**非 TypeScript/JavaScript** → 使用来自安全服务器的 **TCP 连接池**。

对于非 TypeScript 语言，请使用启用连接池的语言原生 Postgres 驱动程序从安全后端服务器连接。

| 语言/框架           | 文档                                       |
| ------------------- | ------------------------------------------ |
| Django (Python)     | https://neon.com/docs/guides/django        |
| SQLAlchemy (Python) | https://neon.com/docs/guides/sqlalchemy    |
| Elixir Ecto         | https://neon.com/docs/guides/elixir-ecto   |
| Laravel (PHP)       | https://neon.com/docs/guides/laravel       |
| Ruby on Rails       | https://neon.com/docs/guides/ruby-on-rails |
| Go                  | https://neon.com/docs/guides/go            |
| Rust                | https://neon.com/docs/guides/rust          |
| Java                | https://neon.com/docs/guides/java          |

**TypeScript/JavaScript** → 继续步骤 2。

---

### 2. 无后端的客户端应用？

**是** → 通过 `@neondatabase/neon-js` 使用 **Neon Data API**

这是客户端应用的唯一选择，因为浏览器无法建立直接的 TCP 连接到 Postgres。请参阅 `neon-js.md` 进行设置。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/reference/javascript-sdk
```

**否** → 继续步骤 3。

---

### 3. 长时间运行的服务器？(Railway, Render, 传统 VPS)

**是** → 通过 `node-postgres`、`postgres.js` 或 `bun:pg` 使用 **TCP 连接池**

长时间运行的服务器维护持久连接，因此带有池化的标准 TCP 驱动程序是最佳选择。

**否** → 继续步骤 4。

---

### 4. 不支持 TCP 的边缘环境？

一些边缘运行时不支持 TCP 连接。现在这种情况很少见。

**是** → 继续步骤 5 检查事务需求。

**否** → 继续步骤 6 检查连接池支持。

---

### 5. 你的应用使用 SQL 事务吗？

**是** → 通过 `@neondatabase/serverless` 和 `Pool` 使用 **WebSocket 传输**

WebSocket 维护事务所需的连接状态。请参阅 `neon-serverless.md` 进行设置。

**否** → 通过 `@neondatabase/serverless` 使用 **HTTP 传输**

HTTP 对于单个查询更快（~3 次往返 vs TCP 的 ~8 次）。请参阅 `neon-serverless.md` 进行设置。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/serverless/serverless-driver
```

---

### 6. 支持连接池的 Serverless 环境？

**Vercel (Fluid Compute)** → 使用 **TCP 和 `@vercel/functions`**

Vercel 的 Fluid 计算支持连接池。使用 `attachDatabasePool` 进行最佳连接管理。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/guides/vercel-connection-methods
```

**Cloudflare (with Hyperdrive)** → 通过 Hyperdrive 使用 **TCP**

Cloudflare Hyperdrive 为 Workers 提供连接池。使用 `node-postgres` 或任何原生 TCP 驱动程序。

有关使用 Cloudflare Workers 和 Hyperdrive 连接的更多信息，请参阅 https://neon.com/docs/guides/cloudflare-hyperdrive 。

**无连接池支持 (Netlify, Deno Deploy)** → 使用 `@neondatabase/serverless`

根据事务需求回退到步骤 5 中的决定。

---

## 快速参考表

| 平台                    | TCP 支持 | 连接池              | 推荐驱动                   |
| ----------------------- | -------- | ------------------- | -------------------------- |
| Vercel (Fluid)          | 是       | `@vercel/functions` | `pg` (node-postgres)       |
| Cloudflare (Hyperdrive) | 是       | Hyperdrive          | `pg` (node-postgres)       |
| Cloudflare Workers      | 否       | 否                  | `@neondatabase/serverless` |
| Netlify Functions       | 否       | 否                  | `@neondatabase/serverless` |
| Deno Deploy             | 否       | 否                  | `@neondatabase/serverless` |
| Railway / Render        | 是       | 内置                | `pg` (node-postgres)       |
| 客户端 (浏览器)         | 否       | N/A                 | `@neondatabase/neon-js`    |

---

## ORM 支持

流行的 TypeScript/JavaScript ORM 都适用于 Neon：

| ORM     | 支持的驱动                                      | 文档                                 |
| ------- | ----------------------------------------------- | ------------------------------------ |
| Drizzle | `pg`, `postgres.js`, `@neondatabase/serverless` | https://neon.com/docs/guides/drizzle |
| Kysely  | `pg`, `postgres.js`, `@neondatabase/serverless` | https://neon.com/docs/guides/kysely  |
| Prisma  | `pg`, `@neondatabase/serverless`                | https://neon.com/docs/guides/prisma  |
| TypeORM | `pg`                                            | https://neon.com/docs/guides/typeorm |

所有 ORM 都根据你的平台支持 TCP 驱动程序和 Neon 的 serverless 驱动程序。

有关 Drizzle ORM 与 Neon 的集成，请参阅 `neon-drizzle.md`。

---

## Vercel Fluid + Drizzle 示例

使用 Drizzle ORM 和连接池的 Vercel 完整数据库客户端设置。更多示例请参阅 `neon-drizzle.md`。

```typescript
// src/lib/db/client.ts
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
attachDatabasePool(pool);

export const db = drizzle({ client: pool, schema });
```

**为什么要用 `attachDatabasePool`?**

- 第一个请求建立 TCP 连接（~8 次往返）
- 后续请求立即重用连接
- 确保在函数挂起之前优雅地关闭空闲连接
- 防止无服务器环境中的连接泄漏

---

## 收集需求

在帮助用户选择连接方式时，收集以下信息：

1. **部署平台**：应用将在哪里运行？(Vercel, Cloudflare, Netlify, Railway, 浏览器等)
2. **运行时类型**：Serverless 函数、边缘函数还是长时间运行的服务器？
3. **事务需求**：应用是否需要 SQL 事务？
4. **ORM 偏好**：使用 Drizzle, Kysely, Prisma 还是原生 SQL？

然后提供：

- 推荐的驱动程序/包
- 适合其设置的工作代码示例
- 正确的 npm 安装命令

---

## 文档资源

| 主题              | URL                                                    |
| ----------------- | ------------------------------------------------------ |
| 选择连接方式      | https://neon.com/docs/connect/choose-connection        |
| Serverless Driver | https://neon.com/docs/serverless/serverless-driver     |
| JavaScript SDK    | https://neon.com/docs/reference/javascript-sdk         |
| 连接池            | https://neon.com/docs/connect/connection-pooling       |
| Vercel 连接方式   | https://neon.com/docs/guides/vercel-connection-methods |
