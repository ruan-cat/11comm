## ADDED Requirements

### Requirement: Phase7 证据字段模型

Phase7 后续每个 endpoint 或任务切片都必须保留稳定证据字段：`coverageKind`、`dataSourceStatus`、`targetStatus`、`callerEvidence`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision`、`notes`。这些字段共同决定一个 endpoint 只是被覆盖、可本地调用、DB-ready、fallback-ready、blocked，还是可以进入退役评审。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 迁移旧矩阵字段

- **WHEN** 从旧 Superpowers 矩阵迁移 endpoint 状态
- **THEN** 必须保留足以判断覆盖口径、数据源、调用端、浏览器/HTTP、fallback、DB、写入闭环和退役决策的字段

#### Scenario: 字段缺失

- **WHEN** endpoint 缺少关键证据字段
- **THEN** 该 endpoint 必须保持 unknown-needs-triage、candidate-after-evidence、legacy-fallback、blocked 或 keep-source，不得进入 delete-candidate

### Requirement: Phase7 证据默认值

从旧矩阵迁移或新建 endpoint 状态行时，缺省值 MUST 保守：`callerEvidence=pending-client-rg-or-page-evidence`、`browserEvidence=pending-chrome-mcp`、`fallbackEvidence=pending-shadow-off-or-fallback-drill`、`dbReadinessEvidence=READY_CONFIGURED-only`、`retirementDecision=keep-source`。`writeReadRollbackEvidence` 只有确认无写入行为时才可写 `not-applicable`；写入口必须保持 `pending`、`guarded`、`blocked-for-execution` 或更具体的未完成状态。

#### Scenario: 新建 endpoint 状态行

- **WHEN** 后续代理把一个旧 admin 或 app legacy endpoint 加入 OpenSpec 任务/进度记录
- **THEN** 未采集到的 caller、browser、fallback、DB 和写入证据必须使用 pending/READY_CONFIGURED-only/keep-source 等保守默认值，不得留空或猜测完成

#### Scenario: 写入口状态初始化

- **WHEN** endpoint 是 create、update、delete、支付、缴费、开门、维修流转、审批或其它 side-effect 路径
- **THEN** `writeReadRollbackEvidence` 不得默认为 `not-applicable`，必须记录 guard、pending 或 blocked 状态

### Requirement: 覆盖口径枚举

`coverageKind` 必须区分 `old-path-exact-covered`、`canonical-only`、`not-covered`、`unknown-needs-triage`。`apps/api` canonical route 存在不能抵扣旧 path exact coverage；old path exact coverage 也不能证明调用端、DB、fallback 或退役完成。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: canonical-only route 存在

- **WHEN** `apps/api` 有 canonical route，但旧 `/api/**` path 没有精确兼容入口或旧 source 未归类
- **THEN** 必须记录为 `canonical-only`，不能写成 old path exact covered

#### Scenario: old path exact covered

- **WHEN** 旧 `/api/**` path 已有精确 `apps/api` route
- **THEN** 只能说明路径覆盖，仍需 contract、caller、DB、browser/HTTP、fallback 和 retirement evidence

### Requirement: 数据源状态枚举

`dataSourceStatus` 必须区分 `db-ready`、`db-read-repository-wired`、`db-read-repository-wired-with-gap`、`db-crud-wired`、`schema-exists-not-wired`、`in-memory-only`、`legacy-fallback`、`blocked-for-execution`、`unknown-needs-triage`。字段缺口、兼容默认、mock 和 fallback 必须显式写入 notes。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: DB repository 有字段缺口

- **WHEN** repository 已接入 Drizzle，但部分字段来自兼容默认、JSONB 推导、合成 ID 或缺少 join
- **THEN** 必须使用带 gap 的状态或在 notes 中说明，不能写成完整 `db-ready`

#### Scenario: Legacy fallback 返回 200

- **WHEN** 统一 server 通过旧 app/admin fallback 返回 HTTP 200
- **THEN** `dataSourceStatus` 必须保持 `legacy-fallback` 或相应非完成状态，不能写成 DB/repository 完成

### Requirement: Target status 与 retirement decision 分离

`targetStatus` 描述当前迁移候选状态，`retirementDecision` 描述旧服务是否可退役。二者必须分离。`candidate-after-evidence` 不等于 `delete-candidate`，`available-in-apps-api-not-caller-verified` 不等于 old service 可删。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 本地 HTTP gate 通过

- **WHEN** endpoint 已通过本地 HTTP gate 或 `/api-shadow` 页面 Network
- **THEN** 可以记录为本地证据，但 retirementDecision 仍应保持 `keep-source`、`blocked` 或 `candidate-after-review`，直到所有退役门禁满足

### Requirement: Target status 枚举与组合语义

Phase7 `targetStatus` MUST 至少区分 `available-in-apps-api-not-caller-verified`、`candidate-after-evidence`、`legacy-fallback`、`blocked-for-execution`、`unknown-needs-triage`、`not-candidate`、`delete-candidate`。`retirementDecision` MUST 至少区分 `keep-source`、`blocked`、`candidate-after-review`、`delete-candidate`。这些值可以组合，但组合必须保守解释：只要 caller、browser、fallback、DB/write 或独立复核缺失，`retirementDecision` 就不能升级为 `delete-candidate`。

#### Scenario: apps/api 可达但 caller 未验证

- **WHEN** runtime manifest、contract test 和 HTTP gate 都通过，但调用端还没有页面、hook 或生产证据
- **THEN** `targetStatus` 可以是 `available-in-apps-api-not-caller-verified`，`retirementDecision` 仍必须是 `keep-source` 或 `candidate-after-review`

#### Scenario: endpoint 暂无法安全执行

- **WHEN** 写入口缺少可清理哨兵数据、R2 环境、真实 schema、生产 DB env 或 guard 恢复证据
- **THEN** `targetStatus` 必须保持 `blocked-for-execution` 或 `unknown-needs-triage`，不能用历史 HTTP 200 降低风险等级

### Requirement: Retirement ledger 最低字段

后续替代旧矩阵的 retirement ledger MUST 至少能追溯 `batchId`、`ownerRole`、`sourceKind`、`sourcePath`、`businessPath`、`method`、`oldPath`、`appsApiTarget`、`coverageKind`、`callerEvidence`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision` 和 `notes`。OpenSpec 可以分散存放这些字段，但不得让任一 endpoint 的来源、目标、证据或退役判断不可追溯。

#### Scenario: 生成退役候选清单

- **WHEN** 后续代理准备评审一个 endpoint 或目录是否可退役
- **THEN** 必须能从 `tasks.md`、`agent-progress.md`、`agent-findings.md` 或稳定证据文件组合出上述最低字段

#### Scenario: 字段只能从旧矩阵查到

- **WHEN** 删除旧矩阵后某个 endpoint 的 sourcePath、oldPath、appsApiTarget 或 retirementDecision 只能从 git history 或旧文件恢复
- **THEN** 说明 OpenSpec 转写不完整，必须补写 canonical 记录后再继续退役评审

### Requirement: Retirement ledger 物化与维护方式

Retirement ledger MUST 在 OpenSpec canonical 中物化为可追溯记录：优先落入 `tasks.md` 的 endpoint 任务行和对应 `agent-progress.md` checkpoint、`agent-findings.md` 风险记录、稳定证据 artifact 的组合；如某批次需要单独 artifact，必须从 `tasks.md` 或本 change 的 canonical 文件引用。每个 admin/app endpoint 在进入退役候选前必须至少落一行 endpoint 级 ledger 记录；未落行、缺最低字段或只能从旧文档/git history 恢复的 endpoint 不得升级为退役候选。

#### Scenario: endpoint 进入 ledger

- **WHEN** 后续代理新增或更新一个 admin/app endpoint 的迁移状态
- **THEN** 必须在 `tasks.md` 或其引用的稳定证据位置落行，最低包含 endpoint 身份、旧来源、目标 `apps/api`、证据字段、retirementDecision、维护人/批次和更新时间；`agent-progress.md` 只记录 checkpoint 与验证命令，不承载平行任务树

#### Scenario: 维护 ledger

- **WHEN** route、manifest、caller、dataSourceStatus、fallbackEvidence、dbReadinessEvidence、writeReadRollbackEvidence 或 retirementDecision 发生变化
- **THEN** 必须同步更新 ledger 行和对应验证记录；只有复核确认最低字段完整后，才允许从 `keep-source` 或 `candidate-after-review` 继续升级

### Requirement: 证据层级不可替代

Hook tests、manifest tests、contract tests、HTTP gate、Chrome MCP 页面 Network、production evidence、DB readiness、write/read/rollback 是不同层级证据，不能互相替代。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Hook-level evidence 存在

- **WHEN** admin hook resolver tests 通过
- **THEN** 只能证明 resolver 能根据环境切换 URL，不能记为 browserEvidence 或 production evidence

#### Scenario: HTTP gate 存在

- **WHEN** 直接 HTTP gate 通过
- **THEN** 只能证明 route 可达和响应契约，不能替代页面真实交互，除非 endpoint 明确无页面入口并记录原因

#### Scenario: 页面 list 请求成功

- **WHEN** 页面 list 请求经 `/api-shadow` 命中 `apps/api`
- **THEN** 只能证明该页面 list 请求，不能推导同域 detail/CUD/upload/写入口完成

### Requirement: 当前接力状态

OpenSpec 必须保留当前接力状态：`apps/api/server/routes/api/**/*.ts` 最新文档口径为 160 个 server route，`apps/admin/server/api/**/*.ts` 最新文档口径为 155 个 legacy file，admin old path exact coverage 最新文档口径为 155/155；admin resolver 迁移已记录为完成；生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 CRUD/交互和旧服务退役证据仍未闭环；下一推荐切片是 `property-manage/contract-manage` 12 个普通 list endpoint。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 后续代理开始 Phase7

- **WHEN** 后续代理从 OpenSpec 开始
- **THEN** 可以识别已完成 resolver 迁移、当前 no-go-for-retirement、剩余证据缺口和下一推荐 endpoint 切片，而不依赖旧三文档作为任务源

### Requirement: 冲突口径处理

恢复后的旧矩阵中存在冲突口径：同一文档前文写 admin old path exact coverage 155/155，末尾仍残留“未覆盖 exact legacy path 约 51 个”的旧说法。OpenSpec 必须记录该冲突，并要求后续以 fresh scan 和当前 working tree 为准。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 旧数字互相冲突

- **WHEN** 后续代理发现旧文档或历史 Memorix 中的 endpoint 数字冲突
- **THEN** 必须先重新扫描当前 working tree，把旧数字标记为 dated snapshot，不得直接选择任一数字作为 timeless fact

### Requirement: 状态升级门槛

endpoint 状态升级必须满足对应门槛：路径覆盖需要 route/manifest；候选需要 contract 和 HTTP 或页面证据；DB 候选需要 repository 与真实库样本；写入口候选需要 guard/read-back/rollback；退役候选需要 caller、browser/HTTP、fallback、DB/write 和独立复核全部满足。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 试图升级到退役候选

- **WHEN** endpoint 准备进入 `delete-candidate` 或 retirement review
- **THEN** 必须同时具备替代实现、调用端切流或无调用证明、浏览器/HTTP 证据、fallback/shadow-off、DB/write evidence、独立复核和 no-go 解除条件
