## ADDED Requirements

### Requirement: Neon main DB_READY 验收

Phase7 DB readiness 必须使用 Neon main 分支连接串完成。不得默认使用 Neon 测试分支，不得使用测试分支连接串，不得把本地 fake DB、in-memory fallback 或 `READY_CONFIGURED` 记为 `DB_READY`。文档只能记录环境变量名、脱敏 host、连接类型、required tables、migration count 和 response 摘要，禁止记录真实连接串。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: DB readiness 通过

- **WHEN** 设置 `RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY`
- **THEN** OpenSpec 进度可以记录该环境的 DB readiness evidence，但仍不能自动升级任何业务 endpoint，endpoint 还需要真实调用和数据语义证据

#### Scenario: DB readiness 未通过

- **WHEN** `/__nitro/ready` 返回 `READY_CONFIGURED`、`DATABASE_CONFIG_MISSING`、`DATABASE_CONNECTION_FAILED`、`DATABASE_SCHEMA_MISSING`、`DATABASE_MIGRATIONS_NOT_READY`、503 或任何非 `DB_READY`
- **THEN** 必须记录失败原因，所有相关 endpoint 的 `dbReadinessEvidence` 保持 incomplete，不得进入退役候选

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
- **THEN** 必须先进入独立 schema 变更流程，更新 `apps/type/src/business/**/schema.ts`、相关导出、迁移文件和 schema 记忆清单；本 OpenSpec 载体迁移不能夹带数据库 schema 改动

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

#### Scenario: 没有可承载 `phase7RunId` 的字段

- **WHEN** endpoint payload 没有 remark、description、title、name、外部单号、测试手机号或其它可检索字段承载标记
- **THEN** 该 endpoint 必须保持 `blocked-for-execution`，不得强行写入不可追踪数据

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

Neon main 验收 MUST 保留旧计划的接力 checklist：不使用 Neon 测试分支；DB deep readiness 使用 main 分支连接串且只通过环境变量注入；`RUN_PHASE7_DB_READINESS_CHECK=1` 后 `/__nitro/ready` 必须返回 `DB_READY`；写入口默认先证明 `409 PHASE7_MUTATION_GUARDED`；写入窗口仅在 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 下临时开放；payload 必须带 `PHASE7_E2E_*` 或 `phase7RunId`；必须读回、回滚/清理、残留检查和 guard 恢复；任何残留、清理失败或 guard 未恢复都停止同批次后续写入。

#### Scenario: 执行 Neon main 只读验收

- **WHEN** endpoint 只需要只读 DB 样本
- **THEN** 仍必须先证明 health、`DB_READY`、目标 repository 读取真实业务表和字段映射，不能用空数组、mock 或兼容默认值替代

#### Scenario: 执行 Neon main 写入验收

- **WHEN** endpoint 需要证明写能力
- **THEN** 必须按接力 checklist 完整执行，并把每一步证据写入 `agent-progress.md` 或稳定证据文件

### Requirement: 写入证据模板

任何写入口升级前，`writeReadRollbackEvidence` 必须能追溯到固定字段：endpoint、phase7RunId、databaseTarget、connectionEvidence、healthEvidence、readyEvidence、baselineEvidence、guardBefore、writeWindow、writeRequest、writeResponse、readBackMethod、readBackResult、rollbackMethod、rollbackResult、residualCheck、guardAfter、operator、timestamp、artifactPath。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 证据字段不完整

- **WHEN** 写入口缺少任一关键证据字段
- **THEN** 不能从 blocked 或 candidate-after-evidence 升级，必须继续保留旧服务来源或 fallback

### Requirement: 禁止真实业务破坏性写入

Phase7 不得修改真实缴费、真实支付、真实开门、真实维修流转、真实业主资料或无法恢复的真实业务对象作为测试。若业务无法构造可清理哨兵数据，必须保持 blocked。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: endpoint 只能修改真实业务对象

- **WHEN** endpoint 无法使用测试数据、无法读回、无法回滚或无法证明无残留
- **THEN** 不得执行真实写入，必须记录阻断原因并保持 no-go-for-retirement
