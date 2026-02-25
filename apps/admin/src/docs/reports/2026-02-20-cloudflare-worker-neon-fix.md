<!-- 已完成 有参考意义 未来考虑删除 -->

# Cloudflare Worker Neon 数据库连接修复实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修复 Cloudflare Worker 部署的 Nitro 接口无法连接 Neon 数据库的问题，使接口能正常返回数据而非 500 错误。

**Architecture:** 通过 `nitro.config.ts` 中的 `cloudflare.wrangler.vars` 配置，将 `.env.vercel.local` 中的 Vercel 前缀环境变量（`comm_admin_11__DATABASE_URL` 等）自动写入生成的 `wrangler.json` 文件。

**Tech Stack:** Nitro v3, Cloudflare Workers, Neon Database, Drizzle ORM

**Important:**

- 使用 Vercel 前缀 `comm_admin_11_`
- 环境变量来源：`apps/admin/.env.vercel.local`（由 `env:pull` 命令生成）
- 关键环境变量：`comm_admin_11__DATABASE_URL`

---

## Task 1: 修改 server/db/index.ts 使用 process.env

**Files:**

- Modify: `apps/admin/server/db/index.ts`

**完成状态：** ✅

---

## Task 2: 修改 nitro.config.ts 配置环境变量

**Files:**

- Modify: `apps/admin/nitro.config.ts`

**完成状态：** ✅

**实现细节：**

1. 使用 `dotenv` 加载 `.env.vercel.local` 文件
2. 使用 `getVercelEnv` 函数获取带前缀的环境变量
3. 将环境变量配置到 `cloudflare.wrangler.vars`

---

## Task 3: 构建验证

**完成状态：** ✅

**验证结果：**

构建成功后，检查 `.output/server/wrangler.json`：

```json
{
	"vars": {
		"comm_admin_11__DATABASE_URL": "postgresql://neondb_owner:xxx@ep-cold-surf-a1x1hkmn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
		"comm_admin_11__DATABASE_URL_UNPOOLED": "...",
		"comm_admin_11__NEON_AUTH_BASE_URL": "...",
		"comm_admin_11__NEON_PROJECT_ID": "snowy-base-74751932",
		"comm_admin_11__PGDATABASE": "neondb",
		"comm_admin_11__PGHOST": "...",
		"comm_admin_11__PGHOST_UNPOOLED": "...",
		"comm_admin_11__PGPASSWORD": "...",
		"comm_admin_11__PGUSER": "neondb_owner"
	}
}
```

---

## Task 4: 部署到 Cloudflare Worker

**Files:**

- None

**Step 1: 部署**

```bash
cd apps/admin
npx wrangler deploy
```

或者使用 Nitro 生成的部署命令：

```bash
cd apps/admin/.output
npx wrangler deploy
```

**Step 2: 验证生产接口**

访问 `https://01s-11.ruan-cat.com/api/dev-team/config-manage/center/list` 验证接口正常工作。

---

## 部署流程说明

```plain
1. 运行 pnpm build:prod:cloudflare 命令
   │
   ├─> turbo 先运行 env:pull 命令
   │   └─> 生成 apps/admin/.env.vercel.local（包含 comm_admin_11__DATABASE_URL）
   │
   └─> 然后运行 vite:build:prod:cloudflare 命令
       └─> Vite 调用 Nitro 插件
       └─> Nitro 加载 nitro.config.ts
       └─> dotenv 加载 .env.vercel.local 文件
       └─> getVercelEnv("DATABASE_URL") 读取 process.env.comm_admin_11__DATABASE_URL
       └─> 将环境变量写入 cloudflare.wrangler.vars
       └─> 生成 .output/server/wrangler.json

2. 运行 npx wrangler deploy
   └─> 读取 wrangler.json 中的 vars
   └─> 部署到 Cloudflare Workers
```

---

## 修改的文件清单

| 文件                            | 操作 | 说明                                                          |
| ------------------------------- | ---- | ------------------------------------------------------------- |
| `apps/admin/server/db/index.ts` | 修改 | 使用 `process.env.comm_admin_11__DATABASE_URL` 获取数据库连接 |
| `apps/admin/nitro.config.ts`    | 修改 | 添加 `dotenv` 加载环境变量，配置 `cloudflare.wrangler.vars`   |

---

## 验证标准

- [x] Task 1: server/db/index.ts 使用 process.env.COMM_ADMIN_11\_\_DATABASE_URL
- [x] Task 2: nitro.config.ts 配置 cloudflare.wrangler.vars
- [x] Task 3: 构建后 wrangler.json 包含数据库环境变量
- [ ] Task 4: 生产接口返回 200 状态码
- [ ] Task 5: 错误情况下能看到详细的错误信息
