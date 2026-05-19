## ADDED Requirements

### Requirement: App legacy/mock Nitro 源流定位

App legacy cutover 必须被视为统一 `apps/api` 合并中的 app legacy/mock Nitro stream。旧来源包括 `apps/app/server/modules/**/endpoints.ts` 和旧项目 `D:\code\ruan-cat\01s-11comm-app`；目标是 `apps/api` legacy adapter、compat handler、runtime manifest、allowlist、guard 和 `apps/app` H5 调用切流。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 总结 app legacy 进度

- **WHEN** 后续代理总结 app legacy 迁移
- **THEN** 必须记录 legacy path、旧来源、`apps/api` adapter 或 fallback、app 调用端证据、allowlist、guard 状态、数据源和 `/app/**` / `/callComponent/**` 兼容缺口

### Requirement: App legacy endpoint 证据字段

每个 app legacy endpoint 必须记录旧路径、HTTP method、旧模块、调用端、runtime manifest、shadow allowlist、legacy dispatch、adapter、response contract、dataSourceStatus、guard、fallback、browser/HTTP evidence、retirementDecision。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Endpoint 加入 allowlist

- **WHEN** app legacy endpoint 被加入 `apps/api` manifest 或 app shadow allowlist
- **THEN** 必须记录它是 DB-backed、in-memory-only、legacy-compatible-only、fallback-only、guarded、blocked 还是 unknown-needs-triage

#### Scenario: Manifest 存在但仍走旧 fallback

- **WHEN** endpoint 在 manifest 中存在，但实际请求仍依赖旧 app Nitro fallback 或兼容 mock
- **THEN** 不能标记 DB 完成，必须保留 legacy-fallback 或 candidate-after-evidence 状态

### Requirement: App Nitro 迁移实现规范

App legacy endpoint 迁入统一 `apps/api` 时，必须按独立 Nitro 项目实现，而不是把旧 mock 或旧 `apps/app/server` handler 原样搬运为完成状态。目标实现必须使用 Nitro v3 / H3 处理器、`nitro/h3` 导入、无鉴权、显式 adapter/service/repository 分层、可追踪 runtime manifest、可回退 legacy fallback 记录和 app H5 调用端切流证据。任何从旧 app mock、in-memory store、兼容默认值或旧项目 `D:\code\ruan-cat\01s-11comm-app` 迁入的逻辑，只有在数据源、契约、调用端和 fallback 行为均有证据时才可升级。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 新增或改写 app legacy handler

- **WHEN** 在 `apps/api` 中新增或改写 app legacy handler、compat handler 或 legacy dispatch
- **THEN** 必须使用 `nitro/h3` 提供的 H3 API，不得直接从 `h3` 导入；不得增加 JWT、Token、Neon Auth 或任何鉴权；不得在模块顶层创建数据库连接；需要数据库时必须通过事件上下文获取连接，并记录 handler、adapter、service/repository、manifest、allowlist 和 response contract

#### Scenario: 旧 mock 逻辑迁入 `apps/api`

- **WHEN** 旧来源只有 mock、in-memory、兼容默认值或旧 app 项目快照
- **THEN** 迁移结果只能标记为 legacy-compatible-only、fallback-only、guarded 或 unknown-needs-triage，不得写成 DB-backed、production-ready 或 retirement-ready

#### Scenario: app H5 调用端切向统一 API

- **WHEN** `apps/app` H5 调用端切向 `apps/api`
- **THEN** 必须记录调用端文件、环境变量或 resolver 来源、请求路径、payload、response envelope、Network 或 HTTP gate 证据，以及 shadow/fallback 关闭或保留的原因

### Requirement: `/callComponent/**` 迁移规则

`/callComponent/**` endpoint 必须独立评审，不能被 `/app/**` 迁移结论覆盖。`/callComponent/core/list` 需复核 repair 与 property-application 两类调用语义、`name/type/domain` 参数、旧服务数据源、compat handler 和页面命中证据；`/callComponent/ownerRepair.appraiseRepair` 是写入评价路径，默认保持 guard。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 处理 `/callComponent/core/list`

- **WHEN** 迁移 `/callComponent/core/list`
- **THEN** 必须证明旧字典/组件查询语义、典型参数、空数据、未知字典、app 页面命中 `apps/api` 和是否仍依赖 fallback

#### Scenario: 处理 `/callComponent/ownerRepair.appraiseRepair`

- **WHEN** 处理维修评价 endpoint
- **THEN** 未完成受控写入、读回、回滚、残留检查和 guard 恢复前，必须保持 `409 PHASE7_MUTATION_GUARDED` 或 blocked 状态

### Requirement: Floor legacy 迁移规则

`/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` 必须证明 floor 兼容视图的数据来源、合成 `floorId` 语义、非 UUID community 兼容策略、App H5 页面 Network、真实库样本和 shadow-off/fallback evidence。合成 ID 不得误写为真实 floor 主键。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Floor list 使用合成 ID

- **WHEN** floor list 通过 `hpHouses` 聚合楼层并生成兼容 `floorId`
- **THEN** 必须记录该 ID 是兼容 ID，不具备真实 floor 专表主键语义，detail 只能按兼容策略查回

### Requirement: Repair legacy 迁移规则

Repair app legacy 迁移必须区分只读查询、字典、设置和写入。`ownerRepair.listOwnerRepairs`、`ownerRepair.queryOwnerRepair`、`dict.queryRepairStates` 已有本地 App H5 页面证据时，仍需真实库样本、shadow-off/fallback 和独立复核；`repairSetting.listRepairSettings` 仍需页面证据；`ownerRepair.saveOwnerRepair` 与 `ownerRepair.appraiseRepair` 必须保持 guarded。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Repair 只读 endpoint 已有页面证据

- **WHEN** repair 只读 endpoint 已有本地 App H5 页面 Network
- **THEN** 只能升级对应 browser evidence，不得写成生产 `DB_READY`、写入口完成或旧服务可退役

#### Scenario: Repair 写入口被调用

- **WHEN** repair 写入口未设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1`
- **THEN** 预期结果必须是 `409 PHASE7_MUTATION_GUARDED`

### Requirement: Fee / Report legacy 迁移规则

Fee/report legacy 迁移必须区分 8 个只读查询、3 个高风险写入口和需要进一步设计的数据源 gap。`feeConfig.listFeeConfigs`、`reportFeeMonthStatistics.queryReportFeeSummary`、`queryPayFeeDetail`、`dataReport.queryFeeDataReport` 等已有 DB 分支或 HTTP gate 的 endpoint 仍需 App 页面或 HTTP gate、真实库样本、shadow-off/fallback evidence。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Fee 查询只有部分字段来源

- **WHEN** endpoint 只从 `exHouseCharges`、`exExpenseItems`、`rptExpenseSummaries` 或 `rptPaymentDetails` 推导部分字段，其他字段仍是兼容默认
- **THEN** 必须记录字段缺口，不能写成完整语义迁移

#### Scenario: Fee join 来源不清楚

- **WHEN** `/app/fee.listFee`、`/app/fee.queryFeeDetail` 或 `/app/oweFeeCallable.listOweFeeCallable` 的 join 来源和字段语义未明确
- **THEN** 必须先补设计和数据源复核，不得直接做不可信 DB wiring

### Requirement: App guarded writes

高风险 app 写入口默认必须 guarded。`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`、`/app/ownerRepair.saveOwnerRepair`、`/callComponent/ownerRepair.appraiseRepair` 在没有受控写入窗口和回滚证据前必须返回或保持 `409 PHASE7_MUTATION_GUARDED`。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 未开启写入窗口

- **WHEN** guarded endpoint 在未设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 时被调用
- **THEN** 预期结果是 `409 PHASE7_MUTATION_GUARDED`，该结果只证明 guard 正常，不代表写能力完成

#### Scenario: 准备真实写入

- **WHEN** 准备对 app 写入口做真实写入
- **THEN** 必须先定义 `PHASE7_E2E_*` / `phase7RunId`、测试数据、业务允许范围、read-back、rollback/cleanup、residual check、guard restored

### Requirement: Client-only 与 Server-only 差集

App client-only call 和 server-only endpoint 必须先 triage，再决定迁移或保留。客户端调用不存在服务端 endpoint，或服务端 endpoint 找不到客户端调用，都不能作为删除依据。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Client call 找不到服务端 endpoint

- **WHEN** `apps/app/src` 调用旧路径但 `apps/app/server/modules/**/endpoints.ts` 扫描不到
- **THEN** 必须记录为 client-only gap 和 unknown-needs-triage，不能删除调用或旧服务

#### Scenario: Server endpoint 找不到客户端调用

- **WHEN** server endpoint 暂时没有客户端调用命中
- **THEN** 必须记录为 server-only gap，继续复核动态路由、历史页面、条件渲染或旧入口，不能直接标记删除

### Requirement: 剩余 App 模块分批迁移

剩余 app legacy 模块必须按小批次推进，不得一次性全量重写。每批只处理 2-3 个 endpoint 或一个小模块，优先生产 H5 会访问、有 schema、只读或低风险的路径；高风险写入复用 guarded write 标准。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 选择剩余 app 模块

- **WHEN** 选择 activity、appointment、complaint、coupon、inspection、item-release、maintenance、meter、owner、parking、property-application、purchase、renovation、repair-extra、resource、room、unit、visit、work-order 等模块
- **THEN** 必须先展开 endpoint 级矩阵，区分只读 POST、受控写、真实写、高风险阻断、legacy fallback 和 unknown-needs-triage

### Requirement: App legacy 退役准备度独立判断

App legacy readiness 必须独立于 admin readiness。admin resolver 完成、admin route 数量、admin old path 155/155 都不得升级 app legacy endpoint 或旧 app Nitro 职责。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Admin stream 领先 app stream

- **WHEN** admin cutover 证据明显多于 app legacy 证据
- **THEN** 统一 Nitro 合并仍保持 partial，`apps/app/server` 和旧 app 项目仍保持受保护
