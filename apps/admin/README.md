# 11comm 智慧社区项目 — Admin 后台

## 部署链接

| 环境            | 地址                                                             | 说明                           |
| :-------------- | :--------------------------------------------------------------- | :----------------------------- |
| **Vercel 项目** | [11comm-admin](https://vercel.com/ruancat-projects/11comm-admin) | Admin 管理后台 Vercel 部署管理 |
| **生产地址**    | [01s-11comm.ruan-cat.com](https://01s-11comm.ruan-cat.com)       | Admin H5 生产域名              |
| **API 服务**    | [01s-11-server.ruan-cat.com](https://01s-11-server.ruan-cat.com) | 独立 Nitro API 服务            |

## 项目技术架构

本项目是一个基于 **Vue 3 + TypeScript** 的纯前端管理后台，采用 **Monorepo** 结构管理多个子项目。

> **⚠️ 重要变更通知（Phase7）**
>
> `apps/admin` **已不再是 Nitro 服务端项目**。从 Phase7 起：
>
> - Admin 前端构建产物为**纯 SPA**；本地生产构建输出 `dist/`，Vercel 云端入口把 `dist/` 搬运到仓库根 `.vercel/output`。
> - 所有业务 API 已迁移至独立的 `apps/api` Nitro 服务（`https://01s-11-server.ruan-cat.com`）。
> - `apps/admin/server/**` 目录处于 `delete-candidate` 状态，待生产验证通过后物理删除。
>
> 详见：[OpenSpec 变更 `migrate-superpowers-docs-to-openspec-longtask`](../../openspec/changes/migrate-superpowers-docs-to-openspec-longtask/)

### 核心技术栈

| 层级         | 技术选型                                           |
| :----------- | :------------------------------------------------- |
| 前端框架     | Vue 3 + Vite + TypeScript                          |
| UI 组件库    | Element Plus + Plus Pro Components                 |
| 状态管理     | Pinia                                              |
| ~~后端框架~~ | ~~Nitro v3 (Phase6 退役）~~ → 独立 `apps/api` 服务 |
| 数据库       | Neon Serverless Postgres（通过 `apps/api` 访问）   |
| ORM          | Drizzle ORM（Schema 定义在 `apps/type`）           |

> **架构决策**：Admin 不再内置 Nitro 服务端。历史遗留的 `apps/admin/server/**` 代码仅作过渡兼容，最终将物理删除。所有业务 API 由 `apps/api` 提供。

### Schema 架构 （Trinity Pattern）

项目采用 **Schema 驱动开发**模式，所有数据库表定义遵循 **Trinity Pattern**：

1. **Drizzle Table** - 数据库表定义
2. **Zod Schemas** - 运行时验证（`insertXxxSchema`, `selectXxxSchema`, `updateXxxSchema`）
3. **TypeScript Types** - 静态类型（`NewXxx`, `Xxx`, `UpdateXxx`）

**Schema 文件位置**：`apps/type/src/business/{domain}/{module}/schema.ts`

例如：

- 字典管理：`apps/type/src/business/dev-team/config-manage/dictionary/schema.ts`
- 房产管理：`apps/type/src/business/property-manage/house-property-manage/schema.ts`
- 费用管理：`apps/type/src/business/property-manage/expense-manage/house-charge/schema.ts`

### API 开发规范（Phase7 独立 Nitro 服务）

> **历史说明**：Admin 曾内置 Nitro 服务端（Phase6），Phase7 已迁移至独立 `apps/api` Nitro 服务。
>
> **当前状态**：`apps/admin/server/**` 目录处于 `delete-candidate` 状态，**不要再向其中新增接口**。所有新接口开发应在 `apps/api` 中进行。

**Admin 前端调用 API 的方式**：`@ruan-cat/domains` 的 `11commAppNitroServer` 别名指向生产环境 `https://01s-11-server.ruan-cat.com`。

生产 API 调用由 `@ruan-cat/domains` 中的 hooks 自动处理，详见：[Domain Hooks 文档](https://github.com/ruan-cat/domains)。

**服务端开发规范**（适用于 `apps/api`）：详见 [Nitro API 开发技能](../../.claude/skills/nitro-api-development/SKILL.md)

### 类型共享架构

项目使用 `@01s-11comm/type` 作为前后端共享的类型库：

- **位置**：`apps/type/src/`
- **导出方式**：按业务路径组织，使用 `index.ts` 统一导出
- **依赖**：被 `apps/admin` 和 `apps/type` 自身引用

### 数据库迁移

数据库表定义仍以 `apps/type` 为唯一事实源；Drizzle Kit 配置、迁移目录和 Neon 运维入口已迁到 `apps/api`：

```bash
# 生成迁移文件
pnpm -F @01s-11comm/api db:generate

# 执行迁移
pnpm -F @01s-11comm/api db:migrate

# 启动 Drizzle Studio
pnpm -F @01s-11comm/api db:studio
```

`apps/admin` 中仍保留 `db:*` 脚本，但它们会先输出 `legacy-db` 提示，再转到 `db:legacy:*` 兼容脚本。新迁移、生产 schema 修复、Neon readiness/drift 诊断不要从 admin 入口执行。

历史 seed/reset 仍在 admin 旧目录中维护，当前仅作为 legacy 兼容路径：

```bash
# 填充种子数据（legacy 兼容路径）
pnpm db:seed

# 重置种子数据（legacy 兼容路径）
pnpm db:reset
```

详见：[Schema 开发规范](./src/docs/guides/db-schema.md)

## 套用的模板

本项目套用是 `pure-admin` 模板。

- [pure-admin 仓库](https://github.com/pure-admin/vue-pure-admin)
- [pure-admin 在线预览界面](https://pure-admin.github.io/vue-pure-admin/#/login)
- [pure-admin 文档](https://pure-admin.cn/)

## 项目部署（Phase7）

> **Phase7 架构**：Admin 为纯前端 SPA，部署到 Vercel 静态托管。所有 API 请求直接发往 `https://01s-11-server.ruan-cat.com`。

### 部署架构

```plain
apps/admin (SPA)                          apps/api (Nitro Serverless)
┌─────────────────────────┐               ┌──────────────────────────────┐
│ https://01s-11comm      │ ─── API ───▶  │ https://01s-11-server        │
│ .ruan-cat.com           │               │ .ruan-cat.com                │
│ (Vercel Static)        │               │ (Vercel Serverless Functions) │
└─────────────────────────┘               └──────────────────────────────┘
```

### 生产环境变量（关键配置）

| 变量名                          | 值                                   | 说明                           |
| :------------------------------ | :----------------------------------- | :----------------------------- |
| `VITE_11COMM_API_BASE_URL`      | `https://01s-11-server.ruan-cat.com` | 独立 Nitro API 服务地址        |
| `VITE_11COMM_API_USE_PROXY`     | `false`                              | 不走 Vite 开发代理             |
| `VITE_IS_REVERSE_PROXY`         | `false`                              | 不使用反向代理                 |
| `VITE_11COMM_API_SHADOW_ENABLE` | `true`                               | 启用 shadow 流量镜像（调试用） |

> **不兼容旧架构**：`apps/admin/server/**` 内置 Nitro 服务已退役，`.env.production` 中不再配置 `NITRO_*` 或指向自身 server 的地址。

### 构建与部署链路

```bash
# 在 apps/admin 内执行：本地生产构建（纯 SPA，不含服务端）
pnpm build:prod

# 预览构建产物
pnpm preview

# 在仓库根目录执行：模拟 Vercel 云端构建入口
pnpm run build:vercel:admin
```

commit `d1c5b6f5` 的关键修复不是新增 `vercel.json`，而是把 Vercel 云端入口改成根命令串联子包构建与产物搬运：

```plain
pnpm run build:vercel:admin
└─ pnpm -F=@01s-11comm/admin build:vercel
   └─ turbo move-vercel-output-to-root
      ├─ dependsOn: build:prod
      │  └─ 生成 apps/admin/dist
      └─ move-vercel-output-to-root --source-dir dist --target-dir .vercel/output
```

命令边界必须分清：

- `build:prod`：纯 SPA 本地构建，构建产物在 `apps/admin/dist/`。
- `build:vercel`：子包内的 Vercel 云端入口，由 `turbo` 先跑 `build:prod`，再把 `dist/` 搬运到仓库根 `.vercel/output`。
- `build:vercel:admin`：仓库根目录的 Vercel Project Build Command，调用 admin 子包的 `build:vercel`。
- `build:prod:vercel`：Phase6 遗留入口，Phase7 云端部署不再使用。

### 部署步骤

1. **本地构建**：`pnpm build:prod`
2. **部署到 Vercel**：Vercel 云端 Project Settings 的 Build Command 使用 `pnpm run build:vercel:admin`，Output Directory 使用 `.vercel/output`。
   - `build:vercel:admin` 会调用 `apps/admin` 的 `build:vercel`，由脚本把 `dist/` 搬运为 Vercel 需要的 `.vercel/output`。
   - Vercel Project 专属配置以云端 Project Settings 为准，不要写入仓库根目录或子目录 `vercel.json`。
   - 禁止通过仓库 `vercel.json` 指定 `apps/admin/dist`、`dist`、`.output/public` 或其他 admin 输出目录；根配置会被同仓库 app/api 项目读到，导致其他项目查找错误产物。
   - 如果需要调整 Root Directory、Build Command、Output Directory 或 Install Command，只在 Vercel 云端 Project Settings 中维护。
3. **健康检查**：`https://01s-11comm.ruan-cat.com` 应返回 SPA 首页。

详细部署文档：[./src/docs/deploy/index.md](./src/docs/deploy/index.md)

## Vercel 云项目部署配置

以下配置只记录 Vercel 云端 Project Settings 的期望值，禁止写入仓库 `vercel.json`：

- Root Directory：仓库根目录（保持默认/留空，不要设置为 `apps/admin`）
- Framework Preset：Other
- Build Command： `pnpm run build:vercel:admin`
- Output Directory： `.vercel/output`
- Install Command： `ls -A && pnpm install`

不要把上面的配置复制成 `vercel.json`。Vercel 官方配置模型允许 `vercel.json` 覆盖 Project Settings；在当前 pnpm workspace monorepo 中，仓库内配置文件会变成跨项目污染源。

## package.json 命令

### 1. 开发命令

|      命令       |               说明                |
| :-------------: | :-------------------------------: |
|   `pnpm dev`    | 启动开发服务器（通过 turbo 调度） |
| `pnpm vite:dev` |   直接使用 vite 启动开发服务器    |
| `pnpm docs:dev` |   启动 VitePress 文档开发服务器   |

### 2. 构建命令

#### 2.1 构建模式说明

本项目当前保留两类构建入口：

1. **纯客户端构建（SPA）** - 构建纯前端单页应用到 `dist/`，不包含服务端代码。
2. **Vercel 云端构建入口** - 在 SPA 构建后把 `dist/` 搬运到仓库根 `.vercel/output`，供 Vercel 读取。

历史 Nitro 全栈构建入口仍保留在脚本中，但 Phase7 云端部署不再使用。

#### 2.2 构建命令列表

> **Phase7 重要变更**：`apps/admin` 已转型为纯前端 SPA。`build:prod` 产出 `dist/` 静态文件；Vercel 云端入口必须走根命令 `pnpm run build:vercel:admin`，再由子包 `build:vercel` 把 `dist/` 搬运到仓库根 `.vercel/output`。

|             命令             |                            说明                            |      构建模式       |
| :--------------------------: | :--------------------------------------------------------: | :-----------------: |
|         `pnpm build`         |            构建生产环境（等同于 `build:prod`）             | 纯客户端构建（SPA） |
|      `pnpm build:prod`       |                   构建生产环境客户端版本                   | 纯客户端构建（SPA） |
|     `pnpm build:vercel`      | Vercel 子包入口，先构建 `dist/`，再搬运到 `.vercel/output` | 纯客户端构建（SPA） |
| `pnpm build:prod:cloudflare` |       ~~构建 Cloudflare 部署版本~~（Phase7 已废弃）        | ~~Nitro 全栈构建~~  |
|   `pnpm build:prod:vercel`   |         ~~构建 Vercel 部署版本~~（Phase7 已废弃）          | ~~Nitro 全栈构建~~  |
|     `pnpm build:staging`     |                  构建预发布环境客户端版本                  | 纯客户端构建（SPA） |
|     `pnpm build:github`      |              构建 GitHub Pages 部署客户端版本              | 纯客户端构建（SPA） |
|      `pnpm docs:build`       |                    构建 VitePress 文档                     |          -          |

#### 2.3 重要说明

> **Phase7 不再使用 Nitro 全栈构建**：
>
> - `build:prod:cloudflare` 和 `build:prod:vercel` 已废弃，保留仅作历史参考。
> - 本地生产构建使用 `pnpm build:prod`（纯 SPA），产物在 `dist/`。
> - Vercel 云端 Project Settings 的 Build Command 使用根命令 `pnpm run build:vercel:admin`；最终产物在仓库根 `.vercel/output`。
> - `move-vercel-output-to-root` 是当前 Vercel 云端入口需要保留的搬运脚本；不要用仓库 `vercel.json` 代替它，也不要把 Output Directory 改回 `apps/admin/dist`。

**验证方法**：

```bash
# apps/admin 内：Phase7 本地生产构建后，应该存在 dist/ 目录
ls dist/index.html  # ✓ 应存在

# 仓库根目录：Vercel 云端构建入口会生成 .vercel/output
pnpm run build:vercel:admin
ls .vercel/output  # ✓ 应存在

# .output/nitro.json 不应存在（Phase6 遗留）
```

### 3. 预览和测试命令

|         命令         |                         说明                          |
| :------------------: | :---------------------------------------------------: |
|    `pnpm preview`    |                     预览构建产物                      |
| `pnpm preview:build` |                  构建后预览构建产物                   |
|     `pnpm test`      |   启动 Vitest 测试（jsdom 环境，用于前端组件测试）    |
|  `pnpm test:nitro`   | 启动 Nitro 接口测试（node 环境，需要先运行 pnpm dev） |

### 4. 代码质量命令

|         命令         |                说明                |
| :------------------: | :--------------------------------: |
|     `pnpm lint`      |      运行 ESLint 和 Prettier       |
|  `pnpm lint:eslint`  |       运行 ESLint 检查并修复       |
| `pnpm lint:prettier` |      运行 Prettier 格式化代码      |
|    `pnpm format`     | 格式化代码（等同于 lint:prettier） |
|   `pnpm typecheck`   |      运行 TypeScript 类型检查      |

### 5. Drizzle ORM 数据库命令（通过 apps/api 访问）

> **Phase7 变更**：Drizzle 配置、迁移目录和数据库运维入口已全部迁移至 `apps/api`。Admin 的 `db:*` 脚本仅保留兼容转发。

|                 命令                  |                           说明                           |
| :-----------------------------------: | :------------------------------------------------------: |
| `pnpm -F @01s-11comm/api db:generate` |        从 `apps/type` schema 生成 `apps/api` 迁移        |
| `pnpm -F @01s-11comm/api db:migrate`  |          通过 `apps/api` 执行受控 Drizzle 迁移           |
|   `pnpm -F @01s-11comm/api db:push`   |       应急 schema 同步入口，需先记录风险和回滚边界       |
|  `pnpm -F @01s-11comm/api db:studio`  |              启动 Drizzle Studio 检查数据库              |
|          `pnpm db:generate`           | admin legacy 兼容入口，会先提示改用 `apps/api` 权威入口  |
|           `pnpm db:migrate`           |      admin legacy 兼容入口，不作为长期生产迁移入口       |
|            `pnpm db:push`             |    admin legacy 兼容入口，不作为默认 schema 修复手段     |
|            `pnpm db:seed`             |   admin legacy seed 兼容脚本，用于旧 seed source 维护    |
|            `pnpm db:reset`            | admin legacy reset 兼容脚本，谨慎用于旧 seed source 维护 |

#### 5.1 种子数据命令详细说明

项目历史 seed 使用 **Direct Seed** 架构，Seed 模块直接使用 Drizzle ORM Insert 类型定义数据，无中间 SQL 文件层。当前 seed/reset 仍属于 admin legacy source 维护范围；新迁移与 Neon 运维入口仍以 `apps/api` 为准。详细使用指南请参阅：[种子数据命令使用指南](./src/docs/guides/seed-commands.md)

|      命令       |                                    说明                                    |
| :-------------: | :------------------------------------------------------------------------: |
| `pnpm db:seed`  |   admin legacy seed 兼容脚本，会先提示 DB 运维权威入口已迁到 `apps/api`    |
| `pnpm db:reset` | admin legacy reset 兼容脚本；执行前必须确认只处理旧 seed source 的维护场景 |

### 6. 环境变量命令

|      命令       |                 说明                  |
| :-------------: | :-----------------------------------: |
| `pnpm env:pull` | 从 Vercel 项目拉取环境变量到本地 .env |

### 7. 其他命令

|        命令        |             说明             |
| :----------------: | :--------------------------: |
|  `pnpm rm:types`   | 删除生成的类型文件（清理用） |
| `pnpm clean:cache` |    清理缓存并重新安装依赖    |
|    `pnpm svgo`     |        优化 SVG 文件         |
