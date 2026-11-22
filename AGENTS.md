# AGENTS.md

此文件为本仓库所有 AI agent 工作时提供指导，是本项目 AI 记忆文件的唯一事实来源（Single Source of Truth）。根目录的 `CLAUDE.md` 与 `GEMINI.md` 均为指向本文件的重定向入口。

## 本项目的技能表

- `code-style`
  - 路径：`.agents/skills/code-style/SKILL.md`
  - 用途：提供项目代码风格指南，或根据代码风格审查、重构代码。
  - 触发时机：需要把控代码风格、组件写法、导入方式、i18n、按钮与图标规范时使用。
  - 参考作用：作为局部代码编辑时的风格基线，避免引入与项目现有风格冲突的写法。
  - 约束：不应借代码风格之名做无关格式化或扩大重构范围。
- `fix-type-error`
  - 路径：`.agents/skills/fix-type-error/SKILL.md`
  - 用途：修复 TypeScript 类型错误，优化类型写法。
  - 触发时机：出现 TS 类型错误、导入冲突、Drizzle/H3/Vue 类型不匹配或类型组织问题时使用。
  - 参考作用：沉淀本项目常见类型错误模式和修复路径。
  - 约束：优先定位真实类型来源，不用 `any` 或断言掩盖未理解的问题。
- `frontend-development`
  - 路径：`.agents/skills/frontend-development/SKILL.md`
  - 用途：指导 `apps/admin` 的 Vue 3 + TypeScript 页面、列表、表单、弹窗和 i18n 开发。
  - 触发时机：编写或修改后台客户端页面、组件、表单、列表和前端 API Hook 时使用。
  - 参考作用：提供 pure-admin 项目内的页面结构、交互组件和自测标准。
  - 约束：遵循业务路径和现有组件模式，不凭空新增路由或页面结构。
- `nitro-api-development`
  - 路径：`.agents/skills/nitro-api-development/SKILL.md`
  - 用途：使用 Nitro v3、H3 和 Drizzle ORM 编写服务端 API。
  - 触发时机：开发 CRUD 接口、迁移 Mock 数据到 Neon、修复后端接口逻辑时使用。
  - 参考作用：约束 H3 导入、响应类型、时间字段、数据库连接和常见陷阱。
  - 约束：Nitro 允许在明确设计边界内局部恢复鉴权能力；H3 函数必须从 `"nitro/h3"` 导入。
- `type-project-organization`
  - 路径：`.agents/skills/type-project-organization/SKILL.md`
  - 用途：规范 `apps/type` 的代码组织、导出语法和文件结构。
  - 触发时机：处理类型项目开发、导出冲突、类型错误修复和组织规范时使用。
  - 参考作用：提供全量导出、统一入口和重复导出处理规则。
  - 约束：禁止 `export type *` 和逐个罗列导出；类型项目内导入路径必须使用相对路径。
- `project-schema-registry`
  - 路径：`.agents/skills/project-schema-registry/SKILL.md`
  - 用途：项目数据库 schema 架构综合指南和 Trinity Pattern 规范。
  - 触发时机：定义新表、修改 schema、理解数据模型时使用。
  - 参考作用：作为 `apps/type/src/business/**/schema.ts` 的 Single Source of Truth 指南。
  - 约束：每个 schema 必须同时维护 Drizzle Table、Zod Schemas 和 TypeScript Types。
- `schema-and-seed-guardian`
  - 路径：`.agents/skills/schema-and-seed-guardian/SKILL.md`
  - 用途：数据库结构和 seed 脚本变更的风险防护指南。
  - 触发时机：修改数据库结构、唯一索引、外键、循环依赖或种子数据时使用。
  - 参考作用：预防性能问题、数据一致性崩溃和部署失败。
  - 约束：新 Schema 应在 `apps/type` 中创建；seed 数据应避免脆弱生成逻辑。
- `schema-change-sync`
  - 路径：`.agents/skills/schema-change-sync/SKILL.md`
  - 用途：数据库 Schema 变更时的全项目同步检查清单。
  - 触发时机：修改字段、新增表、删除表或迁移前端业务类型时使用。
  - 参考作用：确保类型项目、迁移、后端接口、前端页面、种子数据和技能文档同步。
  - 约束：不能只改 schema；必须检查导出链、迁移、API、前端和文档。
- `project-migration-guide`
  - 路径：`.agents/skills/project-migration-guide/SKILL.md`
  - 用途：项目范围迁移策略，特别是数据库 schema 和类型系统影子迁移。
  - 触发时机：执行大规模结构迁移、类型迁移或 schema 迁移时使用。
  - 参考作用：提供分阶段迁移、兼容窗口和回滚思路。
  - 约束：迁移必须控制范围和验证点，不做无计划的全量重写。
- `neon-db-query`
  - 路径：`.agents/skills/neon-db-query/SKILL.md`
  - 用途：项目数据库表清单与批量查询工具说明。
  - 触发时机：需要验证表名、理解数据库结构、检查 Schema 定义或查询表结构时使用。
  - 参考作用：作为数据库表清单和 Neon MCP 查询流程的入口。
  - 约束：Schema 清单变更后必须同步更新该技能内的表清单。
- `neon-postgres`
  - 路径：`.agents/skills/neon-postgres/SKILL.md`
  - 用途：Neon Serverless Postgres 英文指南和最佳实践。
  - 触发时机：处理 Neon 连接、本地开发、认证、Data API、CLI 或平台 API 问题，需要核对最新英文文档时使用。
  - 参考作用：与 `neon-postgres-zh` 互补的英文权威文档入口。
  - 约束：涉及最新 Neon 行为时以官方文档和实际环境为准。
- `neon-postgres-zh`
  - 路径：`.agents/skills/neon-postgres-zh/SKILL.md`
  - 用途：Neon Serverless Postgres 中文指南和最佳实践。
  - 触发时机：处理 Neon 连接、本地开发、认证、数据 API、CLI 或平台 API 问题时使用。
  - 参考作用：作为 Neon 相关技术决策和配置排查的文档入口。
  - 约束：涉及最新 Neon 行为时需要核对当前文档或实际环境。
- `cloudbase`
  - 路径：`.agents/skills/cloudbase/SKILL.md`
  - 用途：腾讯云开发（CloudBase/TCB）一体化运行与部署环境指南，覆盖数据库、云函数、云托管、云存储、身份鉴权和内置 AI。
  - 触发时机：开发、部署、调试、迁移或排障 CloudBase 相关项目，以及微信小程序云开发环境关联时使用。
  - 参考作用：作为 CloudBase 平台能力和运维诊断的文档入口。
  - 约束：CloudBase 不承载主业务后端，不作为主数据库或主文件存储。
- `wechat-cloud-mini-program-deployment`
  - 路径：`.agents/skills/wechat-cloud-mini-program-deployment/SKILL.md`
  - 用途：项目级微信云小程序部署指南。
  - 触发时机：处理微信小程序、CloudBase、miniprogram-ci、预览、上传、合法域名和云开发环境关联相关任务时使用。
  - 参考作用：约束 miniprogram-ci 预览/上传操作和小程序部署链路。
  - 约束：预览、上传等敏感操作需用户授权，不擅自执行大型构建。
- `openspec-new-change`
  - 路径：`.agents/skills/openspec-new-change/SKILL.md`
  - 用途：创建新的 OpenSpec change。
  - 触发时机：用户要新增功能、修复或结构化变更，并希望按 OpenSpec 管理时使用。
  - 参考作用：建立 proposal、spec、design、tasks 的变更骨架。
  - 约束：change 命名和能力边界必须清晰。
- `openspec-ff-change`
  - 路径：`.agents/skills/openspec-ff-change/SKILL.md`
  - 用途：快速创建实现前所需的 OpenSpec artifacts。
  - 触发时机：用户希望快速生成完整变更材料而不逐步确认时使用。
  - 参考作用：提高规范准备效率。
  - 约束：仍需保证 artifacts 之间一致并通过 OpenSpec 校验。
- `openspec-apply-change`
  - 路径：`.agents/skills/openspec-apply-change/SKILL.md`
  - 用途：实施 OpenSpec 变更中的 tasks。
  - 触发时机：用户要求开始或继续实现某个 OpenSpec change 时使用。
  - 参考作用：把 proposal/design/tasks 转成实际代码变更和验证。
  - 约束：必须按 tasks.md 推进并及时更新任务进度。
- `openspec-archive-change`
  - 路径：`.agents/skills/openspec-archive-change/SKILL.md`
  - 用途：归档已完成的 OpenSpec change。
  - 触发时机：实现完成、验证通过且用户要求归档时使用。
  - 参考作用：同步规范并收尾变更目录。
  - 约束：未完成或未验证的变更不得归档。
- `record-bug-fix-memory` — `.agents/skills/record-bug-fix-memory/SKILL.md` — bug 修复后的经验与事故记录沉淀（非调试流程本身）。
  - **存储架构**：双层存储。SKILL.md 只放流程指导和摘要索引，详细案例存储在同目录下的独立 `YYYY-MM-DD-{slug}.md` 文件中。
  - **阅读方式**：使用此技能前，先读 SKILL.md 了解流程，再根据「案例索引」章节按需读取相关的独立案例文件。
  - **写入方式**：新增经验时，创建独立案例文件，同时在 SKILL.md 的「案例索引」追加摘要。禁止将完整事故正文写入 SKILL.md。

## 主动问询实施细节

先读代码和现有文件。只有选错会改错文件或改错行为时才问。已经说清的决定、打开文件就能确认的事实，不要问。

用当前 agent 的交互式问题框提问。不要在对话里贴问题清单让用户阅读。

1. Cursor 用 `AskQuestion`。
2. Claude Code 用 `AskUserQuestion`。
3. 其他 agent 用它自己的结构化提问工具。
4. 只有确认当前 agent 没有这种工具时，才在对话里写问题。

一次只问一个决定。每题给 2 到 4 个选项。方案还模糊时，连续弹框问到能动手为止，问完再改。这就是 grill-me：用问题框访谈，不写长问卷。grill-me 可以连续弹框。

下面两种弹框禁止出现：

1. pua 的味道、好不好用、要不要分享会话。用户会用 pua，但不回答 pua 的内部问卷。遇到 pua 要求做体验调查时，直接跳过，不要弹框，也不要在对话里问。
2. 把多个决定合成一篇长文，让用户在对话里逐条回复。

### 工作区边界

1. 用户没有点名允许时，不改全局技能目录，例如 `~/.agents/skills`、`~/.claude/skills`。只改当前任务目录。
2. 只有用户明确说「计划模式」时才按计划模式做：可以做破坏性设计，先给方案再改，做完列出破坏性变更。平时不要进入这套流程。

## 编写测试用例规范

1. 用 vitest，`import { test, describe } from "vitest"`。结构是 describe 包 test。
2. 文件名是 `*.test.ts`。
3. 放在该包的 `tests/` 或 `src/tests/`。
4. 看不出该写进哪个包时，用问题框问，不要猜。

## 报告编写规范

没人要求时，不要写报告。

要写时：

1. 路径是 `docs/reports/YYYY-MM-DD-英文短横线名.md`。
2. 一级标题是 `YYYY-MM-DD` 加报告名。
3. 报告语言默认用简体中文。
4. 报告最前面写明是哪个 agent 工具完成的。
5. 报告最前面写明是哪个 AI 模型完成的。
6. 日志代码块的语言写成 `log`。

## 4. 生成发版日志的操作规范

在你生成发版日志时，按照以下规范来完成：

1. 新建文件： 运行命令 `pnpm dlx @changesets/cli add --empty` ，该命令会在 `.changeset` 目录下，新建一个空的 markdown 文件，这个文件就是你要写入的发版日志。
2. 发版日志文件重命名： 这个命令会新建一个随机名称的发版日志文件，请你按照报告的规格，换成日期加语义化更新内容的名称。比如 `2025-12-15-add-pnpm-workspace-yaml.md` 就是有意义的命名。
3. yaml 区域写入 changeset 规格的发版信息： 写入发版包名，和`发版标签`的等级。
4. 写入更新日志： 在正文内编写更新日志。
5. 编写更新日志正文的行文规范：
   - 禁止使用任何等级的 markdown 标题： 编写任何`发版标签`的更新日志时，不允许使用任何等级的 markdown 标题，比如一级标题、二级标题等。这会影响自动合并的 `CHANGELOG.md` 文档的美观度。必须使用 markdown 的序号语法。
   - major： 详细，清晰。说明清楚 major 版本的重大变更。
   - minor： 用有序序号，简明扼要的说明清楚更新日志即可。
   - patch： 用有序序号，简明扼要的说明清楚更新日志即可。

### 术语说明

在我和你沟通时，我会使用以下术语，便于你理解。

#### 发版日志相关术语

- `生成更新日志` ： 指的是在 `.changeset` 目录内，编写面向 changeset 的更新日志文件。其`发版标签`分为 `major` `minor` `patch` 这三个档次。如果我在要求你生成更新日志时，没有说明清楚`发版标签`具体发版到那个等级，请及时询问我。要求我给你说明清楚。
- `生成发版日志` ： `生成更新日志` 的别名，是同一个意思。

## 6. 终端操作注意事项（防卡住）

在 Windows PowerShell 环境下执行终端命令时，必须遵循以下规则，避免命令卡住浪费时间：

### 6.1. 避免超长单行命令

命令行参数过多（超过 200 字符）时，PowerShell 可能会挂起无响应。

- **拆分命令**：每次传入 2~3 个文件路径，不要一次传入 5 个以上。
- **使用通配符**：优先用 `git add scripts/.../src/*.ts` 替代逐个列举文件路径。

### 6.2. 优先使用 `pnpm run` 而非 `npx`

`npx` 在 Windows 上被终止时，会触发 `Terminate batch job (Y/N)?` 交互提示导致卡住。

- **优先使用** `pnpm run build` 替代 `npx tsdown`。
- **优先使用** `pnpm run test` 替代 `npx vitest run`。

### 6.3. 及时止损，不要反复轮询

当命令可能卡住时：

1. 第 1 次状态检查等待 10~15 秒。
2. 如果无输出且仍在运行 → **立即终止**，用新命令重试。
3. **不要超过 2 次**状态检查仍无进展还继续等待。

### 6.4. 合理的等待超时设置

|         命令类型         | 建议等待时长 |
| :----------------------: | :----------: |
| `git add / status / log` |   5~10 秒    |
|       `git commit`       |    10 秒     |
| `pnpm run build / test`  |    30 秒     |
|      `pnpm install`      |    60 秒     |

## 7. 简单任务的高效执行原则

当用户交代的任务范围明确清晰时，必须**直接行动**，禁止进行不必要的大范围侦察。对于明显简单、直接、可在几步内完成的任务，请避免过度工程化。

### 7.1. 不要创建任务列表

简单任务不需要任务管理。只有当任务满足以下条件时才使用任务列表：

- 3 个或以上独立步骤
- 需要多轮决策
- 涉及多个文件或模块
- 用户明确要求跟踪进度

### 7.2. 不要写报告

除非用户明确要求，否则不要为简单任务生成报告、总结文档或变更说明。

### 7.3. 不要过度确认

在信息充足时直接执行，不要反复询问用户已经明确的内容。

### 7.4. 判断任务规模，选择正确的行动姿态

| 任务信号                         | 正确行动               |
| :------------------------------- | :--------------------- |
| 用户通过 `@文件` 明确了操作范围  | 直接读该文件，立即动手 |
| 用户说"帮我改这个"、"写个日志"   | 行动优先，缺什么补什么 |
| 用户涉及多包架构改动、新功能设计 | 先侦察，再行动         |

**核心原则**：用户提供的上下文（@文件引用、对话内容、当前打开文件）就是最直接的线索，优先使用，不要用命令重新发现已知信息。

### 7.5. 完整命令型简单任务优先级

当用户已经给出完整 `skills add ... --skill ... -g -y -a ...`、`npx skills add ...` 等可执行命令时，优先级是：用户明确命令 > 简单任务短路 > skill 触发 > 历史记忆/事故经验。首个实质动作应是执行原命令，或在存在明显语义风险时按用户语义确认原命令；失败后再按错误类型分流。

历史事故和 skill 只用于风险提示、失败分流和后置验证，不能抢占当前命令，也不能把安装命令提前扩展成同步、发布、fallback、agent team 或长计划。

### 7.6. 禁止行为清单

以下行为在**简单任务**（单文件改动、写 changeset、写提交信息等）中是被禁止的：

- 禁止连续执行超过 3 次 `git log` 来"了解全貌"
- 禁止在明确知道目标文件的情况下，仍去扫描整个项目目录
- 禁止把"读遍所有相关文档"当作行动前置条件
- 禁止在用户已给出 @文件 的情况下，用命令重新搜索文件位置

### 7.7. 立即响应纠偏

当用户发出以下信号时，必须**立即停止对当前路径的死磕**，回归最小行动路径：

- "太复杂了"
- "不要反复查询"
- "直接做就行"
- "按要求做即可"
- "不对"
- "不是"
- "换种方式"

正确反应：停止当前侦察行为 → 明确当前已知信息 → 直接执行最核心的操作步骤。

### 7.8. 标准执行路径

| 用户请求      | 直接执行       |
| :------------ | :------------- |
| 安装依赖      | `pnpm install` |
| 运行测试      | `pnpm test`    |
| 格式化代码    | `pnpm format`  |
| 查看 git 状态 | `git status`   |

以"为某文件修改编写更新日志"为例，正确路径只有 3 步：

1. 读目标文件，理解改了什么
2. 执行 `pnpm dlx @changesets/cli add --empty`，重命名文件，写入内容
3. 提交

不需要查 git log，不需要扫描全部 tags，不需要对比所有包的版本号。

## 9. 使用 superpower 技能的个人偏好

本章节记录用户使用 superpower 系列技能时的固定个人偏好。执行 `brainstorming`、`writing-plans`、`executing-plans` 等 superpower 工作流时，优先遵循这些偏好；除非用户在当前对话中明确要求例外，不要自行改成其他默认流程。

### 9.1. superpower 产物必须使用中文

使用 `brainstorming` 技能生成的 `docs\superpowers\specs` 规格规划文件，以及 `docs\superpowers\plans` 计划执行清单文件，必须使用简体中文编写。

具体要求如下：

- 规格文件的标题、正文、方案说明、取舍分析、验收标准和风险说明必须使用简体中文。
- 计划文件的阶段划分、任务清单、执行步骤、验证方式和完成状态必须使用简体中文。
- 尤其是 plan 执行任务清单，不要写成英文任务项。
- 只有技能名、文件路径、命令、分支名、包名、API 名称等必要技术标识可以保留英文。
- 如果 superpower 技能自带示例是英文，也要在落地到本项目的 Markdown 文件时改写为中文表达。

这条偏好用于纠正 superpower 技能在实际执行中偶尔生成英文 Markdown 的问题。项目级 AI 记忆文件中必须明确强调：由 superpower 技能生成的规格文件和计划文件，特别是 plan 任务清单文件，必须是中文内容。

### 9.2. superpower 产物不要擅自标记完成

使用 `brainstorming`、`writing-plans`、`executing-plans` 等 superpower 工作流生成 `docs\superpowers\specs` 或 `docs\superpowers\plans` 文档时，禁止在文档顶部或正文中擅自添加 `<!-- 已完成 -->`、`已完成`、`完成` 等状态标记。

只有当对应任务已经真实实施、验证完成，并且用户明确认可该阶段已经完成时，才能记录完成状态。用户只是认可方案或 spec，不代表实施任务已经完成；不能用 “已完成” 误导后续查找和判断。

### 9.3. superpower 流程不要擅自 git commit

使用 superpower 技能时，即使技能文档写有“写完设计文档并 commit”之类默认流程，也不能擅自执行 `git commit`。提交会影响用户查找文件和管理工作区，必须等用户在当前对话中明确要求 “提交” “git commit” 或给出等价授权后才能提交。

如果技能默认流程与用户当前偏好冲突，以用户当前偏好为准：只写文件、说明状态、等待用户决定是否提交。需要提交时，也必须只暂存本轮会话明确涉及的文件，不要把无关 dirty 文件纳入。

### 9.4. executing-plans 不默认使用 git worktree

使用 `executing-plans` 技能执行任务时，不要默认创建或切换到 git worktree。用户不喜欢默认的 git worktree 执行方式。

分支使用规则如下：

- 当前 AI 代理在哪个分支内工作，就优先在当前分支内开始执行任务。
- 如果当前分支是 `dev`，直接在 `dev` 分支完成开发、测试和文档编写。
- 如果当前分支是 `main`，先检查是否存在 `dev` 分支；如果存在，优先切换到 `dev` 分支再完成开发与编写。
- 如果当前分支是 `main` 且不存在 `dev` 分支，不要自行创建 worktree；先向用户确认是在 `main` 继续，还是创建或切换到其他开发分支。
- 只有当用户明确要求隔离工作区、并行分支开发或使用 worktree 时，才采用 git worktree 流程。

切换分支前必须先检查工作区状态。若存在未提交修改，先判断这些修改是否会影响切换；不要覆盖、丢弃或回滚用户已有改动。

## 文档读取策略

初始化或更新项目内的 AI 记忆文档时，先看结构，再读要用的那一节。

1. 第一次只读目录和标题。Markdown 先执行 `grep "^##" 文件`，不要先读全文。
2. 用 `offset` / `limit` 只读相关章节。其他章节不要装进上下文。
3. JSON、YAML、TOML 先看顶层键、数组项和相关字段，再按字段读。不要为了一个字段读完全文。
4. 改文档用 `Edit` 做定点替换或插入。不要先 `Read` 全文再整篇 `Write`。
5. 改完只复读改过的位置，并对一下差异，确认没有误改、漏改或破坏原有格式。

## 11. Memorix 记忆治理

- 高频场景优先使用 `use-memorix` 技能：记忆读写、会话交接、归档、健康检查、黄金集与检索捕获都从它进入。
- 读自动、写确认：`context` / `search` / `detail` 等只读操作直接执行；`store`、`resolve`、session 的开始与结束、handoff 都先展示摘要再确认。
- 归档必须有官方 archive-candidate 或明确后继替代关系；先快照或预演，再取得授权，优先标记 archived，不做物理删除。
- 项目黄金集使用相对路径 `.memorix/golden-set/`：`README.md` 与 `cases.json` 纳入版本控制，`.local/` 保持 ignored。
- 不把 `MEMORIX_DATA_DIR` 指向项目 `.memorix/`；`.memorix/hooks.json` 必须保留，不忽略、不删除。
- common 联邦入口用 GitHub repository identity（`owner/repository`）描述，不写本机物理路径。
- 详细命令、算法与版本统一指向 `use-memorix` 技能，本节省略正文，不复制实现细节。

## 12. 对话沟通术语表

在我和你沟通时，我会使用以下术语，便于你理解。

在任何沟通下，这些术语都生效。

### 12.1. 核心开发技能 （Core Development Skills）

- `code-style` ： `.agents/skills/code-style/SKILL.md` `代码风格技能` ，用于说明代码编写规范的技能。
- `fix-type-error` ：`.agents/skills/fix-type-error/SKILL.md` `修复类型报错技能` ，专门用于修复 TypeScript 类型错误。

- `type-project-organization` ：`.agents/skills/type-project-organization/SKILL.md` `类型项目组织规范技能` ，规范类型项目代码组织方式、导出语法和文件结构。

- `project-schema-registry` ：`.agents/skills/project-schema-registry/SKILL.md` `项目Schema注册表技能` ，数据库表定义、Zod Runtime Schemas 和 TypeScript 类型定义的**唯一事实来源（Single Source of Truth）**。包含 Trinity Pattern 编写标准和 12 个业务领域的 schema references。

- `frontend-development` ：`.agents/skills/frontend-development/SKILL.md` `前端开发技能` ，包含 Vue 3 组件开发、Form 表单标准、List 页面模式和数据获取（API Hooks）的标准模式。

- `nitro-api-development` ：`.agents/skills/nitro-api-development/SKILL.md` `Nitro API 开发技能` ，包含基于 Nitro v3、H3 和 Drizzle ORM 的后端接口开发标准。支持 Mock 模式和 Neon+Drizzle 生产模式。

- `project-migration-guide` ：`.agents/skills/project-migration-guide/SKILL.md` `项目迁移指南技能` ，包含影子迁移（Shadow Migration）等大规模架构迁移策略。

### 12.2. 数据库与质量保障技能 （Database & Quality）

- `schema-and-seed-guardian` ：`.agents/skills/schema-and-seed-guardian/SKILL.md` `Schema与Seed守护技能` ，用于预防数据库 schema 定义和 Direct Seed 模块编写中的常见错误。

- `schema-change-sync` ：`.agents/skills/schema-change-sync/SKILL.md` `Schema变更同步技能` ，数据库 Schema 变更时的全项目同步检查清单。当修改表字段或新增数据库表时，确保类型项目、数据库迁移、后端接口、前端页面、种子数据和技能文档全部同步更新。

- `neon-db-query` ：`.agents/skills/neon-db-query/SKILL.md` `Neon数据库表查询技能` ，提供项目所有数据库表的完整清单，并支持使用 Neon MCP 批量查询表结构信息，用于数据库结构查询和开发参考。

- `neon-postgres-zh` ：`.agents/skills/neon-postgres-zh/SKILL.md` `Neon Postgres中文文档技能` ，Neon PostgreSQL 数据库服务的中文参考文档。

### 12.3. OpenSpec 工作流技能 （OpenSpec Workflow Skills）

OpenSpec 是本项目用于管理大型任务和变更的工作流系统。以下技能用于支持 OpenSpec 工作流：

- `openspec-new-change` ：创建新的 OpenSpec 变更任务
- `openspec-ff-change` ：快速通过创建所有 artifacts
- `openspec-apply-change` ：实施 OpenSpec 变更中的 tasks
- `openspec-archive-change` ：归档已完成的变更

### 12.4. 项目术语 （Project Terminology）

- 后台项目： 即 `apps\admin\package.json` 项目。又称为 `admin后台项目` 。
- 类型项目： 即 `apps\type\package.json` 项目。又称为 `type类型项目` 。
  - **[NEW DEFINITION]** 正在转型为**同构运行时库 （Isomorphic Runtime Library）**，包含 Zod Schemas + Drizzle Tables，提供运行时验证。前后端共享同一 Schema 作为 Single Source of Truth。
- 客户端代码： 即 后台项目的 `apps\admin\src` 目录，这个目录下的全部代码，都是`客户端代码`。
- 服务端代码： 即 后台项目的 `apps\admin\server` 目录，这个目录下的全部代码，都是`服务端代码`。

- `业务路径`： 即 `apps\admin\src\router\rank\rank-route-keys.ts` 文件的全部`三级路由`所体现出来的文件路径。被认定为`业务路径`。`类型项目`、`服务端代码`、`后台项目`、`客户端代码`等。都要依赖于`业务路径`来组织代码。是本项目**非常重要**的路径概念。
  - `业务路径`几乎不会新增。一旦新增了`业务路径`，都会在 `rank-route-keys.ts` 内新增。所以在你执行相关任务时，请不要凭空新建内容。一律在`业务路径`对应的目录和文件内做修改或新增。

### 12.5. 生产环境地址来源

- 生产环境地址的权威读取入口是各子项目 `package.json` 的 `homepage` 字段；不要从 Vercel 控制台截图、历史报告、旧域名或 README 中反向推断。
- admin 后台 H5：读取 `apps/admin/package.json` 的 `homepage`，当前为 `https://01s-11comm.ruan-cat.com`。
- app H5：读取 `apps/app/package.json` 的 `homepage`，当前为 `https://01s-11-app.ruan-cat.com`。
- 独立统一 Nitro API server：读取 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。
- 文档、脚本或验证流程需要引用生产地址时，必须先读取或核对对应 `homepage`；变更域名时先改 `homepage`，再同步环境变量、部署说明和验证文档。

### 12.6. Vercel 部署触发机制

> **[CRITICAL]** 本项目三个 Vercel 项目（`apps/admin`、`apps/app`、`apps/api`）的**生产部署均通过 `main` 分支 push 触发**。当 `main` 分支有新的 commit 时，GitHub Actions CI 会在 main 上运行，全部通过后 Vercel 自动部署。

**部署触发路径：**

```plain
dev 分支 push → GitHub Actions CI (dev) → rebase2main → main 分支 push → GitHub Actions CI (main) → Vercel 自动部署
```

**正确工作流（不要等待"用户手动合并"）：**

1. 在 `dev` 分支完成所有本地可验证的任务
2. 使用 `rebase2main` 技能将 dev rebase 到 main 并 push 到 origin
3. 等待 main 分支 CI 通过（此时 Vercel 自动部署）
4. 部署完成后执行生产验证任务（task1318/1319/1320 等）

**错误做法：** 告诉用户"需要您手动合并 PR 到 main"——这是愚蠢的，agent 应该主动使用 `rebase2main` 技能完成合并。

**do-long-task 长任务卡点处理：** 当长任务只剩下生产验证和 git push 相关的 BLOCKED 任务时，应该立即使用 `rebase2main` 推送到 main，而不是停下来向用户请求授权。生产环境验证依赖 main 分支部署，这是 agent 的职责而非用户的职责。

## 13. 禁止全局安装工具包

**严禁**使用 `npm install -g` 或 `pnpm add -g` 等命令进行工具的全局安装。

这会污染用户的全局环境，且导致工具版本不可控。

**正确做法：**

1.  **优先使用 npx**：例如 `npx prettier --write .`
2.  **或者使用本地开发依赖**：确保工具已添加到 `package.json` 的 `devDependencies` 中，然后通过 `pnpm exec` 或 npm scripts 运行。

## 14. 类型项目导出规范

> 详见 `type-project-organization` 技能（`.agents/skills/type-project-organization/SKILL.md`）。

> **[ARCHITECTURE TRANSFORMATION NOTICE]** `apps/type` 正在转型为**同构运行时库 （Isomorphic Runtime Library）**，包含 Zod Schemas + Drizzle Tables。Full Stack Type Transformation 完成前，本章节"禁止反复增删现有类型字段"的规则对 Schema 迁移活动豁免。

核心规则（**必须遵守**）：

1. **禁止**反复增删现有类型字段；中文字段名可改为英文，其余情况禁止重命名。
2. 始终使用 `export * from "./xxx"` 全量导出；**禁止** `export type *`。
3. **禁止**逐个罗列导出的项目（`export type { A, B, C } from "./xxx"`）。
4. 每层目录必须有 `index.ts` 统一导出所有内容（类型 + 变量）。
5. 重复导出冲突时，将公共内容移至 `apps/type/src/common/business-options.ts` 或 `business-types.ts`。

## 15. 主从代理的相关规范

### 15.1. 主代理新建子代理的类型

主代理新建的子代理**必须**是**后台运行**的子代理。

### 15.2. 主代理新建子代理的时机

什么情况下应该新建子代理？在以下的几种情况下，主代理应该及时新建子代理来完成任务：

- 大规模的代码探索与信息收集任务。
- 访问 url 获取文档信息的任务。
- 指定严格顺序的代码修改任务。
- 报告编写任务。
- 进度文件更新与编写任务。

### 15.3. 基于`业务路径`做任务划分时的子代理规范

根据 `rank-route-keys.ts` 提供的三级路由做细粒度任务划分，每个子代理只负责 **2~3 个具体三级路由**，避免单个子代理负责过多导致执行失败。

### 15.4. 主从代理`调度设计`、`职责说明`与`通信反馈`规范

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

## 16. 执行 openspec 系列长任务时的注意事项

本项目使用 openspec 来制定长任务执行规范。

### 16.1. 更新 openspec 的规范文件后应该及时运行校验命令，并根据校验反馈，使得 openspec 规范文件满足格式要求

比如你修改了 `migrate-static-data-to-nitro-query` 这款任务的规范文件后，你应该及时运行以下命令来检查文件是否满足规范：

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

更加通用的命令格式为：

```bash
openspec validate {任务名称} --strict
```

### 16.2. 执行长任务时的策略与注意事项

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

## 17. 数据库 Schema 开发规范

### 17.1. Schema 定义的唯一事实来源

**核心原则**：`apps/type/src/business/{domain}/{module}/schema.ts` 是数据库表定义的**唯一事实来源（Single Source of Truth）**。

每个 schema 文件必须导出三种产物（Trinity Pattern）：

1. **Drizzle Table** - 数据库表定义（例如 `communities`）
2. **Zod Schemas** - 运行时验证（`insertXxxSchema`, `selectXxxSchema`, `updateXxxSchema`）
3. **TypeScript Types** - 静态类型（`NewXxx`, `Xxx`, `UpdateXxx`）

**详细规范**请参考：`.agents/skills/project-schema-registry/SKILL.md`

### 17.2. Schema 文件位置规范

- **正确位置**：`apps/type/src/business/{domain}/{module}/schema.ts`
- **错误位置**：`apps/admin/server/db/schemas/` （已废弃，仅作临时过渡）

### 17.3. 数据库变更维护清单

当你在 `apps/type/src/business/` 目录内**新增、修改或删除**schema 时：

1. 你**必须**主动更新 `.agents/skills/neon-db-query/SKILL.md` 文件内的数据库表清单
2. 确保该清单与实际代码保持一致
3. 如有 schema 结构变更，schema 仍在 `apps/type` 维护，但迁移文件生成必须通过 `pnpm -F @01s-11comm/api db:generate` 执行，由 `apps/api` 的 Drizzle 配置读取 `apps/type` schema 并输出到 `apps/api/drizzle/**`；禁止再把 type 子包命令当作迁移入口。

### 17.4. Schema 编写标准

必须严格遵循**Trinity Pattern**，详见 `project-schema-registry` 技能：

- Part A：使用 `pgTable` 定义表，使用 `primaryId()` 和 `...timestamps`
- Part B：使用 `createInsertSchema`, `createSelectSchema` 创建 Zod schemas
- Part C：使用 `$inferSelect`, `$inferInsert` 推断 TypeScript 类型

### 17.5. 常见错误预防

参考 `schema-and-seed-guardian` 技能避免：

- 字段重复定义
- 外键关系冲突
- Zod schema 与 Drizzle table 不一致
- Seed 数据生成器函数（应使用字面量数组）

#### Drizzle Seed 类型绕过

- `primaryId()` 的 `defaultRandom()` 会将 `id` 排除出 `InferInsertModel`；种子数据 `.values()` 必须使用 `rows()` identity 函数（见 `server/db/seed/helpers.ts`）打破 fresh literal excess property check。
- 修改 `primaryId()` 的 default 实现方式无效——Drizzle 对任何有默认值的列都执行相同类型排除。

## 18. 开发工作流

1. 使用 pnpm 进行包管理
2. Turbo 处理构建编排
3. 基于文件的路由 - 在 src/views/中创建。vue 文件用于新页面
4. 使用 definePage（）宏进行路由配置
5. API 接口按业务模块组织
6. 遵循现有组件模式（自定义组件使用 Re\*前缀）
7. 使用组合式函数处理共享逻辑
8. 测试文件与实现文件共同定位

### 18.1. Windows 行尾配置一致性（防止幽灵 git modified）

本项目在 Windows 上必须保持四层行尾配置协同一致，缺一层就会导致文件反复出现「幽灵 modified」：

1. `.gitattributes`：`* text=auto eol=lf`
2. `.editorconfig`：`end_of_line = lf`
3. `prettier.config.mjs`：`endOfLine: "lf"`（**禁止** `"auto"`，`"auto"` 在 Windows 上会保留/引入 CRLF）
4. `.vscode/settings.json`：`"files.eol": "\n"`

遇到「git status 显示 modified 但 git diff 为空」时，按此顺序排查。详见 `.agents/skills/record-bug-fix-memory/SKILL.md` 中的 CRLF 幽灵修改事故记录。

### 18.2. `apps/app` H5 生产构建的 Windows ESM loader 约束

`apps/app` 的 `build:h5:prod` 不要改回裸 `uni build --mode production`。Windows + 较新 Node ESM loader 下，uni-app/Vite 构建链可能动态导入 `D:\...` 这类绝对路径，Node 会把盘符识别成不支持的 URL scheme。

当前决策是通过 `node --import ./scripts/register-window-path-loader.js` 启动 uni 构建，并且注册脚本只在 Windows 下用 `node:module.register()` 注册 `window-path-loader.js`；Linux/Vercel CI 不注册 loader，保持默认 ESM 解析。不要退回 `--experimental-loader`，该入口会产生 Node experimental warning，且历史上曾和 Vercel 输出目录问题混淆。

修改这条链路后至少验证 `pnpm -F @01s-11comm/app build:h5:prod` 和 `pnpm -F @01s-11comm/app build:vercel`。详细复盘见 `.agents/skills/record-bug-fix-memory/2026-07-09-app-h5-prod-windows-esm-loader.md`，决策说明见 `apps/app/README.md`。

## 19. Memorix — 自动记忆规则

1. **会话开始**：调用 `memorix_search` 加载相关历史记忆，再响应用户
2. **每次修改状态后**：调用 `memorix_store` 记录（文件修改、bug 修复、架构决策、配置变更等）
3. **会话结束**：调用 `memorix_store` 记录本次会话摘要（已完成、待续项、修改文件）
