# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 本项目的技能表

- `record-bug-fix-memory`
  - 路径：`.claude/skills/fix-bug/record-bug-fix-memory/SKILL.md`
  - 用途：在 bug 已经定位并修复后，记录事故结论、排错经验、AI 记忆更新、复盘摘要和本地 MCP 记忆。
  - 触发时机：当用户要求“记录经验教训”“补充 AI 记忆”“写事故记录”“同步本地 MCP 记忆”时，必须使用；当主代理完成错误处理后，也应主动参考并补充这个技能。
  - 参考作用：后续处理错误时，应先把这个技能作为历史事故模式、稳定基线、验证证据写法的参考来源之一。
  - 约束：这个技能只负责记忆沉淀和经验总结，不承担具体修复职责；解决错误后，应主动把新增的根因、关键误导点、有效修复、验证方式和后续约束补充回这个技能，并在需要时同步回根级 AI 记忆文档与 Memorix。

## 1. 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你**深度思考**这些`遗漏点`，`缺漏点`，和`冲突相悖点`，**并主动的向我问询这些你不清楚的实施细节**。请主动使用 claude code 内置的 `AskUserQuestion` 工具，将你不清楚的内容设计成一些列问题，并询问我，向我索要细节，或着与我协作沟通。

我会与你共同补充细化实现细节。我们会先迭代出一轮完整完善的实施清单，然后再由你亲自落实实施下去。

## 2. 对话沟通术语表

在我和你沟通时，我会使用以下术语，便于你理解。

在任何沟通下，这些术语都生效。

### 2.1. 核心开发技能 (Core Development Skills)

- `code-style` ： `.claude\skills\code-style\SKILL.md` `代码风格技能` ，用于说明代码编写规范的技能。
- `fix-type-error` ：`.claude\skills\fix-type-error\SKILL.md` `修复类型报错技能` ，专门用于修复 TypeScript 类型错误。

- `type-project-organization` ：`.claude\skills\type-project-organization\SKILL.md` `类型项目组织规范技能` ，规范类型项目代码组织方式、导出语法和文件结构。

- `project-schema-registry` ：`.claude\skills\project-schema-registry\SKILL.md` `项目Schema注册表技能` ，数据库表定义、Zod Runtime Schemas 和 TypeScript 类型定义的**唯一事实来源（Single Source of Truth）**。包含 Trinity Pattern 编写标准和 12 个业务领域的 schema references。

- `frontend-development` ：`.claude\skills\frontend-development\SKILL.md` `前端开发技能` ，包含 Vue 3 组件开发、Form 表单标准、List 页面模式和数据获取（API Hooks）的标准模式。

- `nitro-api-development` ：`.claude\skills\nitro-api-development\SKILL.md` `Nitro API 开发技能` ，包含基于 Nitro v3、H3 和 Drizzle ORM 的后端接口开发标准。支持 Mock 模式和 Neon+Drizzle 生产模式。

- `project-migration-guide` ：`.claude\skills\project-migration-guide\SKILL.md` `项目迁移指南技能` ，包含影子迁移（Shadow Migration）等大规模架构迁移策略。

### 2.2. 数据库与质量保障技能 (Database & Quality)

- `schema-and-seed-guardian` ：`.claude\skills\schema-and-seed-guardian\SKILL.md` `Schema与Seed守护技能` ，用于预防数据库 schema 定义和 seed 数据生成中的常见错误。

- `schema-change-sync` ：`.claude\skills\schema-change-sync\SKILL.md` `Schema变更同步技能` ，数据库 Schema 变更时的全项目同步检查清单。当修改表字段或新增数据库表时，确保类型项目、数据库迁移、后端接口、前端页面、种子数据和技能文档全部同步更新。

- `neon-db-query` ：`.claude\skills\neon-db-query\SKILL.md` `Neon数据库表查询技能` ，提供项目所有数据库表的完整清单，并支持使用 Neon MCP 批量查询表结构信息，用于 seed 数据生成参考。

- `neon-postgres-zh` ：`.claude\skills\neon-postgres-zh\SKILL.md` `Neon Postgres中文文档技能` ，Neon PostgreSQL 数据库服务的中文参考文档。

### 2.3. OpenSpec 工作流技能 (OpenSpec Workflow Skills)

OpenSpec 是本项目用于管理大型任务和变更的工作流系统。以下技能用于支持 OpenSpec 工作流：

- `openspec-new-change` ：创建新的 OpenSpec 变更任务
- `openspec-continue-change` ：继续现有 OpenSpec 变更的下一个 artifact
- `openspec-ff-change` ：快速通过创建所有 artifacts
- `openspec-apply-change` ：实施 OpenSpec 变更中的 tasks
- `openspec-verify-change` ：验证 OpenSpec 变更的实施质量
- `openspec-explore` ：探索模式，用于需求澄清和问题调研
- `openspec-sync-specs` ：同步 delta specs 到 main specs
- `openspec-archive-change` ：归档已完成的变更
- `openspec-bulk-archive-change` ：批量归档多个变更
- `openspec-onboard` ：OpenSpec 工作流引导教程

### 2.4. 项目术语 (Project Terminology)

- 后台项目： 即 `apps\admin\package.json` 项目。又称为 `admin后台项目` 。
- 类型项目： 即 `apps\type\package.json` 项目。又称为 `type类型项目` 。
  - **[NEW DEFINITION]** 正在转型为**同构运行时库 (Isomorphic Runtime Library)**，包含 Zod Schemas + Drizzle Tables，提供运行时验证。前后端共享同一 Schema 作为 Single Source of Truth。
- 客户端代码： 即 后台项目的 `apps\admin\src` 目录，这个目录下的全部代码，都是`客户端代码`。
- 服务端代码： 即 后台项目的 `apps\admin\server` 目录，这个目录下的全部代码，都是`服务端代码`。

- `业务路径`： 即 `apps\admin\src\router\rank\rank-route-keys.ts` 文件的全部`三级路由`所体现出来的文件路径。被认定为`业务路径`。`类型项目`、`服务端代码`、`后台项目`、`客户端代码`等。都要依赖于`业务路径`来组织代码。是本项目**非常重要**的路径概念。
  - `业务路径`几乎不会新增。一旦新增了`业务路径`，都会在 `rank-route-keys.ts` 内新增。所以在你执行相关任务时，请不要凭空新建内容。一律在`业务路径`对应的目录和文件内做修改或新增。

### 2.5. 生产环境地址来源

- 生产环境地址的权威读取入口是各子项目 `package.json` 的 `homepage` 字段；不要从 Vercel 控制台截图、历史报告、旧域名或 README 中反向推断。
- admin 后台 H5：读取 `apps/admin/package.json` 的 `homepage`，当前为 `https://01s-11comm.ruan-cat.com`。
- app H5：读取 `apps/app/package.json` 的 `homepage`，当前为 `https://01s-11-app.ruan-cat.com`。
- 独立统一 Nitro API server：读取 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。
- 文档、脚本或验证流程需要引用生产地址时，必须先读取或核对对应 `homepage`；变更域名时先改 `homepage`，再同步环境变量、部署说明和验证文档。

## 3. 禁止全局安装工具包

**严禁**使用 `npm install -g` 或 `pnpm add -g` 等命令进行工具的全局安装。

这会污染用户的全局环境，且导致工具版本不可控。

**正确做法：**

1.  **优先使用 npx**：例如 `npx prettier --write .`
2.  **或者使用本地开发依赖**：确保工具已添加到 `package.json` 的 `devDependencies` 中，然后通过 `pnpm exec` 或 npm scripts 运行。

## 4. 类型项目导出规范

> 详见 `type-project-organization` 技能（`.claude/skills/type-project-organization/SKILL.md`）。

> **[ARCHITECTURE TRANSFORMATION NOTICE]** `apps/type` 正在转型为**同构运行时库 (Isomorphic Runtime Library)**，包含 Zod Schemas + Drizzle Tables。Full Stack Type Transformation 完成前，§4.1 的"禁止修改"规则对 Schema 迁移活动豁免。

核心规则（**必须遵守**）：

1. **禁止**反复增删现有类型字段；中文字段名可改为英文，其余情况禁止重命名。
2. 始终使用 `export * from "./xxx"` 全量导出；**禁止** `export type *`。
3. **禁止**逐个罗列导出的项目（`export type { A, B, C } from "./xxx"`）。
4. 每层目录必须有 `index.ts` 统一导出所有内容（类型 + 变量）。
5. 重复导出冲突时，将公共内容移至 `apps/type/src/common/business-options.ts` 或 `business-types.ts`。

## 5. 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `apps\admin\src\docs\reports` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告的一级标题： 必须是日期`YYYY-MM-DD`+报告名的格式。
  - 好的例子： `2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误` 。前缀包含有 `YYYY-MM-DD` 日期。
  - 糟糕的例子： `构建与 fdir/Vite 事件复盘报告` 。前缀缺少 `YYYY-MM-DD` 日期。
- 报告日志信息的代码块语言： 一律用 `log` 作为日志信息的代码块语言。如下例子：

  ````markdown
  日志如下：

  ```log
  日志信息……
  ```
  ````

- 报告语言： 默认用简体中文。

## 6. 主从代理的相关规范

### 6.1. 主代理新建子代理的类型

主代理新建的子代理**必须**是**后台运行**的子代理。

### 6.2. 主代理新建子代理的时机

什么情况下应该新建子代理？在以下的几种情况下，主代理应该及时新建子代理来完成任务：

- 大规模的代码探索与信息收集任务。
- 访问 url 获取文档信息的任务。
- 指定严格顺序的代码修改任务。
- 报告编写任务。
- 进度文件更新与编写任务。

### 6.3. 基于`业务路径`做任务划分时的子代理规范

根据 `rank-route-keys.ts` 提供的三级路由做细粒度任务划分，每个子代理只负责 **2~3 个具体三级路由**，避免单个子代理负责过多导致执行失败。

### 6.4. 主从代理`调度设计`、`职责说明`与`通信反馈`规范

主从代理的调度设计：

- `主代理的职责`：
  - 阅读、理解、思考、推理全部的任务要求： 主代理应该负责全面的，完整的阅读任务所要求阅读的 md 文档和提示词。如果是执行 openspec 的任务，那么就按照要求，对应的阅读对应任务的 openspec 目录下全部的 markdown 文档任务要求。
  - 任务细粒度拆分： 并按照业务路由的路径做任务拆分，新建足够数量的子代理。
  - 将必要的上下文和任务要求传达给子代理。
  - 收集子代理反馈： 要求子代理按照报告编写规范，在指定目录内，以统一的报告格式，以文件的形式传达处理结果和上下文。
  - 临时设计报告格式： 主代理为了更好的收集子代理的反馈，可以临时简单设计一个报告格式，并要求子代理严格按照报告格式来反馈结果。
  - 监听子代理基于报告文档的反馈： 并持续监听，定期收集来自子代理的处理反馈。
  - 设计验收标准并检查子代理的处理结果： 如果你发现子代理的处理质量偏差过大，请重新开启一个子代理来完成任务。直接重做相关任务。
- `子代理的职责`：
  - 子代理应该严格按照主代理给定的要求来完成任务。
  - 以报告文件的形式，向主代理反馈工作成果。

## 7. 执行 openspec 系列长任务时的注意事项

本项目使用 openspec 来制定长任务执行规范。

### 7.1. 更新 openspec 的规范文件后应该及时运行校验命令，并根据校验反馈，使得 openspec 规范文件满足格式要求

比如你修改了 `migrate-static-data-to-nitro-query` 这款任务的规范文件后，你应该及时运行以下命令来检查文件是否满足规范：

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

更加通用的命令格式为：

```bash
openspec validate {任务名称} --strict
```

### 7.2. 执行长任务时的策略与注意事项

1. **及时更新任务文件**： **必须要**及时更新对应任务的 `tasks.md` 任务进度文件。避免出现大批量完成任务后，没有更新进度文件的情况，带来严重的误解。
2. 启动**多个子代理**分模块并行完成任务： 务必要启动多个在后台运行的子代理，同时完成 openspec 设定的一系列繁杂的任务。以便加快速度。你应该至少同时启用至少 4 个子代理。并根据情况，主动增加足够数量的子代理完成任务。
3. 回复文本语言： 务必用**中文**回复用户。
4. 上下文合并后重新阅读一次任务要求： 为了避免你在自动合并上下文的时候，给后续的任务带来明显的幻觉，你应该及时的重新阅读 openspec 的任务规范要求。
5. 连续的，持续的执行长任务：
   - 你应该一次性完成 `tasks.md` 所记录的全部任务。你应该同时新建多个子代理，做出合理的任务划分，一次性完成任务。
   - 不要在完成一个任务的时候就停下来询问用户。这种停顿方式很低效率，你要避免这种执行方式。
6. **禁止**编写脚本完成批处理任务：
   - **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。
   - 你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
   - 你应该新建多个子代理，主代理用具体的子代理来完成大规模的修改任务。

## 9. 编写测试用例规范

1. 请你使用 vitest 的 `import { test, describe } from "vitest";` 来编写。我希望测试用例格式为 describe 和 test。
2. 测试用例的文件格式为 `*.test.ts` 。
3. 测试用例的目录一般情况下为 `**/tests/` ，`**/src/tests/` 格式。
4. 在对应 monorepo 的 tests 目录内，编写测试用例。如果你无法独立识别清楚到底在那个具体的 monorepo 子包内编写测试用例，请直接咨询我应该在那个目录下编写测试用例。

## 10. 数据库 Schema 开发规范

### 10.1. Schema 定义的唯一事实来源

**核心原则**：`apps/type/src/business/{domain}/{module}/schema.ts` 是数据库表定义的**唯一事实来源（Single Source of Truth）**。

每个 schema 文件必须导出三种产物（Trinity Pattern）：

1. **Drizzle Table** - 数据库表定义（例如 `communities`）
2. **Zod Schemas** - 运行时验证（`insertXxxSchema`, `selectXxxSchema`, `updateXxxSchema`）
3. **TypeScript Types** - 静态类型（`NewXxx`, `Xxx`, `UpdateXxx`）

**详细规范**请参考：`.claude/skills/project-schema-registry/SKILL.md`

### 10.2. Schema 文件位置规范

- **正确位置**：`apps/type/src/business/{domain}/{module}/schema.ts`
- **错误位置**：`apps/admin/server/db/schemas/` (已废弃，仅作临时过渡)

### 10.3. 数据库变更维护清单

当你在 `apps/type/src/business/` 目录内**新增、修改或删除**schema 时：

1. 你**必须**主动更新 `.claude/skills/neon-db-query/SKILL.md` 文件内的数据库表清单
2. 确保该清单与实际代码保持一致
3. 如有 schema 结构变更，需要运行 `pnpm -F @01s-11comm/type db:generate` 生成迁移文件

### 10.4. Schema 编写标准

必须严格遵循**Trinity Pattern**，详见 `project-schema-registry` 技能：

- Part A：使用 `pgTable` 定义表，使用 `primaryId()` 和 `...timestamps`
- Part B：使用 `createInsertSchema`, `createSelectSchema` 创建 Zod schemas
- Part C：使用 `$inferSelect`, `$inferInsert` 推断 TypeScript 类型

### 10.5. 常见错误预防

参考 `schema-and-seed-guardian` 技能避免：

- 字段重复定义
- 外键关系冲突
- Zod schema 与 Drizzle table 不一致
- Seed 数据生成器函数（应使用字面量数组）

## 11. 开发工作流

1. 使用 pnpm 进行包管理
2. Turbo 处理构建编排
3. 基于文件的路由 - 在 src/views/中创建.vue 文件用于新页面
4. 使用 definePage()宏进行路由配置
5. API 接口按业务模块组织
6. 遵循现有组件模式（自定义组件使用 Re\*前缀）
7. 使用组合式函数处理共享逻辑
8. 测试文件与实现文件共同定位

## 11.1. Windows 行尾配置一致性（防止幽灵 git modified）

本项目在 Windows 上必须保持四层行尾配置协同一致，缺一层就会导致文件反复出现「幽灵 modified」：

1. `.gitattributes`：`* text=auto eol=lf`
2. `.editorconfig`：`end_of_line = lf`
3. `prettier.config.mjs`：`endOfLine: "lf"`（**禁止** `"auto"`，`"auto"` 在 Windows 上会保留/引入 CRLF）
4. `.vscode/settings.json`：`"files.eol": "\n"`

遇到「git status 显示 modified 但 git diff 为空」时，按此顺序排查。详见 `.claude/skills/fix-bug/record-bug-fix-memory/SKILL.md` 中的 CRLF 幽灵修改事故记录。

## 12. 获取技术栈对应的上下文

以下是本项目使用的部分技术栈，你应该主动访问 github 仓库，或者使用 context7 MCP 来访问最新的文档。

### 12.1. taskmaster-ai

- [claude-task-master](https://github.com/eyaltoledano/claude-task-master)

我们项目的任务清单配置，就是用 `claude-task-master`，即 `taskmaster-ai` 来生成的。请你在生成 `.taskmaster` 目录内的任务文件时，满足其格式要求。

### 12.2. nitro

- https://github.com/unjs/nitro
- https://v3.nitro.build/

这是使用全栈构建的库。用该库就能实现将 vite 项目变成全栈项目。以下是使用 nitro v3 开发服务端接口的的注意事项：

#### 12.2.1. 本项目不做任何接口鉴权

> **[重要项目特性]** 本项目的 Nitro 接口**不做任何鉴权**。
>
> - **禁止**为 Nitro 接口添加 JWT 认证、Token 验证、Neon Auth 鉴权等任何鉴权逻辑。
> - **禁止**引入 `@neondatabase/auth` 包。
> - 所有接口均公开访问，无需登录或 Token。
> - `server/middleware/`、`server/plugins/` 中**不应存在**任何鉴权中间件或插件。

#### 12.2.2. 编写接口需要导入正确的模块

**H3 函数必须从 `"nitro/h3"` 导入**（如 `createError`、`defineHandler` 等），**严禁**从 `"h3"` 直接导入。

请参考 `.claude/skills/nitro-api-development/SKILL.md` 获取完整的接口开发规范。

#### 12.2.3. 配置文件格式没有 vite 配置对象

请参考 `.claude/skills/nitro-api-development/SKILL.md` 获取配置相关信息。

### 12.3. pure-admin 后台框架模板

`apps\admin` 项目套用是 `pure-admin` 模板。

- pure-admin 模板仓库 ： https://github.com/pure-admin/vue-pure-admin
- pure-admin 在线预览界面 ： https://pure-admin.github.io/vue-pure-admin/#/login
- pure-admin 文档 ： https://pure-admin.cn/
- pure-admin 文档仓库 ： https://github.com/pure-admin/pure-admin-doc
- pure-admin 注册路由 ： `https://github.com/pure-admin/pure-admin-doc/blob/master/docs/01.指南/01.指南/07.路由和菜单.md`

### 12.4. claude code skill

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices

## Memorix — 自动记忆规则

1. **会话开始**：调用 `memorix_search` 加载相关历史记忆，再响应用户
2. **每次修改状态后**：调用 `memorix_store` 记录（文件修改、bug 修复、架构决策、配置变更等）
3. **会话结束**：调用 `memorix_store` 记录本次会话摘要（已完成、待续项、修改文件）
