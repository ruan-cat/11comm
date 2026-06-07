# Vercel Neon 环境变量前缀机制

本文档说明 `apps/api` 如何读取 Vercel Neon 环境变量。admin 文档站只保留本文作为历史说明入口；现行 DB/Nitro 运维必须以 `@01s-11comm/api` 为准。

## 1. 背景

通过 Vercel Neon 集成配置数据库时，Vercel 会为环境变量添加自定义前缀。例如：

```bash
comm_admin_11__DATABASE_URL="postgresql://..."
comm_admin_11__DATABASE_URL_UNPOOLED="postgresql://..."
comm_admin_11__NEON_AUTH_BASE_URL="https://..."
comm_admin_11__PGDATABASE="neondb"
```

其中 `comm_admin_11_` 是历史 Vercel Neon 集成前缀。名称里保留 `admin`，但当前数据库连接由 `apps/api` 消费。

## 2. 现行入口

| 用途           | 现行位置                                |
| -------------- | --------------------------------------- |
| API 服务       | `apps/api`                              |
| Nitro 配置     | `apps/api/nitro.config.ts`              |
| Drizzle 配置   | `apps/api/drizzle.config.ts`            |
| 运行时环境解析 | `apps/api/server/shared/runtime/env.ts` |
| Seed CLI       | `apps/api/server/db/seed/index.ts`      |

`apps/admin/server/**` 只能作为 legacy source 或历史兼容参考，不再作为当前环境变量、数据库连接或 Nitro 运维入口。

## 3. 数据库 URL 解析顺序

`apps/api` 会从以下变量中解析数据库连接：

1. `comm_admin_11__DATABASE_URL`
2. `NITRO_DATABASE_URL`
3. `DATABASE_URL`
4. `POSTGRES_URL`
5. `POSTGRES_PRISMA_URL`
6. `VERCEL_POSTGRES_URL`

Cloudflare Worker 运行时优先读取 `event.req.runtime.cloudflare.env`，Node/Vercel 本地运行时读取 `process.env`，最后回退到 Nitro `runtimeConfig.databaseUrl`。

## 4. 本地配置

本地开发或验证 `apps/api` 时，优先在 `apps/api` 运行命令：

```bash
pnpm -F @01s-11comm/api dev
pnpm -F @01s-11comm/api run typecheck
```

如需验证迁移和 seed 入口：

```bash
pnpm -F @01s-11comm/api db:generate
pnpm -F @01s-11comm/api db:migrate
pnpm -F @01s-11comm/api run db:seed:dry-run
```

## 5. R2 环境变量

R2 也由 `apps/api` 读取和校验，相关变量包括：

```bash
R2_ENDPOINT="https://..."
R2_BUCKET="01s-11comm-files"
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_PUBLIC_BASE_URL="https://..."
```

运行时解析位置为 `apps/api/server/shared/runtime/r2-env.ts`。readiness 检查会同时覆盖数据库和 R2 配置。

## 6. 故障排查

**问题：** 接口返回 "Database URL is not configured"

**处理：**

1. 确认 `apps/api` 运行环境存在上述任一数据库 URL。
2. Cloudflare 部署时确认变量注入到 Worker runtime env。
3. 本地 Node/Vercel 运行时确认变量存在于 `process.env`。

**问题：** R2 readiness 失败

**处理：**

1. 确认 `R2_ENDPOINT`、`R2_BUCKET`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_PUBLIC_BASE_URL` 均已配置。
2. 运行 `pnpm -F @01s-11comm/api run test:infra` 验证运行时环境解析。
