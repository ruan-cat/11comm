# app-legacy-cutover Specification

## Purpose

TBD - created by archiving change migrate-superpowers-docs-to-openspec-longtask. Update Purpose after archive.

## Requirements

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

### Requirement: App fallback 当前红线

OpenSpec MUST 保留当前 app legacy fallback 红线：`/callComponent/core/list` 已可有 in-memory compat handler 但不是 DB-ready；`/callComponent/ownerRepair.appraiseRepair` 默认 guarded；floor 两端点若使用 legacy-compatible handler 或合成 ID，仍是 in-memory/with-gap；repair 三个只读端点已有本地 App H5 页面证据但仍缺生产、真实库样本和 fallback；`/app/repairSetting.listRepairSettings` 仍缺 App H5 页面证据；`/app/ownerRepair.saveOwnerRepair` 只能作为默认 guard 证据，不能写成真实写入完成。

#### Scenario: 复用 App repair 本地 H5 证据

- **WHEN** 引用 `/app/ownerRepair.listOwnerRepairs`、`/app/dict.queryRepairStates` 或 `/app/ownerRepair.queryOwnerRepair` 的本地 App H5 Network 证据
- **THEN** 只能升级 local app browser evidence，仍需 production DB_READY、真实库样本、shadow-off/fallback 和独立复核

#### Scenario: 处理 repairSetting

- **WHEN** 后续代理处理 `/app/repairSetting.listRepairSettings`
- **THEN** 必须补 App H5 页面证据或明确无页面入口原因，不能因其它 repair 只读 endpoint 已有证据而跳过

#### Scenario: 处理 ownerRepair 保存

- **WHEN** `/app/ownerRepair.saveOwnerRepair` 被调用或验证
- **THEN** 默认只能证明 guard 返回受保护响应；没有受控写入窗口、read-back、rollback、residual check 和 guard-after 时不能升级写能力

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

### Requirement: App legacy endpoint 格式统一

新增或改写 app legacy endpoint MUST 采用统一模块分层与 handler 形状。目标模块必须保持 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 的职责边界；`legacy-endpoints.ts` 只负责声明旧路径、method 与 handler registry，handler MUST 通过 `get<Module>Runtime(event).legacyAdapter` 分发。runtime manifest、App shadow allowlist、legacy response contract、module files 与 test MUST 在同一切片内对齐；任一层缺失时，只能保持 partial、guarded、fallback-only 或 unknown-needs-triage。 本 requirement MUST 作为后续执行、格式自检和退役评审的强制约束。

#### Scenario: 新增或改写 app legacy endpoint 定义

- **WHEN** 在 `apps/api/server/modules/<module>/legacy-endpoints.ts` 新增或改写 app legacy endpoint
- **THEN** handler 必须采用 `({ query, body, event }) => get<Module>Runtime(event).legacyAdapter.<method>(...)` 或等价只读/写入最小形状，并只通过共享输入适配逻辑处理 query/body；不得在 `legacy-endpoints.ts` 内写业务查询、构造兼容数据、创建 adapter/service/repository、直接访问数据库或手写 response envelope

#### Scenario: 对齐 endpoint 多层证据

- **WHEN** endpoint 被加入 runtime manifest、App shadow allowlist、response contract 或迁移测试
- **THEN** legacy path、method、owner module、cutoverStatus、dataSourceStatus、guard/fallback 口径和 response envelope 必须互相一致；manifest-only、allowlist-only、contract-only、module-only 或 test-only 都不能单独证明接口已 cutover

#### Scenario: 发现格式偏差

- **WHEN** 新增代码绕过 runtime 的 `legacyAdapter`、在 `legacy-endpoints.ts` 里内联 mock/store/DB 逻辑、复制旧 app server handler、只注册 manifest 不补 module files/test，或让 allowlist 指向尚无统一 handler 的旧路径
- **THEN** 该写法属于违反规范的偏差，不能作为迁移完成证据；必须回到统一分层并补齐 runtime manifest、allowlist、response contract 与 Vitest/infra test 后才能升级状态

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

### Requirement: Admin 收费缴费与 App 缴费 legacy 双端边界

Admin 收费/缴费证据与 App 缴费 legacy 证据 MUST 分开判断。`property-manage/expense-manage/**`、`property-manage/report-manage/**`、`house-charge`、`payment-review` 等 admin canonical/list/CRUD 证据不能推导 `/app/fee/**`、`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable` 或 `/app/fee.saveRoomCreateFee` 已完成；App 缴费 legacy 必须独立保留旧路径、旧 envelope、移动端调用端、guard/fallback、数据源 gap 和写入闭环。

#### Scenario: Admin 费用证据存在

- **WHEN** admin 费用或收费模块已有 manifest、contract、HTTP gate、页面 Network 或部分 DB repository 证据
- **THEN** 只能升级对应 admin endpoint 的证据字段，不能把 app 缴费 legacy 标记为 caller-verified、DB-ready、write-ready 或 retirement candidate

#### Scenario: App 缴费 endpoint 升级

- **WHEN** `/app/fee/**`、`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable` 或 `/app/fee.saveRoomCreateFee` 准备升级状态
- **THEN** 必须提供 app H5 或 HTTP 调用证据、legacy response contract、fallback/shadow-off、真实数据源或明确 gap、guard/write-read-rollback 证据；缺任一层时保持 app legacy partial/guarded/blocked

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

### Requirement: App mock 与测试不得库化依赖旧 server

旧内置 Nitro 退役前，`apps/app/src/api/mock/**` 与 `apps/app/src/tests/nitro-runtime/**` MUST 不再直接导入 `apps/app/server/modules/**`、`apps/app/server/shared/runtime/**` 或等价旧 server 文件。App 侧测试只能保留前端 URL 解析、调用端 base URL、shadow/standalone 配置等前端职责；endpoint、repository、runtime registry、legacy adapter 和 fallback 行为测试必须迁到 `apps/api/tests/**` 或改为不依赖旧 server。

#### Scenario: mock 文件导入旧 server modules

- **WHEN** `apps/app/src/api/mock/*.mock.ts` 仍导入 `../../../server/modules/**`
- **THEN** `apps/app/server` 目录必须保持 `blocked`，mock 必须逐文件改为 app-local fixture、独立 `apps/api` helper 或删除冗余 mock

#### Scenario: nitro-runtime 测试导入旧 server

- **WHEN** `apps/app/src/tests/nitro-runtime/**` 仍把旧 `apps/app/server` 当作 runtime library
- **THEN** 该测试必须迁入 `apps/api/tests/legacy`、`apps/api/tests/runtime` 或改为纯前端配置测试；不得用这些测试证明旧 server 可删除

### Requirement: App 内置 Nitro 构建退役

`apps/app` 完成退役切流后 MUST 不再拥有自有 Nitro build/dev/preview/runtime。`apps/app/package.json`、`apps/app/turbo.json`、`apps/app/vite.config.ts`、`apps/app/nitro.config.ts` 和 app dev scripts 中任何启动或构建 app Nitro 的入口都会阻断 `apps/app/server` 删除。

#### Scenario: app 仍有 legacy-dispatch handler

- **WHEN** `apps/app/nitro.config.ts` 仍把 `/app/**` 或 `/callComponent/**` 指向 `./server/handlers/legacy-dispatch`
- **THEN** app 内置 Nitro 未退役，必须先由 `apps/api` exact handler、guard/blocked 契约和 fallback-off 证据承接

#### Scenario: app production standalone 已配置

- **WHEN** app production shadow-disabled 或 standalone base URL 指向 `apps/api`
- **THEN** 仍必须验证 mock/test/Nitro build/fallback-only 均已清理；生产 base URL 成功不能单独证明 `apps/app/server` 可删除

### Requirement: App fallback-only endpoint 收口

App fallback-only endpoint MUST 在删除旧 app server 前逐项收口为 exact handler、guarded write、explicit blocked、diagnostic/not-candidate 或删除候选外保留项。历史 150 个 fallback-only 只是 dated snapshot，后续执行前必须 fresh scan。只要存在未归类 fallback-only，`apps/app/server` 就不得升级为 `delete-candidate`。

#### Scenario: fallback-only 清单刷新

- **WHEN** 后续代理准备推进 app server 删除
- **THEN** 必须重新扫描 `apps/app/server/modules/**` 与 `apps/api/server/shared/runtime/runtime-endpoints.ts`，刷新 exact/fallback/diagnostic 差集，再按小批次推进

#### Scenario: endpoint 无法短期迁移

- **WHEN** fallback-only endpoint 因数据源、写入风险、旧字段语义或页面调用不清而无法迁移
- **THEN** 必须显式标记为 `blocked`、`guarded` 或 `not-candidate`，并说明为何不会继续依赖旧 app server fallback
