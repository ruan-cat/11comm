# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 本项目的技能表

- `code-style`
  - 路径：`.claude/skills/code-style/SKILL.md`
  - 用途：提供项目代码风格指南，或根据代码风格审查、重构代码。
  - 触发时机：需要把控代码风格、组件写法、导入方式、i18n、按钮与图标规范时使用。
  - 参考作用：作为局部代码编辑时的风格基线，避免引入与项目现有风格冲突的写法。
  - 约束：不应借代码风格之名做无关格式化或扩大重构范围。
- `record-bug-fix-memory` — `.claude/skills/fix-bug/record-bug-fix-memory/SKILL.md` — bug 修复后的经验与事故记录沉淀（非调试流程本身）。
  - **存储架构**：双层存储。SKILL.md 只放流程指导和摘要索引，详细案例存储在同目录下的独立 `YYYY-MM-DD-{slug}.md` 文件中。
  - **阅读方式**：使用此技能前，先读 SKILL.md 了解流程，再根据「案例索引」章节按需读取相关的独立案例文件。
  - **写入方式**：新增经验时，创建独立案例文件，同时在 SKILL.md 的「案例索引」追加摘要。禁止将完整事故正文写入 SKILL.md。
- `fix-type-error`
  - 路径：`.claude/skills/fix-type-error/SKILL.md`
  - 用途：修复 TypeScript 类型错误，优化类型写法。
  - 触发时机：出现 TS 类型错误、导入冲突、Drizzle/H3/Vue 类型不匹配或类型组织问题时使用。
  - 参考作用：沉淀本项目常见类型错误模式和修复路径。
  - 约束：优先定位真实类型来源，不用 `any` 或断言掩盖未理解的问题。
- `frontend-development`
  - 路径：`.claude/skills/frontend-development/SKILL.md`
  - 用途：指导 `apps/admin` 的 Vue 3 + TypeScript 页面、列表、表单、弹窗和 i18n 开发。
  - 触发时机：编写或修改后台客户端页面、组件、表单、列表和前端 API Hook 时使用。
  - 参考作用：提供 pure-admin 项目内的页面结构、交互组件和自测标准。
  - 约束：遵循业务路径和现有组件模式，不凭空新增路由或页面结构。
- `neon-db-query`
  - 路径：`.claude/skills/neon-db-query/SKILL.md`
  - 用途：项目数据库表清单与批量查询工具说明。
  - 触发时机：需要验证表名、理解数据库结构、检查 Schema 定义或查询表结构时使用。
  - 参考作用：作为数据库表清单和 Neon MCP 查询流程的入口。
  - 约束：Schema 清单变更后必须同步更新该技能内的表清单。
- `neon-postgres-zh`
  - 路径：`.claude/skills/neon-postgres-zh/SKILL.md`
  - 用途：Neon Serverless Postgres 中文指南和最佳实践。
  - 触发时机：处理 Neon 连接、本地开发、认证、数据 API、CLI 或平台 API 问题时使用。
  - 参考作用：作为 Neon 相关技术决策和配置排查的文档入口。
  - 约束：涉及最新 Neon 行为时需要核对当前文档或实际环境。
- `nitro-api-development`
  - 路径：`.claude/skills/nitro-api-development/SKILL.md`
  - 用途：使用 Nitro v3、H3 和 Drizzle ORM 编写服务端 API。
  - 触发时机：开发 CRUD 接口、迁移 Mock 数据到 Neon、修复后端接口逻辑时使用。
  - 参考作用：约束 H3 导入、响应类型、时间字段、数据库连接和常见陷阱。
  - 约束：本项目 Nitro 接口不做鉴权；H3 函数必须从 `"nitro/h3"` 导入。
- `openspec-apply-change`
  - 路径：`.claude/skills/openspec-apply-change/SKILL.md`
  - 用途：实施 OpenSpec 变更中的 tasks。
  - 触发时机：用户要求开始或继续实现某个 OpenSpec change 时使用。
  - 参考作用：把 proposal/design/tasks 转成实际代码变更和验证。
  - 约束：必须按 tasks.md 推进并及时更新任务进度。
- `openspec-archive-change`
  - 路径：`.claude/skills/openspec-archive-change/SKILL.md`
  - 用途：归档已完成的 OpenSpec change。
  - 触发时机：实现完成、验证通过且用户要求归档时使用。
  - 参考作用：同步规范并收尾变更目录。
  - 约束：未完成或未验证的变更不得归档。
- `openspec-bulk-archive-change`
  - 路径：`.claude/skills/openspec-bulk-archive-change/SKILL.md`
  - 用途：批量归档多个已完成 OpenSpec change。
  - 触发时机：需要同时归档多个并行变更时使用。
  - 参考作用：统一处理多个 completed change 的归档流程。
  - 约束：只归档已完成且可验证的变更。
- `openspec-continue-change`
  - 路径：`.claude/skills/openspec-continue-change/SKILL.md`
  - 用途：继续现有 OpenSpec change 的下一个 artifact。
  - 触发时机：用户要求继续 workflow、创建下一个 artifact 或推进变更时使用。
  - 参考作用：按 OpenSpec 阶段推进 proposal、design、spec 或 tasks。
  - 约束：先读取现有 change 状态，不跳步覆盖已有 artifact。
- `openspec-explore`
  - 路径：`.claude/skills/openspec-explore/SKILL.md`
  - 用途：探索想法、调查问题和澄清需求。
  - 触发时机：用户想先讨论方案、问题不清楚、需要需求探索时使用。
  - 参考作用：在写 proposal 或实施前形成更清晰的问题定义。
  - 约束：探索模式不直接替代实现，结束时应明确下一步。
- `openspec-ff-change`
  - 路径：`.claude/skills/openspec-ff-change/SKILL.md`
  - 用途：快速创建实现前所需的 OpenSpec artifacts。
  - 触发时机：用户希望快速生成完整变更材料而不逐步确认时使用。
  - 参考作用：提高规范准备效率。
  - 约束：仍需保证 artifacts 之间一致并通过 OpenSpec 校验。
- `openspec-new-change`
  - 路径：`.claude/skills/openspec-new-change/SKILL.md`
  - 用途：创建新的 OpenSpec change。
  - 触发时机：用户要新增功能、修复或结构化变更，并希望按 OpenSpec 管理时使用。
  - 参考作用：建立 proposal、spec、design、tasks 的变更骨架。
  - 约束：change 命名和能力边界必须清晰。
- `openspec-onboard`
  - 路径：`.claude/skills/openspec-onboard/SKILL.md`
  - 用途：OpenSpec 工作流引导教程。
  - 触发时机：用户需要了解或演练完整 OpenSpec 流程时使用。
  - 参考作用：解释阶段、命令和产物结构。
  - 约束：不要在普通开发任务中强行进入教学流程。
- `openspec-sync-specs`
  - 路径：`.claude/skills/openspec-sync-specs/SKILL.md`
  - 用途：把 delta specs 同步到 main specs。
  - 触发时机：用户要求同步规范但暂不归档 change 时使用。
  - 参考作用：维护主规范与变更规范的一致性。
  - 约束：同步后应运行对应 OpenSpec 校验。
- `openspec-verify-change`
  - 路径：`.claude/skills/openspec-verify-change/SKILL.md`
  - 用途：验证实现是否匹配 OpenSpec change artifacts。
  - 触发时机：归档前、交付前或用户要求检查实现质量时使用。
  - 参考作用：对照 proposal/spec/tasks 检查完整性与一致性。
  - 约束：发现缺口时不能声称完成，应回到实现或任务更新。
- `project-migration-guide`
  - 路径：`.claude/skills/project-migration-guide/SKILL.md`
  - 用途：项目范围迁移策略，特别是数据库 schema 和类型系统影子迁移。
  - 触发时机：执行大规模结构迁移、类型迁移或 schema 迁移时使用。
  - 参考作用：提供分阶段迁移、兼容窗口和回滚思路。
  - 约束：迁移必须控制范围和验证点，不做无计划的全量重写。
- `project-schema-registry`
  - 路径：`.claude/skills/project-schema-registry/SKILL.md`
  - 用途：项目数据库 schema 架构综合指南和 Trinity Pattern 规范。
  - 触发时机：定义新表、修改 schema、理解数据模型时使用。
  - 参考作用：作为 `apps/type/src/business/**/schema.ts` 的 Single Source of Truth 指南。
  - 约束：每个 schema 必须同时维护 Drizzle Table、Zod Schemas 和 TypeScript Types。
- `schema-and-seed-guardian`
  - 路径：`.claude/skills/schema-and-seed-guardian/SKILL.md`
  - 用途：数据库结构和 seed 脚本变更的风险防护指南。
  - 触发时机：修改数据库结构、唯一索引、外键、循环依赖或种子数据时使用。
  - 参考作用：预防性能问题、数据一致性崩溃和部署失败。
  - 约束：新 Schema 应在 `apps/type` 中创建；seed 数据应避免脆弱生成逻辑。
- `schema-change-sync`
  - 路径：`.claude/skills/schema-change-sync/SKILL.md`
  - 用途：数据库 Schema 变更时的全项目同步检查清单。
  - 触发时机：修改字段、新增表、删除表或迁移前端业务类型时使用。
  - 参考作用：确保类型项目、迁移、后端接口、前端页面、种子数据和技能文档同步。
  - 约束：不能只改 schema；必须检查导出链、迁移、API、前端和文档。
- `type-project-organization`
  - 路径：`.claude/skills/type-project-organization/SKILL.md`
  - 用途：规范 `apps/type` 的代码组织、导出语法和文件结构。
  - 触发时机：处理类型项目开发、导出冲突、类型错误修复和组织规范时使用。
  - 参考作用：提供全量导出、统一入口和重复导出处理规则。
  - 约束：禁止 `export type *` 和逐个罗列导出；类型项目内导入路径必须使用相对路径。

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

- `schema-and-seed-guardian` ：`.claude\skills\schema-and-seed-guardian\SKILL.md` `Schema与Seed守护技能` ，用于预防数据库 schema 定义和 Direct Seed 模块编写中的常见错误。

- `schema-change-sync` ：`.claude\skills\schema-change-sync\SKILL.md` `Schema变更同步技能` ，数据库 Schema 变更时的全项目同步检查清单。当修改表字段或新增数据库表时，确保类型项目、数据库迁移、后端接口、前端页面、种子数据和技能文档全部同步更新。

- `neon-db-query` ：`.claude\skills\neon-db-query\SKILL.md` `Neon数据库表查询技能` ，提供项目所有数据库表的完整清单，并支持使用 Neon MCP 批量查询表结构信息，用于数据库结构查询和开发参考。

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

## 6.5. 沟通协作要求

### `计划模式`

在`计划模式`下，请你按照以下方式与我协作：

1. 你不需要考虑任何向后兼容的设计，允许你做出破坏性的写法。请先设计一个合适的方案，和我沟通后再修改实施。
2. 如果有疑惑，请询问我。
3. 完成任务后，请告知我你做了那些破坏性变更。

请注意，在绝大多数情况下，我不会要求你以这种 `计划模式` 来和我协作。

## 6.6. 终端操作注意事项（防卡住）

在 Windows PowerShell 环境下执行终端命令时，必须遵循以下规则，避免命令卡住浪费时间：

### 6.6.1. 避免超长单行命令

命令行参数过多（超过 200 字符）时，PowerShell 可能会挂起无响应。

- **拆分命令**：每次传入 2~3 个文件路径，不要一次传入 5 个以上。
- **使用通配符**：优先用 `git add scripts/.../src/*.ts` 替代逐个列举文件路径。

### 6.6.2. 优先使用 `pnpm run` 而非 `npx`

`npx` 在 Windows 上被终止时，会触发 `Terminate batch job (Y/N)?` 交互提示导致卡住。

- **优先使用** `pnpm run build` 替代 `npx tsdown`。
- **优先使用** `pnpm run test` 替代 `npx vitest run`。

### 6.6.3. 及时止损，不要反复轮询

当命令可能卡住时：

1. 第 1 次状态检查等待 10~15 秒。
2. 如果无输出且仍在运行 → **立即终止**，用新命令重试。
3. **不要超过 2 次**状态检查仍无进展还继续等待。

### 6.6.4. 合理的等待超时设置

|         命令类型         | 建议等待时长 |
| :----------------------: | :----------: |
| `git add / status / log` |   5~10 秒    |
|       `git commit`       |    10 秒     |
| `pnpm run build / test`  |    30 秒     |
|      `pnpm install`      |    60 秒     |

## 6.7. 简单任务的高效执行原则

当用户交代的任务范围明确清晰时，必须**直接行动**，禁止进行不必要的大范围侦察。

### 6.7.1. 判断任务规模，选择正确的行动姿态

| 任务信号                         | 正确行动               |
| :------------------------------- | :--------------------- |
| 用户通过 `@文件` 明确了操作范围  | 直接读该文件，立即动手 |
| 用户说"帮我改这个"、"写个日志"   | 行动优先，缺什么补什么 |
| 用户涉及多包架构改动、新功能设计 | 先侦察，再行动         |

**核心原则**：用户提供的上下文（@文件引用、对话内容、当前打开文件）就是最直接的线索，优先使用，不要用命令重新发现已知信息。

### 6.7.2. 禁止行为清单

以下行为在**简单任务**（单文件改动、写 changeset、写提交信息等）中是被禁止的：

- 禁止连续执行超过 3 次 `git log` 来"了解全貌"
- 禁止在明确知道目标文件的情况下，仍去扫描整个项目目录
- 禁止把"读遍所有相关文档"当作行动前置条件
- 禁止在用户已给出 @文件 的情况下，用命令重新搜索文件位置

### 6.7.3. 对用户纠偏提示立即响应

当用户发出以下信号时，必须**立即停止对当前路径的死磕**，回归最小行动路径：

- "太复杂了"
- "不要反复查询"
- "直接做就行"
- "按要求做即可"

正确反应：停止当前侦察行为 → 明确当前已知信息 → 直接执行最核心的操作步骤。

## 6.8. 编码前思考、简洁优先、精准修改与目标驱动执行

本章节整合自 `multica-ai/andrej-karpathy-skills` 对 LLM 编码陷阱的总结，用于降低 AI agent 在写代码、改代码、重构代码时的常见错误。

这些准则偏向**谨慎和可验证**，而不是追求最快动手。遇到拼写修正、显而易见的一行改动、用户已经明确要求“直接做”的简单任务时，仍应遵循“简单任务的高效执行原则”，走最小行动路径。

### 6.8.1. 核心原则概览

| 原则         | 主要解决的问题                             |
| :----------- | :----------------------------------------- |
| 编码前思考   | 错误假设、隐藏困惑、缺少权衡、没有及时澄清 |
| 简洁优先     | 过度工程、抽象泛滥、为了未来场景提前设计   |
| 精准修改     | 无关编辑、顺手重构、删除不理解的代码       |
| 目标驱动执行 | 成功标准模糊、验证不足、靠盲改推进任务     |

### 6.8.2. 编码前思考

不要假设，不要隐藏困惑，要把关键权衡摆出来。

- 明确说明当前假设。只要假设会影响实现路径，就不要把它藏在心里。
- 如果存在多种解释，列出这些解释，并说明各自会导致什么实现差异。
- 如果需求不清楚，停下来指出不清楚的点，向用户询问。
- 如果用户提出的方案明显复杂、风险高或与目标不匹配，应该礼貌指出，并给出更简单的替代方案。
- 如果只是小范围、低风险、目标明确的任务，可以说明采用的合理默认假设，然后直接执行。

不要用“我先实现一个通用版本”来掩盖需求不清。通用版本通常意味着你正在替用户决定未确认的未来需求。

### 6.8.3. 简洁优先

用能解决当前问题的最少代码完成任务，不要写推测性功能。

- 不添加用户没有要求的功能。
- 不为只使用一次的逻辑创建抽象。
- 不为了“灵活性”添加未要求的配置项、插件点、策略对象或兼容层。
- 不为实际上不可能发生的场景堆错误处理。
- 不为了展示完整架构而扩大文件、模块或 API 的边界。
- 如果你写了 200 行，但 50 行就能清楚解决问题，应该主动收缩实现。

### 6.8.4. 精准修改

只触碰必须触碰的内容，只清理自己造成的问题。

- 不要顺手“改进”相邻代码、注释、格式或命名。
- 不要重构没有坏、也不在任务范围内的代码。
- 匹配已有代码风格，即使你个人更喜欢另一种写法。
- 看到无关死代码时，可以在总结中提及，不要擅自删除。
- 不要把格式化整个文件当作完成小改动的副作用。
- 不要因为读不懂旧逻辑就删除它；读不懂时应先调查或询问。

最终自检标准：每一行 diff 都应该能直接追溯到用户请求、实现该请求所需的必要调整，或本次改动产生的必要清理。

### 6.8.5. 目标驱动执行

先定义成功标准，再循环验证直到达成。

不要只把用户的话理解成“要做什么”，还要把它转化成“怎样证明已经做好”。例如：

| 用户指令   | 更好的目标表达                               |
| :--------- | :------------------------------------------- |
| 添加验证   | 为无效输入补测试，再让测试通过               |
| 修复 bug   | 先写出能复现问题的测试或最小复现，再让它通过 |
| 重构某模块 | 保证重构前后现有测试通过，行为不变           |
| 优化构建   | 给出构建命令、耗时或错误消失的验证证据       |
| 更新文档   | 检查链接、路径、命令和示例是否与实际文件一致 |

### 6.8.6. AI 实践补充

- **先识别任务类型**：简单任务直接做；多文件、多包、发布、架构和流程变更先列清范围与验证点。
- **先读最近相关上下文**：读目标文件、相邻模板、现有 changelog 或测试，不要为了“了解全貌”无边界扫描。
- **显式记录关键假设**：假设影响版本号、发布等级、文件落点、兼容策略时，必须告诉用户或请求确认。
- **让每一步能回滚和解释**：每次编辑只覆盖一个清楚意图，避免把内容改写、版本升级、格式整理和无关清理混在一起。
- **失败时先定位根因**：测试、构建、校验失败后，先读错误和相关代码，不要连续盲改。
- **验证证据要具体**：优先给出命令、文件、diff、测试结果、解析结果，而不是“应该可以”。
- **保护用户改动**：工作区已有改动默认属于用户；除非用户明确要求，不要撤销、覆盖、提交或重新暂存这些改动。
- **避免流程压过目标**：技能、规范和流程用于服务任务。如果流程与用户明确意图冲突，应先说明冲突并按用户意图收敛。
- **完成前读 diff**：确认改动范围、标题层级、格式、语言和验证结果都符合目标，再声称完成。

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
3. 如有 schema 结构变更，schema 仍在 `apps/type` 维护，但迁移文件生成必须通过 `pnpm -F @01s-11comm/api db:generate` 执行，由 `apps/api` 的 Drizzle 配置读取 `apps/type` schema 并输出到 `apps/api/drizzle/**`；禁止再把 type 子包命令当作迁移入口。

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

#### Drizzle Seed 类型绕过

- `primaryId()` 的 `defaultRandom()` 会将 `id` 排除出 `InferInsertModel`；种子数据 `.values()` 必须使用 `rows()` identity 函数（见 `server/db/seed/helpers.ts`）打破 fresh literal excess property check。
- 修改 `primaryId()` 的 default 实现方式无效——Drizzle 对任何有默认值的列都执行相同类型排除。

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

## 11.2. `apps/app` H5 生产构建的 Windows ESM loader 约束

`apps/app` 的 `build:h5:prod` 不要改回裸 `uni build --mode production`。Windows + 较新 Node ESM loader 下，uni-app/Vite 构建链可能动态导入 `D:\...` 这类绝对路径，Node 会把盘符识别成不支持的 URL scheme。

当前决策是通过 `node --import ./scripts/register-window-path-loader.js` 启动 uni 构建，并且注册脚本只在 Windows 下用 `node:module.register()` 注册 `window-path-loader.js`；Linux/Vercel CI 不注册 loader，保持默认 ESM 解析。不要退回 `--experimental-loader`，该入口会产生 Node experimental warning，且历史上曾和 Vercel 输出目录问题混淆。

修改这条链路后至少验证 `pnpm -F @01s-11comm/app build:h5:prod` 和 `pnpm -F @01s-11comm/app build:vercel`。详细复盘见 `.claude/skills/fix-bug/record-bug-fix-memory/2026-07-09-app-h5-prod-windows-esm-loader.md`，决策说明见 `apps/app/README.md`。

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
