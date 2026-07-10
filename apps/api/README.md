# @01s-11comm/api — 独立 Nitro API 服务

## 部署链接

| 环境            | 地址                                                                           | 说明                      |
| :-------------- | :----------------------------------------------------------------------------- | :------------------------ |
| **Vercel 项目** | [11comm-nitro-server](https://vercel.com/ruancat-projects/11comm-nitro-server) | Nitro API Vercel 部署管理 |
| **生产地址**    | [01s-11-server.ruan-cat.com](https://01s-11-server.ruan-cat.com)               | 独立 Nitro API 服务       |
| **Admin 前端**  | [01s-11comm.ruan-cat.com](https://01s-11comm.ruan-cat.com)                     | Admin H5 生产域名         |
| **App 前端**    | [01s-11-app.ruan-cat.com](https://01s-11-app.ruan-cat.com)                     | App H5 生产域名           |

## vercel 云项目的部署配置

以下配置只记录 Vercel 云端 Project Settings 的期望值，禁止写入仓库 `vercel.json`：

- Framework Preset： other
- Build Command： `pnpm run build:vercel:api`
- Output Directory： `.vercel/output`
- Install Command： `ls -A && pnpm install`

API 项目的 `.vercel/output` 是 `11comm-nitro-server` 自己的云端 Output Directory。不要依赖仓库根目录 `vercel.json` 配置它，也不要在 `apps/api` 提交项目专属 `vercel.json`。

Vercel 会读取 Project Root 下的 `vercel.json` 并覆盖云端 `outputDirectory`、`buildCommand`、`installCommand` 等设置；在 monorepo 中，根配置会影响同仓库下的 admin/app/api 多个 Vercel Project。API 的 Framework Preset、Root Directory、Build Command、Output Directory、Install Command、Ignored Build Step 和环境变量统一在 Vercel 云端 Project Settings 管理。

## 项目定位

Phase7 起，`apps/api` 作为**独立 Nitro Serverless API 服务**，承接原来分散在 `apps/admin/server` 和 `apps/app/server` 中的所有业务接口。

| 域名                                 | 角色                     | 运行时                      |
| :----------------------------------- | :----------------------- | :-------------------------- |
| `https://01s-11-server.ruan-cat.com` | 独立 Nitro API 服务      | Vercel Serverless Functions |
| `https://01s-11comm.ruan-cat.com`    | Admin 前端 SPA（消费者） | Vercel Static               |
| `https://01s-11-app.ruan-cat.com`    | App 前端 H5（消费者）    | Vercel Static               |

## 部署架构

```plain
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Phase7 部署架构                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   browsers                          Vercel                                  │
│  ┌──────────────┐                 ┌────────────────────────────────────┐   │
│  │ Admin H5     │──── API ──────▶│ apps/api                          │   │
│  │ App H5       │──── API ──────▶│ https://01s-11-server            │   │
│  └──────────────┘                 │ (Nitro Serverless Functions)      │   │
│                                    │                                    │   │
│                                    │  server/routes/api/**             │   │
│                                    │  server/db/**                     │   │
│                                    │  (Neon + Drizzle ORM)            │   │
│                                    └────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 技术栈

| 层级      | 技术选型                                   |
| :-------- | :----------------------------------------- |
| 运行时    | Nitro v3 (`nitro@3.0.1-alpha.2`)           |
| HTTP 框架 | H3（通过 `nitro/h3` 导入）                 |
| 数据库    | Neon Serverless Postgres                   |
| ORM       | Drizzle ORM (`drizzle-orm@0.42.0`)         |
| Schema    | `@01s-11comm/type`（同构运行时库）         |
| 存储      | Cloudflare R2（通过 `@aws-sdk/client-s3`） |

## 目录结构

```plain
apps/api/
├── server/
│   ├── routes/
│   │   └── api/          # 业务 API handlers
│   │       ├── debug-env.get.ts
│   │       ├── dev-team/
│   │       ├── j1-dashboard/
│   │       ├── operation-team/
│   │       ├── property-manage/
│   │       └── setting-manage/
│   └── db/
│       ├── seed/         # 种子数据
│       └── (index.ts / readiness.ts)
├── src/                  # 源码入口（根据 preset 而定）
├── drizzle/              # 迁移文件输出目录
│   └── meta/
│       └── _journal.json
├── package.json
└── nitro.config.ts
```

## 开发命令

### API 开发

```bash
# 启动开发服务器
pnpm -F @01s-11comm/api dev

# 运行测试
pnpm -F @01s-11comm/api test

# 类型检查
pnpm -F @01s-11comm/api typecheck
```

### 构建与部署

| 命令                                       | 说明                       | 产物目录   |
| :----------------------------------------- | :------------------------- | :--------- |
| `pnpm -F @01s-11comm/api build`            | 默认 Vercel preset 构建    | `.output/` |
| `pnpm -F @01s-11comm/api build:node`       | Node.js preset（本地预览） | `.output/` |
| `pnpm -F @01s-11comm/api build:cloudflare` | Cloudflare Workers preset  | `.output/` |

> **生产部署**：Vercel 自动检测 `apps/api` 目录，以 Vercel preset 构建并部署到 `https://01s-11-server.ruan-cat.com`。

### 数据库命令

> 数据库 Schema 定义在 `apps/type/src/business/**/schema.ts`，Drizzle 配置和迁移入口在 `apps/api`。

```bash
# 生成迁移文件（从 apps/type schema）
pnpm -F @01s-11comm/api db:generate

# 执行迁移
pnpm -F @01s-11comm/api db:migrate

# 推送 schema 到数据库（应急）
pnpm -F @01s-11comm/api db:push

# 启动 Drizzle Studio
pnpm -F @01s-11comm/api db:studio

# Seed 种子数据
pnpm -F @01s-11comm/api db:seed:dry-run  # 预演（不写入）
pnpm -F @01s-11comm/api db:seed          # 正式执行
```

## API 开发规范

所有接口遵循 [Nitro API 开发技能](../../.claude/skills/nitro-api-development/SKILL.md)：

- H3 函数必须从 `"nitro/h3"` 导入（**禁止**从 `"h3"` 直接导入）
- 响应使用 `JsonVO<T>` 类型注解
- 入参通过 `readValidatedBody` + Zod Schema 校验
- Insert 操作使用 `as unknown as NewX` 类型回填
- 错误响应包含 `error` 和 `stack` 字段
- **不做任何鉴权**（所有接口公开访问）

## 接口清单

Phase7 统一 Nitro API 的接口清单见：[OpenSpec 变更 `migrate-superpowers-docs-to-openspec-longtask`](../../openspec/changes/migrate-superpowers-docs-to-openspec-longtask/)

## 数据库连接

### Neon 数据库项目

| 属性                 | 值                                                         |
| :------------------- | :--------------------------------------------------------- |
| **Console 地址**     | https://console.neon.tech/app/projects/snowy-base-74751932 |
| **数据库名称**       | neondb（默认）                                             |
| **连接字符串**       | 通过环境变量 `DATABASE_URL` 获取                           |
| **Neon MCP 项目 ID** | `snowy-base-74751932`（用于 MCP 工具配置）                 |

### 环境变量配置

生产环境在 Vercel 项目设置中配置：

- `DATABASE_URL` - Neon 数据库连接字符串

本地开发通过 `.env.local` 配置：

```bash
DATABASE_URL="postgresql://user:password@ep-snowy-base-74751932.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Neon MCP 连接

在 ZCode MCP 配置中使用项目 ID `snowy-base-74751932` 连接到 Neon 数据库。

## 健康检查

```bash
curl https://01s-11-server.ruan-cat.com/api/debug-env
```

应返回包含 `apiRuntime: "nitro-standalone"` 的 JSON 响应。
