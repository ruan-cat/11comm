# Nitro 接口环境变量配置指南

本文档说明 Nitro 接口在 Cloudflare Worker 环境中如何获取 Neon 数据库环境变量的完整流程。

## 1. 环境变量获取链路

### 1.1 命令执行流程

```mermaid
graph TD
    A[运行 pnpm build:prod:cloudflare] --> B[turbo 运行 env:pull 命令]
    B --> C[调用 scripts/env-pull.ts]
    C --> D[从 Vercel 项目拉取环境变量]
    D --> E[生成 apps/admin/.env.vercel.local]
    E --> F[turbo 运行 vite:build:prod:cloudflare]
    F --> G[Vite 调用 Nitro 插件]
    G --> H[Nitro 加载 nitro.config.ts]
    H --> I[dotenv 加载 .env.vercel.local]
    I --> J[getVercelEnv 读取环境变量]
    J --> K[将环境变量写入 cloudflare.wrangler.vars]
    K --> L[生成 .output/server/wrangler.json]
```

### 1.2 关键文件说明

| 文件                           | 说明                                                        |
| ------------------------------ | ----------------------------------------------------------- |
| `.env`                         | 项目根目录的环境变量配置文件，定义 `VERCEL_ENV_PREFIX` 前缀 |
| `.env.vercel.local`            | 由 `env:pull` 命令生成，包含 Vercel Neon 集成的环境变量     |
| `nitro.config.ts`              | Nitro 配置文件，负责将环境变量写入 wrangler 配置            |
| `.output/server/wrangler.json` | 构建生成的 wrangler 配置文件，包含环境变量                  |

## 2. 环境变量前缀

### 2.1 Vercel 前缀

本项目使用 Vercel Neon 集成，环境变量前缀为：

- **前缀**: `comm_admin_11_`
- **完整变量名**: `comm_admin_11__DATABASE_URL`

### 2.2 .env.vercel.local 文件内容示例

```bash
# Neon 数据库连接
comm_admin_11__DATABASE_URL="postgresql://neondb_owner:xxx@ep-cold-surf-a1x1hkmn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
comm_admin_11__DATABASE_URL_UNPOOLED="postgresql://neondb_owner:xxx@ep-cold-surf-a1x1hkmn.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Neon 项目信息
comm_admin_11__NEON_AUTH_BASE_URL="https://ep-cold-surf-a1x1hkmn.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth"
comm_admin_11__NEON_PROJECT_ID="snowy-base-74751932"

# PostgreSQL 连接参数
comm_admin_11__PGDATABASE="neondb"
comm_admin_11__PGHOST="ep-cold-surf-a1x1hkmn-pooler.ap-southeast-1.aws.neon.tech"
comm_admin_11__PGPASSWORD="xxx"
comm_admin_11__PGUSER="neondb_owner"
```

## 3. 数据存储特点

### 3.1 构建时存储

```mermaid
graph LR
    A[.env.vercel.local] --> B[dotenv 加载]
    B --> C[nitro.config.ts]
    C --> D[cloudflare.wrangler.vars]
    D --> E[.output/server/wrangler.json]
```

在构建过程中，环境变量通过以下方式存储：

1. **nitro.config.ts** 使用 `dotenv` 加载 `.env.vercel.local`
2. 通过 `getVercelEnv()` 函数读取带前缀的环境变量
3. 将环境变量写入 `cloudflare.wrangler.vars` 配置
4. 最终写入 `.output/server/wrangler.json` 的 `vars` 字段

### 3.2 运行时存储

```mermaid
graph LR
    A[wrangler.json vars] --> B[Cloudflare Worker 环境]
    B --> C[process.env]
    C --> D[Nitro API 路由]
    D --> E[useDb 函数]
    E --> F[Neon 数据库]
```

在 Cloudflare Worker 运行时：

1. Nitro 自动将 `wrangler.json` 中的 `vars` 注入到 Worker 环境
2. 代码中使用 `process.env.comm_admin_11__DATABASE_URL` 访问环境变量

### 3.3 本地开发存储

本地开发时，环境变量存储在：

- `apps/admin/.env` - 项目本地配置
- `apps/admin/.env.vercel.local` - Vercel 拉取的环境变量

## 4. 本地验证方式

### 4.1 构建验证

运行构建命令并检查输出：

```bash
cd apps/admin
pnpm build:prod:cloudflare
```

```mermaid
graph TD
    A[运行 build 命令] --> B{检查构建输出}
    B -->|成功| C[检查 wrangler.json]
    B -->|失败| D[检查错误信息]
    C --> E{验证 vars 字段}
    E -->|包含 DATABASE_URL| F[验证通过]
    E -->|vars 为空| G[检查 env:pull 是否执行]
    D --> H[修复后重新构建]
    G --> H
```

### 4.2 验证 wrangler.json

构建完成后，检查生成的配置文件：

```bash
cat apps/admin/.output/server/wrangler.json
```

**预期结果**：文件中的 `vars` 字段应包含 `comm_admin_11__DATABASE_URL` 等环境变量：

```json
{
  "vars": {
    "comm_admin_11__DATABASE_URL": "postgresql://...",
    "comm_admin_11__DATABASE_URL_UNPOOLED": "postgresql://...",
    ...
  }
}
```

### 4.3 部署验证

部署后访问接口验证：

```bash
curl https://01s-11.ruan-cat.com/api/dev-team/config-manage/center/list
```

**预期结果**：返回 200 状态码和正确的 JSON 数据

## 5. 核心代码说明

### 5.1 server/db/index.ts

数据库连接使用 `process.env.comm_admin_11__DATABASE_URL`：

```typescript
export function useDb(event: H3Event): DbType {
	const databaseUrl = process.env.comm_admin_11__DATABASE_URL;

	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not configured...");
	}

	const envSql = neon(databaseUrl);
	const envDbInstance = drizzle(envSql, { schema });
	return envDbInstance;
}
```

### 5.2 nitro.config.ts

Nitro 配置使用 `cloudflare.wrangler.vars` 写入环境变量：

```typescript
function getVercelEnv(envName: string): string | undefined {
	const prefix = process.env.VERCEL_ENV_PREFIX || "comm_admin_11_";
	return process.env[`${prefix}_${envName}`];
}

export default defineConfig({
	cloudflare: {
		wrangler: {
			vars: {
				comm_admin_11__DATABASE_URL: getVercelEnv("DATABASE_URL"),
				// ... 其他变量
			},
		},
	},
});
```

## 6. 常见问题

### 6.1 环境变量未找到

**症状**: 接口返回 500 错误，错误信息为 "DATABASE_URL is not configured"

**解决方案**:

1. 确保 `.env.vercel.local` 文件存在且包含 `comm_admin_11__DATABASE_URL`
2. 确保构建命令先运行 `env:pull`

### 6.2 wrangler.json 中 vars 为空

**症状**: 构建成功但 `wrangler.json` 中 `vars` 为空对象

**解决方案**:

1. 检查 `.env.vercel.local` 文件是否存在
2. 检查 `nitro.config.ts` 中是否正确调用了 `dotenv`
