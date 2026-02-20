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

使用 Drizzle ORM 进行数据库版本管理：

```bash
# 生成迁移文件
pnpm db:generate

# 执行迁移
pnpm db:migrate

# 推送 schema 变更（开发环境）
pnpm db:push

# 生成种子数据
pnpm db:generate-seed
pnpm db:seed
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

|         命令         |               说明                |
| :------------------: | :-------------------------------: |
|     `pnpm build`     | 构建生产环境（等同于 build:prod） |
|  `pnpm build:prod`   |         构建生产环境版本          |
| `pnpm build:staging` |        构建预发布环境版本         |
| `pnpm build:github`  |    构建 GitHub Pages 部署版本     |
|  `pnpm docs:build`   |        构建 VitePress 文档        |

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

|          命令           |                      说明                      |
| :---------------------: | :--------------------------------------------: |
|   `pnpm db:generate`    | 生成数据库迁移文件（根据 schema 变更生成 SQL） |
|    `pnpm db:migrate`    |         执行数据库迁移（应用迁移文件）         |
|     `pnpm db:push`      |  推送 schema 变更到数据库（开发环境快速同步）  |
|    `pnpm db:studio`     |  启动 Drizzle Studio（可视化数据库管理界面）   |
|     `pnpm db:drop`      |            删除迁移文件（谨慎使用）            |
| `pnpm db:generate-seed` |     生成种子数据 SQL 文件（详见下方说明）      |
|     `pnpm db:seed`      |    执行种子数据导入到数据库（详见下方说明）    |

#### 5.1 种子数据命令详细说明

种子数据命令用于生成和导入测试数据，详细使用指南请参阅：[种子数据命令使用指南](./src/docs/guides/seed-commands.md)

##### `db:generate-seed` 命令参数

|          命令           |              说明              |
| :---------------------: | :----------------------------: |
| `pnpm db:generate-seed` |     生成全部模块的种子 SQL     |
|    `--list-modules`     |   显示可用模块列表及依赖关系   |
|    `--module=<name>`    | 只生成指定模块（如 community） |

##### `db:seed` 命令参数

|       命令        |            说明            |
| :---------------: | :------------------------: |
|  `pnpm db:seed`   |  导入全部种子数据到数据库  |
| `pnpm db:reseed`  | 清理数据后重新导入全部数据 |
|     `--clean`     |     清理数据后重新导入     |
|  `--clean-only`   |   仅执行清理，不导入数据   |
| `--module=<name>` |    只导入指定模块的数据    |

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
