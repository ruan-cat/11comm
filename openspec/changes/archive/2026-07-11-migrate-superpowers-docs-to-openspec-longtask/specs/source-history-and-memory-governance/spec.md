## ADDED Requirements

### Requirement: 来源承接与临时审计退场

三份旧 Superpowers 文档、它们的 git 历史和 Memorix 接力记录必须有明确 OpenSpec canonical 落点。OpenSpec MUST 将长期信息承接到 `design.md`、`tasks.md`、`agent-findings.md`、`agent-progress.md` 与相关 `specs/**/spec.md`；临时来源覆盖审计完成后不得作为长期任务源、持续维护矩阵或后续执行入口。

#### Scenario: 逐段核对旧文档

- **WHEN** 后续代理准备判断旧文档是否可删除
- **THEN** 必须先核对 `design.md`、`tasks.md`、`agent-findings.md`、`agent-progress.md` 和相关 specs 中目标架构、Phase1-7、P0-P8、矩阵字段、当前接力、Memorix、Neon main、no-go 是否都有 OpenSpec 落点

#### Scenario: 发现未迁移章节

- **WHEN** 旧文档章节无法在 OpenSpec specs、`design.md`、`tasks.md`、`agent-progress.md` 或 `agent-findings.md` 中找到落点
- **THEN** 旧文档不得删除，必须先补充 OpenSpec 工件或明确记录不迁移原因

### Requirement: Git 历史溯源

OpenSpec 必须记录三份旧文档的关键 git 历史，包括创建提交、重大重写、Neon main 规则引入、Chrome MCP/DB_READY 证据记录、当前接力更新和用户恢复后的重新审计结论。关键状态不得只保留为无来源的当前口径。 本 requirement MUST 作为后续执行、来源追溯和旧文档删除评审的强制约束。

#### Scenario: 追溯状态来源

- **WHEN** 后续代理看到 endpoint 数字、batch 状态、DB_READY 结论或 no-go 结论
- **THEN** 必须能在 `agent-findings.md`、`design.md` 或 git history 表中找到对应提交、日期或旧文档来源

#### Scenario: 历史提交与当前状态冲突

- **WHEN** git 历史中的旧结论与当前 working tree 或恢复后的旧文档不一致
- **THEN** 必须把旧结论标记为 dated snapshot，并以 fresh scan 和当前 OpenSpec 任务状态为准

### Requirement: Memorix 接力索引

Phase7 后续会话必须先搜索 Memorix，并在 OpenSpec 中保留关键观察编号作为检索线索。缺少 Memorix MCP 时必须记录为环境缺口，不能推断项目没有历史记录。 本 requirement MUST 作为后续执行、来源追溯和旧文档删除评审的强制约束。

#### Scenario: 会话开始

- **WHEN** 后续代理开始 Phase7、OpenSpec、Nitro 合并、Neon readiness 或旧文档清理任务
- **THEN** 必须执行项目范围 Memorix 搜索，并把 relevant obs 编号或搜索失败原因写入 `agent-progress.md` 或 `agent-findings.md`

#### Scenario: 状态修改完成

- **WHEN** 后续代理修改了 OpenSpec 状态、证据结论、任务 checkbox 或架构决策
- **THEN** 必须写入 Memorix，记录变更摘要、文件、验证命令和剩余风险

### Requirement: 当前事实与历史事实分离

OpenSpec 必须区分 current handoff baseline、historical snapshot、local evidence、production evidence 和 git-derived fact。历史页面 200、local `DB_READY`、hook tests、CDP fallback 或旧批次完成记录不得自动升级为当前生产完成或旧服务退役证据。 本 requirement MUST 作为后续执行、来源追溯和旧文档删除评审的强制约束。

#### Scenario: 复用旧证据

- **WHEN** 后续代理引用 2026-05-04、2026-05-16、2026-05-18 或 2026-05-19 的历史证据
- **THEN** 必须写清楚证据环境、工具、artifactPath、适用 endpoint 和剩余缺口，不得跨端、跨环境或跨证据层级升级状态

#### Scenario: 当前执行前

- **WHEN** 后续代理要继续实现或验证 endpoint
- **THEN** 必须 fresh scan 当前 working tree 与调用端，不能只根据旧三文档或 Memorix 数字执行

### Requirement: 文档、skills 与 AI 记忆治理

旧总设计 Phase1.1 中的文档迁移治理仍有效：Markdown 价值分类、重复文档处理、skills 与 AI 记忆文档、敏感信息检查、字符集和文本完整性保护、迁移后索引、动态 mock 文档同步必须作为来源迁移规则保留。 本 requirement MUST 作为后续执行、来源追溯和旧文档删除评审的强制约束。

#### Scenario: 迁移或删除历史文档

- **WHEN** 后续代理准备迁移、归档或删除历史 Markdown
- **THEN** 必须先判断该文档是执行源、历史证据、AI 记忆、skill 说明、敏感信息风险还是可压缩重复文档，并在 OpenSpec 或稳定索引中保留必要入口

#### Scenario: 处理字符集和敏感信息

- **WHEN** 后续代理改写旧文档、索引或 OpenSpec 迁移文件
- **THEN** 必须保护中文内容、路径、代码块和表格完整性，并避免把真实 Neon 连接串、密钥、R2 凭据或生产敏感值写入文档

### Requirement: Phase1.1 Markdown 细粒度治理

Phase1.1 的 Markdown 治理 MUST 保留旧总设计的细粒度规则：迁入当日重新生成 Markdown 基线；默认保留项目自有 Markdown；默认排除 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**` 和构建/依赖产物；按 P0 迁移关键上下文、P1 app 业务与历史经验、P2 模板/第三方参考、P3 重复或过时候选分类；精确重复用哈希或内容比对，语义重叠只记录 canonical 与历史来源关系。

#### Scenario: 迁移 app 文档

- **WHEN** 后续代理迁移、压缩或删除 `apps/app` 历史 Markdown
- **THEN** 必须先按 P0-P3 分类和重复关系记录处理结论，不能凭路径或文件名直接删除

#### Scenario: 处理 app-local OpenSpec/OPSX 副本

- **WHEN** 发现 app-local OpenSpec commands/skills 或多工具重复副本
- **THEN** 必须以根 OpenSpec commands/skills 为 canonical，app 专属非 OpenSpec skills 先保留并进入价值/冲突清单

### Requirement: 动态 mock 增量文档同步

旧总设计 Phase1.1 的动态 mock 文档同步规则 MUST 保留：当旧 app mock、`apps/app/server/modules/**/endpoints.ts`、`apps/api` legacy compat handler、in-memory 数据、fallback 行为或响应字段发生新增、删除、重命名、字段语义变化时，必须增量同步到 OpenSpec canonical，而不是覆盖旧事实或冒充生产 DB。同步记录必须说明触发条件、旧来源、当前实现、响应契约差异、验证方式和证据边界。

#### Scenario: mock 或 compat 行为发生变化

- **WHEN** 后续代理修改或发现动态 mock、in-memory compat、legacy fallback、app endpoint 响应字段、默认值、分页 envelope 或错误码语义变化
- **THEN** 必须在相关 spec、`agent-progress.md` 或 `agent-findings.md` 中记录变更来源、旧事实、当前事实、受影响 endpoint、验证命令或 artifact、是否需要重新采集 H5/HTTP evidence

#### Scenario: 同步 mock 文档边界

- **WHEN** mock 增量文档被写入 OpenSpec
- **THEN** 不得删除或覆盖旧事实来源，不得把 mock/in-memory/fallback 写成 Neon main `DB_READY`、真实 repository 样本或生产数据能力；如只验证了本地 mock，必须标记为 local/historical/mock evidence

### Requirement: AI 记忆提升条件

App 历史 AI 记忆、skills 和文档经验提升到根级规则前 MUST 同时满足：仍然真实、可复现、适用于 admin/app/api/type 至少两个长期模块、与根级规范不冲突。只属于 app 子项目、旧工具、一次性 prompt、废弃目录或外部客户端专属规则的内容必须保留为历史证据或 app 作用域规则，不能提升为 monorepo 长期规范。

#### Scenario: 提升一条 app 经验

- **WHEN** 后续代理准备把 app 历史经验写入根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`、skills 或 OpenSpec
- **THEN** 必须记录来源路径、原始主题、适用范围、冲突状态和验证方式

### Requirement: 单一汇总报告优先

Phase7 和统一 Nitro API 迁移默认 MUST 使用 OpenSpec canonical 与单一汇总入口沉淀上下文，不为每个子代理、每个阶段或每个检查点长期维护碎片化报告。约 3500 行以内只是一条可读性软建议，不是第二任务源、硬性篇幅 KPI 或复制旧长文的理由；不得为了凑长度把旧 Superpowers 长文原样搬运到新报告。只有用户明确要求、外部工具强制要求或单文件已经明显影响阅读/检索/编辑时，才允许拆分报告；拆分前必须说明理由，并把有效事实合并回 OpenSpec canonical。

#### Scenario: 子代理生成临时报告

- **WHEN** 子代理为了反馈探索、编辑或复核结果创建临时报告
- **THEN** 主代理必须把有效事实合并到 `tasks.md`、`agent-progress.md`、`agent-findings.md` 或相关 specs，临时报告不得成为后续执行入口

### Requirement: 旧 app 项目身份与记忆保全

旧 app 源目录 `D:\code\ruan-cat\01s-11comm-app`、旧项目身份和相关 Memorix 线索必须作为只读历史来源长期保留。OpenSpec 文档迁移不得让后续代理误以为旧 app 历史已经可以丢弃。 本 requirement MUST 作为后续执行、来源追溯和旧文档删除评审的强制约束。

#### Scenario: 核对 app legacy 行为

- **WHEN** 后续代理需要核对旧 app endpoint、mock 数据、H5 调用或历史设计
- **THEN** 可以只读引用旧 app 源目录和 Memorix 线索，但不得移动、清空、归档或删除旧 app 项目

#### Scenario: 解释 app legacy 迁移状态

- **WHEN** 后续代理描述 app legacy stream
- **THEN** 必须把旧 app 源目录、monorepo `apps/app`、独立 `apps/api` legacy adapter 和 app H5 browser evidence 分开记录

### Requirement: 证据 artifact 索引

旧计划和旧矩阵中出现的关键证据 artifact 路径必须进入 OpenSpec canonical 发现记录、设计说明或任务上下文，尤其是 Chrome MCP、HTTP gate、shadow-off/fallback、App repair H5、CRUD gate 和 `.tmp/phase7-agent-reports`。 本 requirement MUST 作为后续执行、来源追溯和旧文档删除评审的强制约束。

#### Scenario: 引用旧 artifact

- **WHEN** 后续代理引用 `.tmp/phase7-dev-browser/**` 或 `.tmp/phase7-agent-reports/**` 的历史证据
- **THEN** 必须在 `agent-findings.md` 或对应任务/进度记录中说明该 artifact 是 local、production、Chrome MCP、CDP fallback、HTTP gate、hook test 还是 reviewer report

#### Scenario: artifact 缺失或过期

- **WHEN** 旧 artifact 不存在、不可读或与当前代码状态不匹配
- **THEN** 对应证据必须降级为 historical pointer，并安排重新采集或在 `agent-findings.md` 记录阻断

### Requirement: 执行记录中文治理

OpenSpec 的任务描述、检查点、执行记录和发现记录 MUST 以中文为主。`tasks.md`、`agent-progress.md` 与 `agent-findings.md` 不得新增纯英文行；英文术语、命令、路径、状态码、接口名或 OpenSpec 关键字必须嵌入中文语境，同一行应说明中文动作、结论或边界。该 requirement MUST 作为后续接力、复核和日志验收的强制约束。

#### Scenario: 记录任务、检查点或发现

- **WHEN** 后续代理写入 `tasks.md`、`agent-progress.md` 或 `agent-findings.md`
- **THEN** 每条新增记录必须包含中文语义主体；如需保留 `DB_READY`、`No-go`、`runtime manifest`、命令或 artifact path，必须在同一行或同一记录中给出中文解释，不得整行纯英文

#### Scenario: 运行语言门禁

- **WHEN** 后续代理完成文档、任务或日志变更并准备接力
- **THEN** 必须对本轮新增行执行语言门禁：含英文字母但不含中文字符的新增行判定为违规；英文字母明显压过中文说明的新增行判定为混合语言候选并进入人工复核，复核结论必须写入 `agent-progress.md` 或 `agent-findings.md`

#### Scenario: 发现语言违规

- **WHEN** 语言门禁发现纯英文行、英文占满执行记录、或历史记录被复制成无中文解释的混合语言日志
- **THEN** 后续代理必须先改写为中文主导记录；若因保留原始错误输出、命令或 artifact 摘要确需保留英文，必须在 `agent-findings.md` 记录原因、边界和后续处理，不得默默继续推进 runtime、DB_READY、退役或任务勾选
