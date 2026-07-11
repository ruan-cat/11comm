# admin-api-cutover Specification

## Purpose

TBD - created by archiving change migrate-superpowers-docs-to-openspec-longtask. Update Purpose after archive.

## Requirements

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

### Requirement: Admin 内置 Nitro 构建退役

`apps/admin` 完成旧内置 Nitro 退役后 MUST 不再通过 Vite Nitro plugin、`apps/admin/nitro.config.ts`、`serverDir: "./server"`、`scanDirs: ["./server"]`、Nitro build script 或 Vercel Nitro script 运行本包 server。Admin 前端必须通过 `resolveAdminApiRequestUrl` 或等价 resolver 消费独立 `apps/api`，不得把 `apps/admin/server` 作为 dev、build、CI 或 production API 入口。

#### Scenario: admin Vite 仍加载 Nitro

- **WHEN** `apps/admin/build/plugins/index.ts` 仍导入 `nitro/vite` 或调用 `nitro()`
- **THEN** admin 内置 Nitro 未退役，`apps/admin/server` 必须保持 `blocked`

#### Scenario: admin Nitro config 仍被脚本使用

- **WHEN** `apps/admin/nitro.config.ts` 仍被 `package.json`、Vercel build、CI 或 dev script 调用
- **THEN** admin 仍具备自有 Nitro runtime，不能删除 `apps/admin/server`

### Requirement: Admin legacy DB、seed 与 Drizzle compatibility 退役

`apps/admin/server/db/**`、`apps/admin/server/db/seed/**`、`apps/admin/drizzle.config.ts` 和 admin 侧 `db:*` / `db:legacy:*` script MUST 在删除 `apps/admin/server` 前迁入 `apps/api` 或显式废弃。任何生产 migration、schema drift、readiness、seed、reset 或 CUD 验证都不得继续把 admin 包作为权威入口。带有 destructive reset 语义的旧 seed/reset 命令不得作为现行操作保留。

#### Scenario: admin db script 仍存在

- **WHEN** `apps/admin/package.json` 仍包含可执行 `db:*` 或 `db:legacy:*` 入口
- **THEN** 必须确认它们已被删除、改为 fail-closed notice、或转向 `apps/api`；否则 `apps/admin/server` 状态保持 `blocked`

#### Scenario: seed 仍有业务价值

- **WHEN** 旧 `apps/admin/server/db/seed/**` 中的 seed 运维仍需要保留
- **THEN** 必须迁入 `apps/api` 的 package-local seed/dry-run seed 入口，并补缺 DB URL fail-closed、dry-run、回滚和不直接破坏生产库的规范

### Requirement: Admin R2/upload 源依赖退役

Contract upload 的 R2 client、env 读取、upload session repository、multipart control plane 和 cleanup/residual 证据 MUST 由 `apps/api` 承接。删除 `apps/admin/server` 前，admin 页面和 shared-upload 组件必须证明在 standalone/shadow-off 或目标生产配置下命中 `apps/api`，且不再依赖旧 admin server 同域 upload route 或旧 `server/services/**`、`server/utils/r2-*`。

#### Scenario: upload hook 仍依赖同域旧 API

- **WHEN** admin upload hook、页面或 env 配置仍可能把 upload control plane 发往同域 `/api/**` 的旧 admin Nitro
- **THEN** 必须补 URL resolver 测试、页面 Network 证据和生产 CORS/R2 evidence，不能删除旧 upload source

#### Scenario: server-side R2 drill 通过

- **WHEN** `apps/api` server-side R2 multipart drill 通过
- **THEN** 只能证明 API control plane 和 R2 gateway 可用；仍需 admin 浏览器 shared-upload、R2 CORS、cleanup/residual 和 standalone/shadow-off 证据才能推进目录删除

### Requirement: Admin generator 与活动文档不得继续指向旧 server

旧内置 Nitro 退役前，活动生成器、指南和部署文档 MUST 不再引导新增 `apps/admin/server/**`、从 admin 运行 Drizzle、或把 admin Nitro 作为生产 API。历史 reports 可以保留迁移来源表述，但现行 guide、script 和 prompt 入口必须改到 `apps/api` 或明确标记废弃。

#### Scenario: generator 仍生成 admin server route

- **WHEN** `scripts/generate-tasks.ts` 或等价脚本仍生成 `apps/admin/server/api/**`
- **THEN** 该脚本必须迁移或废弃，否则 admin server 目录保持 `blocked`

#### Scenario: 活动 guide 仍说明 admin db/seed

- **WHEN** `apps/admin/src/docs/guides/**` 仍把 admin server、admin Drizzle 或 admin seed 写成现行操作入口
- **THEN** 必须更新到 `apps/api`，并在 retirement evidence 中记录扫描结果
