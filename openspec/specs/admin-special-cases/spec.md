# admin-special-cases Specification

## Purpose

TBD - created by archiving change migrate-superpowers-docs-to-openspec-longtask. Update Purpose after archive.

## Requirements

### Requirement: Admin 特殊端点必须脱离普通 list 批次

Admin 特殊端点必须从普通 list cutover 中分离。upload、R2、create、update、delete、detail、tree、debug、payment-like、file、批量操作或任何有副作用的 endpoint，都不能被普通 list endpoint 的完成证据覆盖。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Contract manage 拆分

- **WHEN** 继续处理 `property-manage/contract-manage`
- **THEN** 12 个普通 list endpoint 必须与 `upload/{init,sign-part,complete,status,abort}`、`change/{create,update,delete,detail}`、`draft-contract/{create,update,delete,detail}` 分开记录、分开验证、分开升级状态

#### Scenario: 特殊端点被普通 HTTP 200 覆盖

- **WHEN** 特殊端点只有直接 HTTP gate 200 或 mock response
- **THEN** 不得标记为完成或 retirement candidate，必须继续记录其特殊风险和缺失证据

### Requirement: Contract Upload / R2 迁移前置评审

Contract upload 5 个接口迁移前必须完成独立 R2 评审。评审必须覆盖 `@aws-sdk/client-s3`、`@aws-sdk/s3-request-presigner` 依赖，Cloudflare R2 环境变量，`ctUploadSessions` 与 `ctUploadSessionParts` 表，旧 upload-service 行为，前端断点续传 hook，fallback/rollback 方案和安全边界。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: R2 环境未确认

- **WHEN** R2 endpoint、bucket、access key、secret、public base URL 或 upload session 表未确认
- **THEN** upload endpoint 必须保持 `blocked-pending-r2-env` 或独立评审状态，不能因 `apps/api` 存在 mock/in-memory response 而升级

#### Scenario: 迁移 upload 实现

- **WHEN** 真正实施 contract upload 迁移
- **THEN** 必须证明 init、sign-part、complete、status、abort 的旧契约兼容、R2 multipart 行为、DB session/part 写入、异常清理、重复调用幂等和前端断点续传 hook 切流

#### Scenario: complete 后 cleanup 与 residual 验证

- **WHEN** contract upload 通过 signed URL 上传分片并调用 complete 生成 completed object
- **THEN** 必须证明 complete 后对象可按脱敏方式验证存在，并且 cleanup 或 abort cleanup 后 MUST 证明 public URL 不再暴露、uploaded parts 已清空、missing parts 回到预期值、旧对象 HEAD 不再可访问；没有 cleanup/residual 证据时不得关闭 upload/R2 迁移任务

#### Scenario: 生产 completed cleanup 仍有残留

- **WHEN** 生产 complete 后调用 cleanup 或 abort 返回成功但 session 仍为 `completed`、uploadedParts 仍存在、public URL 仍可访问或旧对象 HEAD 仍返回 200
- **THEN** 必须把 task102 保持 blocked，并停止新增生产 R2 写入；后续只能先修复和复验 cleanup/residual，不得继续用更多生产对象验证页面上传或断点续传

#### Scenario: 本地 production env 不等于生产证据

- **WHEN** 本地 `apps/api` dev runtime 使用从 Vercel production env 拉取的本地环境文件完成 R2 drill
- **THEN** 该证据 MUST 只记录为本地 runtime 真实 R2 验证；除非另有生产公开 HTTP 或 admin 页面上传组件 Network 同步完成同一链路，否则不得替代生产 complete、生产 cleanup/residual 或前端 shared-upload 断点续传证据

### Requirement: R2 浏览器直传与 server-side drill 边界

Contract upload 的浏览器直传链路与 server-side multipart drill MUST 分层记录。浏览器 shared-upload 断点续传闭环需要 admin 页面真实触发 `init`、`status`、`sign-part`，并由浏览器对 signed URL 发起 R2 `PUT`；R2 bucket CORS 必须允许目标 origin 的预检和上传响应。server-side drill 可以验证 `apps/api` 控制面、R2 multipart、DB session 和 cleanup 行为，但不能替代浏览器 CORS 与 shared-upload 页面证据。

#### Scenario: 浏览器直传被 CORS 预检阻断

- **WHEN** admin 页面已经拿到 signed URL，但浏览器 `OPTIONS` 或 `PUT` 被 R2 CORS 缺少 `Access-Control-Allow-Origin` 阻断
- **THEN** 只能记录为 `control-plane-ok / browser-put-blocked` 或等价 partial evidence；不得把它写成 R2 multipart 页面闭环完成，也不得据此否定 `apps/api` 的 init、sign、status 或 DB session 控制面能力

#### Scenario: R2 bucket CORS 修复后重试页面上传

- **WHEN** 后续代理调整或确认 R2 bucket CORS 后重试 admin shared-upload
- **THEN** 必须重新采集浏览器 `OPTIONS`、`PUT`、response header、断点续传状态、complete、cleanup/residual 和页面 Network；不得沿用 CORS 修复前的页面 partial 证据直接关闭 task102

#### Scenario: 使用 server-side multipart drill

- **WHEN** 后续代理使用 Node、服务端请求或等价非浏览器方式执行 `init -> sign-part -> PUT signed URL -> status -> complete -> public HEAD -> cleanup/abort -> residual HEAD`
- **THEN** 可以作为 R2 控制面、对象写入、DB session 读回和 residual check 证据；但必须单独标记为 server-side drill，不能关闭浏览器 shared-upload 断点续传、页面 Network、R2 CORS 或旧服务退役任务

### Requirement: Admin CUD 与 Detail 的真实数据闭环

Admin create、update、delete、detail 端点必须证明真实数据源、读回、回滚或清理、残留检查和 fallback/shadow 行为。InMemory fallback、mock response 或 route coverage 不足以升级为 DB 完成。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Contract change baseline 未通过

- **WHEN** `property-manage/contract-manage/change/list` 在生产只读 baseline 中返回 `missing FROM-clause entry for table "ct_contracts"` 或其它业务失败
- **THEN** 不得开启 `change` 或 `draft-contract` 的生产 CUD；必须先修复并证明 `health -> ready(DB_READY) -> draft-contract/list -> change/list` 只读链路全部通过

#### Scenario: Create 或 Update endpoint 接入 Drizzle

- **WHEN** create 或 update endpoint 声称已接入真实 DB
- **THEN** 必须有插入或更新后的读回证据，包含主键、关键业务字段、时间戳或状态字段，并记录 cleanup 或回滚方式

#### Scenario: Delete endpoint 被验证

- **WHEN** delete endpoint 被验证
- **THEN** 必须证明目标记录是可删除测试数据，删除后可按主键或 `phase7RunId` 查无残留，且不会破坏真实业务对象

#### Scenario: Detail endpoint 只有 list 数据拼装

- **WHEN** detail endpoint 只是复用 list 的兼容默认或静态拼装
- **THEN** 必须保持 gap 状态，直到证明 detail 字段来自正确 repository/service 或明确记录为非 DB 兼容实现

### Requirement: Edge Endpoint 单独决策

`debug-env.get.ts`、`j1-dashboard/center/commonmenu/get.ts`、`setting-manage/organize-manage/org-info/tree.post.ts` 等边缘接口必须单独决策。它们可能是调试、导航、树结构或环境信息接口，不得被普通 CRUD 批次自动纳入可退役。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 发现调试或环境端点

- **WHEN** endpoint 暴露环境、调试、菜单或公共树结构信息
- **THEN** 必须判断是否应该迁入 `apps/api`、保留在旧服务、限制用途、改成 health/debug 能力，或排除出退役候选

### Requirement: 特殊端点证据不得越权升级

特殊端点的完成状态必须由对应风险证据决定。HTTP gate、hook resolver、页面 list 请求和 route 文件存在，只能作为辅助证据，不能代替 R2、DB、写入、回滚、安全和幂等证据。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: HTTP gate 通过但缺真实交互

- **WHEN** CUD/upload endpoint 的 HTTP gate 通过，但没有通过页面按钮、弹窗、上传组件或真实调用路径触发
- **THEN** 必须记录为 HTTP evidence only，并继续要求真实交互证据或明确无页面原因
