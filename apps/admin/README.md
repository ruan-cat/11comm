# 11comm 智慧社区项目

## 项目技术架构

本项目是一个基于 **Vue 3 + TypeScript** 的全栈管理后台，采用 **Monorepo** 结构管理多个子项目。

### 核心技术栈

| 层级      | 技术选型                           |
| :-------- | :--------------------------------- |
| 前端框架  | Vue 3 + Vite + TypeScript          |
| UI 组件库 | Element Plus + Plus Pro Components |
| 状态管理  | Pinia                              |
| 后端框架  | Nitro v3 (Nitro v3 + H3)           |
| 数据库    | Neon Serverless Postgres           |
| ORM       | Drizzle ORM                        |
| 类型库    | @01s-11comm/type (同构运行时库)    |

### Schema 架构 (Trinity Pattern)

项目采用 **Schema 驱动开发**模式，所有数据库表定义遵循 **Trinity Pattern**：

1. **Drizzle Table** - 数据库表定义
2. **Zod Schemas** - 运行时验证（`insertXxxSchema`, `selectXxxSchema`, `updateXxxSchema`）
3. **TypeScript Types** - 静态类型（`NewXxx`, `Xxx`, `UpdateXxx`）

**Schema 文件位置**：`apps/type/src/business/{domain}/{module}/schema.ts`

例如：

- 字典管理：`apps/type/src/business/dev-team/config-manage/dictionary/schema.ts`
- 房产管理：`apps/type/src/business/property-manage/house-property-manage/schema.ts`
- 费用管理：`apps/type/src/business/property-manage/expense-manage/house-charge/schema.ts`

### API 开发规范

所有 Nitro 接口遵循统一的开发规范：

- 使用 `defineHandler` 与 `nitro/h3` 导入
- 响应必须使用 `JsonVO<T>` 类型注解约束
- 统一使用 `message` 字段（不是 `msg`）
- 入参通过 `readValidatedBody` + Zod Schema 校验
- Insert 操作使用 `as unknown as NewX` 类型回填
- 错误响应包含 `error` 和 `stack` 字段

详见：[Nitro API 开发技能](../.claude/skills/nitro-api-development/SKILL.md)

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

## 项目部署

点此[阅读文档](./src/docs/deploy/index.md)。

## package.json 命令

### 1. 开发命令

|      命令       |               说明                |
| :-------------: | :-------------------------------: |
|   `pnpm dev`    | 启动开发服务器（通过 turbo 调度） |
| `pnpm vite:dev` |   直接使用 vite 启动开发服务器    |
| `pnpm docs:dev` |   启动 VitePress 文档开发服务器   |

### 2. 构建命令

#### 2.1 构建模式说明

本项目支持两种构建模式：

1. **纯客户端构建（SPA）** - 构建纯前端单页应用，不包含服务端代码
2. **Nitro 全栈构建** - 构建包含 Nitro 服务端的全栈应用

#### 2.2 构建命令列表

|             命令             |                       说明                        |       构建模式        |
| :--------------------------: | :-----------------------------------------------: | :-------------------: |
|         `pnpm build`         |        构建生产环境（等同于 `build:prod`）        |  纯客户端构建（SPA）  |
|      `pnpm build:prod`       |              构建生产环境客户端版本               |  纯客户端构建（SPA）  |
| `pnpm build:prod:cloudflare` | **构建 Cloudflare 部署版本（包含 Nitro 服务端）** | **Nitro 全栈构建** ⭐ |
|   `pnpm build:prod:vercel`   |   **构建 Vercel 部署版本（包含 Nitro 服务端）**   | **Nitro 全栈构建** ⭐ |
|     `pnpm build:staging`     |             构建预发布环境客户端版本              |  纯客户端构建（SPA）  |
|     `pnpm build:github`      |         构建 GitHub Pages 部署客户端版本          |  纯客户端构建（SPA）  |
|      `pnpm docs:build`       |                构建 VitePress 文档                |           -           |

#### 2.3 重要说明

⚠️ **生产环境部署必须使用 Nitro 全栈构建命令**

- **Cloudflare 部署**：使用 `pnpm build:prod:cloudflare`
- **Vercel 部署**：使用 `pnpm build:prod:vercel`

**区别**：

- **纯客户端构建**：只生成 `.output/public/` 目录，包含静态 HTML/CSS/JS 文件
- **Nitro 全栈构建**：生成 `.output/server/` 和 `.output/public/` 目录，包含服务端 API 和客户端文件

**验证方法**：

```bash
# Nitro 全栈构建成功后，应该存在以下文件：
ls .output/nitro.json        # Nitro 配置文件
ls .output/server/index.mjs  # 服务端入口文件
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

### 5. Drizzle ORM 数据库命令

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
