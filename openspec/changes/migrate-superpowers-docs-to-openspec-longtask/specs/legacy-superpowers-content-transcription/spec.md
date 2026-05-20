## ADDED Requirements

### Requirement: 旧三文档语义转写完成定义

旧 Superpowers 总设计、endpoint 状态矩阵和 batch 执行计划的核心内容必须被重写为 OpenSpec 工件中的可读、可验收、可续跑语义，而不是只保留旧文件名、路径引用或一句“已迁移”。OpenSpec MUST 同时保留架构目标、阶段链、证据模型、当前接力状态、批次执行纪律、Memorix 规则、no-go 约束和后续 backlog；缺任一类核心语义时，不得把旧文档载体视为已完成迁移。

#### Scenario: 判断语义是否已转写

- **WHEN** 后续代理准备删除、归档或不再读取旧三文档
- **THEN** 必须能在 `proposal.md`、`design.md`、`specs/**/spec.md`、`tasks.md`、`agent-progress.md` 或 `agent-findings.md` 找到对应语义落点

#### Scenario: 只替换链接但没有转写内容

- **WHEN** 旧文件路径已被替换为 OpenSpec 入口，但旧文件中的阶段、批次、证据字段或当前接力事实无法在 OpenSpec 中复原
- **THEN** 必须继续补写 OpenSpec 工件，不能删除旧载体或把迁移任务标记完成

#### Scenario: 逐文档逐章节逐落点复核

- **WHEN** 后续代理执行旧三文档语义覆盖复核
- **THEN** 必须按旧总设计、旧 endpoint 状态矩阵、旧 batch 执行计划分别列出章节或等价主题，并把每个章节映射到 `specs/**/spec.md`、`tasks.md`、`agent-progress.md`、`agent-findings.md` 或 `design.md` 中的至少一个长期落点
- **AND** 任何没有落点的章节都必须记录为转写缺口，不能用“已迁移”“已删除旧文档”或旧文件名引用代替语义转写

#### Scenario: 旧文件名只能作为历史来源说明

- **WHEN** OpenSpec、稳定索引或后续报告保留 `phase7-endpoint-migration-matrix.md`、`2026-05-10-phase7-batch-migration-plan.md` 或 `2026-04-25-11comm-app-monorepo-api-migration-design.md` 文件名
- **THEN** 这些文件名只能说明历史来源、git history 或 provenance，不能作为执行入口、任务链接、长期维护对象或判断当前完成状态的依据
- **AND** 后续执行 SHALL 从 `tasks.md` 取任务，从 `specs/**/spec.md` 与 `design.md` 取要求，从 `agent-progress.md` 与 `agent-findings.md` 取 checkpoint 和风险事实

### Requirement: 旧 monorepo API 迁移总设计转写

旧总设计中的核心架构与治理内容 MUST 转写进 OpenSpec：`apps/api` 是 admin 与 app 的唯一长期 Nitro API 服务，`apps/app` 来自旧 app 快照迁入，`apps/type` 是 Schema/Zod/Drizzle/TypeScript 类型事实源，Nitro 接口不新增鉴权，`apps/admin/server`、`apps/app/server` 与旧 app 项目在退役门禁前只作为迁移来源、legacy fallback 和回滚参考保留。

#### Scenario: 复原目标架构

- **WHEN** 后续代理只读取 OpenSpec change
- **THEN** 应能复原 `apps/admin/server` 与 `apps/app/server` 两条旧 Nitro 源流合并到独立 `apps/api` 的目标架构，并能区分 admin canonical contract 与 app legacy contract

#### Scenario: 复原阶段链

- **WHEN** 后续代理解释 Phase1 到 Phase7
- **THEN** 应能从 OpenSpec 中看到 Phase1 快照迁入、Phase1.1 文档/skills/AI 记忆治理、Phase2 shadow service 与 fee/payment/report 首批纵切、Phase3 基础设施、Phase4 app legacy 扩展、Phase5 admin API/CRUD、Phase6 切流、Phase7 退役准备的阶段关系

#### Scenario: 复原治理规则

- **WHEN** 后续代理处理文档、skills、AI 记忆、动态 mock、敏感信息或字符集问题
- **THEN** 应以 OpenSpec 中的来源治理、文档价值分类、Memorix 规则、敏感信息保护和 UTF-8/LF 规则为准，而不是重新依赖旧总设计

### Requirement: 旧 endpoint 状态矩阵转写

旧 endpoint 状态矩阵中的状态账本语义 MUST 转写进 OpenSpec，包括基线口径、admin 已覆盖和剩余调度、app legacy 覆盖、P0/P1 fallback 与差集、剩余 app 模块、扫描证据快照、复核硬门槛、当前接力摘要、历史事实压缩、下一个 AI 接力规则和仍保留风险。OpenSpec 不需要逐字复制旧矩阵大表，但必须保留可继续执行和可防误判的核心字段与当前状态。

#### Scenario: 复原矩阵字段

- **WHEN** 后续代理需要判断 endpoint 状态
- **THEN** 应能从 OpenSpec 中找到 `coverageKind`、`dataSourceStatus`、`targetStatus`、`callerEvidence`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision` 和 `notes` 的含义、枚举和升级门槛

#### Scenario: 复原当前矩阵口径

- **WHEN** 后续代理继续 Phase7
- **THEN** 应能从 OpenSpec 中看到当前文档口径：`apps/api/server/routes/api/**/*.ts` 为 160 个 server route，`apps/admin/server/api/**/*.ts` 为 155 个 legacy file，admin old path exact coverage 为 155/155，admin resolver 迁移已记录完成，但生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 CRUD/交互和旧服务退役证据仍未闭环

#### Scenario: 复原下一接力点

- **WHEN** 后续代理选择下一批 admin 工作
- **THEN** 应能从 OpenSpec 中看到下一推荐切片是 `property-manage/contract-manage` 12 个普通 list endpoint 的 runtime manifest、contract 和 HTTP gate，且 upload/R2、写入、删除和 detail 必须排除并单独评审

### Requirement: 旧 batch 执行计划转写

旧 batch 执行计划中的执行组织语义 MUST 转写进 OpenSpec，包括强约束、no-go、当前统计口径、Agent Team 角色、批次拆分规则、每批固定流程、Batch0 到 Batch8 的目标、每批完成定义、复核检查清单、历史 Batch7a 记录、参考文档、禁止误判清单、当前接力摘要和 Neon main 接力口径。

#### Scenario: 复原 Agent Team 模型

- **WHEN** 后续代理启动大批次实现
- **THEN** 应能从 OpenSpec 中看到主代理、探索子代理、编辑子代理、复核子代理的职责，以及每批需要先声明目标、endpoint、owner 文件、验证命令、证据需求和不触碰范围

#### Scenario: 复原 Batch0 到 Batch8

- **WHEN** 后续代理需要把旧计划批次映射为当前 backlog
- **THEN** 应能从 OpenSpec 中识别 Batch0 为 endpoint 矩阵与 P0 gate，Batch1 为 `/callComponent/**` fallback 清理，Batch2 为 floor DB 化，Batch3 为 repair DB 接入，Batch4 为 fee/report 只读，Batch5 为 fee guarded writes，Batch6 为 admin P1，Batch7 为 admin P2/P3，Batch8 为其他 app legacy 业务域

#### Scenario: 复原每批完成定义

- **WHEN** 后续代理准备勾选一个批次或 endpoint 任务
- **THEN** 必须检查来源扫描、实现或阻断原因、Vitest/contract/HTTP gate、Chrome MCP 或替代证据、DB/写入边界、`tasks.md`、`agent-progress.md`、`agent-findings.md` 和 Memorix 是否同步完成

### Requirement: Neon main 与写入闭环转写

旧总设计和旧计划中的 Neon main DB readiness 与写入完整性流程 MUST 转写进 OpenSpec。Phase7 不使用 Neon 测试分支，不使用测试分支连接串；只有 `RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY` 时，才能记录 DB readiness 完成。写入口必须具备 `PHASE7_E2E_*` 或 `phase7RunId`、guard-before、write-window、controlled write、read-back、rollback/cleanup、residual check 和 guard-after。

#### Scenario: 复原 DB_READY 流程

- **WHEN** 后续代理执行 DB readiness
- **THEN** 必须按 OpenSpec 中的服务存活、DB deep readiness、只读基线、默认 guard、写入窗口、controlled write、read-back、rollback、residual check、guard restored 顺序执行

#### Scenario: 复原写入证据模板

- **WHEN** 后续代理准备升级写入口
- **THEN** 必须能在 OpenSpec 中找到 endpoint、phase7RunId、databaseTarget、connectionEvidence、healthEvidence、readyEvidence、baselineEvidence、guardBefore、writeWindow、writeRequest、writeResponse、readBackMethod、readBackResult、rollbackMethod、rollbackResult、residualCheck、guardAfter、operator、timestamp、artifactPath 的证据模板

### Requirement: 历史证据与当前事实边界转写

旧三文档中的历史验证流水 MUST 转写为带环境、工具、artifactPath 和剩余缺口的历史证据索引。OpenSpec 不得把历史 Chrome MCP、本地 HTTP gate、local DB_READY、hook tests、CDP fallback 或批量提交记录自动升级为当前生产证据、DB-ready 证据或旧服务退役依据。

#### Scenario: 引用 2026-05-16 或 2026-05-18 证据

- **WHEN** 后续代理引用 final batch 44/44、shadow-off/fallback、report-manage 页面 Network、App repair H5 Network 或 CRUD HTTP gate
- **THEN** 必须标注它是 local-dev、production、Chrome MCP、CDP fallback、HTTP gate、hook test 或 fake DB，并列出仍缺的生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或独立复核

#### Scenario: 历史完成记录与当前扫描冲突

- **WHEN** 历史矩阵、旧计划、Memorix 或 git history 的数字与当前 working tree 不一致
- **THEN** 必须把历史数字视为 dated snapshot，先 fresh scan，再更新 `agent-progress.md` 与 `agent-findings.md`

### Requirement: 旧文档删除前语义覆盖闸门

删除三份旧 Superpowers 文件前，OpenSpec MUST 通过语义覆盖闸门：旧总设计的架构与治理、旧矩阵的状态账本、旧计划的批次执行模型、当前接力事实、Memorix/证据索引、no-go 和受保护路径均已转写；外部执行入口已改到 OpenSpec canonical；OpenSpec strict 校验、旧路径引用扫描和 diff 检查通过；删除动作不得被解释为 runtime 旧服务退役。

#### Scenario: 删除旧三文档

- **WHEN** 用户要求在核心内容转写后删除旧三文档
- **THEN** 删除前必须完成语义转写、引用替换和校验；删除后必须更新 `agent-progress.md`、`agent-findings.md`、稳定索引和 Memorix

#### Scenario: 删除后继续 Phase7

- **WHEN** 旧三文档已经不存在
- **THEN** 后续代理必须从 `docs/superpowers/phase7-openspec-migration-index.md` 与 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/` 接力，且 `tasks.md` 仍保持 Nitro 合并和退役门禁未完成项
