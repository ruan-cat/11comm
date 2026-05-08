<!-- 状态：已实施，apps/api 的 build:vercel 已通过 turbo 串联 Nitro Vercel 构建和产物搬运 -->

# 2026-05-09 11comm Nitro Server Vercel 部署设计

## 背景

`apps/api` 已经是仓库内独立的 Nitro v3 接口服务。现在要再创建一个独立的 Vercel 项目 `11comm-nitro-server`，专门承接这个服务的生产部署。

当前仓库是 monorepo，根目录已经有 `apps/admin`、`apps/api`、`apps/type` 等 workspace。Vercel 在 monorepo 场景里最容易出错的地方有两个：

1. Root Directory 错配成子包目录，导致 pnpm workspace 依赖安装失效。
2. Nitro 构建产物留在子包目录里，Vercel 却只从它期望的位置读取 `.vercel/output`。

本次设计的核心目标，就是避免这两个坑。

## 已确认事实

- 旧的根目录 `.vercel` 绑定已被手动清理，本次会重新为 `11comm-nitro-server` 创建新的 Vercel 绑定。
- `apps/api/package.json` 已将 `build:vercel` 改为 `turbo move-vercel-output-to-root`。
- `apps/api/package.json` 保留 `nitro:build:vercel` 作为实际 Nitro Vercel 构建命令，供 turbo 任务依赖。
- `apps/api` 本地构建已经能生成 `.vercel/output`。
- `@ruan-cat/utils` 已提供官方 bin `move-vercel-output-to-root`，不是自定义脚本。
- 本仓库已经验证过该工具的 `--dry-run`，其工作目录应当落在 `apps/api`，并把产物搬到仓库根目录的 `.vercel/output`。
- `apps/api/server/routes/__nitro/health.get.ts`、`ready.get.ts`、`endpoints.get.ts` 已存在，可作为上线烟测入口。
- `11comm-admin` 现有 Vercel 项目已经维护了一组后端强相关环境变量，包含 Neon 数据库、Neon Auth、Postgres 连接参数和 Cloudflare R2。新建 `11comm-nitro-server` 时必须同步这一整组变量，不能只配置单个数据库 URL。

## 目标

1. 创建独立 Vercel 项目 `11comm-nitro-server`。
2. 保持 monorepo 根目录不变，不能把 Vercel Root Directory 改成 `apps/api`。
3. 让 `apps/api` 的 Nitro 产物通过 `move-vercel-output-to-root` 进入根目录 `.vercel/output`。
4. 使用 `vercel deploy --prebuilt --prod` 做直接生产部署。
5. 保留 admin 项目的既有绑定，不把 `11comm-admin` 和 `11comm-nitro-server` 混成一个项目。
6. 使用 Vercel 的环境变量能力，把 `11comm-admin` 项目的后端环境变量全量同步到 `11comm-nitro-server`。

## 非目标

- 不新增任何接口鉴权。
- 不重写 `apps/api` 的业务结构。
- 不把 Vercel 部署改成手工上传产物。
- 不用 `shx`、`cp`、`xcopy` 或自写脚本替代 `move-vercel-output-to-root`。
- 不把本次 API 项目接入现有 `vercel-deploy-tool.config.ts` 的 admin 目标里。
- 不把环境变量同步简化为只迁移 `DATABASE_URL`。Cloudflare R2、Neon Auth、Postgres 分项变量都属于本次部署前置条件。

## 推荐方案：直接生产部署（推荐）

### Vercel 项目设置

| 项目项                | 配置                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| Root Directory        | 留空，保持仓库根目录                                                                                  |
| Output Directory      | `.vercel/output`                                                                                      |
| Production Branch     | `dev`                                                                                                 |
| Build Command         | `pnpm -F @01s-11comm/api run build:vercel`                                                            |
| Install Command       | 使用 Vercel 默认的 pnpm 安装流程，保持 workspace 根安装                                               |
| Environment Variables | 从 `11comm-admin` 全量同步后端环境变量到 `11comm-nitro-server`，覆盖 Production、Preview、Development |

### 直接部署流程

```bash
pnpm install
pnpm -F @01s-11comm/api run build:vercel
vercel deploy --prebuilt --prod
```

### 项目绑定规则

- 先用 `vercel link --repo` 或针对目标目录的 `vercel link --project 11comm-nitro-server` 重新创建新项目绑定。
- 部署前不要沿用任何旧 `.vercel` 目录内容。
- `vercel deploy --prebuilt --prod` 直接面向 `11comm-nitro-server` 执行。
- Vercel monorepo 场景应走官方 `vercel link --repo` 体系管理项目绑定，不要手工改 `.vercel/project.json` 里的字符串来伪装切换。

## 环境变量同步设计

### 同步口径

`11comm-admin` 是本次环境变量同步的源项目。`11comm-nitro-server` 在首次生产部署前，必须拥有 `11comm-admin` 当前后端相关环境变量的同名、同值、同环境范围副本。

同步范围不是“按代码当前只读到哪些变量做最小集”，而是“以 Vercel 上 `11comm-admin` 的现有变量为准做全量镜像”。这样做的原因是：独立 Nitro 服务会逐步承接 admin 侧后端能力，后续业务迁移、文件上传、数据库连接、Neon 集成和兼容 fallback 都可能依赖这些变量。

### 推荐同步方式

优先使用 Vercel 的 Shared Environment Variables：

1. 在 Vercel 的 `11comm-admin` 项目里盘点现有 Project Variables 和 Shared Variables。
2. 后端强相关的变量优先提升为 Team 级 Shared Variables，或者复用已经存在的 Shared Variables。
3. 在 `11comm-nitro-server` 项目里通过 `Link Shared Variable` 链接同一批变量。
4. 如果某些变量暂时只能保持 Project Variables，则在 `11comm-nitro-server` 中逐个创建同名变量，并保持同样的环境范围。

这个方案比手写 `.env` 文件更稳：密钥继续由 Vercel 托管，后续 Neon、R2 密钥轮换时也能减少两个项目之间的漂移。

### CLI 盘点与校验

使用 Vercel CLI 盘点环境变量时，应通过独立临时目录分别链接两个项目，避免污染仓库根目录即将新建的 `11comm-nitro-server` 正式绑定。

```powershell
New-Item -ItemType Directory -Force .tmp\vercel-env-sync\11comm-admin | Out-Null
New-Item -ItemType Directory -Force .tmp\vercel-env-sync\11comm-nitro-server | Out-Null
pnpm exec vercel link --cwd .tmp/vercel-env-sync/11comm-admin --project 11comm-admin --yes
pnpm exec vercel link --cwd .tmp/vercel-env-sync/11comm-nitro-server --project 11comm-nitro-server --yes
pnpm exec vercel env list production --cwd .tmp/vercel-env-sync/11comm-admin
pnpm exec vercel env list preview --cwd .tmp/vercel-env-sync/11comm-admin
pnpm exec vercel env list development --cwd .tmp/vercel-env-sync/11comm-admin
pnpm exec vercel env list production --cwd .tmp/vercel-env-sync/11comm-nitro-server
pnpm exec vercel env list preview --cwd .tmp/vercel-env-sync/11comm-nitro-server
pnpm exec vercel env list development --cwd .tmp/vercel-env-sync/11comm-nitro-server
```

如需用 CLI 补变量，只能按变量逐个添加，敏感变量应使用 `--sensitive`：

```powershell
pnpm exec vercel env add R2_SECRET_ACCESS_KEY production --sensitive --cwd .tmp/vercel-env-sync/11comm-nitro-server
pnpm exec vercel env add comm_admin_11__DATABASE_URL production --sensitive --cwd .tmp/vercel-env-sync/11comm-nitro-server
```

`vercel env pull` 可以辅助拉取某个环境的变量做本地对照，但拉下来的文件只能放在 `.tmp/vercel-env-sync/**` 这类已忽略目录内，不能提交到仓库。

### 必须覆盖的变量类别

最终清单以 Vercel 上 `11comm-admin` 的实时变量为准。下面是本仓库和截图已经确认的后端强相关类别，不能漏：

- Cloudflare R2：`R2_ENDPOINT`、`R2_BUCKET`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_PUBLIC_BASE_URL`。
- Neon / Postgres URL：`comm_admin_11__DATABASE_URL`、`comm_admin_11__DATABASE_URL_UNPOOLED`、`comm_admin_11__POSTGRES_URL`、`comm_admin_11__POSTGRES_PRISMA_URL`、`comm_admin_11__POSTGRES_URL_NO_SSL`、`comm_admin_11__POSTGRES_URL_NON_POOLING`。
- Neon / Postgres 分项连接参数：`comm_admin_11__PGDATABASE`、`comm_admin_11__PGHOST`、`comm_admin_11__PGHOST_UNPOOLED`、`comm_admin_11__PGUSER`、`comm_admin_11__PGPASSWORD`、`comm_admin_11__POSTGRES_DATABASE`、`comm_admin_11__POSTGRES_HOST`、`comm_admin_11__POSTGRES_USER`、`comm_admin_11__POSTGRES_PASSWORD`。
- Neon 项目与 Auth：`comm_admin_11__NEON_PROJECT_ID`、`comm_admin_11__NEON_AUTH_BASE_URL`、`comm_admin_11__NEON_AUTH_COOKIE_SECRET`。
- 公共基础地址：`comm_admin_11__PUBLIC_BASE_URL`。
- 标准 fallback：如果 `11comm-admin` 当前存在 `DATABASE_URL`、`DATABASE_URL_UNPOOLED`、`POSTGRES_URL`、`POSTGRES_PRISMA_URL`、`VERCEL_POSTGRES_URL`、`NEON_AUTH_BASE_URL`、`NEON_AUTH_COOKIE_SECRET` 等未加前缀变量，也要同步。
- Nitro 运行时开关：如果 `11comm-admin` 已配置 `NITRO_CORS_ALLOWED_ORIGINS`、`RUN_PHASE7_DB_READINESS_CHECK` 或其他后端运行时开关，也要同步。

### 验收口径

环境变量同步完成后，至少要确认：

1. `11comm-nitro-server` 的 Production、Preview、Development 三个环境都能看到与 `11comm-admin` 对应的变量。
2. `Needs Attention` 的变量不能被忽略；如果它们是仍在使用的后端变量，应在新项目里同样补齐或链接。
3. R2 五个变量必须完整出现，否则合同附件、文件上传或后续迁移接口会在运行时失败。
4. Neon 数据库 URL、unpooled URL、PG 分项参数和 Auth 变量必须完整出现，否则 readiness 或后续数据库访问可能只在部分路径失败。
5. 所有密钥值只通过 Vercel 管理，不写入设计文档、README、Git 跟踪文件或终端最终报告。

## 运行时配置

### 数据库 URL

Vercel 生产环境至少要配置一个数据库 URL。当前代码的解析优先级应按现有实现理解，其中 `comm_admin_11__DATABASE_URL` 会优先于标准名：

1. `comm_admin_11__DATABASE_URL`
2. `NITRO_DATABASE_URL`
3. `DATABASE_URL`
4. `POSTGRES_URL`
5. `POSTGRES_PRISMA_URL`
6. `VERCEL_POSTGRES_URL`

但这只是 `apps/api` 当前数据库连接的最小 fallback 链，不代表环境变量同步只需要这些。实际部署仍以 `11comm-admin` 的全量后端变量镜像为准。

如果后续需要更强的 readiness 门槛，可以额外设置：

```bash
RUN_PHASE7_DB_READINESS_CHECK=1
```

开启后，`/__nitro/ready` 会进一步检查数据库连通性、表结构和迁移状态；未开启时，它只检查数据库 URL 是否已配置。

### CORS

`NITRO_CORS_ALLOWED_ORIGINS` 应至少包含 admin 生产域名，以及需要联调的预览域名。

## 环境变量观测接口

### 路由

`GET /__nitro/env`

### 目的

这个接口不是一次性的临时调试端点，而是 `apps/api` 作为独立 Nitro 服务应长期具备的运行时观测能力。它用于在 Vercel 和本地环境中核对：

1. `req.runtime.cloudflare.env` 是否能读取到 Cloudflare/Worker 侧的环境注入。
2. `process.env` 是否能读取到 Vercel/Node 侧的环境注入。
3. 关键环境变量是否在不同部署项目之间保持一致。

### 响应策略

- 按来源分组返回，不合并成一坨字符串。
- 每个来源都返回 `keys`、`keyCount` 和 `entries`。
- `entries` 里只返回 `kind`、`length` 和 `hash`，不返回明文值。
- `hash` 使用 SHA-256 指纹，便于跨部署比对。
- 如果某个来源不存在，也要返回空快照，而不是报错或省略来源。

### 用途

- 在新建的 `11comm-nitro-server` 里核对环境变量是否和 `11comm-admin` 对齐。
- 在 Vercel 部署后确认环境变量同步没有漏项。
- 配合 `__nitro/health` 与 `__nitro/ready` 一起判断“环境注入、数据库可用性、基础接口可用性”三件事是否同时成立。

## 验收标准

1. `pnpm -F @01s-11comm/api run build:vercel` 能通过 turbo 先执行 `nitro:build:vercel`，再执行 `move-vercel-output-to-root`。
2. `build:vercel` 完成后，根目录 `.vercel/output` 存在可供 `vercel deploy --prebuilt --prod` 使用的产物。
3. `vercel deploy --prebuilt --prod` 最终部署到 `11comm-nitro-server`，不是 `11comm-admin`。
4. `11comm-nitro-server` 已同步 `11comm-admin` 的全量后端环境变量，至少覆盖 Neon、Postgres、Neon Auth、Cloudflare R2 和运行时开关。
5. `GET /__nitro/env` 能返回按来源分组的环境变量指纹，不泄露明文。
6. 线上访问 `/`、`/__nitro/health`、`/__nitro/endpoints`、`/__nitro/ready` 能返回预期内容。
7. 生产环境如果配置了数据库 URL，`/__nitro/ready` 至少应返回 200；如果未配置，则应按现有逻辑明确返回 503，而不是伪装成可用。
8. admin 项目的 Vercel 绑定、构建和部署不被这次 API 项目接入破坏。

## 风险

- 风险一：没有先执行 `move-vercel-output-to-root`，Vercel 会找不到正确的 Build Output。
- 风险二：把 Root Directory 误设为 `apps/api`，会破坏 pnpm workspace 解析和本地包链接。
- 风险三：生产环境没配数据库 URL，构建仍然能过，但 `/__nitro/ready` 会失败，导致上线烟测不通过。
- 风险四：只同步 Neon 数据库变量但漏掉 R2 变量，会让基础健康检查通过，但文件上传、合同附件等后端能力在运行时失败。
- 风险五：`11comm-admin` 和 `11comm-nitro-server` 环境变量后续漂移，会导致同一套后端逻辑在两个 Vercel 项目中表现不一致。

## 参考

- 裂解 monorepo + Nitro 的部署经验文章：<https://juejin.cn/post/7610816257119354915>
- `move-vercel-output-to-root` 官方说明：<https://utils.ruan-cat.com/node-esm/scripts/move-vercel-output-to-root/#move-vercel-output-to-root>
- 参考项目 `notes/my-pull-requests` 中的 Vercel / Nitro 组织方式
