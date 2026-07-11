# db-readiness-and-write-verification Specification

## Purpose

TBD - created by archiving change migrate-superpowers-docs-to-openspec-longtask. Update Purpose after archive.

## Requirements

### Requirement: Neon main DB_READY 验收

Phase7 DB readiness 必须使用 Neon main 分支连接串完成。不得默认使用 Neon 测试分支，不得使用测试分支连接串，不得把本地 fake DB、in-memory fallback 或 `READY_CONFIGURED` 记为 `DB_READY`。文档只能记录环境变量名、脱敏 host、连接类型、required tables、migration count 和 response 摘要，禁止记录真实连接串。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: DB readiness 通过

- **WHEN** 设置 `RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY`
- **THEN** OpenSpec 进度可以记录该环境的 DB readiness evidence，但仍不能自动升级任何业务 endpoint，endpoint 还需要真实调用和数据语义证据

#### Scenario: DB readiness 未通过

- **WHEN** `/__nitro/ready` 返回 `READY_CONFIGURED`、`DATABASE_CONFIG_MISSING`、`DATABASE_CONNECTION_FAILED`、`DATABASE_SCHEMA_MISSING`、`DATABASE_MIGRATIONS_NOT_READY`、503 或任何非 `DB_READY`
- **THEN** 必须记录失败原因，所有相关 endpoint 的 `dbReadinessEvidence` 保持 incomplete，不得进入退役候选

### Requirement: 唯一允许的 Neon 真实库验收方式

Neon 真实库验收 MUST 只能通过生产或受控 Vercel `apps/api` runtime 的公开 HTTP endpoint 执行，最小验收入口为 `GET /__nitro/health` 与 `GET /__nitro/ready`，业务样本再调用公开业务 endpoint。runtime MUST 使用 Neon main 分支连接串，并且只通过受控 env 注入；执行前必须确认 `RUN_PHASE7_DB_READINESS_CHECK=1` 已在目标 runtime 生效，且 `/__nitro/ready` 明确返回 `DB_READY`。不得用 Neon 测试分支、local fake DB、in-memory fallback、直接数据库脚本、`psql`、Drizzle 临时脚本、未部署的本地连接、import handler/service/repository、`READY_CONFIGURED`、HTTP 200、Vitest mock 或任何绕过 `apps/api` runtime 公开 HTTP 路径的方式替代真实库验收。文档不得记录 secret、真实连接串、token、cookie、完整账号凭据或可复用生产 payload；只允许记录 env 名、脱敏 host、连接类型、request id、HTTP 状态码、ready code、required tables、migration count、响应摘要和 artifact path。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 生产或受控 Vercel runtime 通过 Neon 验收

- **WHEN** 生产或受控 Vercel `apps/api` runtime 已通过 env 注入 Neon main 分支连接串，`RUN_PHASE7_DB_READINESS_CHECK=1` 已生效，且公开 HTTP `GET /__nitro/ready` 返回 `DB_READY`
- **THEN** OpenSpec 可以记录脱敏的 Neon 真实库 readiness 证据，包括 env 名、脱敏 host、连接类型、request id、HTTP 状态码、required tables、migration count、ready code、响应摘要和 artifact path；仍不得自动升级任一业务 endpoint

#### Scenario: 远程 runtime env 未被公开 ready 证明

- **WHEN** `RUN_PHASE7_DB_READINESS_CHECK=1` 只在本机 shell、本地 `.env`、本地 dev server 或未指向目标 Vercel `apps/api` runtime 的环境中设置，或没有通过公开 HTTP `GET /__nitro/ready` 返回 `DB_READY` 证明目标 runtime 已生效
- **THEN** 该证据必须记录为 invalid-for-db-ready；不得把本机环境变量、部署配置截图、HTTP 200 或 `READY_CONFIGURED` 当作 Neon 真实库 readiness，相关 endpoint 保持 blocked 或 incomplete

#### Scenario: 非唯一验收路径被提出

- **WHEN** 证据来自 Neon 测试分支、local fake DB、in-memory fallback、直接数据库脚本、`psql`、Drizzle 临时脚本、未部署本地连接、import handler/service/repository、直接 repository 调用、`READY_CONFIGURED`、HTTP 200、Vitest mock 或绕过 `apps/api` runtime 公开 HTTP endpoint 的检查
- **THEN** 该证据必须记录为 invalid-for-db-ready，不能关闭 `DB_READY`、真实库样本、写入读回回滚或退役门禁任务

### Requirement: Neon 与 Drizzle 使用规范

统一 `apps/api` 的数据库访问必须以 Neon main 分支和 Drizzle ORM 为基准。后续迁移不得把 Neon 测试分支、临时本地连接、本地 fake DB、旧 admin 私有 schema 或旧 app in-memory 数据源写成生产数据库能力；不得在文档、日志或证据中泄漏真实连接串。涉及表结构或运行时 schema 时，必须以 `apps/type/src/business/**/schema.ts` 的 Trinity Pattern 作为事实源，并通过 `@01s-11comm/type` 共享表、Zod schema 和类型。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 编写 repository 或 service

- **WHEN** admin/app endpoint 在 `apps/api` 中实现 DB-backed repository 或 service
- **THEN** 必须使用 Drizzle 查询构建器和来自 `@01s-11comm/type` 的 schema/table/type；不得依赖 `apps/admin/server/db/schemas` 作为新事实源；不得用原始 SQL 代替常规 Drizzle 查询，除非在 `agent-findings.md` 记录必要性和验证证据

#### Scenario: 在 Nitro 运行时获取数据库连接

- **WHEN** handler、service 或工具函数需要访问 Neon
- **THEN** 必须从当前请求事件上下文获取数据库连接，避免模块顶层读取 `process.env` 并创建全局连接；证据只记录 env key、脱敏 host、平台来源和 readiness 摘要，不记录 secret value

#### Scenario: 需要新增或修改数据库 schema

- **WHEN** 迁移发现必须新增、修改或删除业务 schema
- **THEN** 必须先进入独立 schema 变更流程，更新 `apps/type/src/business/**/schema.ts`、相关导出、迁移文件和 schema 记忆清单；普通 endpoint 或文档载体迁移不能夹带未声明的数据库 schema 改动，若本 change 的 §4D 明确列出 Drizzle/Neon 工具链任务，则必须按该任务和本 spec 的保守只读 drift 规则推进

### Requirement: Drizzle Kit 与 Neon schema 变更流程归属

Drizzle Kit 配置、迁移输出目录、`db:*` 脚本、Neon readiness 与 drift 诊断 MUST 归属 `apps/api`。`apps/type` MUST 继续作为 schema 事实源，只提供 Drizzle Table、Zod Schema 与 TypeScript Type；`apps/admin` 的旧 Drizzle 配置、迁移目录和 DB 脚本只能作为 legacy source、兼容转发或退役对象，不得作为后续生产 schema 运维权威。

#### Scenario: 执行前驱排雷 gate

- **WHEN** 后续代理准备执行 Drizzle/Neon 工具链迁移、生产 schema 诊断或任何生产 CUD 写入
- **THEN** 必须先记录工作区状态、OpenSpec open checkbox 状态、目标 runtime、`DB_READY` 只读证据、目标 endpoint baseline、R2 cleanup/residual blocker 和本轮预计写入范围；任一前驱 gate 未通过时不得执行 `migrate`、`push`、生产 CUD 或 R2 新写入

#### Scenario: 工作区存在既有暂存改动

- **WHEN** `git status --short` 显示本轮开始前已有暂存或未暂存改动
- **THEN** 必须把这些改动视为用户或上一轮工作，记录本轮只会触达的文件范围；不得通过重置、覆盖、重新暂存或混合提交来清理不属于本轮的改动

#### Scenario: OpenSpec artifact 完整但 tasks 未完成

- **WHEN** `openspec status --change ... --json` 返回 `isComplete=true`，但 `openspec instructions apply --change ... --json` 或 `tasks.md` 仍显示 open checkbox
- **THEN** 必须以 `tasks.md` open checkbox 作为真实任务状态；不得归档 change、不得声称 runtime 迁移完成、不得退役旧服务目录

#### Scenario: 执行保守 C 只读 drift 诊断

- **WHEN** 生产 endpoint、ready probe 或 schema 对账暴露 Neon 结构疑似漂移
- **THEN** 必须先从 `apps/api` 入口执行只读诊断，记录目标 runtime、`RUN_PHASE7_DB_READINESS_CHECK=1` 生效证据、`DB_READY`、脱敏 host、migration count、required tables、目标表、关键列、索引或约束摘要和 artifact path；诊断期间不得执行 `push`、`migrate`、seed reset、truncate、直接写库或生产业务 CUD

#### Scenario: 迁移目录和 migration table 归属变化

- **WHEN** 将 `apps/admin/drizzle/**` 承接到 `apps/api/drizzle/**`
- **THEN** 必须原样保留 SQL 文件、snapshot、`meta/_journal.json`、迁移顺序和 migration table/schema 读取口径；不得漏迁 meta、改写 SQL 语义、改变 migration table/schema 或让 readiness 与 Drizzle Kit 读取不同迁移历史

#### Scenario: Drizzle CLI 环境变量缺失

- **WHEN** `apps/api` 的 `db:generate`、`db:migrate`、`db:push`、`db:studio` 或 drift 检查命令缺少真实 DB URL
- **THEN** 写库命令必须 fail closed 并输出可脱敏诊断；不得返回 dummy URL、不得连接不明数据库、不得让 runtime 使用 A 库而 Drizzle CLI 迁移 B 库

#### Scenario: drift 诊断确认需要迁移

- **WHEN** 只读诊断确认 Neon main、`apps/type` schema 与 `apps/api` migration 目录之间存在真实 drift
- **THEN** 必须从 `apps/api` 运行迁移生成或等价命令，人工审查 SQL 与风险，再按受控 `apps/api` 迁移入口执行；`db:push` 只能作为明确记录风险、原因和回滚边界的应急路径，不能作为默认生产修复方式

#### Scenario: `ct_contracts` 报错需要分类

- **WHEN** 生产 endpoint 返回 `missing FROM-clause entry for table "ct_contracts"` 或等价 SQL 运行时错误
- **THEN** 必须先归类为 runtime query、部署差异或 schema drift 待诊断；只有只读 drift 证据证明表、字段、索引或迁移状态缺失时，才允许进入 schema 变更流程，不得直接新增字段、直接改 Neon 或跳过公开 `apps/api` HTTP 证据

### Requirement: DB 证据与业务 endpoint 证据分离

`DB_READY` 只证明数据库连接、必要表和 migration probe 通过，不证明某个业务 endpoint 已正确读写真实数据。业务 endpoint 还必须证明 repository/service 使用真实数据源、响应字段语义正确、调用端命中 `apps/api`、fallback/shadow 行为明确。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: `/__nitro/ready` 返回 DB_READY 但 endpoint 为空数组

- **WHEN** DB_READY 通过但业务 endpoint 只返回空数组、兼容默认、mock 或 fallback 结果
- **THEN** endpoint 不能升级为 DB 完成，必须继续补真实库样本或语义复核

#### Scenario: 只读 endpoint 使用真实 repository

- **WHEN** 只读 endpoint 声称使用 Drizzle repository
- **THEN** 必须记录使用的表、关键查询条件、字段映射、空数据行为、错误路径和至少一种真实库样本复核方式

### Requirement: 受控写入验收

Phase7 写入验收必须使用唯一 `PHASE7_E2E_*` 或 `phase7RunId` 标记，并包含 guard-before、write-window、controlled write、read-back、rollback/cleanup、residual check、guard-after。缺任一步不得升级写入口状态。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Neon main 上验证写入口

- **WHEN** 写入口在 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 窗口内执行
- **THEN** 必须记录脱敏 request、response、读回方式、回滚结果、残留检查、guard 恢复证据和执行时间

#### Scenario: 已授权写入窗口的逐步证据记录

- **WHEN** 用户已明确授权生产写入窗口并允许在 Neon main 上执行低风险 CUD 验收
- **THEN** 仍必须逐次记录 `writeWindow`、`operator`、`phase7RunId`、`requestIdByStep`、`httpStatusByStep` 与 `sanitizedPayloadSummary`；不得记录 token、secret、cookie、真实连接串、完整账号凭据或完整生产 payload

#### Scenario: 没有可承载 `phase7RunId` 的字段

- **WHEN** endpoint payload 没有 remark、description、title、name、外部单号、测试手机号或其它可检索字段承载标记
- **THEN** 该 endpoint 必须保持 `blocked-for-execution`，不得强行写入不可追踪数据

#### Scenario: 无法完成 residual check

- **WHEN** endpoint 没有可追踪哨兵字段、无法按 `phase7RunId` 或等价标记查询残留、或无法证明 cleanup/rollback 后无残留
- **THEN** 该 endpoint 必须保持 blocked，不得以授权窗口、人工确认或单次成功响应替代 residual check，也不得强行执行 CUD

### Requirement: 生产 CUD 只能通过公开 apps/api HTTP endpoint

生产 CUD 真实测试 MUST 只允许通过公开 `apps/api` HTTP endpoint 触发业务 handler，不得直接写数据库、直接调用 handler、service 或 repository、import 运行时代码、运行一次性 DB 脚本、后台手改数据或绕过公开 HTTP 路径修改数据。候选 endpoint 必须低风险、可构造哨兵数据、可 read-back、可 rollback/cleanup、可 residual check，且每次只能执行窄口径 CUD 闭环。费用、支付、开门、维修流转、业主资料、审批流等破坏性业务对象默认禁止作为生产 CUD 测试对象。任一步失败时，必须立即停止同批后续写入，先清理、查残留并记录 guard 或 baseline 状态。证据 MUST 按每一步记录 request id、HTTP 状态码和脱敏响应摘要。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 低风险 CUD 端点完成闭环

- **WHEN** 低风险 endpoint 经公开 `apps/api` HTTP endpoint 完成 baseline 或 guard-before、create、read-back、update、read-back、delete 或 cleanup、delete 后校验、residual check 与 guard-after 或 guard-not-applicable 说明
- **THEN** 可以记录该 endpoint 的生产 CUD 窄口径证据；证据必须包含 endpoint、环境、HTTP method、request id、HTTP 状态码、phase7RunId、写入目标、读回查询、清理结果、残留数量、guard 或 baseline 状态和 artifact path

#### Scenario: 生产 CUD 按唯一闭环顺序执行

- **WHEN** 执行生产 CUD 验收
- **THEN** 必须按 `health -> ready(DB_READY) -> baseline/guard-before -> 开写入窗口 -> create/update/delete 等公开 HTTP -> read-back -> cleanup/rollback -> residual check -> 关闭窗口/guard-after 或 guard-not-applicable` 的唯一闭环顺序执行；不得并行批量写入，不得在任一步失败后继续写同批其它 endpoint

#### Scenario: CUD 测试试图绕过业务 handler

- **WHEN** CUD 证据来自直接数据库写入、直接 handler 调用、直接 service 调用、直接 repository 调用、import 运行时代码、临时 DB 脚本、后台手改数据或任何绕过公开 `apps/api` HTTP endpoint 的方式
- **THEN** 该证据无效，相关 endpoint 保持 blocked 或 partial，不能升级写入口、真实库样本或退役状态

### Requirement: 默认 Guard 验证

所有高风险写入口在默认状态下必须证明 guard 生效。未设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 时，相关 endpoint 应返回 `409 PHASE7_MUTATION_GUARDED` 或等价受保护响应。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Guard 默认打开

- **WHEN** 未设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 调用支付、催缴、费用创建、维修创建、维修评价、开闸、审核、状态流转等写入口
- **THEN** 预期必须是 guarded response，且该证据只能说明默认阻断正常，不代表写入迁移完成

### Requirement: 写入失败处理

写入验收任一步失败时，必须立即停止同批次后续写入，先查残留、尽可能 cleanup、关闭写入窗口并重新证明 guard 恢复。失败 endpoint 必须保持 blocked、unknown 或 keep-source。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: cleanup 后仍有残留

- **WHEN** 按 `phase7RunId` 查询仍发现残留数据
- **THEN** endpoint 保持 blocked，同批次停止继续写入，残留主键、失败步骤、cleanup 尝试和 guard 状态必须写入 `agent-findings.md`

#### Scenario: guard 未恢复

- **WHEN** 写入窗口关闭后 endpoint 不再返回 guarded response
- **THEN** 不得继续本批次任何写入口验收，必须先恢复 guard 并记录事故

### Requirement: Neon main 接力 checklist

Neon main 验收 MUST 保留旧计划的接力 checklist：不使用 Neon 测试分支；DB deep readiness 使用 main 分支连接串且只通过环境变量注入；`RUN_PHASE7_DB_READINESS_CHECK=1` 后公开 HTTP `GET /__nitro/ready` 必须返回 `DB_READY`；高风险写入口默认先证明 `409 PHASE7_MUTATION_GUARDED`；高风险写入窗口仅在 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 下临时开放；低风险公开管理配置类哨兵 endpoint 只有在明确用户授权写入窗口、可追踪、可读回、可清理且可查残留时才可执行，并且必须把无单独 mutation guard 写成 `guard-not-applicable`，不得把 baseline total 0 误写成高风险 guard 生效；payload 必须带 `PHASE7_E2E_*` 或 `phase7RunId`；必须读回、回滚/清理、残留检查和 guard 或 baseline 状态记录；任何残留、清理失败或 guard 未恢复都停止同批次后续写入。

#### Scenario: 执行 Neon main 只读验收

- **WHEN** endpoint 只需要只读 DB 样本
- **THEN** 仍必须先证明 health、`DB_READY`、目标 repository 读取真实业务表和字段映射，不能用空数组、mock 或兼容默认值替代

#### Scenario: 执行 Neon main 写入验收

- **WHEN** endpoint 需要证明写能力
- **THEN** 必须按接力 checklist 完整执行，并把每一步证据写入 `agent-progress.md` 或稳定证据文件

### Requirement: 写入证据模板

任何写入口升级前，`writeReadRollbackEvidence` 必须能追溯到固定字段：endpoint、phase7RunId、databaseTarget、connectionEvidence、healthEvidence、readyEvidence、baselineEvidence、guardBefore、writeWindow、writeRequest、writeResponse、readBackMethod、readBackResult、rollbackMethod、rollbackResult、residualCheck、guardAfter 或 guardNotApplicable、requestIdByStep、httpStatusByStep、sanitizedPayloadSummary、operator、timestamp、artifactPath。`writeRequest`、`writeResponse` 与 `sanitizedPayloadSummary` 只能保留脱敏摘要，禁止记录 token、cookie、secret、完整账号凭据、真实连接串、密码、可复用生产 payload 或完整敏感业务对象。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 证据字段不完整

- **WHEN** 写入口缺少任一关键证据字段
- **THEN** 不能从 blocked 或 candidate-after-evidence 升级，必须继续保留旧服务来源或 fallback

### Requirement: 禁止真实业务破坏性写入

Phase7 不得修改真实缴费、真实支付、真实开门、真实维修流转、真实业主资料、真实审批流或无法恢复的真实业务对象作为测试。若业务无法构造可清理哨兵数据，必须保持 blocked。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: endpoint 只能修改真实业务对象

- **WHEN** endpoint 无法使用测试数据、无法读回、无法回滚或无法证明无残留
- **THEN** 不得执行真实写入，必须记录阻断原因并保持 no-go-for-retirement
