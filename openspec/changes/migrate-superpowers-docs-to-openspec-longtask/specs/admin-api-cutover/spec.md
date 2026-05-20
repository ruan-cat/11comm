## ADDED Requirements

### Requirement: Admin 旧 Nitro 源流定位

Admin cutover 必须被视为统一 `apps/api` 合并中的 admin legacy Nitro stream。旧来源是 `apps/admin/server/api/**`；长期目标是 `apps/api/server/routes/api/**`、`apps/api/server/modules/**` 和 admin 前端通过 `resolveAdminApiRequestUrl` 消费统一 API。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 总结 admin 迁移进度

- **WHEN** 后续代理总结 admin cutover
- **THEN** 必须说明哪些 `apps/admin/server/api/**` 职责已被 `apps/api` 承接，哪些仍缺 caller、DB、fallback、browser、HTTP gate、write/read/rollback 或 retirement evidence

### Requirement: 按业务路径组织 Admin 迁移

Admin endpoint 迁移必须以 `apps/admin/src/router/rank/rank-route-keys.ts` 体现的三级业务路径为 canonical 业务坐标。不得凭空新建业务路径，不得只按文件名或旧 URL 粗略归组。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 迁移一个 admin list endpoint

- **WHEN** 迁移或复核一个 admin list endpoint
- **THEN** OpenSpec 进度必须记录业务路径、旧 `apps/admin/server/api/**` 路径、目标 `apps/api` route、owner module、response contract、resolver 状态、测试文件、HTTP/page 证据和剩余证据缺口

#### Scenario: 业务路径无法匹配

- **WHEN** 旧 admin endpoint 无法映射到已有三级业务路径
- **THEN** 必须记录为 unknown-needs-triage 或 edge decision，不得为了迁移方便凭空创建路径

### Requirement: Admin Endpoint 类型分级

Admin endpoint 必须按类型分级处理：list、detail、create、update、delete、tree、debug、upload、file、payment-like 或其它 side-effect endpoint。普通 list 端点的证据不能自动覆盖 detail/CUD/upload/file 端点。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 普通 list 端点完成

- **WHEN** 一个普通 list endpoint 已有 `apps/api` route、runtime manifest、contract test 和 HTTP gate
- **THEN** 只能把该 list endpoint 标记为本地 manifest/contract/HTTP gate 已覆盖；仍不得推导同域 detail/create/update/delete/upload 完成

#### Scenario: CUD endpoint 只有 route

- **WHEN** create、update、delete 或 detail route 已在 `apps/api` 中存在，但缺少真实 DB、读回、回滚或页面交互证据
- **THEN** endpoint 必须保持非退役状态，并记录缺少的数据源、页面交互或回滚证据

### Requirement: `property-manage/contract-manage` 下一切片

当前下一推荐 admin 切片是 `property-manage/contract-manage` 12 个普通 list endpoint：`archive/list`、`attachment/list`、`clause/list`、`change/list`、`draft-contract/list`、`expire/list`、`first-party/list`、`print/list`、`review/list`、`second-party/list`、`template/list`、`type/list`。该切片只处理 list 的 runtime manifest、contract 和 HTTP gate，不纳入 upload/R2、CUD、delete、detail。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 继续 contract-manage list

- **WHEN** 后续代理执行 `contract-manage` 下一切片
- **THEN** 必须把 12 个普通 list 拆成小组推进，每组记录 manifest、contract test、HTTP gate、ownerModule、cutoverStatus 和仍缺证据

#### Scenario: upload 或 CUD 被混入 list 切片

- **WHEN** `upload/{init,sign-part,complete,status,abort}`、`change/{create,update,delete,detail}` 或 `draft-contract/{create,update,delete,detail}` 被放入普通 list 切片
- **THEN** 必须阻止合批，并转入 admin-special-cases 约束下的独立评审

### Requirement: Admin 前端 Resolver 完成态与回归扫描

OpenSpec 必须保留 admin 前端 resolver 迁移已记录为完成的当前口径，同时要求后续 fresh scan 复核。resolver 完成不代表生产 `DB_READY`、真实库样本、页面 CRUD 交互、shadow-off/fallback 或旧服务退役。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 后续代理复核 admin hooks

- **WHEN** 后续代理扫描 `apps/admin/src/api/**/index.ts`
- **THEN** 如果未发现新的硬编码 `/api/**` 绕过 `resolveAdminApiRequestUrl`，则继续把 resolver 迁移视为完成，并把精力放在 runtime、DB、fallback、browser、retirement evidence

#### Scenario: 发现新的硬编码旧 API

- **WHEN** fresh scan 发现新的业务 hook 直接硬编码旧 `/api/**`
- **THEN** 必须记录为 Phase7 regression，并在 admin cutover backlog 中新增修复与验证任务

### Requirement: Admin 验证证据分层

Admin cutover 必须区分 hook-level resolver evidence、page-level Chrome Network evidence、direct HTTP gate evidence、contract/module test、production evidence。不同证据层级不能互相替代。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 无独立页面入口

- **WHEN** endpoint 没有独立页面入口，或只能通过弹窗、按钮、批量操作、上传组件触发
- **THEN** 必须记录无页面原因，并补 HTTP gate、contract evidence 或交互级页面证据；不得静默升级为 browserEvidence

#### Scenario: 页面 list 请求成功

- **WHEN** list 页面通过 `/api-shadow` 返回 200
- **THEN** 只能证明该页面 list 读路径可达，不得推导同页面的新增、编辑、删除、详情、上传、审批、支付等操作完成

### Requirement: Admin manifest 与 HTTP gate 证据最低字段

Admin runtime manifest、contract test 和 HTTP gate 证据 MUST 至少记录 `targetClient=admin`、`routeKind=admin-canonical`、`responseContract`、`ownerModule`、`cutoverStatus`、旧路径、目标 route、HTTP method、测试文件、运行命令、端口或 base URL、响应摘要和剩余缺口。旧矩阵中 2026-05-19 的 operation、patrol/parking、expense、report、community、house-property 小片证据只代表本地 manifest/contract/HTTP gate，不能自动升级生产 `DB_READY`、真实库样本、shadow-off/fallback 或退役候选。

#### Scenario: 记录一个 admin list HTTP gate

- **WHEN** 后续代理为 admin list endpoint 补 runtime manifest、contract test 或 fetch 型 HTTP gate
- **THEN** 必须写明 ownerModule、cutoverStatus、测试命令和是否只是 `available-in-apps-api-not-caller-verified`

#### Scenario: 复用 2026-05-19 小片证据

- **WHEN** 引用 operation-team 13 个、patrol/parking 10 个、expense-manage 14 个、report-manage 12 个、community-manage 7 个或 house-property-manage 10 个 manifest/HTTP gate 证据
- **THEN** 必须标为 local manifest/contract/HTTP gate 历史证据，并继续保留生产 DB、真实库样本、shadow-off/fallback、页面交互和退役缺口

### Requirement: Admin 旧服务退役准备度

Admin old path exact coverage 不能作为删除 `apps/admin/server` 的证明。Admin 退役准备必须同时具备统一 Nitro 承接证据、调用端证据、DB 或接受的非 DB 解释、页面或 HTTP gate、fallback/shadow-off、写入口闭环、retirement gate 评审。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Admin old path exact coverage 完成

- **WHEN** admin old path exact coverage 被记录为 155/155
- **THEN** `apps/admin/server` 仍保持受保护，直到 retirement gate 对所有 endpoint 完成归类和独立评审
