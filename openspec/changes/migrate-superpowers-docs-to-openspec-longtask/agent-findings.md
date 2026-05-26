# 代理发现记录

## 2026-05-26 task102 R2 生产 abort-only 阻断边界

Laplace 只读探索确认，当前 `upload/init`、`sign-part`、`status`、`complete`、`abort` 的公开 API 字段足以设计最小 abort-only 演练，但不适合执行 `complete+cleanup`：代码中没有 `DeleteObjectCommand`，也没有公开删除 completed object 的 API；一旦 complete 成功，后续 `abort` 对 completed session 只会返回 `completed` 状态，不会清理对象。因此生产闭环优先顺序只能是 `health -> ready(DB_READY) -> init -> sign-part -> status -> abort -> status`，且即使 abort-only 成功，也只能证明 R2 control-plane、DB session read-back 和 abort 状态持久化，不能证明 completed object 清理。

本轮实际生产尝试在 `init` 阶段被旧 placeholder 阻断。Vercel CLI 只读确认生产项目存在 R2 env key 与 `RUN_PHASE7_DB_READINESS_CHECK`，但公开 HTTP `POST /api/property-manage/contract-manage/upload/init` 返回 body `success=false`、code `409`，message 仍是旧 hard-block 文案 `R2 upload is blocked in apps/api until R2 env, AWS SDK, upload session repository, and resumable upload verification are migrated.`。同轮 `GET /__nitro/ready` 已返回 `DB_READY`，所以该结果不能写成 DB readiness 缺失，也不能简单写成 R2 secret 缺失；更保守的结论是生产别名当前命中的 runtime 仍是旧 upload block 代码路径，或者生产部署未包含本地 R2 upload-service 改动。

证据文件为 `.tmp/phase7-dev-browser/2026-05-26-task102-r2-production-abort-blocked.md`。本轮没有拉取或输出 Vercel/R2 secret，没有保存完整 signed URL，没有创建 sessionId，没有执行 sign-part/status/abort/complete，没有产生 completed R2 object。

No-go：不得把 Vercel env key 存在、`DB_READY` 或本地 R2 控制面测试写成生产 R2 multipart 可用；不得把旧 409 placeholder 写成生产 upload session read-back、rollback、residual 或页面断点续传完成；task102 必须保持 open。

## 2026-05-26 contract change/draft-contract 删除 payload 契约边界

Hume 只读审计确认 `property-manage/contract-manage/change` 与 `draft-contract` 的 8 个 detail/CUD endpoint 仍不能关闭，但发现一个必须先消除的页面级删除契约缺口：页面和类型侧使用 `{ ids: [...] }` 删除 payload，`apps/api/server/modules/contract/admin-adapter.ts` 原本只读取 `{ id }`。如果不修复，后续真实页面点击删除即使前端发起请求，也无法完成生产 read-back、cleanup 或 residual 闭环。

本轮按窄口径修复该前置缺口：`deleteChange` 与 `deleteDraftContract` 现在通过统一 helper 接受 `{ id }` 或 `{ ids: [id] }`，并对缺失、空数组、空白 id 保持 400 失败边界；`apps/api/tests/admin/contract-change-draft-crud.test.ts` 增加 `{ ids }` 契约测试；`apps/admin/src/pages/property-manage/contract-manage/draft-contract/tests/api.test.ts` 同步使用页面真实的 `{ ids: [...] }` payload。验证结果已回写到 `tasks.md` 与 `agent-progress.md`。

No-go：这不是 task101 的关闭证据。当前仍缺生产 CUD HTTP gate、真实 admin 页面新增/编辑/删除点击证据、`change` 父合同哨兵创建与清理顺序证明、write/read-back/rollback/residual 记录、生产页面 Network、shadow-off/fallback 和 retirement ledger。后续做 contract CUD 生产验收时，仍必须按 `db-readiness-and-write-verification` 的唯一闭环顺序执行。

## 2026-05-26 Neon main 与生产 CUD 规范补强边界

本轮回应用户对 Neon 数据库真实 CUD 测试规范的质疑，复核并补强 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/db-readiness-and-write-verification/spec.md`。Maxwell 只读审计结论为 PASS：现有 requirement 已明确 Neon 真实库验收只能走生产或受控 Vercel `apps/api` runtime 的公开 HTTP endpoint，且生产 CUD 只能经公开 `apps/api` HTTP endpoint 触发业务 handler，不能用 Neon 测试分支、fake DB、直接 DB 脚本、`psql`、Drizzle 临时脚本、import handler/service/repository、HTTP 200 或 Vitest mock 替代。

Dewey 做了最小增量补强：新增“远程 runtime env 未被公开 ready 证明”，明确 `RUN_PHASE7_DB_READINESS_CHECK=1` 只在本机 shell、本地 `.env` 或未命中目标 Vercel runtime 时无效，必须由公开 HTTP `GET /__nitro/ready` 返回 `DB_READY` 证明目标 runtime 生效；新增“已授权写入窗口的逐步证据记录”，即便用户已授权写入窗口，也必须记录 `writeWindow`、`operator`、`phase7RunId`、`requestIdByStep`、`httpStatusByStep` 与 `sanitizedPayloadSummary`，且禁止记录 token、secret、cookie、真实连接串、完整账号凭据或完整生产 payload；新增“无法完成 residual check”，无哨兵字段或无法查残留时保持 blocked；新增“生产 CUD 按唯一闭环顺序执行”，固定为 `health -> ready(DB_READY) -> baseline/guard-before -> 开写入窗口 -> create/update/delete 等公开 HTTP -> read-back -> cleanup/rollback -> residual check -> 关闭窗口/guard-after 或 guard-not-applicable`，任一步失败后不得继续同批其它 endpoint。

验证结果：`openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过。No-go：本轮是规范与接力记录补强，不代表已新执行 Neon main 写入、不代表任何业务 endpoint 新增完成证据、不代表 R2 multipart、生产页面 Network、fallback/shadow-off、retirement ledger 或旧服务目录退役完成。

## 2026-05-26 task815 App shadow-disabled 关闭边界

本轮把 task815 从“runtime fallback-off partial”推进到 App legacy 目标 endpoint 的最小闭环：旧 fallback 不可达时 exact handler 仍由 `apps/api` 承接，且 App H5 production standalone 配置在 `VITE_11COMM_API_SHADOW_ENABLE=false` 时仍将目标请求解析到统一 `apps/api` 生产域。新增测试位于 `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`，测试名为 `routes production app requests through the unified standalone server when shadow is disabled`，覆盖 `/app/floor.queryFloors`、`/app/owner.queryOwnerAndMembers` 和 `/app/owner.saveRoomOwner`，并明确 production 的 `VITE_SERVER_BASEURL=https://01s-11-server.ruan-cat.com` 与 legacy local env 的旧 runtime fallback 语义不同。

验证链路分三层：App runtime 单测 `pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts` 通过，1 文件 117 tests passed；API runtime fallback-off 单测 `pnpm -F @01s-11comm/api exec vitest run tests/runtime/legacy-dispatch-fallback-drill.test.ts tests/runtime/legacy-fallback.test.ts tests/runtime/endpoint-registry.test.ts` 通过，3 文件 8 tests passed；生产目标 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "serves app legacy floor list and detail DB synthetic id over real HTTP"` 通过，1 个目标测试 passed、24 skipped。

边界必须保守：Ampere 只读复核确认 admin resolver 的 shadow disabled 仍返回 same-origin `/api/**`，不是 `apps/api` base；`apps/admin/vite.config.ts` 也只在 `/api-shadow` proxy 模式下转发。task815 关闭不能写成 admin `property-manage/report-manage/expense-summary-table/list` shadow-off 完成，不能替代 task203，也不能证明生产页面 shadow-off Network、allowlist 全量移除、retirement ledger、旧服务引用清零、独立退役评审或旧服务目录可删除。

## 2026-05-26 task102 R2 multipart 本地控制面完成边界

本轮把 `property-manage/contract-manage/upload/{init,sign-part,complete,abort,status}` 从旧的 hard-block placeholder 推进到 `apps/api` 本地 R2 multipart 控制面。新增 `apps/api/server/shared/runtime/r2-env.ts`、`apps/api/server/shared/runtime/r2-client.ts` 与 `apps/api/server/modules/contract/upload-service.ts`，并在 `contract` service/runtime/admin-adapter/index 与 `runtime-endpoints.ts` 接入；`apps/api/package.json` 与 `pnpm-lock.yaml` 已加入 `@aws-sdk/client-s3` 和 `@aws-sdk/s3-request-presigner`。

实现边界：默认 gateway 使用 AWS SDK v3 的 multipart S3/R2 命令和 presigner；DB repository 落到 `ctUploadSessions` / `ctUploadSessionParts`；`initUpload` 会创建或复用 session，`signPart` 签发 part URL，`getStatus` 同步 R2 parts 到 session parts，`completeUpload` 校验缺失 part 后 complete 并写入 public URL，`abortUpload` 对 completed/aborted 保持幂等。5 个 upload endpoint 进入 runtime manifest，phase 为 `phase7-contract-manage-upload-r2`，status 为 `available-in-apps-api-not-caller-verified`。

验证通过：`RUN_PHASE7_DB_READINESS_CHECK=1 pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-upload-r2-blocked.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/runtime/legacy-dispatch-fallback-drill.test.ts tests/runtime/legacy-fallback.test.ts tests/runtime/endpoint-registry.test.ts` 为 6 文件 50 tests passed；`RUN_PHASE7_DB_READINESS_CHECK=1 pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-change-draft-crud.test.ts tests/http/phase7-gated-http.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 为 3 文件 40 tests passed + 1 文件 25 skipped；`RUN_PHASE7_DB_READINESS_CHECK=1 pnpm -F @01s-11comm/api run typecheck` 通过；`openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过。

复核风险已收口：`r2-env.ts` 不再只读 `process.env`，而是按 Cloudflare runtime env、`process.env`、Nitro runtimeConfig 顺序解析；真实 runtime 无 DB URL 时不再用 in-memory upload repository，而是通过受控 `503 upload persistence unavailable` 阻断；终态 session 的 status 不再访问 R2 `ListParts`；`completeUpload` 不再只凭 R2 上存在完整 parts 就接受客户端子集，而是校验提交 parts 覆盖完整 part 序列且 ETag 与 R2 listed parts 完全一致。新增专项测试把这 4 个点固化为 11 个测试，复验专项、组合矩阵、API typecheck、OpenSpec strict 和 diff check 均通过。

No-go：本轮没有拉取或输出 Vercel/R2 secret，没有真实 R2 object 上传、complete、abort，没有生产 upload session DB 写入读回清理，没有生产 admin H5 页面断点续传 Network，没有前端 shared-upload 闭环，没有 R2 residual check，也没有旧服务退役前 shadow-off/fallback/retirement 证据。因此 task102 继续保持未完成，不能写成生产 R2 上传完成、页面上传完成、R2 env 已实证可用或旧服务可退役。

## 2026-05-26 task203/task815 shadow-off 边界复核

本轮正向补强只限于 report hook anti-alias 与 runtime fallback-off 复跑。`apps/admin/src/api/property-manage/report-manage/expense-summary-table/tests/index.test.ts` 新增 helper 后，shadow disabled、shadow proxy、direct apps/api base 三个分支都断言 URL 包含 `/report-manage/expense-summary-table/` 且不包含 `/expense-manage/`；这能防止 report hook alias 到 expense-manage，但不能证明 shadow disabled 命中独立 `apps/api`。

阻断结论更关键：`resolveAdminApiRequestUrl(...)` 在 `VITE_11COMM_API_SHADOW_ENABLE !== "true"` 时直接返回原始 same-origin `/api/**`；`apps/admin/vite.config.ts` 只在 `/api-shadow` proxy 模式下转发到 `VITE_11COMM_API_BASE_URL`；生产 `.env.production` 当前是 shadow enabled + direct `https://01s-11-server.ruan-cat.com`。因此本轮没有证据证明 shadow disabled 下的相对 `/api/**` 会被 rewrite 到独立 `apps/api`。旧 2026-05-21 同域 `/api/property-manage/report-manage/expense-summary-table/list` 返回 legacy/source 字段，继续作为 shadow-off no-go。

验证通过：`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/report-manage/expense-summary-table/tests/index.test.ts src/utils/http/tests/api-base-url.test.ts` 为 2 文件 12 tests passed；`pnpm -F @01s-11comm/api exec vitest run tests/admin/report-manage-expense-summary-table.test.ts tests/runtime/legacy-dispatch-fallback-drill.test.ts tests/runtime/legacy-fallback.test.ts tests/runtime/endpoint-registry.test.ts` 为 4 文件 12 tests passed。证据汇总见 `.tmp/phase7-dev-browser/2026-05-26-task815-shadow-off-boundary-review.md`。

No-go：不得把 hook 单测、resolver 单测、runtime fallback-off 单测、生产 direct API 200、生产 admin H5 shadow-enabled 页面 Network 或旧同域 `/api/**` legacy/source 响应写成 admin shadow-off 或全局退役证据。该 checkpoint 当时不能关闭 task815；后续 task815 只按顶部 App production shadow-disabled 关闭边界窄口径关闭。task203、retirement ledger 和旧服务退役仍不能关闭。

## 2026-05-26 task203 report expense-summary-table 证据升级但不关闭

本轮只把 `property-manage/report-manage/expense-summary-table/list` 的生产 DB 证据从旧 `READY_CONFIGURED` 状态升级为生产 `DB_READY` + report 真实库样本，不勾选 task203。生产 API base 仍以 `apps/api/package.json` 的 `homepage=https://01s-11-server.ruan-cat.com` 为准；`/__nitro/health` requestId `req_7a31b51d-4d88-42c0-bfc6-a9fb896db302`，`/__nitro/ready` requestId `req_8eb18452-937a-43c4-9506-1698d4fc928b`，ready code 为 `DB_READY`，database `connected=true` 且 `probeEnabled=true`。目标 endpoint requestId `req_cbe89838-2ed8-4845-b64d-88e3c4db6528`，返回 `total=2/listCount=2`，首条含 `feeItem=物业费`、`currentReceivable=50000.00`、`currentActualReceipt=45000.00`、`chargeRate=90.00%`、`clearanceRate=90.00%`、`statisticsTime=2024-01-01`。

anti-alias 边界继续成立。Galileo 只读复核确认 report route 调 `adminAdapter.listReportExpenseSummaryTables`，service 转 `repository.listReportExpenseSummaryTables`，repository 读 `rptExpenseSummaries` / `rpt_expense_summaries`；runtime manifest 为 `phase7-report-manage-admin-list` 与 owner `fee-report`；admin hook 使用 `resolveAdminApiRequestUrl` 指向 `/api/property-manage/report-manage/expense-summary-table/list`，页面导入 report hook，不是 expense hook。复跑 `pnpm -F @01s-11comm/api exec vitest run tests/admin/report-manage-expense-summary-table.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，4 文件 47 tests passed。

本轮随后补齐生产 admin H5 页面自然 Network 证据。生产 admin 入口按 `apps/admin/package.json` 的 `homepage=https://01s-11comm.ruan-cat.com` 读取；主代理在当前本地浏览器上下文中通过项目已有 SSO 参数进入 `#/property-manage/report-manage/expense-summary-table`，只用于触发页面自然请求，不是真实后端登录态证明，未记录完整 token/cookie，采证后已清理临时 localStorage 与 cookie。页面自然发出 `POST https://01s-11-server.ruan-cat.com/api/property-manage/report-manage/expense-summary-table/list`，HTTP 200，`x-request-id=req_046901e9-7301-44a7-adaf-f54bb8c652e1`，`x-api-phase=phase3-infra`；响应为 `success=true/code=200/total=2/pageIndex=1/pageSize=10`，首条含 `feeItem=物业费`、`currentReceivable=50000.00`、`currentActualReceipt=45000.00`、`chargeRate=90.00%`、`clearanceRate=90.00%`、`statisticsTime=2024-01-01`，第二条含 `feeItem=停车费`、`currentReceivable=30000.00`、`currentActualReceipt=28000.00`、`chargeRate=93.33%`、`clearanceRate=93.33%`、`statisticsTime=2024-02-01`。证据汇总见 `.tmp/phase7-dev-browser/2026-05-26-task203-report-expense-summary-admin-h5-network-evidence.md`。

缺口仍然是 task203 的关闭条件：shadow-off/fallback 演练尚未完成；retirement ledger 与旧服务退役前证据尚未补齐。旧 5/21 同域 `/api/property-manage/report-manage/expense-summary-table/list` 响应为 legacy/source 字段，不能当作独立 API report 契约或 shadow-off 成功。本地 5/18 report-manage 七页页面 Network 不包含 `expense-summary-table`，不能补本项页面证据。Popper 子代理只读复核确认，本轮 SSO 触发的页面 Network 只能按 synthetic/local browser session 证据记录，不能写成真实后端鉴权、生产写入或 shadow-off/fallback。

No-go：不得把生产 API `DB_READY`、HTTP 200、Vitest、同域 legacy `/api/...` 响应、SPA HTML 访问、expense-manage 同名页面或无 Network 语义的 `.tmp` artifact 写成 task203 完成、shadow-off/fallback 成功、retirement ledger 完成或旧服务可退役。本轮生产 admin H5 页面 Network 证据只证明当前页面自然请求命中独立 `apps/api`，不得外推为真实后端鉴权、写入闭环、shadow-off/fallback 或退役结论。

## 2026-05-26 system-config 生产 CUD 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-setting-system-config-cud-evidence.md`，记录生产 `apps/api` 公开 HTTP 的 system-config create、公开 list 全量扫描 read-back、update、旧 `configKey/configValue/configDescription` 清空读回、新 `configKey/configValue/configDescription` 读回、delete 和 residual 0。该证据只支持窄口径关闭 `setting-manage/system-manage/system-config/{list,create,update,delete}`，不代表其它业务模块任务自动完成。

system-config CUD 只覆盖 `smSystemConfigs` / `sm_system_configs`。字段边界是 `configKey` 最长 100 且唯一、`configValue` 文本、`configType` 最长 50、`configDescription` 文本、`status=enabled/disabled`。本轮本地后端已补 `configKey/configType/status` 服务端过滤能力并有红绿测试，但生产预检 requestId `req_2077c83b-a7df-492f-9479-ef634186618c` 证明当前生产部署尚未应用这项本地过滤改动：唯一 `configKey/configType/status` 查询仍返回 `total=1/listCount=1`。因此生产 CUD 读回和残留检查采用公开 HTTP list `pageSize=1000` 全量扫描，再按唯一 `configKey/title`、`configValue`、`description/subtitle` 精确匹配；baseline 和 residual 均证明 `listCount == total == 1`，create/update 窗口内也证明全量扫描覆盖了当时 2 条记录。

成功 runId 为 `syscfg-0526080627-1c2f3c`；`/__nitro/health` requestId `req_fe7aaaa9-0721-4b36-9fb7-c6ffb7ed4054`，`/__nitro/ready` requestId `req_77957d71-0bd0-4e00-b173-d17c68a1a438`，ready code 为 `DB_READY`。CUD requestId 链路为 baseline `req_56f28257-2051-4245-9675-775f23d26835`、create `req_0e3cf905-0350-4f41-b73e-acf40044b7f4`、after-create `req_15774c50-a24c-4285-98f0-04aa36a7c840`、update `req_7259b338-6937-4cd9-b9ae-9418a516ddb9`、after-update `req_2415517a-be8c-4c0d-a2f6-f6faf443d25e`、delete `req_076a2656-5d94-44d3-a858-ce6fac465f15`、residual `req_d05847a8-0a36-425c-86ab-07755b8e7dcb`。早先 runId `syscfg-0526080043-0912af` 同样完成清理，但缺每步响应头 requestId，仅作为 dry run 边界，不作为成功证据主链路。

已知字段边界：生产 list 返回 `description/category` 等展示字段，不一定返回 CUD payload 的 `configDescription/configType` 同名字段；页面映射和生产 read-back 因此显式兼容 `description/category`。不得把本地新增服务端过滤写成生产已部署过滤；不得把全量扫描读回误写成服务端过滤读回。前端页面已从静态展示和模拟保存切换为真实 list/create/update/delete caller；详情因无 detail endpoint 只用当前 row 只读弹窗。

No-go：本轮不关闭 contract、expense、report、R2 或其它 CUD；不代表生产 admin H5 页面真实点击、页面级全局 Network 覆盖、fallback/shadow-off drill、retirement ledger、旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。

## 2026-05-26 register-protocol 生产 CUD 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-setting-system-register-protocol-cud-evidence.md`，记录生产 `apps/api` 公开 HTTP 的 register-protocol create、公开 list 全量扫描 read-back、update、旧 `title/content` 清空读回、新 `title/content` 读回、delete 和 residual 0。该证据只支持窄口径关闭 `setting-manage/system-manage/register-protocol/{list,create,update,delete}`，不代表其它 setting system-manage 任务自动完成。

register-protocol CUD 只覆盖 `smRegisterProtocols` / `sm_register_protocols`。字段边界是 `protocolType` 最长 50、`protocolTitle` 最长 200 且必填、`protocolContent` 文本、`version` 最长 20、`status=enabled/disabled`。本轮本地后端已补 `protocolType/protocolTitle/status` 服务端过滤能力并有红绿测试，但生产预检 requestId `req_f9c7636c-63da-4c17-aba4-eb114bdaf88c` 证明当前生产部署尚未应用这项本地过滤改动：唯一 `protocolTitle/protocolType/status` 查询仍返回 `total=2/listCount=2`。因此生产 CUD 读回和残留检查采用公开 HTTP list `pageSize=1000` 全量扫描，再按唯一 `title/content` 精确匹配；baseline 和 residual 均证明 `listCount == total == 2`，create/update 窗口内也证明全量扫描覆盖了当时 3 条记录。

失败尝试边界：runId `regproto-0526072715-e4bf86` 的 create requestId `req_09ec4a42-4afe-4ac9-85d5-1cf2d593272a` 成功写入，但验证脚本错误期待 list 返回 `protocolType`，而生产 list 只返回展示字段 `title/content/version/status`；cleanup requestId `req_8b5a5ccf-7bba-4a15-a791-32fe0d08c9fc` 成功，residual-after-failure requestId `req_8fa7afe4-0e21-4218-979f-cc4dbc8f4dc2` 回到 `total=2/listCount=2` 且哨兵匹配 0。该失败尝试只能作为响应形态和清理边界，不能作为成功 CUD 证据。

已知字段边界：生产 list 响应返回 `title/content/version/status`，不返回 `protocolType/protocolTitle/protocolContent`；不得把本地新增服务端过滤写成生产已部署过滤；不得把全量扫描读回误写成服务端过滤读回。前端页面保留协议展示卡片，同时新增维护入口；表单字段限定为 `protocolType/protocolTitle/protocolContent/version/status`，`title/content` 只在页面和 list 响应映射中作为展示字段。

No-go：本轮不关闭 `system-config`、contract、expense、report、R2 或其它 CUD；不代表生产 admin H5 页面真实点击、页面级全局 Network 覆盖、fallback/shadow-off drill、retirement ledger、旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。

## 2026-05-26 initialize-cell 生产 CUD 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-setting-system-initialize-cell-cud-evidence.md`，记录生产 `apps/api` 公开 HTTP 的 initialize-cell create、公开 list 全量扫描 read-back、update、旧 `initItem` 清空读回、新 `initItem` 读回、delete 和 residual 0。该证据只支持窄口径关闭 `setting-manage/system-manage/initialize-cell/{list,create,update,delete}`，不代表其它 setting system-manage 任务自动完成。

initialize-cell CUD 只覆盖 `smInitializeCells` / `sm_initialize_cells`。字段边界是 `initItem` 最长 100 且必填、`initStatus` 最长 50、`configParams` 为 JSON；该表无 FK、无唯一约束、无软删除。本轮本地后端已补 `initItem/initStatus` 服务端过滤能力并有红绿测试，但生产预检 requestId `req_9019c040-fc8e-450d-b17a-bc7e52102575` 证明当前生产部署尚未应用这项本地过滤改动：唯一 `initItem` 查询仍返回 `total=3/listCount=3`。因此生产 CUD 读回和残留检查采用公开 HTTP list `pageSize=1000` 全量扫描，再按唯一 `initItem` 精确匹配；baseline 和 residual 均证明 `listCount == total == 3`，create/update 窗口内也证明全量扫描覆盖了当时 4 条记录。

已知字段边界：当前 repository update 实现只更新 `initItem/initStatus/configParams`，本轮 update 证据也只验证这三个实际字段。不得把本地新增的服务端过滤写成“生产已部署过滤”；不得把全量扫描读回误写成服务端过滤读回。前端页面已从旧的 `communityId/communityName/nearbyLandmark/cityCode/status` 表单收敛到真实 `initItem/initStatus/configParams` 字段，并接入真实 add/detail/edit/delete；format dialog 仍是页面既有格式化确认场景，不作为后端 CUD endpoint 证据。

No-go：本轮不关闭 `register-protocol`、`system-config`、contract、expense、report、R2 或其它 CUD；不代表生产 admin H5 页面真实点击、页面级全局 Network 覆盖、fallback/shadow-off drill、retirement ledger、旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。

## 2026-05-26 community-configuration 生产 CUD 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-setting-system-community-configuration-cud-evidence.md`，记录生产 `apps/api` 公开 HTTP 的 community-configuration create、按唯一 `settingName` read-back、update、旧 `settingName` 清空读回、新 `settingName` 读回、delete 和 residual 0。该证据只支持窄口径关闭 `setting-manage/system-manage/community-configuration/{list,create,update,delete}`，不代表其它 setting system-manage 任务自动完成。

community-configuration CUD 只覆盖 `smCommunityConfigurations` / `sm_community_configurations`。该表无 FK、无唯一约束、无软删除，生产验证必须使用唯一 sentinel `settingName` 证明 read-back/residual；不得用 `communityName`、`statusCd`、`csId`、`communityId` 或 `operator` 做 residual，因为当前 list repository 只支持 `settingName` 与 `settingType` 过滤。此前失败尝试 `community-configuration-cud-20260526060013-587cf153` 因哨兵字段过长导致 create `success=false`，无 record id，只有 residual 0 边界价值，不能作为成功写入证据。

已知字段边界：当前 repository update 实现只更新 `communityName/settingName/settingValue/settingType/statusCd/remark/operator`，不会更新 `csId/communityId/createTime/updateTime`；所以本轮 update 证据只验证实际可更新字段，`csId/communityId` 只作为 create 和 create 后 read-back 证据。前端页面已将搜索字段收敛到后端实际支持的 `settingName/settingType`，避免把 `communityName/statusCd` 误写成有效服务端过滤。

No-go：本轮不关闭 `initialize-cell`、`register-protocol`、`system-config`、contract、expense、report、R2 或其它 CUD；不代表生产 admin H5 页面真实点击、页面级全局 Network 覆盖、fallback/shadow-off drill、retirement ledger、旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。

## 2026-05-26 task815 fallback-off 演练局部证据

`apps/api/tests/runtime/legacy-dispatch-fallback-drill.test.ts` 当前已经补上 task815 要求中的核心 runtime fallback-off 子项：`legacy-dispatch` 先尝试 registry exact handler，只有 registry 404 且路径属于 `/app/**` 或 `/callComponent/**` 时才进入旧 app fallback。测试用 `PHASE7_LEGACY_APP_FALLBACK_BASE_URL=http://127.0.0.1:9` 模拟 fallback 不可达，证明 `/app/floor.queryFloors` 这类已注册 exact endpoint 仍由 `apps/api` 承接并且不会调用 `globalThis.fetch`。

同一测试还用 `/app/task815.unregisteredFallbackProbe` 证明未注册旧 app endpoint 才会尝试 fallback；fallback 不可达后返回 legacy 404 和 `ENDPOINT_NOT_FOUND`，避免把“fallback 不可达”误写成 exact handler 全部可用。

验证通过：`pnpm -F @01s-11comm/api exec vitest run tests/runtime/legacy-dispatch-fallback-drill.test.ts tests/runtime/legacy-fallback.test.ts tests/runtime/endpoint-registry.test.ts` 为 3 文件 8 tests passed；`openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过。探索子代理 Euclid 的结论是 runtime fallback-off 子项 PASS，但 shadow-off 未覆盖。

No-go：本局部 fallback-off 证据单独不能关闭 task815。它不证明 `VITE_11COMM_API_SHADOW_ENABLE=false`、allowlist 移除、页面 Network、生产或本地 HTTP shadow-off 状态下仍命中 `apps/api`；不代表生产 `DB_READY`、真实库样本、写入闭环、retirement ledger、旧服务目录退役或旧服务删除许可。后续 task815 的实际关闭依据是顶部 App production shadow-disabled 关闭边界；旧服务退役仍必须另走独立评审。

## 2026-05-26 change-password 生产 CUD 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-setting-system-change-password-cud-evidence.md`，记录生产 `apps/api` 公开 HTTP 的 change-password create、按唯一 username read-back、update、旧 username 清空读回、新 username 读回、delete 和 residual 0。该证据只支持窄口径关闭 `setting-manage/system-manage/change-password/{list,create,update,delete}`，不代表其它 setting system-manage 任务自动完成。

change-password CUD 只覆盖 `smChangePasswordRecords` / `sm_change_password_records`。该表无 FK、无唯一约束、无软删除，生产验证必须使用唯一 sentinel `username` 证明 read-back/residual；不得用 `remark` 做 residual，因为 list 不支持按 `remark` 过滤。该 endpoint family 没有 detail endpoint，因此本轮 detail/read-back 语义只能由 list 按唯一 username 承担。

已知字段边界：当前 repository update 实现只更新 `username/realName/department/changeType/status/remark`，不会更新 `changeTime/changeIp/operator`；所以本轮 update 证据只验证实际可更新字段，`changeTime/changeIp/operator` 只作为 create 和 create 后 read-back 证据。不得把这条证据写成所有表字段 update 均已验证。

No-go：本轮不关闭 `community-configuration`、`initialize-cell`、`register-protocol`、`system-config`、contract、expense、report、R2 或其它 CUD；不代表生产 admin H5 页面真实点击、页面级全局 Network 覆盖、fallback/shadow-off drill、retirement ledger、旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。

## 2026-05-26 type 生产 CUD 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-dev-team-config-manage-type-cud-evidence.md`，记录生产 `apps/api` 公开 HTTP 的 type create、detail-after-create、update、detail-after-update、delete、delete 后 detail 404 和四类 residual 0。该证据只支持窄口径关闭 `dev-team/config-manage/type/{list,create,detail,update,delete}`，不代表其它任务自动完成。

type CUD 只覆盖 `dtConfigTypes` / `dt_config_types`，不能写成 `dev-team/config-manage` 20 个文件全完成，也不能倒推 center、dictionary、item 之外的其它 dev-team 路径完成。residual 只承认按创建前 typeName/typeCode 和更新后 typeName/typeCode 的四类查询，以及 delete 后 detail 404；不得把既有 list/detail 只读采样或 route/manifest/Vitest 写成生产写入闭环。

No-go：本轮不关闭 setting、contract、expense、report、R2 或其它 CUD；不代表生产 admin H5 页面真实点击、页面级交互证据或全局 Network 覆盖；不关闭 fallback/shadow-off drill，不新增 retirement ledger 通过结论，不代表旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。

## 2026-05-26 type 前端接线字段漂移发现

本轮探索确认 `dev-team/config-manage/type` 的后端事实源是 `dtConfigTypes` / `dt_config_types`，字段为 `typeName`、`typeCode`、`typeDescription`、`sortOrder`；旧页面和 type 项目类型里仍出现 `dictionaryNumber/dictionaryName/dictionaryType/status/remark` 等前端历史字段，容易把 `dt_config_types` 的 CUD 写成不存在字段。前端接线已在 admin 页面和 caller 局部收敛字段，没有扩大修改 type 项目。

失败编辑子代理留下的 type 静态测试和 resolver 红灯被保留为 TDD 入口，主代理随后补齐 caller、form 和页面 wiring。最终页面只展示和搜索真实字段，form 使用本地 `DictionaryTypeFormData`，不再暴露旧 `status` 或 `remark` 等未落到 `dt_config_types` 的字段。本发现只支持 type 前端 caller/page wiring 的本地收口，不支持 task480 勾选。

No-go：type list/detail 只读生产采样和本地 caller/page tests 不能外推为生产 create/update/delete；没有新的生产 `DB_READY`、type write/read-back/update/read-back/delete 和 residual 0 前，task480 必须保持 open。本轮也不代表生产 admin H5 页面真实点击、fallback/shadow-off drill、retirement ledger、旧服务目录退役或 `dev-team/config-manage` 20 个文件全完成。

## 2026-05-26 item 生产 CUD 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-dev-team-config-manage-item-cud-evidence.md`，记录生产 `apps/api` 公开 HTTP 的父 dictionary 哨兵、item create、detail-after-create、update、detail-after-update、delete、delete 后 detail 404 和 residual 0。该证据只支持窄口径关闭 `dev-team/config-manage/item/{list,create,detail,update,delete}`，不代表其它任务自动完成。

父 `dictionary-create` 与 `dictionary-delete` 只是为了满足 `dt_dictionary_items.dictionary_id` 非空 FK 和清理 item 哨兵，不能写成 dictionary task 的新增关闭证据，也不能覆盖 dictionary 页面/全局 Network。第一次用 `itemCode` 做 item residual 查询时暴露了后端 `listDictionaryItem` 未按 `itemCode` 过滤的问题，返回全量 15 条；该查询已废弃，不得作为 residual 证据。最终 residual 只承认 delete 后 detail 404、按 `dictionaryId`、按创建前 itemName、按更新后 itemName 查询 item 为 0，以及父 dictionary residual 为 0。

No-go：本轮不关闭 type、center、setting、contract、expense、report、R2 或其它 CUD；不代表生产 admin H5 页面真实点击、页面级交互证据或全局 Network 覆盖；不关闭 fallback/shadow-off drill，不新增 retirement ledger 通过结论，不代表旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。后续若要优化 item list 的 `itemCode` 过滤，应单独按 API 行为缺陷处理，不能倒写成本轮 residual 证据。

## 2026-05-26 item 前端接线字段漂移发现

本轮探索确认 `dev-team/config-manage/item` 的后端事实源是 `dtDictionaryItems` / `dt_dictionary_items`，而不是旧 `DtConfigItem`；当前 `apps/type/src/business/dev-team/config-manage/item.ts` 仍保留旧 config item 命名，容易误导前端继续使用 `configName/configCode/configType/isEnabled`。本轮只在 admin 页面和 caller 局部收敛字段，没有扩大修改 type 项目，避免把字段事实源迁移做成无关 schema 改造。

前端表单最终使用本地 `DictionaryItemFormData`：`dictionaryId`、`itemName`、`itemCode`、`sortOrder`、`isDefault`。虽然后端 detail/list 同时返回 `itemCode` 与 `itemValue`，repository 的 create/update 实际优先从 `itemCode` 写入 `item_value`，因此页面没有把 `itemValue` 做成独立可编辑字段，避免用户分别填写两个最终落同一列的值。该发现只支持 item 前端 caller/page wiring 的本地收口，不支持 task478 勾选。

No-go：dictionary 关闭时创建和删除过的辅助 item 仍不能作为 item task 关闭证据；item list/detail 只读生产采样和本地 caller/page tests 不能外推为生产 create/update/delete；没有新的生产 `DB_READY`、父 dictionary 哨兵、item write/read-back/update/read-back/delete、父 dictionary cleanup 和 residual 0 前，task478 必须保持 open。本轮也不代表生产 admin H5 页面真实点击、fallback/shadow-off drill、retirement ledger 或旧服务目录退役。

## 2026-05-26 dictionary CUD/FK 关闭边界与 no-go

本轮新增证据 artifact 为 `.tmp/phase7-dev-browser/2026-05-26-dev-team-config-manage-dictionary-cud-fk-evidence.md`，记录生产 `apps/api` 公开 HTTP 的 dictionary create、detail-after-create、update、detail-after-update、含子项时 FK 阻断、清理和 residual 0。该证据只支持窄口径关闭 `dev-team/config-manage/dictionary/{list,create,detail,update,delete}`，不代表其它任务自动完成。

辅助 `item-create` 与 `item-delete` 只是为了制造和清理 dictionary 子项 FK 场景，不能关闭 `dev-team/config-manage/item/{list,create,detail,update,delete}`，也不能写成 item 生产 CUD 闭环。该证据来自生产公开 HTTP，不代表生产 admin H5 页面真实点击、页面级交互证据或全局 Network 覆盖；也不能外推到 `type`、`center`、`setting`、`contract`、`expense`、`report`、R2 multipart 或其它 CUD。

本轮不关闭 fallback/shadow-off drill，不新增 retirement ledger 通过结论，不代表旧服务目录退役、旧服务删除许可、目录移动、归档或清空许可。`dictionary-delete-with-child-blocked` 返回 HTTP 200 且 body `success=false`、code `500`、message 包含 `dt_dictionary_items_dictionary_id_dt_dictionaries_id_fk`，这是预期负向 FK 证据；但它不代表错误响应契约已经优化，也不代表后续不需要单独设计更友好的业务错误响应。

## 2026-05-26 dictionary helper 运行时兼容性边界

本轮最小修复把 `getCurrentDictionaryFormData()` 改为先读取 `dictionaryFormInstance.value?.formComputed`，再通过 `typeof formComputed === "object"` 与 `"value" in formComputed` 兼容 `ComputedRef` 和 Vue 父组件实例上已自动解包的对象，最终统一 `cloneDeep(payload)` 为 `DictionaryFormData`；`doBeforeClose`、取消按钮和提交仍共用该 helper。本轮只修复 dictionary helper 的运行时兼容性，不改变 task474 的 open 状态，也不触碰 task344、R2、retirement 或任何 checkbox。

## 2026-05-26 dictionary doBeforeClose 解包复核

本轮复核发现 dictionary 页面在 `doBeforeClose` 和取消按钮中把 `dictionaryFormInstance.value?.formComputed` 这个 `ComputedRef` 直接传给 `useDoBeforeClose`，而提交按钮虽然临时判断了 `.value`，但没有与关闭和取消共用同一条表单数据快照路径。修复后 `getCurrentDictionaryFormData()` 成为唯一读取点：先兼容 `ComputedRef` 与已解包对象，再立即 `cloneDeep(payload)` 为 `DictionaryFormData | undefined`，分别供 `useDoBeforeClose` 和 create/update payload 使用。

静态测试已收紧为块级断言：helper 块必须包含 `DictionaryFormData | undefined`、`typeof formComputed === "object"`、`"value" in formComputed` 和 `cloneDeep(payload)`；`doBeforeClose`、取消按钮和提交按钮块必须调用 `getCurrentDictionaryFormData()`，并且不得直接出现 `dictionaryFormInstance.value?.formComputed` 或 raw `formComputed.value` 解包逻辑。本发现只覆盖 dictionary 表单快照解包缺陷，不访问生产、不执行真实 CUD、不修改 task344、R2、retirement 或 checkbox。

## 2026-05-26 dictionary 前端 caller 收口边界

本轮只补 `dev-team/config-manage/dictionary` 前端 caller 与页面 wiring，不构成 task474/Task 93 关闭依据。`apps/admin/src/api/dev-team/config-manage/dictionary/index.ts` 已补齐 list/detail/create/update/delete，全部使用 `resolveAdminApiRequestUrl`；`detail` 为 GET，create/update/delete 为 POST。`apps/admin/src/pages/dev-team/config-manage/dictionary/index.vue` 已把 add/edit/info/delete 接到真实 caller：add 调 `createDictionary` 后刷新，edit 先 `getDictionaryDetail` 再调 `updateDictionary` 后刷新，info 只读详情且不提交，delete 经确认后调 `deleteDictionary` 并刷新。

字段边界：dictionary 底层 `dt_dictionaries` 和当前 API 写入链路没有 `isEnabled/status`，因此本轮不实现 toggle，表单和搜索都不暴露启停字段；页面列按类型和返回字段使用 `dictionaryDescription`，不再使用不存在的 `description`、`itemCount`、`creator` 或 `createdBy`。新增 `apps/admin/src/pages/dev-team/config-manage/dictionary/tests/page-api-wiring.test.ts` 使用块级静态检查具体函数和 submit handler，避免只扫全文件字符串。

验证边界：admin 指定 Vitest 先红后绿，最终 2 文件 19 tests passed；API 指定 Vitest 为 3 文件 40 tests passed；admin typecheck 第二次通过。保留风险：没有访问生产，未执行生产 create/update/delete，未做受控写入-读回-回滚，未验证有子项时 FK 阻止删除，未补生产 admin H5 全局 Network，也不关闭 task344、R2、retirement ledger、旧服务退役或其它 CUD。探索代理结论仍然生效：不能仅靠前端 caller wiring 勾选 dictionary checkbox。

本文中“后续”“仍需”“必须”“待归类”或 endpoint 相关表述只表示风险、禁止误判、冲突口径或历史事实边界，不构成执行顺序、endpoint backlog 或任务源；可执行项一律以 `tasks.md` 未完成 checkbox 为准。

本文件记录发现、风险、失败路径和不迁移原因，不记录可执行任务清单。

语言边界：本文件新增发现必须中文为主，禁止纯英文行。英文术语、命令、路径、状态码、接口名或 OpenSpec 关键字只能作为中文语境中的证据标识；若发现纯英文日志、英文占满执行记录或无中文解释的混合语言记录，必须先改写为中文主导，无法改写时在本文件记录原因、artifact 边界和后续处理，不能默默继续推进任务勾选、runtime、`DB_READY` 或退役结论。

## 2026-05-24 日志语言治理发现

本轮发现 `agent-progress.md`、`agent-findings.md` 和 `tasks.md` 已经有任务源边界，但缺少明确的中文日志门禁；这会让后续子代理把英文 reviewer 摘要、命令输出或 artifact 摘要整段贴入接力记录，造成中文协作上下文断裂，也容易把执行记录和发现记录的边界重新打散。

治理结论：新增记录必须中文为主，纯英文行视为违规；英文术语可以保留，但必须嵌入中文动作、结论或证据边界。`No-go`、`DB_READY`、`runtime manifest`、`fallback evidence`、命令和路径都只能作为术语或证据标识，不能整行占满记录。

检查机制：后续每轮文档或日志变更结束前，应扫描本轮新增行中“含英文字母但不含中文字符”的纯英文行；对英文字母明显压过中文说明的新增行进行人工复核。检查结果写入 `agent-progress.md` 的 checkpoint 或本文件的发现记录；若本轮只引用原始输出，必须改为 artifact 路径加中文摘要。

违规处置：发现纯英文行或英文占满执行记录时，先回写规范化中文记录；若无法改写，必须在本文件记录原因、证据边界和阻断状态。未处理前不得继续勾选任务、升级 endpoint 状态、声称 `DB_READY`、写入退役候选或把发现记录当成执行队列。

## 2026-05-24 任务比例纠偏发现

本轮纠偏发现，当前后续执行风险不是缺少更多 endpoint 探索，而是探索闭环和证据补强继续占据活跃任务池，导致真实 Nitro 迁移入口不够靠前。新增 `tasks.md` 的 `1D` 区块后，后续小批次应优先围绕 named endpoint 的 handler、adapter、manifest、caller、test、HTTP/browser/DB evidence 推进。

复核边界：`1D.1` 当前只保留 10 项 checkbox，比例为 6 项实施、2 项验证、1 项记录、1 项复核；`1D.2` 只保留动态补全纪律，不再记录 checkbox backlog。后续若发现缺失文件、测试或证据，只能按当前 named endpoint 回写到 `tasks.md` 本节或对应业务章节，不能把 `agent-progress.md` 或本文件变成第二任务树。

二次审计发现：只把首批压成 10 项仍不够，容易让后续代理继续沿旧 §2/§3/§4 顺序探索。已在 `tasks.md` 补强 §1D.3 证据术语、§1D.4 后续小批次滚动规则，并在 §2/§3/§4 章首增加局部门禁。后续执行必须先从 §1D 开批，再把有效事实回写到对应业务章节；不得直接按旧章节排列顺序执行。

证据边界：`1D` 是执行优先队列和动态补全纪律，不代表其中任何 endpoint 已经迁移完成；`docs/reports/2026-05-24-openspec-do-long-task-dynamic-tasks-design.md` 是增强 `ai-plugins` 源技能的实施文档，不是全局技能修改结果；`docs/superpowers/specs/2026-05-24-openspec-task-rebalance-design.md` 是任务树比例纠偏设计，不是新的 OpenSpec change 或第二任务源。

No-go：不得把本轮文档和任务结构调整写成 runtime 迁移、`DB_READY`、shadow-off/fallback 复验、写入口安全放行或旧服务可退役。后续若执行中发现缺失任务，只能回写 `tasks.md`，`agent-progress.md` 与 `agent-findings.md` 仍不得承载 checkbox backlog。

## 旧文档角色

- 三份旧 Superpowers 文档的细目、职责和历史用途已迁入 OpenSpec canonical：`design.md` 记录来源角色与压缩原则，`tasks.md` 记录唯一可执行 backlog，本文件记录历史 provenance、风险和证据索引。
- `docs/superpowers/phase7-openspec-migration-index.md` 是后续接力的稳定入口，指向 OpenSpec canonical、`tasks.md`、`agent-progress.md` 和本文件。
- 临时来源覆盖审计快照已经完成使命并被删除；后续不得恢复或维护第四份来源覆盖矩阵。
- 后续执行入口只能是 OpenSpec canonical：可执行 backlog 归 `tasks.md`，风险和禁止误判归本文件，checkpoint 归 `agent-progress.md`，架构和验收规则归 `design.md` 与 `specs/**`。

## 必须保留

- 旧总设计的核心迁移目标：`apps/admin/server` 和 `apps/app/server` 的旧 Nitro API 责任逐步合并到独立部署的 `apps/api`。
- `apps/api` 是 admin 与 app 的唯一长期 Nitro API 服务目标。
- Phase7 是统一 Nitro API 迁移的退役准备阶段，不是孤立的 endpoint 数量统计阶段。
- admin legacy Nitro stream 与 app legacy/mock Nitro stream 必须分别跟踪；admin exact coverage 不能推导 app legacy 完成。
- `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision` 的字段语义。
- `READY_CONFIGURED != DB_READY`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- `legacy-fallback 200 != DB/repository 完成`。
- `canonical-only != old path exact covered`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- `hook-level evidence != browserEvidence`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- `local-dev browserEvidence != production browserEvidence`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- `admin H5 evidence != app H5 evidence != API server evidence`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- 当前 no-go-for-retirement 状态。
- 受保护路径：`apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。
- Neon main 验收规则：不使用 Neon 测试分支；`RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY` 才能记录 DB_READY。
- Neon/Drizzle 使用规则：DB-backed repository/service 必须使用 Drizzle 与 `@01s-11comm/type` 的 schema/table/type，`apps/type/src/business/**/schema.ts` 是业务 schema 事实源；禁止把旧 admin 私有 schema、旧 app in-memory 或本地 fake DB 写成生产数据库能力。
- 写入口闭环：guard-before、controlled write、read-back、rollback/cleanup、residual check、guard-after。
- Vitest 规则：运行时代码变更必须补 `*.test.ts` 或记录不可写原因；测试使用 `describe` 与 `test`，从 `vitest` 导入断言工具；Vitest 不能替代 Neon main `DB_READY`、真实库样本、写入读回回滚或旧服务退役门禁。
- Chrome MCP 三端双环境规则：admin H5、app H5、API server 必须分别在 local-dev 和 production 记录；local-dev 覆盖 `apps/api`、`apps/admin`、`apps/app` 三个 dev 服务，production 地址必须从三个 package 的 `homepage` 字段重新读取。

## 当前已知缺口

- 2026-05-19 初版 OpenSpec 迁移过度聚焦 Phase7 证据门禁，未充分呈现“admin/app 两套旧 Nitro API 合并到独立 `apps/api`”的上层主线；已补 `unified-nitro-api-consolidation` spec、设计四流模型和索引说明。
- 2026-05-19 二次复核发现 `tasks.md` 仍错误表现为 43/43 已完成，只覆盖文档载体迁移，没有承接旧计划 P0-P8 的后续 Nitro 合并任务；已重写为长期 backlog。
- 旧三文档曾由用户手动恢复用于核对；2026-05-20 已在完成核心语义转写、引用扫描和 OpenSpec 入口收敛后删除。删除只代表文档载体退场，不代表 `apps/admin/server`、`apps/app/server` 或旧 app 源目录退役。
- 旧矩阵存在冲突口径：同一文件既写 admin old path exact coverage 155/155，又在末尾风险中残留“未覆盖 exact legacy path 约 51 个”的旧说法。后续必须 fresh scan 后更新事实，不得直接照抄旧数字。
- 后续接力必须同时看 admin legacy stream、app legacy stream、unified `apps/api` runtime stream、retirement gate stream。
- 生产 `DB_READY` 已于 2026-05-26 基于 `.tmp/phase7-dev-browser/2026-05-26-neon-main-db-ready-cud-evidence.md` 关闭 task309；关闭范围只覆盖生产 API server 的 Neon main readiness，不代表任一业务 endpoint 自动完成。
- 关键只读真实库样本已于 2026-05-26 基于同一证据关闭 task312；关闭范围只覆盖 `report expense summary`、`org-info list` 与 `floor list` 三个关键样本，不代表全量 admin/app endpoint 真实库样本完成。
- shadow-off/fallback 页面演练仍未闭环。
- 真实页面 CRUD/交互证据仍未闭环。
- `property-manage/contract-manage` 12 个普通 list endpoint 已由 task77-task80 补本地 runtime manifest/contract/gated HTTP test 条目；upload/R2、写入、删除、detail 和页面/生产证据继续单独评审。
- app legacy 后续仍需 `/callComponent/**`、floor、repair、fee/report、guarded writes、remaining modules、client-only gap 和 server-only endpoint 调度。
- 2026-05-19 specs 中文化与细化前，7 个 spec 多数只写门禁概念，缺少 Nitro 接口迁移的实施规则。已补充 `apps/api` 模块组织、admin 三级业务路径、contract-manage 下一切片、R2/upload、app legacy 各类端点、DB_READY、写入口闭环、状态升级和目录退役前提。
- 2026-05-19 用户追问后发现：app Nitro 迁移和 Neon 使用已有部分说明，但实现边界仍不够具体；Vitest 触发时机、文件位置、写法和测试/运行时证据边界没有独立 spec。已补 `app-legacy-cutover`、`db-readiness-and-write-verification`，并新增 `vitest-and-runtime-verification`。
- 2026-05-19 用户追问后发现：Chrome DevTools MCP、本地三 dev 和三个生产环境验收只散落在任务和旧文档口径中，OpenSpec 没有独立规范三端双环境矩阵。已新增 `browser-and-environment-verification` spec，并在 `tasks.md` 增加 4A 验收任务。
- 2026-05-19 重新扫描当前 working tree：`apps/api/server/routes/api` 160、`apps/admin/server/api` 155、`apps/app/server/modules` 56、`apps/api/server/shared/runtime` 11；调用端方面 `apps/admin/src` 的 `/api/` 命中 437，`apps/app/src` 的 `/app/` 或 `/callComponent/` 命中 640。后续 baseline 必须以 fresh scan 为准，而不是旧矩阵末尾的过期口径。
- 2026-05-19 扩展 `tasks.md` 时确认旧数量口径不能直接当 endpoint 清单：`dev-team/config-manage` 旧“16”是四个子模块 CRUD 方法，当前 legacy 文件树是 20 个文件；`setting-manage/system-manage` 旧“15”是五个子模块 CUD 方法，当前 legacy 文件树是 20 个文件；`expense-manage` 旧 Phase7 list 口径是 14 个，当前 legacy list 文件是 16 个；`report-manage` 旧 Phase7 list 口径是 12 个，当前 legacy list 文件是 13 个。后续状态升级必须同时说明历史口径和当前文件口径。
- 2026-05-19 扩展 `tasks.md` 时确认 app remaining modules 不能继续压缩为模块桶；`apps/app/server/modules/**/endpoints.ts` 中的 activity、contact、notice、oa-workflow、profile、staff、test、video 等模块此前在压缩清单里体现不足，已改为显式 URL 级待归类任务。
- 2026-05-19 再次补全 `tasks.md` 时确认：endpoint 行本身仍不足以支撑旧服务安全退役，还必须有 spec-to-task traceability、统一 `apps/api` runtime 对账、批次调度纪律、admin/app 调用端差集、Vitest/HTTP gate、Neon schema/DB_READY、写入闭环和三端双环境证据矩阵。已新增 §1A、§1B、§1C、§2A、§3A、§4B、§4C，并扩展 §5。
- 2026-05-19 任务载体边界再次确认：`agent-progress.md` 不应记录未执行的 Nitro 迁移任务，只能写 checkpoint 和验证结果；本轮补任务源时只在 `tasks.md` 增加 future backlog。
- 2026-05-20 用户纠正迁移目标：当前缺口不是“引用没替换”或“旧文件没删除”，而是必须把旧三份大文档的核心长文本内容转写成 OpenSpec format。后续验收应按语义覆盖判断，而不是按旧路径扫描是否为空判断。
- 2026-05-20 已新增 `legacy-superpowers-content-transcription` spec，用于约束旧总设计、旧 endpoint 矩阵和旧 batch 计划的核心内容转写完成定义；它是删除旧三文档前的语义覆盖闸门。
- 2026-05-20 三名只读审计子代理共同指出：旧总设计仍需 Phase1/1.1 细则、Phase2/3 边界、CI/workflow、runtime governance；旧矩阵仍需默认值、ledger 字段、admin 小片事实、app fallback 红线、Windows/CDP gotcha；旧计划仍需 Agent Team 产出、Batch0 fresh scan gate、Batch0-8 具体映射、batch done definition、复核清单和 Neon main checklist。上述缺口已转写进对应 specs，但删除旧文件前仍需 final strict validate 与引用扫描。
- 2026-05-20 删除前语义覆盖复核结论：旧总设计落入 `legacy-superpowers-content-transcription`、`unified-nitro-api-consolidation`、`source-history-and-memory-governance`、`vitest-and-runtime-verification`、`db-readiness-and-write-verification` 和 `retirement-gate-and-archive`；旧矩阵落入 `phase7-evidence-model`、`admin-api-cutover`、`app-legacy-cutover` 和浏览器/进度/发现记录；旧计划落入 `agent-team-batch-execution`、`tasks.md` 和 Neon main/write verification 规则。
- 2026-05-20 当前重要负清单：`report-manage/expense-summary-table/list`、P1 `report-manage` 剩余 7 页、App repair 三个只读端点已有本地页面 Network 或等价本地 evidence，不应重复作为本地页面待补；但这些证据仍不能写成 production DB_READY、真实库样本、shadow-off/fallback、写入闭环或旧服务可退役。
- 2026-05-20 历史 Batch7a 与 2026-05-19 admin 小片 manifest/HTTP gate 都只能作为 local/runtime/contract evidence；不能自动代表生产 DB_READY、真实库样本、shadow-off/fallback 或退役候选。
- 2026-05-20 工作区纪律：旧矩阵曾记录工作区混有 staged/前序变更，后续任何批次必须先 `git status --short`，不得 stage/unstage/revert 非本轮范围。
- 2026-05-20 编辑子代理 D 复核发现：当前旧三文档转写记录已经覆盖主要语义，但仍需要一个明确的二次复核框架来防止“章节级漏转写”。已补入 `legacy-superpowers-content-transcription` 闸门和 `tasks.md` 任务块；后续探索/复核成员必须按旧总设计、旧 endpoint 状态矩阵、旧 batch 执行计划逐文档、逐章节、逐落点核对，未映射章节只能记为待收敛风险，不能写成已完成迁移。
- 2026-05-20 编辑子代理 D 明确边界：旧文件名可以继续出现在稳定索引、design 或 findings 中作为 historical source/provenance，但不能作为执行入口、任务源链接或长期维护对象。若后续发现旧文件名被用于“去读旧文档继续执行”，必须记录为引用治理缺口并改回 OpenSpec canonical。
- 2026-05-20 本轮二次复核框架只修改 OpenSpec 文档和接力记录，没有恢复三份旧文档，没有删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或 `D:\code\ruan-cat\01s-11comm-app`；不得把本轮文档闸门收敛误读为 runtime 旧服务可退役。
- 2026-05-20 复核成员 E 判定旧语义仍缺口后，编辑子代理 F 已补强：旧总设计 Phase5 `L0-L4` 和 `houseCharge` 只作为历史 CRUD 分级/样板，Phase6 是 `VITE_11COMM_API_SHADOW_ENABLE`、`VITE_11COMM_API_USE_PROXY`、模块 allowlist 或等价配置驱动的受控切流与 fallback/shadow-off 复验，不是旧服务退役；动态 mock 增量同步只能记录 mock/fallback/local evidence；Batch7a 只能作为 historical local/runtime/contract evidence；retirement ledger 未落 endpoint 行不得升级退役候选；admin 收费/缴费证据不得推导 app 缴费 legacy 完成。本轮没有修改运行时代码。
- 2026-05-20 复核成员 G 对 F 的补强结果给出通过结论：Phase5 `L0-L4`/`houseCharge`、Phase6 shadow/proxy/fallback 顺序、动态 mock 增量同步、Batch7a 历史证据、retirement ledger 物化维护、admin/app 缴费双端边界均已有 canonical 落点；旧文件名仍只作为 provenance，`agent-progress.md` 和本文件未承载任务树。本结论只证明旧三文档语义转写补强完成，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback 或旧服务退役完成。
- 2026-05-20 第三轮 agent team 反向审计记录：H、I、J 均判定 PASS，无必须补写缺口；K 的本轮改动只处理建议级缺口，补强旧总设计 Phase4+ 示例边界（`repair/resource/parking`、`charge-machine/open-door`、`machine-record` 等）、单一汇总报告约 3500 行以内的软约束、do-long-task checkpoint 接力术语和 Batch0-8 到当前 backlog 的搜索索引。该 PASS 与 K 的补强只证明 OpenSpec 文档口径更完整，不代表 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback 或旧服务退役完成。
- 2026-05-20 本轮 F 会话没有暴露 `mcp__memorix__*` 工具，无法执行项目范围 Memorix 搜索或写入；这是会话环境缺口，不代表项目没有历史记忆。后续主代理具备 Memorix MCP 时需补写本轮摘要。
- 2026-05-20 task 54 复核发现：原显式 traceability 行只列出 8 个 spec，容易漏掉 `admin-special-cases`、`phase7-evidence-model`、`source-history-and-memory-governance`、`legacy-superpowers-content-transcription` 四个同属 `specs/**/spec.md` 的 Requirement 来源；探索成员 A 进一步指出 Phase1 app 快照范围、Phase2/Phase3 边界、Phase5 `L0-L4`/`houseCharge`、Phase6 shadow/proxy/fallback、Batch7a、Batch0 fresh scan、batch done definition、Windows dev gotcha、CI/workflow、默认 guard `409`、写入失败停止、admin manifest 最低字段和 admin/app 缴费边界必须有任务落点。已在 `tasks.md` 补 traceability note，并由复核成员 E 审批通过；这些补充只证明任务落点完整，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 56 复核发现：`agent-progress.md` 本体没有 markdown checkbox 或任务树，且开头明确 `tasks.md` 是唯一任务源；但复核成员 D 指出原“当前负清单”式 checkpoint 容易被误读为 Nitro endpoint backlog。已将该条改为“当时 checkpoint 摘要/历史状态摘要”，并明确它不构成可执行后续项、endpoint backlog 或任务源，后续可执行项一律以 `tasks.md` 未完成 checkbox 为准。该收敛只证明 `agent-progress.md` 的任务源边界清晰，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 57 复核发现：`agent-findings.md` 本体没有 markdown checkbox、待办标记或独立任务树；但探索成员 A/B 指出“后续/仍需/必须/待归类”与 endpoint 相关语气可能被误读为可执行 backlog。已在文件顶部补充全局边界声明，明确这些表述只表示风险、禁止误判、冲突口径或历史事实边界，不构成执行顺序、endpoint backlog 或任务源；可执行项一律以 `tasks.md` 未完成 checkbox 为准。该收敛只证明 `agent-findings.md` 的任务源边界清晰，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 58 复核发现：`tasks.md` 中保留的“剩余模块”“数量块”“压缩桶”“模块桶”和 `remaining modules` 表述必须被解释为历史口径或索引，不能作为可执行清单。已补强：Batch8 指向 `§3.5 Remaining App Modules`；admin 数量口径指向 §2.1/§2.2 显式 endpoint 行并给出 `rg --files apps/admin/server/api/property-manage apps/admin/server/api/dev-team apps/admin/server/api/setting-manage` fresh scan；app remaining modules 指向 §3.5 URL 台账并给出 `rg -n -- "/app/|/callComponent/|/test" apps/app/server/modules --glob "endpoints.ts"` fresh scan；server-only 新增项必须补显式 URL 行或写明无法展开原因，不得用模块桶结算。该收敛不证明任何 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 60 复核发现：本会话暴露 Memorix MCP，主代理已在继续前完成两次项目范围检索。第一条检索旧三文档/canonical 消化语境，命中 `obs:4433`、`obs:4435`；第二条检索 Phase7、Nitro 合并、`DB_READY`、Chrome MCP、旧三文档迁移和当前 task 60 语境，命中 `obs:4433`、`obs:4364`、`obs:4424`。无需记录当前会话 Memorix 环境缺口；该收敛不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 61 复核发现：状态变更后已写入 Memorix `#4439`，其中包含变更文件、任务源变化、验证命令和剩余阻断项/no-go 边界。该记录只证明本轮 task 60/61 文档和记忆沉淀完成，不证明任何 endpoint runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 113 route inventory 发现：`apps/api` route tree 有 160 个文件，其中 admin legacy 155 个旧 `/api/**` 文件均有同路径 `apps/api` route，但 `apps/api` 额外存在 `expense-item-setting/{create,delete,detail,update}` 与 `house-charge/detail` 5 个 fee route；task77-task80 后 `contract` 的 12 个普通 list route 已有本地 manifest/test/HTTP gate 条目，但其余 13 个非 list/upload/CUD/detail route 仍不得升级为 manifest covered；app legacy 只有 `fee`、`repair`、`floor` 共 21 个显式 registry 定义，剩余 app legacy path 仍是 fallback-proxy 候选而非已迁移 endpoint。
- 2026-05-20 task 113 复核修正：独立复核指出 route inventory 必须有完整逐 route 明细。已新增 `route-inventory-details.csv.md`，并把 `manifestPhase/manifestStatus` 直接落到 160 条 route 行上；其中 `manifest-missing` 明确覆盖 `contract`、`dev`、`setting`、`debug` 和 `j1-dashboard`，防止后续把 route file 存在误判为 runtime manifest 覆盖。
- 2026-05-20 task 114 模块分层审计发现：`module-layering-audit.md` 已逐 domain 记录七层结构。`fee` 与 `repair` 同时有 admin/app legacy adapter，`floor` 是 app legacy-facing 且缺 `admin-adapter.ts`；`community`、`contract`、`dev`、`house`、`operation`、`parking`、`patrol`、`setting` 具备 admin 基础分层但缺 `legacy-adapter.ts`。`contract` 有 route/runtime/service/repository/admin adapter 但 `runtimeEndpointManifest` 中 `contract` owner 为 0；`dev` 与 `setting` 也属于 route/module 存在但 manifest 缺口。app legacy executable registry 仍只覆盖 `fee`、`repair`、`floor` 21 条，fallback proxy 不能升级为显式迁移。
- 2026-05-20 task 114 handler 边界发现：未发现 `apps/api/server/routes/api` 中直接堆 Drizzle/Neon 查询；但 `property-manage/repairs-manage/{return-visit,phone-report-repairs,mandatory-return-issue}/list.post.ts` 直接取 `service`，并在 handler 内做 `result.list.map(...)`、`communityId: "COMM_001"`、分页响应与兼容字段拼装，应记录为 DTO/compat 逻辑未下沉到 `repair/admin-adapter.ts` 的结构缺口。`debug-env.get.ts` 与 `j1-dashboard/center/commonmenu/get.ts` 绕过 module runtime，只能作为诊断/占位例外或 edge route 风险，不能纳入业务迁移完成率。
- 2026-05-20 task 115 Nitro/H3 与鉴权审计发现：`apps/admin/server`、`apps/app/server`、`apps/api/server` 未发现直接 `from "h3"`、`from 'h3'`、`require("h3")` 或动态 `import("h3")`；`nitro/h3` 命中文件数为 350。未发现 `@neondatabase/auth`、`jsonwebtoken`、JWT 校验、`Authorization`/`Bearer` 解析、`authMiddleware`、`requireAuth`、`verifyJwt` 或 `verifyToken` 等 Nitro 运行时鉴权实现。误报包括 `apps/admin/package.json` 的历史 `jose` 依赖、`apps/admin/server/middleware/1.logger.ts` 日志中间件、`apps/admin/server/utils/sensitive-data.ts` 的 `maskToken` 脱敏工具，以及 `@neondatabase/serverless` 数据库驱动；这些均不得被升级为鉴权实现或迁移完成证据。
- 2026-05-20 task 116 数据库连接作用域审计发现：`apps/api/server` 未发现业务模块、route、repository、service 或 shared 模块顶层直接创建 Neon/Drizzle 连接；唯一 `drizzle(neon(url), { schema })` 位于 `apps/api/server/db/index.ts` 的 `useDb(event)` 函数内，并缓存到 `event.context.db`。各 module runtime 通过 `{ db: useDb(event) }` 注入 repository；`apps/api/server/shared/runtime/env.ts` 只解析连接串来源，不创建连接。旧 `apps/admin/server/db/index.ts` 仍保留 legacy `_db/getDb()` 与 `process.env` 回退路径，属于 source-side historical risk；`apps/app/server` 未发现 DB 连接创建命中。该审计不得被写成生产 `DB_READY`、真实库样本、写入口闭环或旧服务退役完成。
- 2026-05-20 task 116 误报边界：`apps/api/server/modules/*/runtime.ts` 的顶层 `fallbackRuntime` 是 in-memory fallback runtime，不是 Neon/Drizzle 连接，也不能作为 DB-backed 完成证据；`probeDatabaseReadiness(useDb(event))` 是 ready handler 内调用既有 helper，不是 route 顶层创建 DB；旧 admin `const db = useDb(event)` 是 helper 使用，不应误报为模块顶层连接创建。
- 2026-05-20 task 117 contract boundary 审计发现：`fee` 与 `repair` 是当前 `apps/api` 中同时服务 admin canonical 与 app legacy 的主要 domain；它们共用核心 repository/service，但 runtime 分别装配 `adminAdapter` 与 `legacyAdapter`。`adminAdapter` 使用 `adminSuccess` 和 `JsonVO/PageDTO`，`legacyAdapter` 使用 `legacySuccess/legacyFailure` 并保持 `{ code, msg, data }` envelope。`floor` 当前只有 app legacy-facing equivalent，没有 admin adapter，不得写成 admin canonical 完成。反向扫描未发现 app legacy adapter/endpoints 使用 `adminSuccess|adminFailure|JsonVO|PageDTO`，也未发现 admin route 使用 `legacySuccess|legacyFailure|LegacyResponse`。
- 2026-05-20 task 117 风险边界：`response-builder.ts` 同时定义 admin 与 legacy builder，`runtime-endpoints.ts` 同时包含 admin/app manifest，因此关键词命中必须看调用方和 manifest 字段；`legacy-dispatch` fallback 会原样返回旧 app fallback body，这不代表 fallback 旧服务 envelope 已完整验收。`repair` 仍有 3 个 admin route 在 handler 内直连 service 并拼装 `adminSuccess`，这是分层风险而非 admin/app 契约混用阻断；`fee` legacy 写/支付结果可能包含 legacy-shaped data 再被 `legacySuccess` 包裹，属于 app contract fidelity 风险，不是 admin DTO 覆盖。
- 2026-05-20 task 118 schema wiring 审计发现：`apps/api/server/modules/**/repository.ts` 中当前实际用于 `db.from()`、`db.insert()`、`db.update()` 或 `db.delete()` 的业务表符号均从 `@01s-11comm/type` 导入，并可反链到 `apps/type/src/business/**/schema.ts` 的 Drizzle table、Zod schema 和 TypeScript 类型；本轮未发现 repository-used table 的 `schema-missing`。这只支持 `db-read-repository-wired-with-gap` 或同等 gap 口径，不能升级为 `db-ready`、生产 `DB_READY`、真实库样本通过、shadow-off/fallback 完成、写入闭环完成或旧服务退役。
- 2026-05-20 task 118 保留 gap：`contract-upload` 的 `ctUploadSessions`/`ctUploadSessionParts` schema 已存在但 upload init/sign/complete/abort/status 仍为 mock/R2 未接，保持 `schema-exists-not-wired`；`fee` legacy payment/write 中 `exPayments` 等 schema 存在但 `createNativeQrcodePayment()`、`writeOweFeeCallable()`、`saveRoomCreateFee()` 仍走 fallback/guarded write，保持 `schema-exists-not-wired` 或 `non-db-or-fallback`；`repair` 的 `rpReturnVisits`、`rpMandatoryReturnIssues`、`rpPhoneRepairReports` 等 schema 存在但相关 list/write/appraise 路径仍有 service 直连、compat DTO、`COMM_001` 默认或 guarded fallback，不能写成 DB 完成；未归类 app legacy modules 继续保持 `unknown-needs-triage`。
- OpenSpec delta parser 要求每个 requirement 正文包含英文 `MUST` 或 `SHALL`。specs 保留中文正文，并在正文中保留 `MUST` 以满足 CLI；不得把 OpenSpec 结构关键字翻成中文。
- PowerShell `Set-Content -Encoding UTF8` 会写入 UTF-8 BOM 和 CRLF，曾导致 OpenSpec 无法解析 specs delta。已改用无 BOM UTF-8 + LF 写回；后续修改 specs 后需检查 `openspec validate`。

- 2026-05-20 task 119 status evidence field gate 审计发现：`route-inventory.md` 的 `cutoverStatus` 与 `route-inventory-details.csv.md` 的 `manifestStatus` 只是 inventory 标签，不是正式 `coverageKind`、`targetStatus` 或 `retirementDecision`；`schema-wiring-audit.md` 只支持 `dataSourceStatus` 的 gap 口径，不能单独支持生产 `DB_READY`、fallback ready、写入闭环或退役。任何 status upgrade 必须同时填写或引用 `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision`，字段不全时只能保持保守状态。
- 2026-05-20 task 119 no-go：不得用 route 文件存在、manifest 命中、HTTP 本地通过、单元测试通过、mock 数据、schema table 存在或 repository import 反链来替代完整 status evidence；不得把 `READY_CONFIGURED-only` 写成生产 `DB_READY`；写入口必须有 guard/write/read-back/cleanup/guard-after 证据，否则保持 `pending`、`guarded` 或 `blocked-for-execution`；`targetStatus` 与 `retirementDecision` 必须分开记录。
- 2026-05-20 task 120 runtime evidence alignment 审计发现：`/__nitro/health`、`/__nitro/ready`、runtime manifest、contract tests、HTTP gate 与 browser/API evidence 是不同层级证据，只能按 endpoint/method/path/response contract/environment/data source 对齐后组合使用，任一层单独存在都不能升级完整覆盖、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役。
- 2026-05-20 task 120 no-go：route file 存在但 runtime manifest 缺失时只能保持 `canonical-only` 或 `unknown-needs-triage`，不得写成 `old-path-exact-covered`；`READY_CONFIGURED` 不能冒充 `DB_READY`；contract test 或 HTTP 200 不能冒充 Chrome MCP browserEvidence；local-dev evidence 不能外推为 production evidence；`contract`、`dev`、`setting`、`debug`、`j1-dashboard` 等 `manifest-missing` 行不得升级为 manifest covered。
- 2026-05-20 task 128 调度 no-go：后续 batch 启动声明不是完成证据，只是实施前 guard。不得一次性吞掉 admin、app legacy、DB/write 或 retirement 整域；不得在没有明确 endpoint 或业务路径列表时实施；不得把 owner 文件、目标 `apps/api` route/manifest/adapter/caller 文件、预期测试和 DB/浏览器/生产证据需求留空后继续动手；不得越过本批声明去触碰 upload/R2/CUD/write/detail/retirement 或无关范围；不得把 local、contract、HTTP gate、historical Batch7a 或启动声明本身升级为 production `DB_READY`、真实库样本、shadow-off/fallback 完成、写入闭环或旧服务退役候选。

## 来源复审发现

- 2026-05-19 独立子代理复核确认：旧总设计的核心任务是 `apps/admin/server` 与 `apps/app/server`/旧 app 项目中的旧 Nitro 职责合并到独立 `apps/api`，Phase7 只是这条主线的退役准备阶段。
- 2026-05-19 独立子代理复核确认：旧计划 §2、§12、§13 的 Agent Team 模型、每批固定流程、批次拆分和复核清单此前没有 spec 化；已新增 `agent-team-batch-execution`。
- 2026-05-19 独立子代理复核确认：旧总设计 Phase1.1 的 Markdown 文档迁移、skills/AI 记忆、Memorix 项目身份、敏感信息、字符集和动态 mock 文档同步此前承接不足；已新增 `source-history-and-memory-governance`。
- 2026-05-19 独立子代理复核确认：OpenSpec 原先缺少 git hash 级 provenance；已在本文件写入关键提交表。
- 2026-05-19 独立子代理复核确认：OpenSpec 原先缺少 `.tmp/phase7-dev-browser/**` 和 `.tmp/phase7-agent-reports/**` 证据 artifact 集中索引；已在本文件写入 artifact index。
- 2026-05-19 独立子代理复核确认：`agent-progress.md` 中“旧三文档已删除”的陈旧表达会误导后续接力；已修正为“用户已恢复，当前只作迁移来源/核对材料”。
- 2026-05-19 编辑子代理 B 复核确认：临时来源审计中值得长期保留的是 provenance 线索、Memorix lookup、artifact evidence、禁止误判和临时审计边界；旧文档章节覆盖大表不应原样迁入 canonical。

## 规范化来源审计摘要

- 来源角色：旧 endpoint 矩阵提供证据字段、状态字段、扫描快照、当前口径和禁止误判；旧 batch 计划提供 Agent Team 调度、P0-P8 批次、每批固定流程和复核门槛；旧总设计提供唯一 `apps/api` 架构、Phase1-7 阶段链、文档/AI 记忆治理、Vitest、Neon main 和退役门禁。
- OpenSpec 落点：执行项进入 `tasks.md`；统一 API 主线进入 `unified-nitro-api-consolidation` 与 `design.md`；app/admin cutover 进入对应 specs；DB、Vitest、浏览器验收、Agent Team 与来源治理分别进入 `db-readiness-and-write-verification`、`vitest-and-runtime-verification`、`browser-and-environment-verification`、`agent-team-batch-execution`、`source-history-and-memory-governance`。
- 压缩决策：旧矩阵大表不逐字复制；只有 endpoint 级 backlog、明确差集调查、风险说明和证据索引进入 canonical。历史批次流水只能解释来源，不能自动继承为完成事实。
- 退场边界：临时来源覆盖审计快照完成迁移后已删除；后续 agent 不应继续要求同步维护它，也不得恢复成长期任务源。

## Git 历史来源

| 提交                               | 旧文件    | 结论                                                                                                                      |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `2af48327`                         | 总设计    | 创建 app 迁入与唯一 API 设计，确立 `apps/api` 目标和 `apps/type` 事实源。                                                 |
| `dd6c5078`、`cc50fec0`、`edc7a693` | 总设计    | 细化文档治理、字符集、AI 记忆和 Memorix 保全。                                                                            |
| `024c4785`                         | 总设计    | 补充 app 迁移自测与 Vitest 验收方案。                                                                                     |
| `22da5b95`                         | 总设计    | 补充 Phase6 计划与 Phase7 门禁。                                                                                          |
| `611c5f99`                         | 计划      | 创建 Phase7 分批计划，定义 Batch 0-6 与 Agent Team 执行框架。                                                             |
| `828a019e`                         | 矩阵/计划 | 创建 endpoint 矩阵和批次矩阵，明确证据字段和 delete-candidate 禁止升级。                                                  |
| `cf85abbd`                         | 三文件    | 引入 Neon main `DB_READY` 与写入闭环。                                                                                    |
| `e3b377fa`                         | 三文件    | 重写当前接力口径，压缩流水事实。                                                                                          |
| `058a9680`、`0a68f7d7`、`b3c94e2f` | 计划      | 记录 Chrome MCP 44/44、本地 Neon main `DB_READY`、shadow-off/fallback 44/44；均不得自动升级为生产 DB_READY 或旧服务退役。 |
| `1969bbac`                         | 矩阵/计划 | 记录 CRUD/CUD DB、HTTP gate 和 Upload R2 评审。                                                                           |
| `04a8e56c`                         | 三文件    | 同步 expense-summary、report-manage 和 App repair evidence。                                                              |
| `6bf1dbc2`                         | 三文件    | 同步 2026-05-19 admin list manifest/contract/HTTP gate 和 contract-manage 下一片。                                        |

## Memorix 检索索引

- `#4152`：Neon main 验收口径；只能作为 DB readiness 规则来源，不能代替本轮生产 `DB_READY`。
- `#4217`、`#4218`、`#4220`、`#4221`：Phase7 resolver、readiness/browser/fallback 边界、handoff 文档和 no-go gotcha。
- `#4260`、`#4263`、`#4267`、`#4273`、`#4276`、`#4277`、`#4282`、`#4289`、`#4290`：operation/expense/report/browser/dev gotcha 链路，均为历史证据索引。
- `#4301`：Phase7 Chrome MCP final verification 44/44 PASS，属于 local evidence。
- `#4367`：report-manage remaining pages verified，属于 local admin browser evidence。
- `#4373`：Chrome MCP transport blocked；若使用 CDP fallback，必须写 fallback evidence，不能写 MCP 完成。
- `#4375`、`#4376`、`#4377`：App repair H5 CORS block、evidence docs 和 session completion；仍缺 production DB_READY、真实库样本、shadow-off/fallback 和 `/app/repairSetting.listRepairSettings` 单独页面证据。
- `#4405`-`#4409`：本次 OpenSpec 迁移修复过程的记录。

## 证据产物索引

- `.tmp/phase7-dev-browser/2026-05-16-final-batch-page-network-verification.log`：local final batch page/API shadow 44/44 PASS。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- `.tmp/phase7-dev-browser/2026-05-16-final-batch-shadow-verification.log`：local shadow-off/fallback 44/44 演练。
- `.tmp/phase7-dev-browser/2026-05-16-crud-batch-http-gate-verification.log`：47 个 CRUD/边缘 route HTTP gate。
- `.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-page-network-verification.md`：7 个 report-manage 页面 Network。
- `.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-http-gate.log`：report-manage HTTP gate。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- `.tmp/phase7-dev-browser/2026-05-18-app-repair-readonly-h5-network-verification.md`：App repair 只读 H5 页面 Network；如本轮无法确认 MCP transport，应按 CDP/fallback 证据谨慎使用。
- `.tmp/phase7-agent-reports/**`：子代理历史报告；有效事实必须迁入 OpenSpec canonical 后才可用于接力。

## 引用风险

- 三份旧文档曾被 prompt、历史计划、汇总报告和设计文档交叉引用。
- 2026-05-19：已提供稳定迁移索引 `docs/superpowers/phase7-openspec-migration-index.md`。
- 2026-05-20：删除后三份旧文件本体不再存在；旧文件名扫描只剩 `docs/superpowers/phase7-openspec-migration-index.md` 和 OpenSpec `design.md` 的迁移来源说明。
- 当前 OpenSpec change 与稳定索引内仍保留旧文件名，用于说明迁移来源、删除对象和历史发现；这不是外部死链，也不是执行入口。
- `proposal.md`、`design.md`、`tasks.md` 与本文件已改为指向 OpenSpec canonical，不再把旧三文档或临时来源覆盖审计文件当作执行源。

## 删除说明

- 旧 endpoint 状态矩阵、旧 Phase7 batch 计划和旧 monorepo API 迁移总设计曾在前一轮被删除后由用户恢复；本轮按用户要求完成核心内容转写后再次删除。
- `docs/superpowers/phase7-openspec-migration-index.md` 是后续文档侧稳定入口。
- 后续执行入口必须是 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`。
- 本次没有修改运行时代码、数据库 schema、部署配置或 package dependency。

## 失败或阻断尝试

- 2026-05-19：尝试创建 date-prefixed OpenSpec change `2026-05-19-migrate-superpowers-docs-to-openspec-longtask` 失败，CLI 报错 change name must start with a letter。已改用合法名称 `migrate-superpowers-docs-to-openspec-longtask`。

## 任务 129 禁止误判发现

2026-05-20：task129 只固化调度颗粒度，不是 runtime 迁移证据。后续 admin 批次必须以 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径为 canonical 坐标，不得凭空新建业务路径，不得一口气整域迁移；同一路径下超过 3 个 endpoint 时必须继续按 ordinary list、upload/R2、CUD/detail、edge endpoint 或紧密 endpoint 小组拆分，且不得把 upload/R2/write/delete/detail 与 ordinary list 混在同一普通 list 批次。app legacy 批次每次只能处理 2-3 endpoints 或一个小模块，可按 `/callComponent/**`、floor、repair、fee/report、guarded write、remaining app module 拆分；本调度项不得被当成端点 runtime 迁移完成、`DB_READY`、shadow-off、fallback 移除或旧服务退役证据。

## 任务 130 禁止误判发现

2026-05-20：task130 只固化 batch 三角色与独立复核契约，不是 runtime 迁移证据。后续任何批次不得无复核就勾选，不得把同一编辑者自审写成独立复核，不得用子代理报告直接作为任务源；子代理有效事实必须合并回 OpenSpec canonical 后才能接力。复核结论不得替代实际测试、HTTP gate、browser evidence、`DB_READY`、真实库样本或写入回滚证据；local、contract、browser、historical evidence 不得升级为 production `DB_READY`、shadow-off/fallback 或 retirement。若某类证据不适用，必须写明不适用原因，不能空缺后用总结文字覆盖缺口。

## 任务 131 禁止误判发现

2026-05-20：task131 只固化子代理输出的 canonical merge 边界，不是 runtime 迁移证据。后续不得把聊天记录、子代理总结、`.tmp/phase7-agent-reports/**`、旧 Superpowers 文档或临时报告当成后续执行入口、完成证据、接力入口或长期维护清单；不得新建第四份长期 source coverage 矩阵；不得用“子代理说已完成”替代 tests/evidence/checkbox；不得把未合并到 `tasks.md`、`agent-progress.md`、`agent-findings.md`、`design.md` 或 `specs/**` 的临时结论用于接力。artifact 路径可以作为证据引用，但不得维护 parallel checkbox 清单或第二任务树。

## 任务 132 禁止误判发现

2026-05-20：task132 只固化复核发现缺口后的退回/新建编辑切片边界，不是 runtime 迁移证据。后续复核发现任务缺漏、证据不足、状态越权升级、旧服务退役误判、source coverage 缺失、测试/证据命令缺失或 no-go 约束缺失时，必须退回对应 endpoint 或新建后续编辑切片，并保持任务未完成、partial、blocked、unknown-needs-triage 或 keep-source，直到补齐。不得用总结文字覆盖缺口；不得口头豁免证据；不得把复核发现写成完成证据；不得把 local/contract/HTTP/browser/historical evidence 升级为 production `DB_READY`、真实库样本、shadow-off/fallback、write closure 或 retirement candidate；不得删除、移动、归档、重命名或清空旧服务目录。

## 任务 133 禁止误判发现

2026-05-20：task133 只固化每批结束前的验证门禁，不是 runtime 迁移证据。后续每个批次必须运行与本批相关的 OpenSpec strict、`git diff --check`、包级测试/typecheck、Vitest、HTTP gate、browser/API evidence 中适用项，或明确记录不可运行/不适用原因；文档-only 批次至少需要 OpenSpec strict 和 diff check，runtime 批次必须按修改范围补包级测试/typecheck、contract/manifest/HTTP gate，并按适用性分层记录 browser evidence、DB_READY、真实库样本、写入回滚和 retirement gate。不得只跑无关命令冒充验证；不得用单一测试替代 browser evidence、DB_READY、真实库样本、写入回滚或 retirement gate；不得全局安装工具或依赖全局 turbo；不得把不可运行原因留空；不得把失败批次写成完成。任一 required check 失败时必须在 `agent-progress.md` 记录失败命令/摘要，在本文件记录阻断原因、影响范围和下一步，并按 task132 退回或新建编辑切片。

## 任务 76 Contract-Manage 列表覆盖发现

2026-05-20：task76 只完成 `property-manage/contract-manage` 12 个普通 list endpoint 的当前覆盖状态确认，不是 runtime 迁移完成证据。`contract-manage-list-coverage-audit.md` 记录了 12 个旧 admin source、12 个 `apps/api` route 和 12 个 admin hook 均存在；探索当时 `runtimeEndpointManifest`、`apps/api` contract/manifest tests 和 gated HTTP test 对这 12 个 endpoint 全缺失。task77-task80 后 12 个普通 list endpoint 获得本地 manifest/contract/gated HTTP test 条目；不得把 route file 存在、旧 source 存在、admin hook 存在或 shadow resolver 测试写成 production `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑或旧服务退役。`rank-route-keys.ts` 只登记 5 个相关三级业务路径，另外 7 个普通 list 目前不能写成 rank 页面完成。

## 任务 77 Contract-Manage 列表发现

2026-05-20：task77 只为 `archive/list`、`attachment/list`、`clause/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目，不包含 upload/R2、write/delete/detail，也不代表其他 9 个 contract-manage list endpoint 完成。三端点 status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。当前 HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## 任务 78 Contract-Manage 列表发现

2026-05-20：task78 只为 `change/list`、`draft-contract/list`、`expire/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目；不包含 `change/{create,detail,update,delete}`、`draft-contract/{create,detail,update,delete}`、upload/R2、write/delete/detail，也不代表 `first-party/list`、`print/list`、`review/list`、`second-party/list`、`template/list`、`type/list` 完成。三端点 status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## 任务 79 Contract-Manage 列表发现

2026-05-20：task79 只为 `first-party/list`、`print/list`、`review/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目；不包含 upload/R2、write/delete/detail，也不代表 `second-party/list`、`template/list`、`type/list` 完成。三端点 status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## 任务 80 Contract-Manage 列表发现

2026-05-20：task80 只为 `second-party/list`、`template/list`、`type/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目；不包含 upload/R2、write/delete/detail，也不代表 25 个 contract-manage route 整体完成。至此 task77-task80 覆盖的是 12 个普通 list endpoint，status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## 任务 82 Contract-Manage 记录发现

2026-05-20：task82 只完成记录闭环：`agent-progress.md`、本文件和 Memorix `#4472` 已同步 task77-task80 的 12 个普通 list endpoint local-dev manifest/contract/gated HTTP test 覆盖事实，并记录独立复核 PASS。该记录项不得被解释为新增运行时代码、真实 HTTP passed、页面 Network、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环、upload/R2、CUD/detail 或旧服务退役证据。

## 任务 199 后台数量基线发现

2026-05-20：task199 只完成 admin 数量口径复核和 OpenSpec 文档收敛，不是 Nitro 接口迁移完成。`dev-team/config-manage` 旧文档“16”= 四个子模块按 `list/create/update/delete` 的历史 CRUD 方法口径；当前 legacy 文件树为 20 个文件，四个子模块 `center/dictionary/item/type` 各含 `list/create/detail/update/delete`，`apps/api` 目标 route 也为 20 个，但缺 runtime manifest/contract/HTTP gate 覆盖。`setting-manage/system-manage` 旧文档“15”= 五个子模块按 `create/update/delete` 的历史 CUD 方法口径；当前 legacy 文件树为 20 个文件，五个子模块 `change-password/community-configuration/initialize-cell/register-protocol/system-config` 各含 `list/create/update/delete`，`apps/api` 目标 route 也为 20 个，但缺 `/api/setting-manage/system-manage/**` runtime manifest/contract/HTTP gate 覆盖。`property-manage/expense-manage` 当前 legacy list 文件树为 16 个 = 14 个 `phase7-expense-manage-admin-list` list + 2 个 `phase5a-expense-manage` list（`house-charge/list`、`expense-item-setting/list`）；既有 Phase7 runtime/HTTP gate 数组只代表 14 个 list 分组，不等于当前 list 总数。`property-manage/report-manage` 当前 legacy list 文件树为 13 个 = 12 个 `phase7-report-manage-admin-list` list + 1 个 `phase2-fee-payment-report` list（`payment-details-form/list`）；既有 Phase7 runtime/HTTP gate 数组只代表 12 个 list 分组，不等于当前 list 总数。

No-go：不得把 20/20/16/13 写成 runtime manifest、contract、HTTP gate、页面 Network、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役证据；不得用目录数量替代 endpoint ledger；不得把 list evidence 推导到 CUD/detail/upload/R2。后续执行必须以当前 working tree legacy 文件树和 `tasks.md` 显式 endpoint 行为准，旧数字只作为 dated historical snapshot。

## 任务 203 Report Expense Summary 发现

2026-05-20：task203 对应 `property-manage/report-manage/expense-summary-table/list`，当前结论为 partial evidence，不能勾选完成。

Pass evidence：只读代理确认 report 与 expense 同名 expense-summary-table endpoint 没有 alias 混用。report legacy/source/target route 调用链为 `adminAdapter.listReportExpenseSummaryTables` -> `service.listReportExpenseSummaryTables` -> `repository.listReportExpenseSummaryTables` -> `rptExpenseSummaries` / `rpt_expense_summaries`；expense 同名 endpoint 调用 `listExpenseSummaryTables` -> `exExpenseSummaryTables` / `ex_expense_summary_tables`。前端 caller 已分离：report hook 指向 `/api/property-manage/report-manage/expense-summary-table/list`，expense hook 指向 `/api/property-manage/expense-manage/expense-summary-table/list`；report 页面导入 report hook，expense 页面导入 expense hook。已有本地测试通过：`pnpm -F @01s-11comm/api exec vitest run tests/admin/report-manage-expense-summary-table.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts`，3 个测试文件、14 个测试通过。

Production API partial evidence：生产 API 入口来自 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。Shell fetch 显示 `GET /__nitro/health` 返回 200 且 database configured 为 true；`GET /__nitro/ready` 返回 200、code 为 `READY_CONFIGURED`、probeEnabled 为 false，不是 `DB_READY`；`POST /api/property-manage/report-manage/expense-summary-table/list` 返回 200、`success=true`、`total=2`，首条字段包含 `feeItem=物业费`、`statisticsTime=2024-01-01`。Chrome DevTools browser-context 也确认 health 200、ready code `READY_CONFIGURED`、endpoint 200、`success=true`、`total=2`，Network reqid=5；request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-expense-summary-table-production-api.network-request` 与 `.tmp/phase7-dev-browser/2026-05-20-report-manage-expense-summary-table-production-api.network-response`。

No-go：当前没有 `RUN_PHASE7_DB_READINESS_CHECK=1` 下的 `DB_READY`，没有 Neon main readiness probe 通过证据，没有 admin H5 生产页面 Network，没有 shadow-off/fallback 演练，没有退役 ledger/旧服务退役证据。因此不得把本 task 写成完成，不得把 `READY_CONFIGURED`、HTTP 200、本地 Vitest 或生产 API 200 写成 `DB_READY`、真实库样本完整或 retirement。特别禁止把 `expense-manage/expense-summary-table` 的 `.tmp` 页面证据当成 report 证据。

2026-05-21 重新采样：本任务仍未完成。独立 `apps/api` 生产环境对 `POST /api/property-manage/report-manage/expense-summary-table/list` 返回 report 契约：`x-request-id=req_fc097735-1a83-46fd-86f2-4445e363dba9`、`success=true`、`total=2`，样本包含 `feeItem=物业费`、`currentReceivable=50000.00`、`currentActualReceipt=45000.00`、`chargeRate=90.00%`、`statisticsTime=2024-01-01`。同轮 ready 返回 `x-request-id=req_1ec42e11-19d4-444b-8fde-50a79b7a1e60`、`code=READY_CONFIGURED`、`connected=null`、`probeEnabled=false`，因此仍不是 `DB_READY`。

生产 admin H5 路由 `GET https://01s-11comm.ruan-cat.com/property-manage/report-manage/expense-summary-table` 只返回 SPA HTML 文档。同源后台 `POST /api/property-manage/report-manage/expense-summary-table/list` 返回 HTTP 200，`x-request-id=e469c568-07ab-4b9b-b8a9-6dfae75a05ab`，但样本字段是旧 source 形态的 `time`、`expenseItemId`、`expenseItemName`、`receivableAmount`、`actualAmount`、`status`、`remark`。本地旧来源确认 `apps/admin/server/api/property-manage/report-manage/expense-summary-table/list.post.ts` 读取 `rptExpenseSummaries`，但映射到旧 `ExpenseSummaryTableListItem` 字段。因此该同源响应不能作为生产 admin H5 页面 Network 已切到独立 report 契约的证据，也不能作为 shadow-off/fallback 成功证据。

证据产物：`.tmp/phase7-dev-browser/2026-05-21-report-expense-summary-refresh.md`。禁止误判口径不变：在具备 `DB_READY`、Neon main readiness、真实 admin H5 页面 Network、shadow-off/fallback 演练和 retirement ledger 证据前，不得把 task203 标记为完成。

## 任务 208 Report Manage P1 发现

2026-05-20：task208 对应 `property-manage/report-manage` P1 四端点：`owner-payment-details/list`、`repair-report-form/list`、`repair-reports-summary-table/list`、`statement-expenses/list`。当前结论为 partial evidence，不能勾选完成。

Pass evidence：源码链路已接入 `apps/api`，且未混用 expense 表。`owner-payment-details/list` 调用 `listOwnerPaymentDetails` 并读 `rptOwnerPaymentDetails` / `rpt_owner_payment_details`；`repair-report-form/list` 调用 `listRepairReportForms` 并读 `rptRepairReports` / `rpt_repair_reports`；`repair-reports-summary-table/list` 调用 `listRepairReportsSummaryTables` 并读 `rptRepairSummaries` / `rpt_repair_summaries`；`statement-expenses/list` 调用 `listStatementExpenses` 并读 `rptStatementExpenses` / `rpt_statement_expenses`。前端 hook/page caller 存在，四个 hook URL 均指向 `/api/property-manage/report-manage/<endpoint>/list`，页面 caller 也存在。runtime manifest/contract/HTTP gate 文件覆盖存在，status 仍为 `available-in-apps-api-not-caller-verified`，owner `fee-report`，phase `phase7-report-manage-admin-list`。

Fallback and caller gaps：`getFeeRuntime(event)` 无 DB URL/event 时会走 in-memory fallback，四端点 fallback 当前为空分页，不是真实库证据；部分页面筛选字段未完全落到真实列，必须保守记录。虽然 hook/page caller 存在，但仍缺明确本地和生产 admin H5 页面 Network artifact，不能把 hook 证据写成页面 Network。

Local and infra test evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/report-manage-p1-endpoints.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，3 文件 18 测试通过。`pnpm -F @01s-11comm/api exec vitest run tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，3 文件 16 测试通过。

Production API partial evidence：生产 API shell 采样四个 POST 均 200 且 `success=true`，total 分别为 `owner-payment-details=2`、`repair-report-form=1`、`repair-reports-summary-table=1`、`statement-expenses=1`。Chrome DevTools browser-context 生产 API 采样四个 POST 均 200 且 `success=true`，total/listCount 同上；request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-owner-payment-details-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-repair-report-form-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-repair-reports-summary-table-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-statement-expenses-production-api.network-request` / `.network-response`。真实生产 HTTP gate 通过：`$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts`，1 文件 13 测试 passed，其中包含 report-manage canonical list endpoint 批量验证。

No-go：不能勾选 task208，因为缺 `RUN_PHASE7_DB_READINESS_CHECK=1` 下 `/__nitro/ready` 返回 `DB_READY`。仍缺 Neon main readiness probe 通过证据、真实库样本逐端点证明、admin H5 页面 Network（本地和生产都未找到明确 artifact）、shadow-off/fallback 演练、retirement ledger/旧服务退役证据。不得把 production API 200、HTTP gate passed、Vitest、manifest/contract、fallback 空分页或 `READY_CONFIGURED` 写成 `DB_READY`、真实库样本完整、页面 Network、shadow-off/fallback 或 retirement。

## 任务 210 Report Manage 剩余七项发现

2026-05-20：task210 对应 `property-manage/report-manage` 剩余七页：`arrears-details-list/list`、`data-statistics/list`、`deposit-report/list`、`fee-reminder/list`、`no-charge-house/list`、`outstanding-fees-analysis/list`、`patrol-report/list`。当前结论为 partial evidence，不能勾选完成。

Local page evidence：`.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-page-network-verification.md` 记录本地 admin 8080 通过 `/api-shadow/api/property-manage/report-manage/<endpoint>/list` 调用七页，均 200 且 `x-api-phase=phase3-infra`。requestId 分别为 `arrears-details-list=req_7fe4f163-677a-496f-98da-6fddd0b6d318`、`data-statistics=req_682d06ce-98e5-46a2-a95e-3ad98e521bba`、`deposit-report=req_becd6558-3344-479b-b65a-5d97112d203c`、`fee-reminder=req_6765dce1-6dce-4781-9082-aaeb8974bf05`、`no-charge-house=req_1da231b2-4ee0-45df-aa8e-399524689364`、`outstanding-fees-analysis=req_87784237-2029-4c16-8758-7ecd2960ab3e`、`patrol-report=req_4ae4d269-378d-4a8e-8f0b-4a2a0bb87946`；页面渲染标题分别为 `欠费明细表`、`数据统计`、`押金报表`、`费用提醒`、`未收费房屋`、`欠费分析`、`巡检报表`，total 分别为 2、2、2、1、1、2、1。该证据只代表 local/admin page-level Network，不代表 production admin H5、DB_READY、真实库样本、shadow-off/fallback 或 retirement。

Runtime/test evidence：当前本地 working tree 确认七个 endpoint 已在 `apps/api/server/shared/runtime/runtime-endpoints.ts`、`tests/infra/endpoint-manifest.test.ts`、`tests/infra/phase7-api-contracts.test.ts` 和 `tests/http/phase7-gated-http.test.ts` 的 report-manage canonical list 覆盖中。以 GitHub 默认分支读取到“未登记/无覆盖”的子代理回报与本地未提交 working tree 不一致，只能作为 stale-remote 风险提示，不能覆盖当前本地源码、测试和生产 API 证据。本地测试 `pnpm -F @01s-11comm/api exec vitest run tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，3 文件 16 测试通过。

Production API partial evidence：生产 API 地址来自 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。生产 API shell 与 Chrome DevTools browser-context 采样七个 POST 均 200 且 `success=true`，total 分别为 `arrears-details-list=2`、`data-statistics=2`、`deposit-report=2`、`fee-reminder=1`、`no-charge-house=1`、`outstanding-fees-analysis=2`、`patrol-report=1`。Chrome request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-arrears-details-list-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-data-statistics-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-deposit-report-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-fee-reminder-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-no-charge-house-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-outstanding-fees-analysis-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-patrol-report-production-api.network-request` / `.network-response`。真实生产 HTTP gate 已通过：`$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts`，1 文件 13 测试 passed，覆盖 report-manage canonical list endpoint 批量验证。

No-go：不能勾选 task210，因为仍缺 `RUN_PHASE7_DB_READINESS_CHECK=1` 下 `/__nitro/ready` 返回 `DB_READY`、Neon main readiness probe 通过证据、生产 admin H5 页面 Network、shadow-off/fallback 演练、真实库样本逐端点证明和 retirement ledger/旧服务退役证据。不得把 local `/api-shadow` 页面 Network、production API 200、HTTP gate passed、Vitest、manifest/contract 覆盖或 `READY_CONFIGURED` 写成 `DB_READY`、真实库样本完整、生产页面 Network、shadow-off/fallback 或 retirement。

## 任务 211 Payment Details Form 发现

2026-05-20：task211 对应 `property-manage/report-manage/payment-details-form/list`，当前完成的是“第 13 个 report-manage list 的 phase、manifest、contract、HTTP gate 和历史测试覆盖归属复核”。该完成不代表生产 `DB_READY`、生产 admin H5 页面 Network、真实库样本完整、shadow-off/fallback、retirement ledger 或旧服务退役。

Phase and ownership：`payment-details-form/list` 是 `phase2-fee-payment-report`、owner `fee`、admin canonical `JsonVO` endpoint，不属于 12 个 `phase7-report-manage-admin-list` / owner `fee-report` 的 report list 批量分组。后续统计 report-manage 时必须区分 “12 个 Phase7 report list” 与 “当前 legacy 文件树 13 个 report-manage list”，不能用前者覆盖后者。

Source and schema evidence：`apps/api/server/routes/api/property-manage/report-manage/payment-details-form/list.post.ts` 使用 `nitro/h3`，调用 `getFeeRuntime(event).adminAdapter.listPaymentDetailsForm`；adapter 调用 `service.getPayFeeDetailReport`，repository 读取 `rptPaymentDetails` / `rpt_payment_details`，并通过 `toPaymentDetailsFormItem` 映射为 `PaymentDetailsFormListItem`。`rptPaymentDetails` 定义在 `apps/type/src/business/property-manage/report-manage/schema.ts`，同时导出 insert/select/update Zod schema 与 `RptPaymentDetail` 类型。无 DB URL/event 时仍可能走 in-memory fallback，因此 fallback 结果不能写成真实库证据。

Test and HTTP gate evidence：`apps/api/tests/admin/fee-admin-endpoints.test.ts` 覆盖 admin adapter shape、route fallback 和 failure；`tests/modules/fee-db-repository.test.ts` 覆盖 `rptPaymentDetails` repository 读取；`tests/infra/endpoint-manifest.test.ts` 与 `tests/infra/phase7-api-contracts.test.ts` 覆盖该 endpoint 的 phase/owner/contract。已补强 `apps/api/tests/http/phase7-gated-http.test.ts`：新增独立 `phase2FeePaymentReportAdminEndpoint` 和 `serves the phase2 fee payment report admin endpoint over real HTTP`，避免继续误用 12 个 Phase7 report list gate 证明第 13 个 endpoint。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/fee-admin-endpoints.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，4 文件 23 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/report-manage/payment-details-form/tests/index.test.ts src/pages/property-manage/report-manage/payment-details-form/tests/page-api-wiring.test.ts` 通过，2 文件 4 测试 passed。默认 `pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 未设置 env 时按既有机制 skipped，1 文件 14 tests skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 14 测试 passed，其中新增 phase2 payment report admin endpoint gate 已实际运行。

Production API partial evidence：`apps/api/package.json` 的 `homepage` 当前为 `https://01s-11-server.ruan-cat.com`。生产 API shell 与 Chrome DevTools browser-context 采样 `POST /api/property-manage/report-manage/payment-details-form/list` 均为 200、`success=true`、`total=2`、`listCount=2`，首条 `orderNumber=82f9ec1f-6850-5822-b897-70c2c00d8338`、`feeItem=物业费`、`actualAmount=300`。Chrome request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-payment-details-form-production-api.network-request` 和 `.network-response`，响应头 `x-api-phase=phase3-infra`、`x-request-id=req_c86b6947-0a62-4378-9c19-db5d812b6655`。生产 health/ready 仍是 partial：health 200 且 database configured true；ready 200、code `READY_CONFIGURED`、probeEnabled false，不是 `DB_READY`。

No-go：不得把 task211 完成写成 report-manage 13/13 可退役、旧服务删除候选、生产 admin H5 页面 Network、Neon main `DB_READY`、真实库样本完整、shadow-off/fallback 或 write/read rollback 完成。真实生产 HTTP 200 与 Chrome API artifact 只能证明 API server 层 partial evidence；页面级生产 evidence 仍需通过 admin H5 入口另采。

## 任务 89 Expense Manage Phase7 发现

2026-05-20：task89 对应 `property-manage/expense-manage` Phase7 14 个 list。当前结论为 partial evidence，不能勾选完成。该 14 个 endpoint 是 `phase7-expense-manage-admin-list` 范围，不包括同目录下 `phase5a-expense-manage` 的 `house-charge/list` 与 `expense-item-setting/list`。

Source/runtime evidence：14 个 endpoint 的 `apps/api` route 均存在，均走 `getFeeRuntime(event).adminAdapter -> FeeService -> FeeRepository`。runtime manifest 均为 phase `phase7-expense-manage-admin-list`、owner `fee`、`targetClient=admin`、`routeKind=admin-canonical`、`responseContract=JsonVO`、`cutoverStatus=available-in-apps-api-not-caller-verified`。逐项数据表为：`cancel-fee/list` -> `exCancelFees` / `ex_cancel_fees`；`contracte-charge/list` -> `exContractCharges` / `ex_contract_charges`；`discount-apply/list` -> `exDiscountApplications` / `ex_discount_applications`；`discount-setting/list` -> `exDiscountSettings` / `ex_discount_settings`；`discount-type/list` -> `exDiscountTypes` / `ex_discount_types`；`expense-summary-table/list` -> `exExpenseSummaryTables` / `ex_expense_summary_tables`；`meter-reading-type/list` -> `exMeterReadingTypes` / `ex_meter_reading_types`；`overdue-payment-information/list` -> `exOverdueReminders` / `ex_overdue_reminders`；`payment-review/list` -> `exPaymentReviews` / `ex_payment_reviews`；`refund-review/list` -> `exRefundReviews` / `ex_refund_reviews`；`reminder-for-overdue-payments/list` -> `exOverdueReminders` / `ex_overdue_reminders`；`reprint-voucher/list` -> `exReprintVouchers` / `ex_reprint_vouchers`；`vehicle-charge/list` -> `exVehicleCharges` / `ex_vehicle_charges`；`water-and-electricity-meter-reading/list` -> `exMeterReadings` / `ex_meter_readings`。

Caller evidence：14 个 endpoint 的 admin hook、页面 caller 与 `rank-route-key` 均存在。`.tmp/phase7-dev-browser` 下有本地 `expense-*` request/response artifact 覆盖 14 个 endpoint，但这些文件缺页面 URL、Network URL 和 local/prod 自证字段，因此严格口径下不能写成完整页面 Network 证据。生产侧本轮保存的是 `production-api` artifact，也只能证明 API server 层请求，不能替代 admin H5 页面 Network。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，3 文件 16 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-a.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-b.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-c.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-d.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-e.test.ts` 通过，5 文件 42 测试 passed。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 14 测试 passed，其中 `serves all admin expense-manage canonical list endpoints over real HTTP` 已实际遍历 14 个 endpoint。

Production API partial evidence：生产 API 入口来自 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。生产 API shell 与 Chrome DevTools browser-context 采样 14 个 POST 均为 200 且 `success=true`，total/listCount 为 `cancel-fee=1/1`、`contracte-charge=1/1`、`discount-apply=1/1`、`discount-setting=1/1`、`discount-type=2/2`、`expense-summary-table=2/2`、`meter-reading-type=3/3`、`overdue-payment-information=1/1`、`payment-review=1/1`、`refund-review=1/1`、`reminder-for-overdue-payments=1/1`、`reprint-voucher=1/1`、`vehicle-charge=2/2`、`water-and-electricity-meter-reading=2/2`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-expense-manage-phase7-<endpoint>-production-api.network-request` / `.network-response`；后四个补采的 x-request-id 分别为 `req_0e3bb717-5dd4-46c8-a022-7b2055736814`、`req_38f17de8-6f76-4623-8c09-6d857fb005d1`、`req_face2923-b29d-424a-b6a0-e58d37c426dd`、`req_d93c5ca3-fbde-4963-a73c-f0a1445f5ee3`。生产 health/ready 仍是 partial：health 200 且 database configured true；ready 200、code `READY_CONFIGURED`、probeEnabled false，不是 `DB_READY`。

No-go：不得把 task89 勾选完成。仍缺生产 admin H5 页面 Network、`RUN_PHASE7_DB_READINESS_CHECK=1` 下 `/__nitro/ready` 返回 `DB_READY`、Neon main readiness probe 通过、真实库样本逐 endpoint 证明、shadow-off/fallback 演练和 retirement ledger/旧服务退役证据。不得把 route/manifest/test 覆盖、HTTP gate passed、production API 200、Chrome API artifact、本地 `.tmp` request/response 或 `READY_CONFIGURED` 写成 `DB_READY`、完整页面 Network、真实库样本完整、shadow-off/fallback 或 retirement。

## 任务 90 Expense Summary 别名发现

2026-05-20：task90 对应 `property-manage/expense-manage/expense-summary-table/list` 与 `property-manage/report-manage/expense-summary-table/list` 的同名路径隔离。当前结论为完成：页面、hook、ownerModule、数据表和响应字段语义没有混用；但该完成只覆盖 alias/语义隔离，不代表 `DB_READY`、生产 admin H5 页面 Network、真实库样本完整、shadow-off/fallback 或 retirement。

Frontend separation：expense 页面使用 `getRouteRank("propertyManage.expenseManage.expenseSummaryTable")`，并从 `@/api/property-manage/expense-manage/expense-summary-table` 导入 `useExpenseSummaryTableListQuery`；hook URL 为 `/api/property-manage/expense-manage/expense-summary-table/list`，类型为 `ExpenseSummaryTableListItem` / `ExpenseSummaryTableQueryParams`。report 页面使用 `getRouteRank("propertyManage.reportManage.expenseSummaryTable")`，并从 `@/api/property-manage/report-manage/expense-summary-table` 导入同名 hook；hook URL 为 `/api/property-manage/report-manage/expense-summary-table/list`，类型为 `ReportExpenseSummaryTableListItem` / `ReportExpenseSummaryTableQueryParams`。两个模块内的 hook 函数名和 `QUERY_KEY_PREFIX = "expenseSummaryTable"` 相同，但模块路径、URL 和类型参数分离。

Runtime and data-source separation：runtime manifest 中 expense endpoint 是 phase `phase7-expense-manage-admin-list`、owner `fee`；report endpoint 是 phase `phase7-report-manage-admin-list`、owner `fee-report`。expense route 调用 `adminAdapter.listExpenseSummaryTables` -> `service.listExpenseSummaryTables` -> `repository.listExpenseSummaryTables` -> `exExpenseSummaryTables` / `ex_expense_summary_tables`，字段语义为 `time`、`expenseItemId`、`expenseItemName`、`receivableAmount`、`actualAmount`、`status`。report route 调用 `adminAdapter.listReportExpenseSummaryTables` -> `service.listReportExpenseSummaryTables` -> `repository.listReportExpenseSummaryTables` -> `rptExpenseSummaries` / `rpt_expense_summaries`，字段语义为 `houseNumberContractName`、`ownerName`、`ownerPhone`、`feeItem`、`currentReceivable`、`currentActualReceipt`、`chargeRate`、`statisticsTime` 等。

Test evidence：新增 `apps/api/tests/admin/expense-manage-expense-summary-table.test.ts`，断言 expense route 将筛选字段传入 `listExpenseSummaryTables`，admin adapter 不调用 `listReportExpenseSummaryTables`，repository 查询 `ex_expense_summary_tables` 且不查询 `rpt_expense_summaries`。report 侧已有 `apps/api/tests/admin/report-manage-expense-summary-table.test.ts`，断言 report route/adapter/repository 不混用 expense 方法和 `ex_expense_summary_tables`。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/expense-manage-expense-summary-table.test.ts` 通过，1 文件 3 测试 passed。`pnpm -F @01s-11comm/api exec vitest run tests/admin/expense-manage-expense-summary-table.test.ts tests/admin/report-manage-expense-summary-table.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，4 文件 17 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-b.test.ts src/api/property-manage/report-manage/expense-summary-table/tests/index.test.ts` 通过，2 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

No-go：不得把 task90 的 alias 隔离完成写成 task89 的 14 个 expense list 全量完成；不得把 expense `.tmp` artifact 写成 report 证据；不得把同名 hook 函数名或 query key 写成跨模块混用；不得把本地 Vitest/typecheck 写成生产 `DB_READY`、生产 admin H5 页面 Network、真实库样本完整、shadow-off/fallback 或 retirement。

## 任务 91 Expense Manage Phase5a 发现

2026-05-20：task91 对应 `property-manage/expense-manage/house-charge/list` 与 `property-manage/expense-manage/expense-item-setting/list`。当前结论为完成：两个 list 已按 phase5a 范围单独复核，不能混入 Phase7 14-list 完成口径；但该完成不代表生产 `DB_READY`、生产 admin H5 页面 Network、生产写入闭环、shadow-off/fallback 或旧服务退役。

Scope and manifest：`house-charge/list`、`house-charge/detail`、`expense-item-setting/list`、`expense-item-setting/detail`、`expense-item-setting/create`、`expense-item-setting/update`、`expense-item-setting/delete` 均在 runtime manifest 中归属 phase `phase5a-expense-manage`、owner `fee`、target admin、response `JsonVO`、cutover status `cut-to-apps-api`。这七个 endpoint 是 `apps/api` 额外存在的 fee route，不能拿 Phase7 14-list 数组覆盖。

Data-source and write boundary：`house-charge` 当前只支持 list/detail 读模型，读取 `exHouseCharges` / `ex_house_charges`；repository、service、adminAdapter 都没有 `createHouseCharge`、`updateHouseCharge`、`deleteHouseCharge`。前端页面也保留字段归属提示，说明 houseCharge create/update/delete 要等字段归属和业务 action 评审后再接真实 hook。`expense-item-setting` 支持 list/detail/create/update/delete，读取和写入 `exExpenseItems` / `ex_expense_items`；create/update 经 schema/service 校验并排除 blocked fields，delete 返回 explicit unsupported/delete-policy rejection，不是软删除或生产删除成功。

Caller evidence：admin hook 已分开存在。`house-charge` hook 使用 `/api/property-manage/expense-manage/house-charge/list` 和 `/detail`，并在页面 `propertyManage.expenseManage.houseCharge` 中调用；页面写入口当前只提示 pending，不接真实 create/update/delete hook。`expense-item-setting` hook 使用 `/api/property-manage/expense-manage/expense-item-setting/{list,detail,create,update,delete}`，页面 `propertyManage.expenseManage.expenseItemSetting` 调用对应 hook。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/fee-admin-endpoints.test.ts tests/admin/expense-manage-phase5a.test.ts tests/modules/fee-admin-crud.test.ts tests/modules/fee-db-repository.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，6 文件 34 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/house-charge/tests/index.test.ts src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts` 通过，2 文件 6 测试 passed。HTTP gate 事实边界：`tests/http/phase7-gated-http.test.ts` 当前显式覆盖 `house-charge/list`；`expense-item-setting/list` 不在当前 HTTP gate 成员内，因此只能记录为 manifest/contract + 本地 API/hook 测试 + 生产 API 采样覆盖。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/property-manage/expense-manage/house-charge/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=40bb4956-6eaa-5bae-b84f-ba535402473d`、`name=住宅物业服务费`；`POST https://01s-11-server.ruan-cat.com/api/property-manage/expense-manage/expense-item-setting/list` 返回 200、`success=true`、`total=5`、`listCount=2`，首条 `id=c4b15095-070f-579a-977f-4a3adc15bbca`、`expenseItem=生活用水费`。Chrome artifact 保存为 `.tmp/phase7-dev-browser/2026-05-20-expense-manage-phase5a-house-charge-production-api.network-request` / `.network-response` 和 `.tmp/phase7-dev-browser/2026-05-20-expense-manage-phase5a-expense-item-setting-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_858c2b85-8c2b-43eb-b6db-58875a59d7b4`、`req_cb124afa-f9b1-4fe5-bc9e-5a3b5eac8fa5`，独立 shell 采样 x-request-id 为 `req_797ab312-d584-4470-8b6d-a62028392bc8`、`req_65809d10-e9ab-4026-b147-cbab48f5814f`。

No-go：本轮没有执行生产 create/update/delete，不能把本地 create/update/delete 策略测试写成生产写入闭环。仍缺生产 `DB_READY`、Neon readiness、生产 admin H5 页面 Network、shadow-off/fallback 和 retirement ledger；不得把 phase5a `cut-to-apps-api` manifest、production API 200 或本地 Vitest 写成旧服务删除候选。

## 任务 92 Dev Config Center 发现

2026-05-20 / 2026-05-21：task92 对应 `dev-team/config-manage/center/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。2026-05-20 记录只说明 `apps/api` 已有五个 route 文件和 repository CRUD 源码链路；2026-05-21 已进一步补齐本地 runtime manifest、API 专项 Vitest、infra contract 和默认 HTTP gate 证据，但仍不代表页面级 CUD、生产 detail/CUD、生产 `DB_READY` 或旧服务退役完成。

Source and DB evidence：`apps/api/server/routes/api/dev-team/config-manage/center/{list.post.ts,detail.get.ts,create.post.ts,update.post.ts,delete.post.ts}` 与旧 `apps/admin/server/api/dev-team/config-manage/center/*` 同路径文件均存在。`apps/api` handler 从 `nitro/h3` 导入，调用 `getDevRuntime(event).adminAdapter`。repository 源码显示 `listConfigCenter`、`createConfigCenter`、`getConfigCenterDetail`、`updateConfigCenter`、`deleteConfigCenter` 均落到 `dtConfigs` / `dt_configs`，其中 list/detail 为 select，create 为 insert，update 为 update，delete 为 delete。

Local API coverage evidence：2026-05-21 新增 `apps/api/tests/admin/dev-config-manage-center.test.ts`，先红灯确认 4 tests 中 1 failed + 3 passed，唯一失败是 `runtimeEndpointManifest` 缺 center 五个 endpoint；路由分发、repository `dt_configs` CRUD 意图和 adapter 缺 id 400 均已通过。随后 `apps/api/server/shared/runtime/runtime-endpoints.ts` 新增 `/api/dev-team/config-manage/center/{list,create,detail,update,delete}` 五条 admin canonical manifest，list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`、owner `dev`、response `JsonVO`、status `available-in-apps-api-not-caller-verified`。同步补 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 与 `apps/api/tests/http/phase7-gated-http.test.ts` 的 center list/detail 只读 HTTP gate；`route-inventory.md` 与 `route-inventory-details.csv.md` 已将 center 五行改为上述 phase/status，admin canonical manifest rows 为 142，dev rows 为 20。

Frontend caller evidence：`apps/admin/src/api/dev-team/config-manage/center/index.ts` 当前只导出 `useConfigCenterListQuery`，URL 为 `/api/dev-team/config-manage/center/list`。页面 `apps/admin/src/pages/dev-team/config-manage/center/index.vue` 使用 `getRouteRank("devTeam.configManage.center")` 并调用 list hook；但 `viewDetails`、`copyConfig`、`toggleStatus`、`deleteConfig` 当前仍是 console/log/确认文案，没有接真实 `detail/create/update/delete` hook，所以不能写成页面级 CUD 证据。

Verification and production API partial evidence：`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed，覆盖 center list shadow resolver。生产 API shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/center/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=e5859909-d510-5742-b338-11951949dafb`、`configName=系统名称`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-center-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_782906d0-e825-424f-8a18-6bd6165f03a0`，shell x-request-id 为 `req_81abb071-fc0e-4c7a-b1f0-3380ae34e869`。

Local verification evidence：center 本地绿色组合命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-center.test.ts tests/admin/dev-config-manage-dictionary.test.ts tests/admin/dev-config-manage-item.test.ts tests/admin/dev-config-manage-type.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 已通过，6 文件 27 tests passed + 1 文件 23 skipped；HTTP gate 默认 skipped，不代表生产 detail 或 CUD 已执行。

No-go：不得把 `center/list` 的生产 API 200、admin resolver 测试、本地 manifest/contract/Vitest/skipped HTTP gate、repository 源码 CRUD 能力或旧/新 route 文件存在写成五个 endpoint 完成。仍缺生产 detail GET 真实调用证据、create/update/delete 受控写入读回回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、shadow-off/fallback 和 retirement ledger。

## App 旧 CallComponent 核心列表发现

2026-05-21：`/callComponent/core/list` 属于 app legacy stream，不属于 admin canonical route。当前结论为 mixed compat / DB-wired-with-gap evidence；已补旧服务生产行为、生产 API server real HTTP gate、生产 App H5 页面 Network 和 DB repository mixed compat 测试，因此可关闭 §3.1 的 `[探索]`、`[实施]`、`[验证]` 三项，但三项完成不代表 DB_READY、真实 fee 字典迁移或旧服务退役。

Caller and semantics evidence：`apps/app/src/api/property-application.ts` 与 `apps/app/src/pages-sub/property/apply-room.vue` 使用 `name=apply_room_discount&type=state`；`apps/app/src/api/repair.ts` 使用 `domain=repair_status/repair_type` 等；`apps/app/src/api/fee.ts` 与 report/fee 页面使用 `name=pay_fee_config&type=fee_type_cd`。旧实现合并层在 `apps/app/server/shared/runtime/legacy-endpoints.ts`，原始定义分布在 `apps/app/server/modules/repair/endpoints.ts` 和 `apps/app/server/modules/property-application/endpoints.ts`。

apps/api evidence：`apps/api/nitro.config.ts` 将 `/callComponent/**` 交给 legacy dispatch；`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `/callComponent/core/list` GET+POST，adapter 为 `legacyAdapter.listCoreDict`，输出旧 `{ code, msg, data }` envelope；`runtime-endpoints.ts` 与 route inventory 中状态为 `app-shadow-allowlist`。本地回放通过：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/callcomponent-batch1.test.ts tests/runtime/legacy-fallback.test.ts` 为 2 文件 16 tests passed；`pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/legacy-endpoints.test.ts src/tests/nitro-runtime/runtime-base-url.test.ts src/tests/nitro-runtime/property-application-endpoints.test.ts src/tests/nitro-runtime/repair-endpoints.test.ts` 为 4 文件 54 tests passed。生产 API real HTTP evidence：新增 `apps/api/tests/http/phase7-gated-http.test.ts` 测试 `serves app legacy callComponent core list mixed compat over real HTTP`；默认 gate 为 24 skipped，生产 `PHASE7_API_BASE_URL=https://01s-11-server.ruan-cat.com` 下目标 test 为 1 passed、23 skipped，覆盖 GET `name=apply_room_discount&type=state`、POST `{ domain: "repair_type" }` 和 GET `name=pay_fee_config&type=fee_type_cd`。

Old service production behavior evidence：生产旧 app server `https://01s-11-app-server.ruan-cat.com` 只读采样确认旧行为仍是 mixed compat：`GET /callComponent/core/list?name=pay_fee_config&type=fee_type_cd` 返回 `success=true`、`code="0"`、`message="查询字典成功"`、`data=[]`；`GET /callComponent/core/list?name=apply_room_discount&type=state` 返回 7 个申请状态；`GET /callComponent/core/list?domain=repair_status` 返回 `{ data, list }` 双字段和 5 个维修状态；`POST /callComponent/core/list` body `{ domain: "repair_type" }` 返回 `{ data, list }` 双字段和 7 个维修类型。结论：`pay_fee_config/fee_type_cd` 空数组是旧服务一致行为，不是新 API 丢字典；但也不能写成真实 fee 字典迁移完成。

Implementation decision evidence：`apps/api/server/modules/repair/repository.ts` 的 DB repository 对 `repair_type` 读 `rpRepairTypes`，对 `repair_status` 保留 static code map，对 `apply_room_discount/state` 与 `pay_fee_config/fee_type_cd` 走 in-memory compat。新增 `apps/api/tests/modules/repair-db-repository.test.ts` 用例 `keeps core list mixed compat while reading repair types from DB`，证明 `repair_type` DB 优先、`repair_status` / `apply_room_discount/state` / `pay_fee_config/fee_type_cd` 兼容行为不被误写成全量 DB；`pnpm -F @01s-11comm/api exec vitest run tests/modules/repair-db-repository.test.ts` 通过 7 tests。

Production App H5 evidence：`apps/app/package.json` homepage 为 `https://01s-11-app.ruan-cat.com`。Chrome 打开 `https://01s-11-app.ruan-cat.com/#/pages-sub/report/room-fee?communityId=COMM_001` 后，Network 捕获 `GET https://01s-11-server.ruan-cat.com/callComponent/core/list?name=pay_fee_config&type=fee_type_cd`，status 200，response `{ code: 0, msg: "query success", data: [] }`，响应头含 `x-api-phase=phase3-infra`、`x-request-id=req_066f4a55-c186-4f93-b5f0-7374d4fc4f3f`、`access-control-allow-origin=https://01s-11-app.ruan-cat.com`，console 无消息；artifact 保存到 `.tmp/phase7-dev-browser/2026-05-21-callcomponent-core-list-production-app-room-fee.network-request.md`、`.network-response`、`.snapshot.txt`、`.png`。同页 `GET /app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 也返回 200，说明页面业务数据加载。

Caller gap：`apps/app/src/pages-sub/property/apply-room.vue` 定义了 `loadApplyStateRequest()` 调 `name=apply_room_discount&type=state`，但未发现实际调用；repair 页面未发现自动触发 `domain=repair_status` 或 `domain=repair_type`；fee/report 的 `room-fee`、`pay-fee-detail`、`fee-summary` 和 `fee/create` 会触发 `name=pay_fee_config&type=fee_type_cd`。因此当前 App H5 页面证据只覆盖 fee/report 的空数组兼容分支，不能外推到 property-application 和 repair 页面调用完成。

No-go：`repair_type` 可记录为 DB-wired-with-gap，但 `repair_status`、`apply_room_discount/state` 仍是 compat/static，`pay_fee_config/fee_type_cd` 当前返回空数组；不得写成 DB 完成。`legacy-dispatch` 只有 registry 404 才会调用 `proxyLegacyAppRequest`，因此 `/callComponent/core/list` 的生产 HTTP gate 与 App H5 Network 可证明 exact handler 可达并被生产页面命中，但不能替代全局 shadow-off/fallback 复验、DB_READY、真实库样本或 retirement ledger；不能把本轮探索/实施/验证三项完成写成 `/callComponent/**` 全量完成、app legacy cutover 完成或旧 app server 可退役。

## App 旧 Floor 发现

2026-05-21：`/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` 属于 app legacy stream。当前结论为 partial evidence，不勾选 `tasks.md` 对应 checkbox。代码、生产 API、生产 App H5 list 页面和真实 `hp_houses` 样本均已有证据，但仍缺 detail 自然 H5 页面入口、明确 shadow-off/fallback drill、`DB_READY` 和 retirement ledger。

Runtime and data-source evidence：两个 endpoint 在 `apps/api/server/modules/floor/legacy-endpoints.ts` 注册 GET+POST，`runtime-endpoints.ts` 标记为 `app-shadow-allowlist`，response contract 为 `{ code, msg, data }`。`getFloorRuntime(event)` 有 DB URL 时注入 `createDbFloorRepository(useDb(event))`，否则走 fallback runtime。DB repository 从 `hpHouses` / `hp_houses` 聚合 `communityId + buildingNo + floor` 生成兼容楼层视图；`floorId` 形如 `DB_<communityUuid>_<buildingNo>_<floorNum>`，只是兼容 ID，不是真实 floor 专表主键。无 DB URL fallback 才生成 `F_COMM_*`。

Production App H5 evidence：`apps/app/package.json` homepage 为 `https://01s-11-app.ruan-cat.com`。Chrome 打开 `https://01s-11-app.ruan-cat.com/#/pages-sub/property/floor-list` 后，Network 捕获 `GET https://01s-11-server.ruan-cat.com/app/floor.queryFloors?page=1&row=10&communityId=COMM_001`，status 200，response `{ code, msg, data }`，首批 `floorId` 为 `DB_92f3885e-f3eb-5f5e-a0db-1f3e0373fd21_A_1` 和 `DB_92f3885e-f3eb-5f5e-a0db-1f3e0373fd21_B_2`；response headers 含 `x-api-phase=phase3-infra`、`x-request-id=req_dc3236af-1eb6-4e17-8414-fc5f0ced76ff`、`access-control-allow-origin=https://01s-11-app.ruan-cat.com`，console 无消息。Artifacts: `.tmp/phase7-dev-browser/2026-05-21-floor-production-app-floor-list.network-response`、`.snapshot.txt`、`.png`；Chrome tool 输出了 request metadata，但未生成独立 `.network-request` 文件。

Production API and DB sample evidence：`apps/api/package.json` homepage 为 `https://01s-11-server.ruan-cat.com`。生产 API list->detail shell 采样确认 `/app/floor.queryFloors?page=1&row=1&communityId=COMM_001` 返回 `DB_92f3885e-f3eb-5f5e-a0db-1f3e0373fd21_A_1`，随后 `/app/floor.queryFloorDetail?floorId=...` 返回同一 `floorId/floorNum=1/floorName=A-1/communityId=92f3885e-f3eb-5f5e-a0db-1f3e0373fd21`。受控 Neon 样本反查只记录脱敏 host 与聚合结果：`hp_houses` 中 `community_id=92f3885e-f3eb-5f5e-a0db-1f3e0373fd21`、`building_no=A`、`floor=1` 有 `house_count=2`。生产 `/__nitro/ready` 当前仍为 `READY_CONFIGURED`、`connected=null`、`probeEnabled=false`，不是 `DB_READY`。

Verification evidence：新增 `apps/api/tests/http/phase7-gated-http.test.ts` 用例 `serves app legacy floor list and detail DB synthetic id over real HTTP`，断言生产 HTTP gate 下 list 返回 `DB_*` 合成 ID、detail 可用同一合成 ID 查回，并保持 `{ code, msg, data }` 且不含 `success`。默认 gate 未设置 env 时为 25 skipped；生产命令 `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "serves app legacy floor list and detail DB synthetic id over real HTTP"` 为 1 passed、24 skipped。`pnpm -F @01s-11comm/api exec vitest run tests/modules/floor-db-repository.test.ts tests/legacy/floor-legacy-endpoints.test.ts tests/runtime/legacy-fallback.test.ts` 为 3 files 22 tests passed。`pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/floor-endpoints.test.ts src/tests/nitro-runtime/runtime-base-url.test.ts` 为 2 files 44 tests passed。`pnpm -F @01s-11comm/api run typecheck` passed。

Caller and fallback gaps：`apps/app/src/pages-sub/property/floor-list.vue` 自然触发 `queryFloors`，并把 `floorId` 传给 unit-list；`apps/app/src/api/floor.ts` 定义了 `getFloorDetail()`，但 `apps/app/src` 只发现封装和测试引用，未发现自然 H5 页面触发 `/app/floor.queryFloorDetail`。`apps/app/src/http/runtime-base.ts` 与 runtime-base-url test 证明 shadow enabled 时 floor path 指向统一 `apps/api`；`apps/api/server/handlers/legacy-dispatch.ts` 只有 registry 404 且 legacy path 时才调用 `proxyLegacyAppRequest`。这些只能证明 exact handler 与 shadow route 可达，仍不是完整 shadow-off/fallback drill。

Old service comparison：旧 app server `https://01s-11-app-server.ruan-cat.com/app/floor.queryFloors?page=1&row=1&communityId=COMM_001` 返回 `success/code/message/data/timestamp` envelope 和 `F_COMM_001_001`；新 `apps/api` 返回 `{ code, msg, data }` 和 `DB_*`。因此本轮只能记录 unified app legacy contract 与 DB 聚合兼容 ID，不能写成旧 app server envelope 完全一致。

No-go：不要勾选 floor task。不得把 `DB_*` 写成真实 floor 主键、不得把 floor list/detail 往返外推成 unit/room 下游真实外键完成、不得把 `READY_CONFIGURED` 或 `hp_houses` 单样本反查写成全局 `DB_READY`、不得把 exact handler 可达写成 shadow-off/fallback 退役完成、不得把旧 app server 可退役。

## App 旧 Repair Setting 发现

2026-05-21：`/app/repairSetting.listRepairSettings` 验证项已按“补 App H5 页面 Network”关闭。该项不是无页面入口：`apps/app/src/pages-sub/repair/add-order.vue` 导入 `getRepairSettings`，`loadRepairTypes()` 在 `onLoad()` 中触发；页面入口为 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/add-order?communityId=COMM_001`。

Runtime evidence：`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `/app/repairSetting.listRepairSettings` GET+POST，adapter 为 `legacyAdapter.listRepairSettings`，输出旧 app `{ code, msg, data }` envelope；`apps/api/server/shared/runtime/runtime-endpoints.ts` 将其标为 `app-shadow-allowlist`。DB repository 有 `rpRepairSettings` 分支，并在 DB settings 为空时保留 repair type compatibility fallback，因此不能把该项单独写成全 repair DB_READY。

Production App H5 evidence：Chrome 打开生产 App H5 页面 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/add-order?communityId=COMM_001` 后，Network 捕获 `GET https://01s-11-server.ruan-cat.com/app/repairSetting.listRepairSettings?communityId=COMM_001&publicArea=T&page=1&row=50`，status 200，response `{ code:0,msg:"query success",data:[...] }`。首条数据为 `repairType=e49c1c1d-8778-55fe-84e2-ac670440ed67`、`repairTypeName=cleaning`、`publicArea=T`、`payFeeFlag=F`、`priceScope=public_area`；response headers 含 `x-api-phase=phase3-infra`、`x-request-id=req_be8e6c6e-efe9-4855-820b-2f1aaeb27c1a` 和 `access-control-allow-origin=https://01s-11-app.ruan-cat.com`；console 无消息。Artifacts: `.tmp/phase7-dev-browser/2026-05-21-repair-setting-production-app-add-order.network-request.md`、`.network-response`、`.snapshot.txt`、`.png`。

Verification evidence：生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "serves Batch3 repair read-only legacy endpoints over real HTTP"` 通过，1 passed、24 skipped，其中包含 `/app/repairSetting.listRepairSettings?page=1&row=1&publicArea=T`。`pnpm -F @01s-11comm/api exec vitest run tests/legacy/repair-legacy-endpoints.test.ts tests/modules/repair-db-repository.test.ts tests/runtime/legacy-fallback.test.ts` 通过，3 files 14 tests passed。`pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/repair-endpoints.test.ts src/tests/nitro-runtime/runtime-base-url.test.ts` 通过，2 files 45 tests passed。

No-go：本项只证明 `/app/repairSetting.listRepairSettings` 的生产 App H5 页面 Network 已补齐，不代表 `/app/ownerRepair.listOwnerRepairs`、`/app/dict.queryRepairStates`、`/app/ownerRepair.queryOwnerRepair` 的 2026-05-18 页面证据仍有效，不代表 `/app/ownerRepair.saveOwnerRepair` 写入口闭环，不代表 production `DB_READY`、shadow-off/fallback 复验、repair legacy 全量完成或旧 app server 可退役。

## App 旧 Repair 只读发现

2026-05-21: `/app/ownerRepair.listOwnerRepairs`、`/app/dict.queryRepairStates`、`/app/ownerRepair.queryOwnerRepair` 已完成生产 App H5 Chrome MCP Network 重采并勾选 `tasks.md` 对应验证项。完成口径仅限“三个目标只读端点的生产页面 Network 命中生产 `apps/api` 且返回旧 app envelope”；不沿用 2026-05-18 本地历史证据作为当前完成依据。

Caller evidence：`/app/ownerRepair.listOwnerRepairs` 的自然入口是 `apps/app/src/pages-sub/repair/order-list.vue`，页面 `onMounted()` 触发 `pagingRef.reload()`，再由 `handleQuery()` 调 `getRepairOrderList()`。`/app/dict.queryRepairStates` 的自然入口是同页 `repair-list-search-bar`，组件 immediate watcher 调 `getRepairStates()`。`/app/ownerRepair.queryOwnerRepair` 的自然入口是 `apps/app/src/pages-sub/repair/order-detail.vue`，`onLoad/onShow` 调 `loadPageData()`，再调 `getRepairDetail()`；本轮没有使用注释示例 `REP_001`，而是使用列表返回的真实 `repairId=65eba1b3-4d85-514a-836e-85c68c3b573e`。

Browser evidence：生产列表页 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/order-list?statusCd=10001&page=1&row=10` 捕获 `GET https://01s-11-server.ruan-cat.com/app/dict.queryRepairStates` status 200，旧 `{ code,msg,data }` envelope，headers 含 `x-api-phase=phase3-infra`、`x-request-id=req_33e40b38-920d-464a-8e55-5936c6b12ccd`、`access-control-allow-origin=https://01s-11-app.ruan-cat.com`；同页捕获 `GET https://01s-11-server.ruan-cat.com/app/ownerRepair.listOwnerRepairs?page=1&row=15&statusCd=10001&storeId=STORE_001&userId=USER_001&communityId=COMM_001&repairName=&reqSource=mobile` status 200，旧 `{ code,msg,data.ownerRepairs }` envelope，首条 `repairId=65eba1b3-4d85-514a-836e-85c68c3b573e`、`workOrderNumber=RT202401170003`、`statusCd=10001`，`x-request-id=req_ffa664e1-0d5e-496d-bae6-a36081d87fe8`，列表页 console 无消息。生产详情页 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/order-detail?repairId=65eba1b3-4d85-514a-836e-85c68c3b573e&storeId=STORE_001` 捕获 `GET https://01s-11-server.ruan-cat.com/app/ownerRepair.queryOwnerRepair?repairId=65eba1b3-4d85-514a-836e-85c68c3b573e&storeId=STORE_001&communityId=COMM_001` status 200，旧 `{ code,msg,data.ownerRepair }` envelope，`ownerRepair.repairId` 与列表一致，`x-request-id=req_f056de87-1d56-4948-ae0d-19939c404e47`。

Artifacts：`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-list-list.network-request.md`、`.network-response`，`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-list-states.network-request.md`、`.network-response`，`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-detail-detail.network-request.md`、`.network-response`，以及 `.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-list.snapshot.txt`、`.png`、`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-detail.snapshot.txt`、`.png`。

Verification evidence：`apps/api/tests/http/phase7-gated-http.test.ts` 的 `serves Batch3 repair read-only legacy endpoints over real HTTP` 已补 `queryOwnerRepair`：从列表响应取真实 `repairId` 后请求详情并断言旧 `{ code,msg,data.ownerRepair }` envelope、`repairId` 与列表一致且无 `success` 字段。生产 gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "serves Batch3 repair read-only legacy endpoints over real HTTP"` 通过，1 passed、24 skipped；默认未设置 gate env 时同文件 25 skipped。

Side finding：详情页同次载入还请求 `/app/ownerRepair.listRepairStaffRecords?repairId=65eba1b3-4d85-514a-836e-85c68c3b573e&communityId=COMM_001`，生产响应为 status 200 但业务体 `{ success:false, code:"404", data:null }`，并产生 alova `Uncaught (in promise)` console error。该端点位于 `tasks.md` §3.5 `repair-extra` 后续列表中，不能作为本项三只读端点失败依据，也不能反向写成本项完成依据。

No-go：本项不代表 repair legacy 全量完成、生产 `DB_READY`、真实库样本完整、shadow-off/fallback 复验、`ownerRepair.saveOwnerRepair` 写入闭环、`listRepairStaffRecords` 完成或旧 app server 可退役。

## App 旧 Owner Repair 保存阻断发现

2026-05-21: `/app/ownerRepair.saveOwnerRepair` 已完成默认 guard 证据闭环并勾选 `tasks.md` 对应实施项。闭环口径是“默认保持 `409 PHASE7_MUTATION_GUARDED`，未开启写入窗口”；不是实际生产 create/read-back/rollback 完成。

Runtime evidence：`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `POST /app/ownerRepair.saveOwnerRepair`，handler 转发到 `getRepairRuntime(event).legacyAdapter.saveOwnerRepair(asRecord(body))`。`apps/api/server/modules/repair/legacy-adapter.ts` 的 `saveOwnerRepair()` 在 title/context 校验和 `service.createOwnerRepair()` 前先检查 `process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1"`；默认返回 `legacyFailure(..., 409, { errorCode:"PHASE7_MUTATION_GUARDED" })`。`apps/api/server/shared/runtime/runtime-endpoints.ts` 将 `/app/ownerRepair.saveOwnerRepair` 纳入 guarded mutation set，manifest 状态保持 `blocked-for-execution`。

Caller boundary：`apps/app/src/pages-sub/repair/add-order.vue` 的 submit path 会调用 `createRepairOrder()`，`apps/app/src/api/repair.ts` 将其映射到 `/app/ownerRepair.saveOwnerRepair`。`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` 仍断言该 endpoint 不在 shadow allowlist；生产 env 路由会解析到 `https://01s-11-server.ruan-cat.com/app/ownerRepair.saveOwnerRepair`。因此本轮证明生产 API guard 可达，不证明 App H5 已完成一次安全提交演练。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/repair-legacy-endpoints.test.ts -t "blocks owner repair create by default in phase7 execution guard"` 通过，1 passed、3 skipped。生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "blocks high-risk app legacy mutation endpoints by default over real HTTP"` 通过，1 passed、24 skipped，覆盖 `/app/ownerRepair.saveOwnerRepair`。直接生产 guard probe `POST https://01s-11-server.ruan-cat.com/app/ownerRepair.saveOwnerRepair` 返回 HTTP 200 但业务体 `{ code:409, data:null, errorCode:"PHASE7_MUTATION_GUARDED" }`，headers 含 `x-api-phase=phase3-infra` 和 `x-request-id=req_aa0e648e-ecd5-46f4-8d4c-eb4eb22ebfed`。同一关键词残留检查列表查询前后 `beforeTotal=3`、`afterTotal=3`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-owner-repair-save-guard-production-api.md`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go：不得把本项写成生产维修工单创建完成、受控写入窗口已授权、read-back/rollback/cleanup 完成、repair 写链路放行、`ownerRepair.updateOwnerRepair` / `repairDispatch` / `repairFinish` / `repairEnd` / `repairStart` / `repairStop` 等其他流转写入口完成、生产 `DB_READY` 完成或旧 app server 可退役。

## App 旧 Owner Repair 评价阻断发现

2026-05-21: `/callComponent/ownerRepair.appraiseRepair` 已完成默认 guard 证据闭环并勾选 `tasks.md` 对应实施项。闭环口径是“默认保持 guarded，阻止生产评价写入”；不是实际评价写入、读回、回滚完成。

Runtime evidence：`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `POST /callComponent/ownerRepair.appraiseRepair`，handler 转发到 `getRepairRuntime(event).legacyAdapter.appraiseRepair(asRecord(body))`。`apps/api/server/modules/repair/legacy-adapter.ts` 的 `appraiseRepair()` 在 `repairId/context` 校验和 `service.appraiseRepair()` 前先检查 `process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1"`；默认返回 `legacyFailure(..., 409, { errorCode:"PHASE7_MUTATION_GUARDED" })`。`apps/api/server/shared/runtime/runtime-endpoints.ts` 将该 URL 纳入 guarded mutation set。

Caller boundary：`apps/app/src/pages-sub/repair/appraise.vue` 的 submit path 会调用 `appraiseRepair()`，`apps/app/src/api/repair.ts` 将其映射到 `/callComponent/ownerRepair.appraiseRepair`。本轮未通过 H5 表单点击做真实评价提交，只验证生产 API 默认 guard；这避免把没有 rollback 的评价写入打到生产。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/callcomponent-batch1.test.ts -t "blocks /callComponent/ownerRepair.appraiseRepair by default"` 通过，1 passed、12 skipped。生产 HTTP gate `blocks high-risk app legacy mutation endpoints by default over real HTTP` 已补 `/callComponent/ownerRepair.appraiseRepair` 并通过，1 passed、24 skipped。直接生产 guard probe `POST https://01s-11-server.ruan-cat.com/callComponent/ownerRepair.appraiseRepair` 返回 HTTP 200 但业务体 `{ code:409, data:null, errorCode:"PHASE7_MUTATION_GUARDED" }`，headers 含 `x-api-phase=phase3-infra` 和 `x-request-id=req_71b5d129-057d-44d0-912a-9482714621f9`。同一工单详情查询前后 `beforeStatus=10001`、`afterStatus=10001`、`sameRepairId=true`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-owner-repair-appraise-guard-production-api.md`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go：不得把本项写成生产评价创建完成、受控写入窗口已授权、read-back/rollback/cleanup 完成、repair 评价链路放行、`repair.replyRepairAppraise` 完成、其他维修写入口完成、生产 `DB_READY` 完成或旧 app server 可退役。

## App 旧 Fee 写入口阻断发现

2026-05-21: `/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee` 已完成默认 guard 证据闭环并勾选 `tasks.md` 3.4 默认 guard 项。闭环口径是“默认阻止生产支付、催缴和费用创建写入”；不是实际支付/催缴/费用创建、读回、回滚完成。

Runtime evidence：`apps/api/server/modules/fee/legacy-endpoints.ts` 注册三项 POST endpoint，分别分发到 `getFeeRuntime(event).legacyAdapter.nativeQrcodePayment`、`writeOweFeeCallable`、`saveRoomCreateFee`。`apps/api/server/modules/fee/legacy-adapter.ts` 的三个方法均在调用 `service.createNativeQrcodePayment()`、`service.writeOweFeeCallable()` 或 `service.saveRoomCreateFee()` 前先检查 `process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1"`；默认返回 `legacyFailure(..., 409, { errorCode:"PHASE7_MUTATION_GUARDED" })`。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/fee-legacy-endpoints.test.ts -t "blocks payment, callable write, and fee-create actions by default in phase7 execution guard"` 通过，1 passed、4 skipped。生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "blocks high-risk app legacy mutation endpoints by default over real HTTP"` 通过，1 passed、24 skipped，覆盖三项 endpoint。

Production probe evidence：直接生产 probes 均返回 HTTP 200 包裹旧 app 业务 409。`POST https://01s-11-server.ruan-cat.com/app/payment.nativeQrcodePayment` 返回 `errorCode=PHASE7_MUTATION_GUARDED`、`x-api-phase=phase3-infra`、`x-request-id=req_ea0f955b-bd09-4186-945b-2c2fea1460a0`。`POST https://01s-11-server.ruan-cat.com/app/oweFeeCallable.writeOweFeeCallable` 返回同类 guard，`x-request-id=req_a4450f46-abfc-462e-a2ca-15d26f819b49`。`POST https://01s-11-server.ruan-cat.com/app/fee.saveRoomCreateFee` 返回同类 guard，`x-request-id=req_c827dc1d-1088-4da7-8c53-4efc7d7f8b4c`。同一社区 `GET /app/fee.listFee?page=1&row=10&communityId=COMM_001` 在 probes 前后均为 `code=0`、`data.total=3`，可见 fee ids 保持 `FEE_001/FEE_002/FEE_003`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-fee-guarded-writes-production-api.md`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go：不得把本项写成支付、催缴或费用创建可放行。仍缺受控写入窗口授权、真实 write/read-back/rollback/cleanup、residual cleanup、guard restored、生产 `DB_READY`、shadow-off/fallback 和旧 app server 退役证据。

## App 旧 Fee Report 只读发现

2026-05-21: `/app/feeConfig.listFeeConfigs`、`/app/reportFeeMonthStatistics.queryReportFeeSummary`、`/app/reportFeeMonthStatistics/queryPayFeeDetail`、`/app/dataReport.queryFeeDataReport` 已完成 3.3 只读验证项并勾选 `tasks.md`。闭环口径是 HTTP gate、生产响应样本、DB repository 意图测试与 shadow-off/fallback 行为证据；不是生产 `DB_READY`，也不是旧服务退役。

Runtime and data-source evidence：四个 endpoint 均在 `apps/api/server/modules/fee/legacy-endpoints.ts` 注册为 GET/POST，并经 `fee/legacy-adapter.ts` 输出旧 app `{ code,msg,data }` envelope。DB repository 分支分别读取 `exExpenseItems`、`rptExpenseSummaries`、`rptPaymentDetails`、`rptExpenseSummaries`。`apps/api/tests/modules/fee-db-repository.test.ts` 当前 7 tests passed，覆盖 fee configs、summary、pay fee detail、data report，并新增 room fee report DB 源测试作为旁证；但 `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 仍由独立探索项约束，未在本项关闭。

Caller and fallback evidence：`apps/app/src/pages-sub/fee/create.vue` 与 `apps/app/src/pages-sub/meter/add-meter.vue` 可触发 `queryFeeConfigs()`；`apps/app/src/pages-sub/report/pay-fee-detail.vue` 可触发 `getPayFeeDetailReport()`；`apps/app/src/pages-sub/report/data-report.vue` 定义了 `getDataReport()`，但当前 `loadReport(communityInfo.communityId)` 被注释，因此本轮对 `dataReport` 采用 HTTP gate 而非自然页面 evidence。`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` 当前 46 tests passed，明确 shadow enabled 命中 apps/api，shadow disabled 对 fee/report 四端点回到旧 runtime base。

Production evidence：生产 API 采样来自 `https://01s-11-server.ruan-cat.com`。四端点均 HTTP 200、旧 app envelope、无 `success` 字段，并带 `x-api-phase=phase3-infra`：feeConfig `x-request-id=req_d85f7da0-0dc6-4a54-82d1-daff43857574`，首两条为 `生活用水费`、`住宅物业服务费`；summary `x-request-id=req_1280b469-72ff-4029-a976-7857ab10fa93`，`curReceivableFee=80000`；payFeeDetail `x-request-id=req_0de2eb88-e56e-48c2-aa31-6aad1d2a2501`，返回两条缴费明细；dataReport `x-request-id=req_5fe877d7-1789-4003-832f-60b7e9cea6f4`，返回 `物业费` 与 `停车费` 两条统计。生产 HTTP gate `serves Batch4 fee read-only report endpoints over real HTTP` 已增强关键字段断言并通过，1 passed、24 skipped。

Legacy fallback comparison：旧 app server `https://01s-11-app-server.ruan-cat.com` 对同四端点均可读，HTTP 200，但 envelope 为 `{ success,code,message,data,timestamp }`。旧服务样本含 `CONFIG_001/CONFIG_002`、summary `curReceivableFee=924`、pay fee detail `total=200`、data report `本月应收/本月实收/欠费房屋`。这只证明旧 runtime fallback 可读，且新旧数据源存在明显差异；不能写成完整 parity 或退役候选。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-fee-report-readonly-production-api.md`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go：生产 `GET /__nitro/ready` 仍为 `READY_CONFIGURED`、`connected=null`、`probeEnabled=false`，不是 `DB_READY`。不得把本项外推为 `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` join/DTO 探索完成，也不得外推为 `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 房间维度探索完成、费用写入口可放行、旧 app server 可退役或完整新旧数据一致。

## App 旧 Fee Join 与 Room Report 探索发现

2026-05-21: 3.3 中 `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` 和 `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 两个探索项已关闭。关闭含义是“确认数据源、兼容 DTO 和 gap”，不是 DB_READY 或完整迁移完成。

Fee list/detail/callable finding：`apps/api/server/modules/fee/repository.ts` 的 `createDbFeeRepository(db)` 通过 `Object.assign(fallback,{...})` 只覆盖部分 DB-backed 方法，当前没有覆盖 `listLegacyFees`、`listFeeDetails`、`listOweFeeCallables`。所以 `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` 即使在 DB runtime 下仍走 in-memory compatibility 分支。字段语义已确认：fee list 保留 fee/room/owner/amount/state 兼容 DTO；fee detail 新 API 主要返回 `data.list`，旧 app server 还会返回 `data.feeDetails`；callable list 返回 `amountdOwed/callableWayName/staffName/remark/startTime/endTime` 等催缴兼容字段。

Room report finding：`/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 分发到 `legacyAdapter.getRoomFeeReport()`，DB branch 读取 `exHouseCharges`。当前 `roomId` 与 `roomName` 都来自 `exHouseCharges.houseId`，`ownerName` 固定为空，`feeName/receivableFee/receivedFee/oweFee/stateName` 来自费用项、金额和状态映射；`floorId` 不能下推，非 UUID `communityId=COMM_001` 也不会被强行写入 UUID 列。因此它是 `db-read-with-join-gap`，不是完整房间/业主维度报表。

Production and fallback evidence：新 API `fee.listFee`、`fee.queryFeeDetail`、`oweFeeCallable.listOweFeeCallable`、`queryReportFeeDetailRoom` 均返回 HTTP 200、`x-api-phase=phase3-infra` 和旧 `{code,msg,data}` envelope，request-id 分别为 `req_e6dd00ce-9040-43cc-a4d7-1ac41f86a468`、`req_ddb66430-0c52-488d-b9cb-ee495c33d55c`、`req_4133c948-7ee3-47cc-91a7-31eea877cb7f`、`req_3c46a536-b369-45ce-8e37-33217f7a40ce`。旧 app server 同路径也可读，但 envelope 为 `{success,code,message,data,timestamp}`，且样本差异明显：旧 fee list `total=4` 而新 API `total=3`；旧 fee detail 额外包含 `data.feeDetails`；旧 room report 有 human-readable room/owner，新 API 是 `houseId` 兼容值和空 owner。

Caller evidence：`apps/app/src/pages-sub/fee/detail.vue` 调 `getFeeList()` 与 `getFeeDetail()`；`apps/app/src/pages-sub/property/apply-room-detail.vue` 通过 `getFeeDetailList()` 调 `/app/fee.queryFeeDetail`；`apps/app/src/pages-sub/fee/write-owe-callable.vue` 调 `getFeeList()` 加载待催缴费用，写入提交仍由 3.4 guard 项保护；`apps/app/src/pages-sub/report/room-fee.vue` 调 `getRoomFeeReport()`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-fee-join-and-room-report-exploration.md`。（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go：不得把探索项关闭写成真实 DB join 完成、完整房间/楼栋/业主维度完成、生产 `DB_READY`、新旧 parity、旧 app server 退役或费用写入口可放行。后续若要升级这些端点，必须先设计并验证 fee/room/owner/payment join 和 DTO parity。

## 任务 93 Dev Config Dictionary 发现

2026-05-20：task93 对应 `dev-team/config-manage/dictionary/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮确实补了 Nitro/API 代码覆盖和测试，不是只写 Markdown；但仍缺页面级 CUD、生产写入回滚、FK 删除阻断、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/dev-config-manage-dictionary.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 dictionary 五个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/dev-team/config-manage/dictionary/{list,create,detail,update,delete}` 五条 admin canonical 记录：list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`，owner `dev`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list + detail 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：五个 route 文件位于 `apps/api/server/routes/api/dev-team/config-manage/dictionary/{list.post.ts,create.post.ts,detail.get.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getDevRuntime(event).adminAdapter`。dev repository 的 `listDictionary`、`createDictionary`、`getDictionaryDetail`、`updateDictionary`、`deleteDictionary` 均使用 `dtDictionaries` / `dt_dictionaries`；专项测试断言这些 CRUD 调用不混用 `dtDictionaryItems` / `dt_dictionary_items`，避免把 dictionary 与 item 子表证据混写。

Local verification：`pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-dictionary.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，3 文件 14 测试 passed。默认 HTTP gate 未设置 env 时 `tests/http/phase7-gated-http.test.ts` 15 tests skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 15 测试 passed，其中 `serves dev config-manage dictionary list and detail over real HTTP` 已实际运行。`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/dictionary/list` 返回 200、`success=true`、`total=5`、`listCount=2`，首条 `id=0e23b1d6-f7a2-548b-9673-b17f3a4dba87`、`dictionaryName=民族`；随后 `GET https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/dictionary/detail?id=0e23b1d6-f7a2-548b-9673-b17f3a4dba87` 返回 200、`success=true`、同一 id 和名称。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-dictionary-list-production-api.network-request` / `.network-response` 与 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-dictionary-detail-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_2123be42-2ae0-4ee5-9c6c-c0c572f9e39f`、`req_afc7f9a6-2746-4439-9a23-09949f642478`，shell x-request-id 为 `req_9450e1dd-1c59-427f-9efc-e05a6e7f21ee`、`req_365193c4-3f4e-4d62-adae-f5973a3d9907`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 dictionary 五行 manifest 状态，admin canonical manifest 计数从 81 更新为 86；`dev` 组只有 dictionary 五行被补 manifest，`center`、`item`、`type`、`cache-manage`、`menu-manage` 仍需单独覆盖。前端 hook `apps/admin/src/api/dev-team/config-manage/dictionary/index.ts` 目前只导出 `useDictionaryListQuery`，URL 为 `/api/dev-team/config-manage/dictionary/list`；页面 `apps/admin/src/pages/dev-team/config-manage/dictionary/index.vue` 的 add/edit dialog submit 只调用 `testAsync()` 模拟异步，delete 按钮没有真实 handler，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list/detail 200 或 repository CRUD 源码能力写成 task93 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、字典有子项时外键约束阻止删除的证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；不能把 `dtDictionaries` evidence 外推到 `dtDictionaryItems`，也不能把 list/detail 只读 HTTP gate 外推为 CUD 完成。

## 任务 94 Dev Config Item 发现

2026-05-20：task94 对应 `dev-team/config-manage/item/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/dev-config-manage-item.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 item 五个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/dev-team/config-manage/item/{list,create,detail,update,delete}` 五条 admin canonical 记录：list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`，owner `dev`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list + detail 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：五个 route 文件位于 `apps/api/server/routes/api/dev-team/config-manage/item/{list.post.ts,create.post.ts,detail.get.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getDevRuntime(event).adminAdapter`。dev repository 的 `listDictionaryItem`、`createDictionaryItem`、`getDictionaryItemDetail`、`updateDictionaryItem`、`deleteDictionaryItem` 均使用 `dtDictionaryItems` / `dt_dictionary_items`；专项测试断言这些 CRUD 调用不混用 `dtDictionaries` / `dt_dictionaries`，避免把 dictionary 主表证据混写成 item 子表证据。

Local verification：`pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-item.test.ts tests/admin/dev-config-manage-dictionary.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 测试 passed + 1 文件 16 skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 16 测试 passed，其中 `serves dev config-manage item list and detail over real HTTP` 已实际运行。`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/item/list` 返回 200、`success=true`、`total=15`、`listCount=2`，首条 `id=14acbc2a-b857-5c68-b800-87f9b3312c3f`、`itemName=女`、`itemCode=female`；随后 `GET https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/item/detail?id=14acbc2a-b857-5c68-b800-87f9b3312c3f` 返回 200、`success=true`、同一 id/name/code。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-item-list-production-api.network-request` / `.network-response` 与 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-item-detail-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_854abed4-663e-470f-897f-0995b9921b55`、`req_522a8d06-79df-4ed2-b418-0f96458b4526`，shell x-request-id 为 `req_142ed2b2-56b8-4c17-9655-1bc7f247bf7c`、`req_fb2fe508-f62e-4d6b-8dd6-4971aee3818a`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 item 五行 manifest 状态，admin canonical manifest 计数从 86 更新为 91；`dev` 组当前只有 dictionary 与 item 共 10 行被补 manifest，`center`、`type`、`cache-manage`、`menu-manage` 仍需单独覆盖。前端 hook `apps/admin/src/api/dev-team/config-manage/item/index.ts` 目前只导出 `useConfigItemListQuery`，URL 为 `/api/dev-team/config-manage/item/list`；页面 `apps/admin/src/pages/dev-team/config-manage/item/index.vue` 的 add/edit dialog submit 只调用 `testAsync()` 模拟异步，delete/info 按钮没有真实 handler，因此不能写成页面级 create/update/delete/detail evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list/detail 200 或 repository CRUD 源码能力写成 task94 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；不能把 `dtDictionaryItems` evidence 外推到 `dtDictionaries`，也不能把 list/detail 只读 HTTP gate 外推为 CUD 完成。

## 任务 95 Dev Config Type 发现

2026-05-20：task95 对应 `dev-team/config-manage/type/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/dev-config-manage-type.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 type 五个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/dev-team/config-manage/type/{list,create,detail,update,delete}` 五条 admin canonical 记录：list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`，owner `dev`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list + detail 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：五个 route 文件位于 `apps/api/server/routes/api/dev-team/config-manage/type/{list.post.ts,create.post.ts,detail.get.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getDevRuntime(event).adminAdapter`。dev repository 的 `listDictionaryType`、`createDictionaryType`、`getDictionaryTypeDetail`、`updateDictionaryType`、`deleteDictionaryType` 均使用 `dtConfigTypes` / `dt_config_types`；专项测试断言这些 CRUD 调用不混用 `dtDictionaries` / `dt_dictionaries` 或 `dtDictionaryItems` / `dt_dictionary_items`，避免把 dictionary/item 证据混写成 type 证据。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-type.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 `manifest records all type CRUD endpoints with the real HTTP methods` 找不到五个 type manifest entry。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-type.test.ts tests/admin/dev-config-manage-item.test.ts tests/admin/dev-config-manage-dictionary.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，5 文件 22 测试 passed + 1 文件 17 skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 17 测试 passed，其中 `serves dev config-manage type list and detail over real HTTP` 已实际运行。`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/type/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=9df17c1a-5fa2-5863-bf16-c19435a6b1ac`、`typeName=系统配置`、`typeCode=system`；随后 `GET https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/type/detail?id=9df17c1a-5fa2-5863-bf16-c19435a6b1ac` 返回 200、`success=true`、同一 id/name/code。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-type-list-production-api.network-request` / `.network-response` 与 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-type-detail-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_42d19d03-55a3-4ccc-b465-6170bbc8d601`、`req_3f1b8b16-d32d-4076-b400-51eb2cb3febf`，shell x-request-id 为 `req_caf3b445-6fb5-4d98-b1c7-71504d30ae07`、`req_e11d8c13-2136-41c7-81a8-4d0e2c6e7efb`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 type 五行 manifest 状态，admin canonical manifest 计数从 91 更新为 96；`dev` 组当前 dictionary、item、type 共 15 行被补 manifest，`center`、`cache-manage`、`menu-manage` 仍需单独覆盖。前端 hook `apps/admin/src/api/dev-team/config-manage/type/index.ts` 目前只导出 `useDictionaryTypeListQuery`，URL 为 `/api/dev-team/config-manage/type/list`；页面 `apps/admin/src/pages/dev-team/config-manage/type/index.vue` 只调用 list hook，add/edit/delete 是按钮占位，没有真实 handler，因此不能写成页面级 create/update/delete/detail evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list/detail 200 或 repository CRUD 源码能力写成 task95 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；不能把 `dtConfigTypes` evidence 外推到 `dtDictionaries` 或 `dtDictionaryItems`，也不能把 list/detail 只读 HTTP gate 外推为 CUD 完成。

## 任务 96 Setting Change Password 发现

2026-05-20：task96 对应 `setting-manage/system-manage/change-password/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-change-password.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 change-password 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/change-password/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/change-password/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listChangePassword`、`createChangePassword`、`updateChangePassword`、`deleteChangePassword` 均使用 `smChangePasswordRecords` / `sm_change_password_records`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-change-password.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-change-password.test.ts tests/admin/dev-config-manage-type.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 tests passed + 1 文件 18 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/change-password/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 18 tests passed，其中 `serves setting system-manage change-password list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/change-password/list` 返回 200、`success=true`、`total=2`、`listCount=2`，首条 `id=e6aff33a-4bdd-59af-b849-b45b6e33cbff`、`username=zhangsan`、`realName=张三`、`status=success`、`changeType=initial_setup`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-setting-system-change-password-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_cdcf217c-ce53-4fe2-aeb8-878a07393720`，shell x-request-id 为 `req_f6b49f27-bbbc-4757-a843-22a78f8c7a56`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 change-password 四行 manifest 状态，admin canonical manifest 计数从 96 更新到 100。`setting` 组当前只有 change-password 四行被补 manifest；all `organize-manage` rows 和 `community-configuration`、`initialize-cell`、`register-protocol`、`system-config` 仍需单独覆盖。前端 hook `apps/admin/src/api/setting-manage/system-manage/change-password/index.ts` 当前只有 `useChangePasswordRecordListQuery`，URL 为 `/api/setting-manage/system-manage/change-password/list`，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task96 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 change-password 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## 任务 97 Setting Community Configuration 发现

2026-05-20：task97 对应 `setting-manage/system-manage/community-configuration/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-community-configuration.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 community-configuration 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/community-configuration/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/community-configuration/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listCommunityConfiguration`、`createCommunityConfiguration`、`updateCommunityConfiguration`、`deleteCommunityConfiguration` 均使用 `smCommunityConfigurations` / `sm_community_configurations`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-community-configuration.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-change-password.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 tests passed + 1 文件 19 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/community-configuration/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 19 tests passed，其中 `serves setting system-manage community-configuration list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/community-configuration/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=8ef5f334-f6eb-53a0-a2a7-208a7684c519`、`communityName=阳光花园`、`settingName=物业费标准`、`settingType=fee`、`statusCd=0`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-setting-system-community-configuration-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_a62e2063-5ac4-4a46-8dff-8c58ad84e605`，shell x-request-id 为 `req_49dedc9f-4786-4243-bef4-3adbbc65c524`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 community-configuration 四行 manifest 状态，admin canonical manifest 计数从 100 更新到 104。`setting` 组当前只有 change-password 和 community-configuration 共八行被补 manifest；all `organize-manage` rows 和 `initialize-cell`、`register-protocol`、`system-config` 仍需单独覆盖。前端 hook `apps/admin/src/api/setting-manage/system-manage/community-configuration/index.ts` 当前只有 `useCommunityConfigurationListQuery`，URL 为 `/api/setting-manage/system-manage/community-configuration/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/community-configuration/index.vue` 的 add/edit/info dialog 存在，但提交按钮仍调用 `testAsync()` 模拟操作，delete 按钮无真实 handler，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task97 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 community-configuration 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## 任务 98 Setting Initialize Cell 发现

2026-05-20：task98 对应 `setting-manage/system-manage/initialize-cell/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-initialize-cell.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 initialize-cell 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/initialize-cell/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/initialize-cell/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listInitializeCell`、`createInitializeCell`、`updateInitializeCell`、`deleteInitializeCell` 均使用 `smInitializeCells` / `sm_initialize_cells`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-initialize-cell.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-initialize-cell.test.ts tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-change-password.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，5 文件 22 tests passed + 1 文件 20 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/initialize-cell/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 20 tests passed，其中 `serves setting system-manage initialize-cell list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/initialize-cell/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=17e5bba4-a1d5-56e8-af0e-f33606990125`、`initItem=数据库初始化`、`initStatus=completed`、`configParams={"tables":45,"migrated":true}`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-setting-system-initialize-cell-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_d55ba03c-5aec-4550-9fe5-469d0cb79c47`，shell x-request-id 为 `req_9b0d26ea-df51-4540-a923-dbd8d4fe72e4`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 initialize-cell 四行 manifest 状态，admin canonical manifest 计数从 104 更新到 108。`setting` 组当前只有 change-password、community-configuration 和 initialize-cell 共十二行被补 manifest；all `organize-manage` rows 和 `register-protocol`、`system-config` 仍需单独覆盖。前端 hook `apps/admin/src/api/setting-manage/system-manage/initialize-cell/index.ts` 当前只有 `useInitializeCommunityListQuery`，URL 为 `/api/setting-manage/system-manage/initialize-cell/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/index.vue` 的 add/edit submit 与 format dialog 仍调用 `testAsync()` 模拟操作，操作列没有真实 delete handler，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task98 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 initialize-cell 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## 任务 99 Setting Register Protocol 发现

2026-05-21：task99 对应 `setting-manage/system-manage/register-protocol/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-register-protocol.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 register-protocol 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/setting-manage/system-manage/register-protocol/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/register-protocol/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listRegisterProtocol`、`createRegisterProtocol`、`updateRegisterProtocol`、`deleteRegisterProtocol` 均使用 `smRegisterProtocols` / `sm_register_protocols`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-register-protocol.test.ts` 按预期失败，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-register-protocol.test.ts tests/admin/setting-system-change-password.test.ts tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-initialize-cell.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，6 文件 26 tests passed + 1 文件 21 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/register-protocol/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 21 tests passed，其中 `serves setting system-manage register-protocol list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/register-protocol/list` 返回 200、`success=true`、`code=200`、`message=查询成功`、`total=2`、`listCount=2`、`hasMsg=false`，首条 `id=4e9782ef-24e3-52bf-88de-b412e3ce4d9c`、`title=用户注册协议`、`version=v1.0.0`、`status=enabled`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-21-setting-system-register-protocol-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_fe161693-aedc-43e7-a05c-9f3b5577491e`，shell x-request-id 为 `req_277a6dcc-e586-43c2-b202-d9510e80665c`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 register-protocol 四行 manifest 状态，admin canonical manifest 计数从 108 更新到 112，`setting` manifest 行数从 12 更新到 16。前端 hook `apps/admin/src/api/setting-manage/system-manage/register-protocol/index.ts` 当前只有 `useRegisterProtocolListQuery`，URL 为 `/api/setting-manage/system-manage/register-protocol/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/register-protocol/index.vue` 只读取列表首条协议并展示 `title/content`，没有真实 create/update/delete hook、提交按钮、删除 handler 或页面级 CUD 调用，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task99 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 register-protocol 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## 任务 100 Setting System Config 发现

2026-05-21：task100 对应 `setting-manage/system-manage/system-config/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-config.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 system-config 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/system-config/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/system-config/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listSystemConfig`、`createSystemConfig`、`updateSystemConfig`、`deleteSystemConfig` 均使用 `smSystemConfigs` / `sm_system_configs`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-config.test.ts` 按预期失败，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-config.test.ts tests/admin/setting-system-register-protocol.test.ts tests/admin/setting-system-initialize-cell.test.ts tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-change-password.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，7 文件 30 tests passed + 1 文件 22 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/system-config/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 22 tests passed，其中 `serves setting system-manage system-config list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/system-config/list` 返回 200、`success=true`、`code=200`、`message=查询成功`、`total=1`、`listCount=1`、`hasMsg=false`，首条 `id=fc60b62e-d530-5fec-80e1-11f45f84f4de`、`configKey=system.config`、`category=""`、`title=system.config`；Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-21-setting-system-config-list-production-api.network-request` / `.network-response`，浏览器 x-request-id 为 `req_6d8841ed-8bf3-4e63-9790-715ce6aaa745`，shell x-request-id 为 `req_0b2429bf-3601-4239-add3-1bcc31bb93f4`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 system-config 四行 manifest 状态，admin canonical manifest 计数从 112 更新到 116，`setting` manifest 行数从 16 更新到 20。前端 hook `apps/admin/src/api/setting-manage/system-manage/system-config/index.ts` 当前只有 `useSystemConfigListQuery`，URL 为 `/api/setting-manage/system-manage/system-config/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/system-config/index.vue` 有编辑表单但提交仍调用 `testAsync()` 并保留 TODO，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task100 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 system-config 四行覆盖外推为 setting system-manage 20 个 endpoint 完成或 setting 全量 28 个 route 完成。

## 任务 101 Contract Change/Draft CRUD 发现

2026-05-21：task101 对应 `property-manage/contract-manage/change/{create,detail,update,delete}` 与 `property-manage/contract-manage/draft-contract/{create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 local apps/api Nitro/API 代码覆盖和测试，但仍缺生产 CUD、write-read-rollback、生产 admin H5 Network、生产 `DB_READY` 和退役证据。

Implemented evidence：`apps/api/server/shared/runtime/runtime-endpoints.ts` 当前包含 8 条 admin canonical POST manifest，phase `phase7-contract-manage-admin-crud`，owner `contract`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。8 个 route 文件位于 `apps/api/server/routes/api/property-manage/contract-manage/change/{create.post.ts,detail.post.ts,update.post.ts,delete.post.ts}` 与 `apps/api/server/routes/api/property-manage/contract-manage/draft-contract/{create.post.ts,detail.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getContractRuntime(event).adminAdapter`，未直接走旧 `apps/admin/server` service。

Source and data-source evidence：`apps/api/tests/admin/contract-change-draft-crud.test.ts` 断言 8 个 route 分别调用 contract runtime adapter 的 `createChange/getChangeDetail/updateChange/deleteChange/createDraftContract/getDraftContractDetail/updateDraftContract/deleteDraftContract`。同一测试还断言 DB repository 的 change CRUD 使用 `ctChanges` / `ct_changes`，draft-contract CRUD 使用 `ctContracts` / `ct_contracts`，并覆盖 detail/delete 缺失 id 返回 400。

Local verification：`pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-change-draft-crud.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，3 文件 15 tests passed + 1 文件 22 skipped。默认 HTTP gate 未设置 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 时仍 skipped，本轮没有把 create/update/delete 写入生产环境。`pnpm -F @01s-11comm/api run typecheck` 通过；`openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 8 行 manifest 状态，contract manifest 行数从 12 更新到 20。独立复核在 2026-05-21 纠正当前 inventory 总数：按 `runtime-endpoints.ts` 实际状态，admin canonical manifest rows 为 136，contract rows 为 20；此前 task101 记录中的 `116 -> 124` 只反映局部旧计数，后续以修正后的 inventory 为准。该状态只表示 local apps/api manifest/contract coverage，不表示 caller 已在生产页面命中新 API。`contract-manage/upload/*` 5 个 R2 multipart route 仍单独阻断，不属于 task101 完成范围。

No-go：不得把本轮 manifest、route、adapter、repository、Vitest 或 skipped HTTP gate 写成 task101 完成。仍缺生产 create/detail/update/delete 实际请求证据、受控写入-读回-回滚和清理证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 change/draft-contract 8 行覆盖外推为 upload/R2 完成、contract-manage 25 个 route 全量完成或旧 `apps/admin/server` 可退役。

## 边缘路由 Setting Org Tree 发现

2026-05-21：边缘路由任务覆盖 `org-info/tree`、`j1-dashboard/center/commonmenu/get` 和 `debug-env.get`。当前结论只是 partial evidence，不是任务完成。

实施证据：三项里只有 `org-info/tree` 升级为本地 `apps/api` 后台契约覆盖。`apps/api/server/routes/api/setting-manage/organize-manage/org-info/tree.post.ts` 分发到 `getSettingRuntime(event).adminAdapter.getOrgInfoTree`；`apps/api/server/modules/setting/admin-adapter.ts` 调用 `service.getOrgInfoTree`；`apps/api/server/modules/setting/service.ts` 暴露 repository 方法；`apps/api/server/modules/setting/repository.ts` 读取 `smOrganizations` / `sm_organizations`，按 `sortOrder` 和 `orgName` 排序，并构建 `OrganizationTreeNode[]` 父子树。`apps/api/server/shared/runtime/runtime-endpoints.ts` 已把 `/api/setting-manage/organize-manage/org-info/tree` 纳入 admin canonical POST，phase 为 `phase7-setting-organize-manage-admin-edge`，owner 为 `setting`，response 为 `JsonVO`，status 为 `available-in-apps-api-not-caller-verified`。

契约与排除证据：`apps/api/tests/admin/setting-organize-edge-routes.test.ts` 初始按预期失败，原因是缺 manifest 行、adapter 返回 `data: []`、repository 缺 `getOrgInfoTree`。实现后，该测试验证 manifest 覆盖、route 到 adapter 分发、adapter/service/repository 的树行为和 repository 表意图。同一测试断言 `debug-env.get.ts` 与 `j1-dashboard/center/commonmenu/get.ts` 不在 `runtimeEndpointManifest` 中；`debug-env` 只是诊断接口（`nodeEnv` + `nitro: true`），`commonmenu/get` 仍是返回 `[]` 的占位文件路由，没有已证明的业务模块或真实调用端。

验证证据：红绿循环后，`pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-organize-edge-routes.test.ts` 通过，1 文件 5 测试通过。`pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-organize-edge-routes.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，3 文件 16 测试通过。`pnpm -F @01s-11comm/api run typecheck` 通过。

本地 admin H5 浏览器证据：`org-info/tree` 已具备本地 Chrome DevTools MCP 页面 Network 证据。本地 dev 服务分别是 `apps/api` 的 `http://127.0.0.1:3102` 和 `apps/admin` 的 `http://127.0.0.1:8080`，后台 shadow 环境把 `/api-shadow` 代理到本地 API base。业务路由为 `http://127.0.0.1:8080/#/setting-manage/organize-manage/org-info`；注入最小本地登录态后，Network 记录到 `POST http://127.0.0.1:8080/api-shadow/api/setting-manage/organize-manage/org-info/tree`，状态 200，响应为 `JsonVO` 组织树。证据产物为 `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.network-request`、`.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.network-response`、`.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.snapshot.txt` 和 `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.png`。同页 `org-info/list` 也通过 `/api-shadow` 返回 200 并保存为旁证，但它仍是 `manifest-missing`，不得由该证据升级。

Production API blocker: `apps/api/package.json` declares production API homepage `https://01s-11-server.ruan-cat.com`. Production read-only sampling on 2026-05-21 showed `GET /__nitro/ready` returning `READY_CONFIGURED` with `checks.database.connected=null` and `probeEnabled=false`, so this is not `DB_READY`. `POST /api/setting-manage/organize-manage/org-info/tree` returned 200 with `success=true`, `code=200`, but `data=[]`. The same production API returned 5 organization rows for `POST /api/setting-manage/organize-manage/org-info/list` (`total=5`, first row `总公司/HQ`). This combination means production API reachability exists, but production DB-backed tree behavior is not proven and should be treated as a deployment/runtime blocker until tree returns the expected hierarchy in production. Chrome artifacts are `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-api.chrome.network-request`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-api.chrome.network-response`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-api.chrome.network-request`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-api.chrome.network-response`, `.tmp/phase7-dev-browser/2026-05-21-api-ready-production-api.chrome.network-request`, and `.tmp/phase7-dev-browser/2026-05-21-api-ready-production-api.chrome.network-response`.

生产 admin H5 阻断证据：`apps/admin/package.json` 声明生产后台首页为 `https://01s-11comm.ruan-cat.com`。注入最小本地浏览器登录态后，Chrome 到达 `https://01s-11comm.ruan-cat.com/#/setting-manage/organize-manage/org-info`。Network 显示生产页面直接请求 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/organize-manage/org-info/tree`，状态 200 但 `data=[]`；同时请求 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/organize-manage/org-info/list`，状态 200 且有 5 行。页面 snapshot 显示组织树容器为空，而右侧表格有 5 行。证据产物为 `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.network-request`、`.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.network-response`、`.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-admin-page.network-request`、`.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-admin-page.network-response`、`.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.snapshot.txt` 和 `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.png`。这证明生产 admin H5 调用已路由到 `apps/api`，但也确认生产 tree 数据仍被阻断。

清单边界：`route-inventory.md` 和 `route-inventory-details.csv.md` 当前统计到 137 条 admin canonical manifest 行与 21 条 `setting` 行。本更新只升级 `org-info/tree`；其余 `setting-manage/organize-manage` 行仍保持 manifest-missing。

禁止误判：暂时不得把 edge route 任务标记为完成。缺失证据仍包括生产 `DB_READY`、生产 tree 数据一致性、shadow-off/fallback 和 retirement ledger。不得把 `debug-env` 或 `commonmenu/get` 当成业务迁移行，也不得从单个 `org-info/tree` 行推断 `setting-manage/organize-manage` 已全量覆盖。

## App Notice、Profile、Video 测试探索发现

2026-05-21：§3.5 的 `notice/profile/video` 与 `test` 探索已按归类口径关闭，不是独立 `apps/api` 迁移完成。

`notice/profile/video` 是旧 App H5 runtime 模块，且存在真实 App 页面调用端，但独立 `apps/api` 还没有这九条路径的精确注册项。生产 `apps/api` 当前对这些 `/app/**` 路径返回 200，只是因为 `legacy-dispatch` 在 registry 404 后回退到 `https://01s-11-app-server.ruan-cat.com`。响应 envelope 是 `{ success, code, message, data, timestamp }`，这是旧 App server 形态，不是已迁移 fee/floor/repair handler 使用的独立 `apps/api` 精确旧 App 契约 `{ code, msg, data }`。因此，在后续切片补明确 manifest、allowlist、contract、guard 和 repository 决策前，这九个端点必须继续保持 `legacy-fallback/mock-like`。

`profile.changeCommunity` 和 `profile.changePassword` 在旧 in-memory profile repository 中属于类写入操作。当前生产 200 样本只是 fallback 证据，不能证明已经有 Phase7 guarded 精确 handler。后续迁移不得把它们直接复制成开放写入口；必须先补明确 guard、写入读回回滚模型，并决定它们到底是 mock-only、公开个人资料操作，还是实际账号/小区状态变更。

`video.getPlayVideoUrl` 返回的是 `interactive-examples.mdn.mozilla.net` 的示例媒体地址，并拼接 machine id。它可以作为兼容证据，但不是摄像头/视频平台真实集成证据，也不是 DB 证据。

`/test`、`/test/params` 和 `/test/error` 是诊断/mock 路由。独立 `apps/api` 生产环境对三者均返回 404，因为只有 `/app/**` 和 `/callComponent/**` 会进入 legacy fallback。旧 app server 对 `/test*` 返回 H5 HTML，而不是诊断 JSON。除非后续有明确的诊断路由决策，否则这些路由应从业务 endpoint 完成率和退役台账中排除。

工具陷阱：PowerShell `Invoke-WebRequest -SkipHttpErrorCheck` 和直接 `[System.Net.Http.HttpClient]` 采样在本 shell 中都失败了，不能据此下 HTTP 结论。已采纳的生产证据来自 Node 22 `fetch`；不得把早期 PowerShell 报错复用为 endpoint 状态证据。

禁止误判：本发现不证明 `DB_READY`、精确 `apps/api` handler、真实 DB 样本、profile 写入口安全、shadow-off/fallback 退役或旧 app server 退役。

## App Room Unit 探索发现

2026-05-21：§3.5 的 `room/unit` 探索已按 ID 语义和 fallback 归类口径关闭，不是独立 `apps/api` 迁移完成。

`apps/app/server/modules/unit/repository.ts` 会生成 `F_COMM_001_001`、`U_COMM_001_001_01` 这类合成 ID。`apps/app/server/modules/room/repository.ts` 会生成 `R_COMM_001_001_01_01` 这类合成 ID。这些值是旧 App 兼容/mock 标识，不得描述成真实数据库主键、真实楼栋/单元/房屋外键，或下游 DB join 安全的证明。

生产 `apps/api` 对 `/app/unit.queryUnits`、`/app/unit.queryUnitDetail`、`/app/room.queryRooms` 和 `/app/room.queryRoomDetail` 返回 HTTP 200，但响应 envelope 是 `{ success, code, message, data, timestamp }`。独立 `apps/api` 没有 room/unit App 旧端点精确注册项，因此这些只是旧 app server 的 legacy fallback 代理样本，不是已迁移的精确 handler。当前 ready 证据仍是 database probe disabled 的 `READY_CONFIGURED`，不是 `DB_READY`。

`apps/app/src/api/unit.ts`、`apps/app/src/api/room.ts`、`pages-sub/property/unit-list.vue`、`room-list.vue` 和 `room-detail.vue` 存在调用端覆盖；这只能证明 App H5 有消费者，不能证明消费者已经切到独立 `apps/api` 精确 handler。

后续迁移要么明确把兼容 ID 映射到 schema-backed 真实键，要么在新的精确 handler 中把它们保留为有文档说明的兼容 ID。不得把合成 `F/U/R_COMM_*` 命名空间静默混入真实 UUID-backed schema 行。

禁止误判：本发现不证明 DB-backed room/unit 读取、App H5 生产页面 Network、shadow-off/fallback 退役或旧 app server 退役。

## App Contact 探索发现

2026-05-21：§3.5 的 `contact` 探索已按 server-only、fallback 与写入风险归类口径关闭，不是独立 `apps/api` 迁移完成。

`apps/app/server/modules/contact/endpoints.ts` 定义 8 个旧 App runtime endpoint，`apps/app/server/shared/runtime/runtime-endpoints.ts` 已包含它们。独立 `apps/api/server/shared/runtime/runtime-endpoints.ts` 没有注册 contact 精确 handler，因此生产 `/app/contact.*` 的 200 响应只是通过 `legacy-dispatch` 得到的旧 App server fallback 样本，不是已迁移精确 handler。

旧 contact repository 是 in-memory 且含 mock/randomized 行为。它生成 `CON_001` 到 `CON_030`，使用随机姓名、电话、部门、岗位和在线状态，并在 `getFavoriteContacts()` 内使用 `Math.random()`。因此常用联系人输出不稳定，不能作为确定性新旧 parity 证据。紧急联系人只是 `EMG_001`、`400-888-9999` 这类兼容样本。

当前调用端扫描没有发现正常的 `apps/app/src/api/contact.ts` wrapper，也没有发现 `/app/contact.*` 的普通 App H5 业务页面调用端。已发现的调用只限于 Vite mock 包装、类型/常量、测试、图标和无关联系电话 UI 字段。这使该模块在当前 App H5 调用端扫描下属于 server-only，但 server-only 不等于允许删除。

`/app/contact.updateOnlineStatus` 是旧 runtime 中的 POST 写入口，会修改 in-memory contact 对象。本切片没有执行生产 POST。如果保留到独立 `apps/api`，它需要明确的默认 guard、受控写入窗口、读回、回滚/清理和残留检查。不得把它迁移成开放生产写入口。

当前 ready 证据仍是 database probe disabled 的 `READY_CONFIGURED`，不是 `DB_READY`。

禁止误判：本发现不证明精确 `apps/api` handler、DB-backed contact 数据、App H5 页面切流、contact 写入口安全、shadow-off/fallback 退役或旧 app server 退役。

## App Appointment 探索发现

2026-05-21：§3.5 的 `appointment` 探索已按页面调用端、fallback 和写入风险归类口径关闭，不是独立 `apps/api` 迁移完成。

`apps/app/src/api/appointment.ts` 和 `apps/app/src/pages-sub/appointment/index.vue` 证明 `/app/communitySpace.listCommunitySpaceConfirmOrder` 与 `/app/communitySpace.saveCommunitySpaceConfirmOrder` 都存在真实 App H5 调用端。这与 server-only 模块不同，但仍不能证明已经切到独立 `apps/api` 精确 handler。

独立 `apps/api/server/shared/runtime/runtime-endpoints.ts` 没有注册 appointment 精确 handler。生产 `/app/communitySpace.listCommunitySpaceConfirmOrder` 只读响应使用旧 App H5 `{ success, code, message, data, timestamp }` envelope，因此它们是通过 `legacy-dispatch` 得到的旧 App server fallback 样本，不是已迁移精确 handler。

`/app/communitySpace.saveCommunitySpaceConfirmOrder` is a POST 核销 endpoint in the old runtime. The old repository mutates in-memory order state from `WAIT_CONFIRM` to `CONFIRMED`; existing App runtime tests intentionally prove that mutation behavior. No production POST was executed in this slice. If retained in independent `apps/api`, it needs an explicit default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

当前 ready 证据仍是 database probe disabled 的 `READY_CONFIGURED`，不是 `DB_READY`。

No-go: this finding does not prove exact `apps/api` handlers, DB-backed appointment orders, safe 核销 writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Visit 探索发现

2026-05-21: Section 3.5 `visit` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/visit.ts`, `apps/app/src/pages-sub/visit/index.vue`, and `apps/app/src/pages-sub/visit/detail.vue` prove real App H5 callers exist for `/app/visit.getVisit`, `/app/visit.getVisitDetail`, and `/app/visit.auditVisit`. This does not prove cutover to an exact independent `apps/api` handler.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register visit exact handlers. Its `return-visit` admin route is unrelated to App H5 `/app/visit.*`. Production read-only responses for `/app/visit.*` use the old App H5 `{ success, code, message, data, timestamp }` envelope, so they are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/visit.auditVisit` is a POST approval endpoint in the old runtime. The old repository mutates in-memory `state/stateName`; existing App runtime tests intentionally prove that mutation behavior. No production POST was executed in this slice. If retained in independent `apps/api`, it needs an explicit default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed visit data, safe visit approval writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Repair Extra 探索发现

2026-05-21: Section 3.5 `repair-extra` exploration is closed as exact-registry-gap/fallback/shared-URL/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/repair/endpoints.ts` registers the 18 endpoints in this row. Ten are read-compatible list/dictionary/statistics/resource paths, while eight are repair workflow mutations: update, dispatch, finish, end, reply appraise, start, stop, and grabbing repair. The old repository is in-memory and mutates repair state for these workflow actions.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/repair.ts` exposes wrappers for the row, and `pages-sub/repair/dispatch.vue`, `finish.vue`, `handle.vue`, `select-resource.vue`, `order-detail.vue`, `end-order.vue`, `appraise-reply.vue`, and `order-list.vue` provide natural page or action callers. This proves caller presence, but does not prove cutover to independent exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Independent `apps/api/server/modules/repair/legacy-endpoints.ts` currently registers only the Phase4A minimal repair slice: owner repair list/detail, save guard, repair settings, repair states, core list, and appraise guard. The `repair-extra` row endpoints are absent from `runtimeEndpointDefinitions` and `runtimeEndpointManifest`; tests explicitly assert `repairDispatch`, `listStaffRepairs`, `resourceStore.listResources`, and `resourceStoreType.listResourceStoreTypes` are absent.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production API read samples for the ten read-compatible paths returned old App fallback envelopes `{ success, code, message, data, timestamp }` through the API front door. Representative request IDs: `listStaffRepairs=req_12333f99-2038-491f-8b66-104c1e7c3af2`, `listStaffFinishRepairs=req_cf3236c2-e417-47ca-81d0-868326b164be`, `listRepairStaffs=req_a3ba4c0e-08ae-4b35-b2fb-120a0f0131c8`, `repairTypeUsers=req_be27338b-4b7c-4e00-9a4a-b3f8c6ce6571`, `listUserStorehouses=req_cf94934c-f1c2-4230-952e-3c4075d8848c`, `statistics=req_5a006987-3c43-4cec-b5da-d60a444610db`, `resourceStoreTypes=req_77ad9820-6b8c-4cf8-9b1e-018834b75b83`, `staffRecords=req_a14fa585-624c-4f54-bc40-d17c7485c6d1`, `payTypes=req_150551f6-d681-460b-83e3-9f121368bc3f`, `resources=req_7a349708-4a70-48d3-a3ea-a18187efe551`. Direct fallback base returned compatible old envelopes; App H5 direct API-path probes returned 404.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/resourceStoreType.listResourceStoreTypes` is a repair/resource shared URL. The old legacy merge dispatcher sends paginated calls to the resource module and non-paginated calls to the repair module. Therefore this finding does not close the larger `resource` 24-endpoint row.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed. If these workflow endpoints are migrated, they need explicit default guard behavior, controlled test data, read-back, rollback/cleanup, residual check, guard restoration, and App H5 page evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed repair-extra data, safe repair workflow writes, production App H5 Network cutover, resource row completion, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Resource 探索发现

2026-05-21: Section 3.5 `resource` exploration is closed as source/caller/fallback/shared-URL/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/resource/endpoints.ts` registers the 24 endpoints in this row. Eleven are read-compatible list/audit/resource-stock paths; thirteen are purchase, item-out, allocation, audit, delete, enter, transfer, return, or scrap write endpoints. The old repository is in-memory and mutates purchase/apply/allocation lists or audit task states for these write paths.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/resource.ts` exposes wrappers for the row. Resource pages under `pages-sub/resource/*` and the purchase list page provide real page/action callers. This proves caller presence, but not cutover to independent exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` currently imports only fee, repair, and floor app legacy definitions. It has no resource exact app legacy handler. The infra manifest test explicitly keeps `/app/resourceStore.listResourceStores` out of the independent runtime manifest. Therefore production 200 responses for these resource paths are old App fallback samples through the API front door.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Duplicate URL boundaries matter: `/app/resourceStore.listResourceStores` is merged from purchase/resource and returns both `data.list` and `data.resourceStores`; `/app/purchase/purchaseApply` is also purchase/resource shared and is a write endpoint; `/app/resourceStoreType.listResourceStoreTypes` is repair/resource shared and dispatches to resource only when `page` or `row` is present.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read samples for the 11 read-compatible paths returned old App fallback envelopes `{ success, code, message, data, timestamp }`. Representative request IDs: `resourceStore.listResourceStores=req_56bfc168-5bcc-4b97-9a5c-f69446fbe94e`, `listStorehouses=req_a0c2ff28-e353-43d7-9b51-57207c8ec10e`, `purchaseApply.listPurchaseApplys=req_c7c6b454-a1ca-42fb-9019-bafe7bfae55d`, `itemRelease.listItemRelease=req_410a21dc-fe80-408d-9cfd-73dde3b0820e`, `listAllocationStorehouseApplys=req_51a7cd3e-012d-47b3-a9df-2f3a458453cf`, `listMyAuditOrders=req_70b15a19-932f-4789-b2b7-2d76790c0879`, `queryUndoItemRelease=req_c6336bb7-a249-41a1-8477-72578b2e86af`, `listAllocationStoreAuditOrders=req_9f400111-223a-40ad-bd4c-6bcf9dc7b8ae`, `resourceStoreType.listResourceStoreTypes=req_2d238c3d-81c5-45d4-ab1d-ba5b626fa1de`, `listAllocationStorehouses=req_709a67f4-afb1-43cc-8e37-a2a5f74c0843`, `queryMyResourceStoreInfo=req_ac26b46d-89f3-43bb-be80-20d2d5581a9b`. Direct fallback base returned compatible old envelopes; App H5 direct API-path probes returned 404.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The existing client-only gap paths `/app/itemRelease.queryFinishItemRelease`, `/app/purchase/updatePurchaseApply`, `/app/purchaseApply.listAuditHistoryOrders`, and `/app/resourceStore.listAllocationStoreHisAuditOrders` remain blocked and are not closed by this finding.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed. If resource writes are migrated, they need explicit default guard behavior, controlled test data, read-back, rollback/cleanup, residual check, guard restoration, and App H5 page evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed resource data, safe resource workflow writes, client-only gap closure, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Purchase 探索发现

2026-05-21: Section 3.5 `purchase` exploration is closed as duplicate-URL/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/resourceStore.listResourceStores` and `/app/purchase/purchaseApply` are duplicate legacy URLs shared by the old `purchase` and `resource` modules. The old App runtime intentionally keeps these URLs out of the module priority layers and serves them through `legacy-endpoints.ts` merge definitions. Therefore future migration must preserve the merged compatibility contract or make a deliberate split decision; it must not silently pick only one module's response shape.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/resourceStore.listResourceStores` production output includes both `data.list` and `data.resourceStores`. That is compatibility/fallback behavior from the old App server. Independent `apps/api` has no exact purchase app legacy registry entries for this slice.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/purchase/purchaseApply`, `/app/purchase/urgentPurchaseApply`, and the client-only `/app/purchase/updatePurchaseApply` are write endpoints or write callers. No production POST was executed. Existing old-runtime tests only prove in-memory mutation/merge behavior; they do not prove Phase7 guarded exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/purchaseApply.listAuditHistoryOrders` is a client-only read gap in this slice. The API wrapper exists in `apps/app/src/api/resource.ts`, but no old runtime endpoint was found and both production `apps/api` fallback and direct old App server probes return HTTP 500 with `error/status/unhandled`. This path is blocked until an exact handler, fallback fix, or product retirement decision exists.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

This finding does not close the larger `resource` 24-endpoint row even though the two modules share URLs.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed purchase/resource data, safe purchase writes, client-only gap closure, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Owner 探索发现

2026-05-21: Section 3.5 `owner` exploration is closed as page-caller/fallback/high-risk-write triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/owner.ts`, `owner-list.vue`, `add-owner.vue`, and `edit-owner.vue` prove real App H5 callers exist for `/app/owner.queryOwnerAndMembers`, `/app/owner.saveRoomOwner`, `/app/owner.editOwner`, and `/app/owner.deleteOwner`. This does not prove cutover to an exact independent `apps/api` handler.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register owner exact handlers. Mentions of `ownerRepair` and admin owner routes are unrelated to App H5 `/app/owner.*`. Production read-only responses for `/app/owner.queryOwnerAndMembers` use the old App H5 `{ success, code, message, data, timestamp }` envelope, so they are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The owner module contains personal-data-shaped fields (`name`, `link`, `idCard`, `address`) and three write endpoints. The old repository mutates in-memory owner/member state on save, edit, and delete; existing App runtime tests intentionally prove that mutation behavior. No production POST was executed in this slice. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write windows, read-back, rollback/cleanup, residual checks, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed owner data, safe owner writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Item Release 探索发现

2026-05-21: Section 3.5 `item-release` exploration is closed as V2 page-caller/fallback/client-only-gap/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/item-release.ts`, `pages-sub/item/release.vue`, and `pages-sub/item/release-detail.vue` prove real App H5 callers exist for the six V2 item-release endpoints. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register item-release exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/itemRelease.auditItemRelease` is a POST approval endpoint in the old runtime. The old repository mutates in-memory state by moving a pending task into the finished list, updating the detail remark, and appending an approval comment. No production POST was executed in this slice. If retained in independent `apps/api`, it needs an explicit default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The non-V2 `/app/itemRelease.queryFinishItemRelease` is a client-only read gap from `apps/app/src/api/resource.ts`. No old runtime endpoint was found for that exact path, and both production `apps/api` fallback and direct old App server probes return HTTP 500 with `error/status/unhandled`. It remains blocked until an exact handler, fallback fix, or product retirement decision exists.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed item-release data, safe item-release approval writes, client-only gap closure, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Staff 探索发现

2026-05-21: Section 3.5 `staff` exploration is closed as dynamic-route/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/staff/endpoints.ts` registers the eight staff endpoints. `/app/staff/:staffId` is a `GET` dynamic detail route, while literal routes such as `/app/staff/by-department`, `/app/staff/search`, `/app/staff/organizations`, and `/app/staff/online` must match before the dynamic route. The old repository is in-memory, with 50 random staff rows plus `STAFF_DEMO_PINYIN`, and uses `pinyin-pro` for pinyin-aware fuzzy search.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/staff.ts`, `apps/app/src/hooks/useAddressList.ts`, and `apps/app/src/pages/address/list.vue` prove real App H5 address-book callers exist for list/detail/by-department usage. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register staff exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: list `req_27b00611-51b2-4db8-97c0-c928f160937c`, dynamic detail `req_6ab9cd91-0f0e-47ad-aba6-24031dd8a0a7`, byDepartment `req_606dcb67-131c-4b67-a30d-57f2d749c5d7`, search `req_2d6642a1-ad8a-4e51-bf96-2c838419218c`, organizations `req_3f2b5d16-3cfb-402f-9bf7-6584dec9d39f`, and online `req_e048b536-8f29-47ca-bc71-e975cebceed2`. The app H5 homepage from `apps/app/package.json` returned HTTP 404 for the same staff paths, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/staff/update-online-status` and `/app/staff/add` are POST mutation endpoints in the old runtime. No production POST was executed in this slice. If retained in independent `apps/api`, they need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed staff data, safe staff writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Coupon 探索发现

2026-05-21: Section 3.5 `coupon` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/coupon/endpoints.ts` registers the seven coupon/integral/reserve write-off endpoints. The old repository is in-memory: 42 coupon write-off records, 28 integral logs, 36 reserve write-off records, and one integral setting. `writeOffCoupon()`, `useIntegral()`, and `saveReserveOrder()` prepend records to old runtime memory, so they are write paths even though the data is mock-like.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/coupon.ts`, `pages-sub/coupon/write-off-coupon.vue`, `pages-sub/coupon/write-off-integral.vue`, and `pages-sub/coupon/write-off-reserve.vue` prove real App H5 callers exist for the coupon, integral, and reserve write-off flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register coupon exact handlers. `apps/api/server/shared/runtime/env.ts` sets the default fallback base to `https://01s-11-app-server.ruan-cat.com`, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: coupon list `req_918db659-c967-4a4c-9f69-a9d98a0db28a`, integral setting `req_5d802e98-00b4-49ca-a04e-cebfcab830e2`, integral logs `req_46a1c783-a064-4782-a8a3-ab8ba07bb04f`, and reserve list `req_c1f23b18-93c0-4b6c-9685-b7d19346f88f`. The same four paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for `/app/couponProperty.writeOffCouponPropertyUser`, `/app/integral.useIntegral`, or `/app/reserveOrder.saveReserveGoodsConfirmOrder`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed coupon/integral/reserve data, safe write-off or integral-consumption writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Inspection 探索发现

2026-05-21: Section 3.5 `inspection` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/inspection/endpoints.ts` registers seven inspection endpoints, including `/app/staff.listStaffs` as the inspection transfer candidate staff list. The old repository is in-memory: 20 tasks, per-task details, 10 today-report rows, 20 transfer staff candidates, and item title definitions for `ITEM_001` through `ITEM_005`. `submitInspection()` mutates task detail state to `20200407` and writes description/photos; `transferTask()` mutates the task assignee name.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/inspection.ts` and the inspection pages under `apps/app/src/pages-sub/inspection/` prove real App H5 callers exist for task list, today report, detail, item titles, submit, staff list, and transfer. `pages-sub/maintenance/transfer.vue` also reuses `getStaffList()`. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register inspection exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: task list `req_b15f1763-0a4b-46c7-bee6-5c9d33141f94`, today report `req_dc97f2fa-66ee-4368-bb5d-fe139661ffba`, task details for `TASK_001` `req_53d0240f-7f37-477c-b4c6-559bfcf361d0`, item titles for `ITEM_001` `req_1059713b-673a-49c8-aae2-965cb4d7b0fc`, and staff list `req_0d9631c5-d8d8-4463-8454-c6a166116d2d`. The same five paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for `/app/inspection.submitInspection` or `/app/inspection.transferTask`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed inspection data, safe inspection submit/transfer writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Maintenance 探索发现

2026-05-21: Section 3.5 `maintenance` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/maintenance/endpoints.ts` registers seven maintenance endpoints. The old repository is in-memory: 15 maintenance tasks, per-task detail rows, and status values `10001` pending, `10002` processing, `10003` completed. `startTask()`, `completeTask()`, `submitSingle()`, and `transferTask()` mutate task state, task detail content, or staff assignment.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/maintenance.ts`, `pages-sub/maintenance/task-list.vue`, `execute.vue`, `execute-single.vue`, and `transfer.vue` prove real App H5 callers exist for list/detail/items and the start/complete/single-submit/transfer flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register maintenance exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: list `req_d6f53c9e-fe49-4be6-94e2-1570a194c867`, detail for `MT_001` `req_b375aea4-5b4f-443d-8b97-6c9eb1d3350a`, and detail items `req_ca5ca526-7352-418b-ad82-fb8c2b0e4f1b`. The same three paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for `/app/maintenance.startMaintenanceTask`, `/app/maintenance.completeMaintenanceTask`, `/app/maintenance.submitMaintenanceSingle`, or `/app/maintenance.transferMaintenanceTask`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed maintenance data, safe maintenance writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Meter 探索发现

2026-05-21: Section 3.5 `meter` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/meter/endpoints.ts` registers 10 meter endpoints. Seven are read-compatible GET/POST endpoints: `/app/meter.listMeterWaters`, `/app/meter.queryFeeTypes`, `/app/meter.queryFeeTypesItems`, `/app/meter.listMeterType`, `/app/meter.queryPreMeterWater`, `/app/meter.listFloorShareReading`, and `/app/meter.listFloorShareMeter`. Three are POST mutation endpoints: `/app/meter.saveMeterWater`, `/app/meter.saveFloorShareReading`, and `/app/meter.auditFloorShareReading`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory. It creates 60 meter reading rows, fee types/config items, meter types, 16 floor-share meters, and 28 floor-share readings. `saveMeterWater()` prepends a new meter reading, `saveFloorShareReading()` prepends a pending floor-share reading, and `auditFloorShareReading()` mutates floor-share state and audit remark.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/meter.ts`, `pages-sub/meter/reading.vue`, `add-meter.vue`, `qrcode-meter.vue`, `share-meter.vue`, `add-share-reading.vue`, and `audit-share-reading.vue` prove real App H5 callers exist. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register meter exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: meter list `req_7f105a94-44f2-42b6-9376-cb2c46cfe567`, fee types `req_736d64cf-7eb8-4e75-b071-b4f2e62d31b5`, fee items `req_b44f6af9-fb73-403d-adaf-a4f8a7ed0edd`, meter types `req_78ce679d-a9d4-4e99-87d1-58c31e2b58c8`, previous meter value `req_4108b838-aef1-4ff2-a005-1df873938b91`, floor-share readings `req_a931aa30-c98d-4ac4-a259-68aab0728014`, floor-share meters `req_c48412d8-d686-4763-acb0-38fe4e3b2950`, and one `fsmId=FSM_0001` filtered sample `req_6f690e4b-f1a2-4787-a65c-836d75dbcb22`. The same seven read-compatible paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for `/app/meter.saveMeterWater`, `/app/meter.saveFloorShareReading`, or `/app/meter.auditFloorShareReading`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed meter data, safe meter writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Activity 探索发现

2026-05-21: Section 3.5 `activity` exploration is closed as read/side-effect/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/activity/endpoints.ts` registers nine activity endpoints. `/app/activities.listActivitiess` is GET/POST compatible and is used for both list and detail. Detail is not pure read: when `activitiesId` is supplied, `apps/app/server/modules/activity/repository.ts` calls `increaseView(activitiesId)` inside `list()`, mutating `viewCount`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The remaining eight endpoints are mutation or counter/status endpoints: `/app/activities.saveActivities`, `/app/activities.updateActivities`, `/app/activities.deleteActivities`, `/app/activities.increaseView`, `/app/activities.likeActivity`, `/app/activities.updateStatus`, `/app/activities.updateLike`, and `/app/activities.updateCollect`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory with 30 seeded activities. It supports `communityId`, `status`, `activitiesId`, and `keyword` filters and returns the legacy `activitiess` spelling. The create/update/delete/view/like/status/collect methods mutate in-memory rows.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/activity.ts`, `pages/activity/index.vue`, `pages/activity/detail.vue`, and `components/activity/activity-actions.vue` prove real App H5 callers exist for list/detail, view-count, like, and collect flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register activity exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only list/filter samples returned old `{success,code,message,data,timestamp}` envelopes: base list `req_d1615e2b-c5ec-4d04-b3b0-32ea2b8bdeed`, `status=ONGOING` `req_2f2972b0-d494-4931-b1ed-1e5d7d4c065d`, and `keyword=health` `req_2315dcef-a275-44ca-85ca-a303cea88681`. Detail GET with `activitiesId` was intentionally not executed because it increments view count. The same three list/filter paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for create/update/delete/view/like/status/collect endpoints. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence. Detail GET also needs an explicit decision because the old API combines read and view-count mutation.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed activity data, safe activity writes, detail side-effect acceptability, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Complaint 探索发现

2026-05-21: Section 3.5 `complaint` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/complaint/endpoints.ts` registers seven complaint endpoints. Four endpoints are read-compatible: `/app/auditUser.listAuditComplaints`, `/app/auditUser.listAuditHistoryComplaints`, `/app/complaint.listComplaintEvent`, and `/app/complaintAppraise.listComplaintAppraise`. Three endpoints are mutation endpoints: `/app/complaint`, `/app/complaint.auditComplaint`, and `/app/complaintAppraise.replyComplaintAppraise`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory with 40 seeded complaints and prebuilt event/appraise rows for the first 15 complaints. `saveComplaint()` prepends a complaint and create event, `auditComplaint()` appends a handle event and may mutate complaint state/stateName, and `replyComplaintAppraise()` mutates appraise state and replyContext.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/complaint.ts`, `pages-sub/complaint/list.vue`, `finish.vue`, `order.vue`, `detail.vue`, `handle.vue`, `audit.vue`, and `appraise-reply.vue` prove real App H5 callers exist for todo/history/order/detail/handle/audit/appraise-reply flows. `handleComplaint()` and `auditComplaint()` both use `/app/complaint.auditComplaint`, so simple handling and audit result submission share the same write endpoint. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register complaint exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: todo list `req_720c48de-85b7-4f13-88c0-b232cbf67aa2`, history list `req_8d17ba93-7e26-4b09-bb3c-cf7bde79e33d`, complaint events for `COMP_001` `req_66aa7e48-f1cd-482d-8569-9e6bbf35505a`, and complaint appraises for `COMP_001` `req_46740223-638f-4a0b-b958-bc5dfe11b2f9`. The same four read-compatible paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for `/app/complaint`, `/app/complaint.auditComplaint`, or `/app/complaintAppraise.replyComplaintAppraise`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed complaint data, safe complaint create/audit/reply writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Parking 探索发现

2026-05-21: Section 3.5 `parking` exploration is closed as page-caller/fallback/high-risk-device-command triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/parking/endpoints.ts` registers twelve parking endpoints. Nine endpoints are read-compatible: `/app/owner.queryOwnerCars`, `/app/parkingArea.listParkingAreas`, `/app/machine.listParkingAreaMachines`, `/app/carInout.listCarInParkingAreaCmd`, `/app/parkingCoupon.listParkingCouponCar`, `/app/tempCarFee.getTempCarFeeOrder`, `/app/carInoutDetail.listCarInoutDetail`, `/app/carInoutPayment.listCarInoutPayment`, and `/app/machine.getBarrierCloudVideo`. Three endpoints are high-risk device or vehicle-flow commands: `/app/machine/openDoor`, `/app/machine/closeDoor`, and `/app/machine.customCarInOutCmd`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory with seeded parking areas, barrier machines, owner cars, in/out details, payments, temporary in-area cars, and coupons. The open-door and close-door handlers currently validate `machineCode` and return placeholder success. The custom car in/out command validates `carNum` and `type` and returns placeholder success. These are not safe production write samples.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/parking.ts`, `pages-sub/parking/owner-car.vue`, `barrier-gate.vue`, `barrier-video.vue`, `car-in.vue`, and `car-out.vue` prove real App H5 callers exist for vehicle list, barrier management, video, manual car-in, and manual car-out flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register these parking App legacy exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: owner cars `req_13e9f287-e84b-486f-9ab6-0d22eae89f64`, parking areas `req_b36bba72-e1b9-4b08-976e-2d37f76d4fac`, machines `req_8c43db84-d711-49a2-89a0-581e84a6fa57`, temp cars in area `req_238d307f-e5e4-4bb3-818a-859d6cfb1ec5`, coupons `req_f5b53517-7f79-498a-aa97-fd48e2823b44`, temp fee `req_d4811f08-8584-4ccf-a7a8-59827a5dbe54`, in/out detail `req_5956645f-e4c5-474f-aea7-866048af7490`, payments `req_d1e35831-9f11-4aa6-ad86-145604bd689e`, and barrier video `req_c9b184a1-a9b6-4716-9bab-9cbbd3ba1b4e`. The same nine read-compatible paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for `/app/machine/openDoor`, `/app/machine/closeDoor`, or `/app/machine.customCarInOutCmd`. If retained in independent `apps/api`, these endpoints need explicit default guards, product authorization, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed parking data, safe barrier/device writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Property Application 探索发现

2026-05-21: Section 3.5 `property-application` exploration is closed as page-caller/fallback/shared-conflict/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/property-application/endpoints.ts` registers ten source paths. Four module-owned paths are read-compatible: `/app/applyRoomDiscount/queryApplyRoomDiscount`, `/app/feeDiscount/queryFeeDiscount`, `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord`, and `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail`. Four module-owned paths are mutations: `/app/applyRoomDiscount/updateApplyRoomDiscount`, `/app/applyRoomDiscount/updateReviewApplyRoomDiscount`, `/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord`, and `/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Two source paths in this row are shared or conflicting rather than property-application-owned in independent `apps/api`: `/callComponent/core/list` is served by the repair shared compatibility layer, and `/app/fee.queryFeeDetail` is served by the fee legacy compatibility layer. The App source filters both out of `propertyApplicationRuntimeEndpointDefinitions`, so they must not be claimed as property-application-only exact migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory with apply-room rows, tracking records, record details, fee discounts, and fee details. `updateCheckInfo()` mutates application check state and photos, `updateReviewInfo()` mutates review state, `saveRecord()` prepends tracking data, and `deleteRecord()` removes tracking data.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/property-application.ts`, `pages-sub/property/apply-room.vue`, `apply-room-detail.vue`, `apply-room-record.vue`, `apply-room-record-detail.vue`, and `apply-room-record-handle.vue` prove real App H5 callers exist for list/detail/dict/discount/fee-detail/record flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not import property-application runtime definitions, so production 200 responses for module-owned property-application paths are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples: apply list `req_a244efd7-a28f-4b32-bdf8-72709a02b8b8`, apply detail `req_89041f06-ffbd-4602-bc8a-84a1c052433c`, shared dict `req_1ff9ac84-db81-45a4-b60a-d8c6b7ec25c4`, fee discount `req_efddc7ca-deeb-41f4-8a87-39a2c332b33a`, fee detail `req_e34b08d7-f0f5-49ac-a6ba-c010d9af4e1d`, record list `req_5f701338-5040-475d-923c-3463c725f63c`, and record detail `req_b35002c9-5d53-45ba-9aae-6d33f4fdbb35`. The same seven source read paths also returned HTTP 200 from the default fallback server. For `/callComponent/core/list` and `/app/fee.queryFeeDetail`, the independent API response contract differs from fallback because independent `apps/api` uses the shared repair/fee compatibility implementations.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST or DELETE was executed for check update, review update, record save, or record delete. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove ten-path exact `apps/api` ownership, DB-backed property-application data, safe check/review/record writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Work Order 探索发现

2026-05-21: Section 3.5 `work-order` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/work-order/endpoints.ts` registers twelve old App runtime endpoints. Five paths are read-compatible: `/app/workorder/todo/list`, `/app/workorder/copy/list`, `/app/workorder/detail`, `/app/workorder/task/list`, and `/app/workorder/task/items`. Seven paths are mutations: `/app/workorder/create`, `/app/workorder/update`, `/app/workorder/start`, `/app/workorder/complete`, `/app/workorder/audit`, `/app/workorder/cancel`, and `/app/workorder/copy/finish`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory with seeded todo work orders, copy work orders, task rows, and task items. `create`, `update`, `start`, `complete`, `audit`, `cancel`, and `finishCopyWork` mutate in-memory work order or task-item state.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/work-order.ts`, `pages-sub/work/do-work.vue`, `copy-work.vue`, `work-detail.vue`, `start-work.vue`, `edit-work.vue`, `audit-work.vue`, `task-list.vue`, and `do-copy-work.vue` prove real App H5 callers exist for list/detail/create/update/start/complete/audit/task/copy-finish flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register work-order exact handlers. Production 200 responses are routed through the independent API front door and then fall back to the old App server, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: todo list sample `WO_001/state=10001/stateName=待处理`, detail `WO_001/state=10001`, copy list `WO_100/state=10002/stateName=处理中`, task list `TASK_WO_001_001/state=W`, and task items `ITEM_WO_001_001/state=W`. Response-header spot checks from the independent API showed `x-api-phase=phase3-infra` and request ids for the five read paths, but the response body matches the default old App fallback server shape, so this remains fallback evidence. Representative app H5 homepage requests returned HTTP 404, so this is not App H5 page-level Network evidence.

No production POST was executed for create, update, start, complete, audit, cancel, or copy-finish. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed work-order data, safe work-order writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App OA Workflow 探索发现

2026-05-21: Section 3.5 `oa-workflow` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/oa-workflow/endpoints.ts` registers thirteen old App runtime endpoints. Nine paths are read-compatible or query endpoints: `/app/oa/workflow/query`, `/app/oa/workflow/form/query`, `/app/oa/workflow/form/data/query`, `/app/oa/workflow/task/undo/query`, `/app/oa/workflow/task/his/query`, `/app/oa/workflow/user/query`, `/app/oa/workflow/image/run`, `/app/oa/workflow/task/next`, and `/app/oa/workflow/undo/next-deal-user`. Four paths are mutations: `/app/oa/workflow/form/save`, `/app/oa/workflow/form/update`, `/app/oa/workflow/audit`, and `/app/oa/workflow/undo/audit`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory with three seeded flows, three workflow records, flow form schemas, comment history, a static base64 workflow image, and placeholder next-task data. `saveFormData`, `updateFormData`, and `submitAudit` mutate in-memory workflow records or comments.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/oa-workflow.ts`, `pages-sub/oa/workflow.vue`, `workflow-form.vue`, `workflow-form-edit.vue`, `workflow-todo.vue`, `workflow-finish.vue`, `workflow-detail.vue`, `workflow-audit.vue`, and `audit-todo.vue` prove real App H5 callers exist for workflow list, form query, form save/update, todo/history, detail, image, next-task, and audit flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register oa-workflow exact handlers, so production 200 responses are old App server fallback samples through the independent API front door, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read/query samples returned old `{success,code,message,data,timestamp}` envelopes: workflow list `req_d4ea46d5-133c-4902-8e69-851f44de81f7`, form definition `req_a706fd77-b28f-417f-ab88-af335763a28a`, form data `req_865e1136-2cb0-47da-90a4-5778863db9c4`, undo list `req_0b90802d-86b1-44bf-933c-aed181f4af11`, history list `req_71e8ce9d-0a41-40fa-92a6-746bf94e06a5`, comments `req_1ce0ce66-9bf4-483e-b473-63a9af10602a`, workflow image `req_529c8b0a-17ff-4184-b8a4-127d22c9fd76`, next task `req_fe3683db-f0c7-4dfb-9089-0bd62ebf617d`, and next deal user `req_0dc4e296-e772-4f3b-8e23-1589db2ad836`. The same nine query paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for form save, form update, audit, or undo audit. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed workflow data, safe workflow form/audit writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Client-Only 缺口发现

2026-05-21: Section 3.5 client-only gap investigation is closed as explicit blocker triage, not as gap repair or independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The four paths are exposed by `apps/app/src/api/resource.ts`: `/app/itemRelease.queryFinishItemRelease`, `/app/purchase/updatePurchaseApply`, `/app/purchaseApply.listAuditHistoryOrders`, and `/app/resourceStore.listAllocationStoreHisAuditOrders`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Observed page callers exist for three of them: `pages-sub/resource/item-out-audit.vue` calls the non-V2 item-release history path, `pages-sub/resource/allocation-audit.vue` calls the allocation history path, and `pages-sub/resource/edit-purchase-apply.vue` calls `updatePurchaseApply()`. No direct page caller was found in this scan for `listAuditHistoryOrders()`, but the wrapper exists and must remain tracked.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No exact old runtime endpoint was found for the four paths. The old item-release module registers `/app/itemRelease.queryFinishItemReleaseV2`, not the non-V2 path. The resource module registers current undo/audit paths but not the three history gap paths. The purchase module does not register `/app/purchase/updatePurchaseApply`. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` also has no exact app legacy entries for these paths.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production GET samples for the three read gaps returned HTTP 500 through the independent API front door and HTTP 500 through the direct old App fallback server. Production request ids were `req_6c90d16e-45b6-47db-b4ca-6f8b15d661ec` for `/app/itemRelease.queryFinishItemRelease`, `req_e9c02c31-6b52-4c30-aaeb-08e848937aea` for `/app/purchaseApply.listAuditHistoryOrders`, and `req_bd38a683-8ea1-4db9-919c-6628119fad0f` for `/app/resourceStore.listAllocationStoreHisAuditOrders`. The response body shape was `{ error, status, unhandled }` rather than a legacy success envelope.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for `/app/purchase/updatePurchaseApply`. If retained in independent `apps/api`, it needs an exact handler or product retirement decision plus default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, client-only gap fixes, DB-backed resource/purchase/item-release data, safe purchase update writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Server-Only 端点汇总发现

2026-05-21: Section 3.5 server-only endpoint investigation is closed as cross-module classification, not as exact `apps/api` migration or deletion approval.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The row name is broader than the actual evidence. `contact` is the only named module currently classified as server-only/mock compatibility in the strict App H5 caller scan. `test` is diagnostic/mock-only. `activity`, `notice`, `profile`, `video`, `staff`, and `oa-workflow` all have real App H5 API wrappers and page or route callers, so they are not server-only in the strict caller sense.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

All named modules are imported by `apps/app/server/shared/runtime/runtime-endpoints.ts` and therefore exist in the old App runtime registry. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not import these module definitions; it maps exact app legacy definitions from fee, repair, and floor only. Current production success responses for these modules, where present, remain fallback evidence unless a later slice adds exact independent handlers and corresponding contract/guard evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The cross-module summary artifact is `.tmp/phase7-dev-browser/2026-05-21-server-only-endpoint-summary.md`. It points to the stable module artifacts for activity, contact, notice/profile/video/test, staff, and oa-workflow.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

This summary is intended to prevent two opposite mistakes: deleting old runtime modules just because current H5 caller scan is thin, and claiming exact independent migration just because production `/app/**` fallback returned 200.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed data, production App H5 Network cutover, safe writes, shadow-off/fallback retirement, retirement ledger completeness, or old App server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## App Renovation 探索发现

2026-05-21: Section 3.5 `renovation` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/server/modules/renovation/endpoints.ts` registers eight old App runtime endpoints. Three paths are read-compatible: `/app/roomRenovation/queryRoomRenovation`, `/app/roomRenovation/queryRoomRenovationRecord`, and `/app/roomRenovation/queryRoomRenovationRecordDetail`. Five paths are mutations: `/app/roomRenovation/updateRoomToExamine`, `/app/roomRenovation/saveRoomRenovationDetail`, `/app/roomRenovation/updateRoomRenovationState`, `/app/roomRenovation/updateRoomDecorationRecord`, and `/app/roomRenovation/deleteRoomRenovationRecord`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

The old repository is in-memory with 36 seeded renovation applications, tracking records, and optional media rows. Examine, acceptance, finish-state update, record add, and record delete mutate in-memory application, record, or media state.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`apps/app/src/api/renovation.ts`, `pages-sub/property/renovation.vue`, `renovation-detail.vue`, `renovation-record.vue`, `renovation-record-handle.vue`, and `renovation-record-detail.vue` prove real App H5 callers exist. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register renovation exact handlers, so production 200 responses are old App server fallback samples through the independent API front door, not migrated exact handlers.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: renovation list `req_d45bc0a3-4c41-43a0-854d-8bc29fca9234` with sample `REN_0001/ROOM_0001/state=3000`, record list `req_8cdee700-427c-4071-9bc0-2ac68451ca4f` with sample `RR_0001/REN_0001/state=3000`, and record detail `req_cc956105-e0ba-4ec0-9d63-32ffcd4e60af` with an empty media array for the selected record. The same three read paths returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No production POST was executed for examine, acceptance, finish-state update, record add, or record delete. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove exact `apps/api` handlers, DB-backed renovation data, safe renovation writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## 生产首页来源发现

2026-05-21: Section 4A production homepage source task is closed as package-field evidence only.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Structured `ConvertFrom-Json` reads confirmed the current authoritative production entrypoints:（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

- Admin H5: `apps/admin/package.json` -> `https://01s-11comm.ruan-cat.com`（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- App H5: `apps/app/package.json` -> `https://01s-11-app.ruan-cat.com`（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）
- Unified API server: `apps/api/package.json` -> `https://01s-11-server.ruan-cat.com`（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Supplemental direct field reads with `Select-String` matched the same three values. Earlier inline `node -e` attempts were discarded because PowerShell quoting mangled the JavaScript; no files were changed by those failed commands. The accepted evidence source is the structured PowerShell JSON read plus direct field reads.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

No-go: this finding does not prove production health, production ready, `DB_READY`, Chrome page Network, local dev base URL, admin resolver base, app shadow/API base, shadow-off/fallback retirement, or old service retirement.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

## 2026-05-24 1D 试点批次发现

本批只为具名试点端点补独立 `apps/api` 精确覆盖，不关闭整个工单模块、采购/资源 client-only gap 类、contract upload/R2、生产 DB readiness、生产 H5 切流或退役门禁。

`property-manage/contract-manage/type/list` remains an admin canonical `JsonVO<PageDTO>` endpoint. The adapter evidence declares `dataSourceStatus=drizzle-ctTypes-when-database-configured-empty-fallback-without-database`: with a Nitro event and DB URL it reads `ctTypes`; without database configuration the in-memory fallback remains empty-compatible. The manifest status stays conservative as `available-in-apps-api-not-caller-verified`; local admin browser evidence proves `/api-shadow` can reach the independent API, but the full admin business page redirected to login, so this is not production page cutover or login-through page evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/workorder/todo/list` and `/app/workorder/detail` now have exact independent `apps/api` handlers with the unified app legacy contract `{ code, msg, data }`, phase `phase7-work-order-readonly`, owner `work-order`, and `app-shadow-allowlist`. The data source is deterministic compatibility seed data, not DB-backed data and not production real sample evidence. No work-order write endpoints were registered; create/update/start/complete/audit/cancel/copy/finish remain out of scope.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

`/app/purchase/updatePurchaseApply` now has an exact independent guard endpoint, phase `phase7-purchase-guarded-write`, owner `purchase`, and `blocked-for-execution`. The guard is intentionally no-go even if the generic `PHASE7_ALLOW_LEGACY_MUTATIONS` flag is set, because no exact old server source exists for this client-only write path. No production POST, real write, read-back, rollback, or cleanup evidence was executed or claimed.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Browser evidence is local only. Admin artifact `.tmp/phase7-dev-browser/2026-05-24-admin-contract-type-list-fetch.json` and matching `.network-request` / `.network-response` show `POST http://127.0.0.1:8080/api-shadow/api/property-manage/contract-manage/type/list`, status 200, `x-api-phase=phase3-infra`, request-id `req_30638265-886b-4f26-8f48-8e1bdaa70055`, `success=true`, `total=3`. App artifact `.tmp/phase7-dev-browser/2026-05-24-app-workorder-page-natural.network-response` shows the natural `do-work` page request to `http://127.0.0.1:3102/app/workorder/todo/list?page=1&row=10&communityId=COMM_001`, status 200, `x-api-phase=phase3-infra`, request-id `req_7486d245-7cfd-4a01-901c-e133951f150b`, `code=0`, `total=2`. The app page emitted repeated Vue/z-paging scheduler errors `Cannot assign to read only property '_' of object '#<Object>'`; treat this as page-layer residual risk, not API handler failure.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

验证证据：TDD 红灯只因为新工单和采购端点尚未注册而失败；转绿后 6 文件 28 测试通过。扩展本地 API 验证 `tests/legacy tests/runtime tests/infra` 为 15 文件 85 测试通过。`@01s-11comm/api` 与 `@01s-11comm/admin` 类型检查通过，OpenSpec strict 校验通过。默认 HTTP gate 因未设置生产环境变量而跳过，因此本批没有产出生产 HTTP 证据。

禁止误判：不得把本批写成生产 `DB_READY`、真实 DB-backed 工单数据、生产 App/Admin H5 Network 完成、采购更新写入闭环、工单写入闭环、shadow-off/fallback 退役、旧 app server 退役或完整 client-only gap 关闭。

## 2026-05-24 1D.5 工单只读续批发现

本批只将具名工单只读续批端点升级为独立 `apps/api` 精确覆盖：`/app/workorder/copy/list`、`/app/workorder/task/list`、`/app/workorder/task/items`。连同此前的 `/app/workorder/todo/list` 与 `/app/workorder/detail`，App H5 影子放行列表已覆盖五条工单只读路径，并继续排除七条工单写入路径。

已发现并保留的兼容边界：`/app/workorder/copy/list` 保留旧来源行为，即接受 `communityId` 但不按它过滤；`/app/workorder/task/list` 与 `/app/workorder/task/items` 同时接受 `WORK_001` 和 `WO_001` 风格的工单 ID，并在响应行里返回调用方请求的 `workId`；`/app/workorder/task/items` 保留 `states` 逗号筛选，并对未知工单 ID 返回空分页而不是 404。

本地 App H5 Network 证据命中 `http://127.0.0.1:3102`，不是旧 app fallback：抄送列表 request-id `req_8ae1688f-c994-4407-b03e-717ee6e1f34f` 返回 `total=2` 与 `isCopyToMe=true`；任务列表 request-id `req_4a1c8858-b5fe-4e4c-a37e-9c51c12a0aba` 返回 `TASK_WO_001_001` 与 `TASK_WO_001_002`；任务项 request-id `req_3bc55a74-07a0-47bb-aa9a-6649808f967c` 返回 `ITEM_WO_001_001` 与 `ITEM_WO_001_002`。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d5-workorder-readonly-local-app-evidence.md`。

页面层残留风险仍存在：`copy-work` 与 `do-copy-work` 出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`。这记录为页面风险，不升级为 API handler 失败，因为目标 Network 响应为 HTTP 200 且 envelope 为预期的 `{ code, msg, data }`。`task-list` 只出现正常 Vite/app 日志和一次 CORB 提示，没有 API 失败。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、DB-backed 工单数据、工单写入就绪、create/update/start/complete/audit/cancel/copy-finish 闭环、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。

## 2026-05-24 1D.6 访客只读发现

本批只将具名访客只读端点升级为独立 `apps/api` 精确覆盖：`/app/visit.getVisit` 与 `/app/visit.getVisitDetail`。`/app/visit.auditVisit` 被有意排除，它仍是写入端点，未来执行前需要 guard、受控写入窗口、读回、回滚/清理和残留检查。

The independent visit adapter uses deterministic compatibility seed data, not a DB-backed repository. It preserves the app legacy `{ code, msg, data }` envelope, pagination fields, `state` filtering, `visitId` filtering, pending-task fields, and the old detail behavior where a missing or unknown `visitId` returns a successful empty pagination result rather than a 400/404. The endpoint layer registers GET/POST for the two readonly paths and keeps POST body parameters overriding query parameters. No audit endpoint is registered.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Runtime manifest and App H5 shadow allowlist now agree for the two readonly paths. Manifest entries use phase `phase7-visit-readonly`, owner `visit`, response contract `{ code, msg, data }`, and status `app-shadow-allowlist`. The App H5 runtime-base allowlist routes the two readonly paths to `VITE_11COMM_API_BASE_URL` when shadow is enabled and still routes `/app/visit.auditVisit` to the legacy runtime base.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback：列表页 request-id `req_b6ea89ee-2681-4104-a7e4-02f850f395a5` 从 `http://127.0.0.1:3102/app/visit.getVisit?page=1&row=10&communityId=COMM_001` 返回 HTTP 200、`x-api-phase=phase3-infra`、`total=6`，样本为 `VISIT_00001/state=0/taskId=TASK_V_0001`；详情页 request-id `req_63429051-6a69-4e56-8c87-ee3e82320392` 从 `http://127.0.0.1:3102/app/visit.getVisitDetail?page=1&row=1&visitId=VISIT_00001&communityId=COMM_001` 返回 HTTP 200、`x-api-phase=phase3-infra`、`total=1`、`departureTime=2026-05-24 11:00:00`、`visitCase=Family visit`。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d6-visit-readonly-local-app-evidence.md`。

页面层残留风险仍存在：访客列表页反复出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`，详情页也出现一次同类错误。该问题记录为页面层风险，不升级为 API handler 失败，因为目标 Network 响应为 HTTP 200 且旧 App envelope 符合预期。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、DB-backed 访客数据、访客审核就绪、安全访客审批写入、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。

## 2026-05-24 1D.7 个人资料只读发现

本批只将具名个人资料只读端点升级为独立 `apps/api` 精确覆盖：`/app/profile.getUserProfile`、`/app/profile.listCommunities`、`/app/profile.listAttendanceRecords`。`/app/profile.changeCommunity` 与 `/app/profile.changePassword` 被有意排除，它们仍是写入/变更端点，未注册到独立 runtime registry，也未进入 App H5 影子放行列表。

The independent profile adapter uses deterministic compatibility seed data, not a DB-backed repository. It preserves the app legacy `{ code, msg, data }` envelope, community keyword filtering, attendance generation by explicit month, a stable default month when the caller omits or passes an invalid month, and POST body over query parameter precedence at the endpoint layer. Profile, community, and attendance responses are clone-safe snapshots; no current community or password state is mutated by this batch.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Runtime manifest and App H5 shadow allowlist now agree for the three readonly paths. Manifest entries use phase `phase7-profile-readonly`, owner `profile`, response contract `{ code, msg, data }`, and status `app-shadow-allowlist`. The App H5 runtime-base allowlist routes the three readonly paths to `VITE_11COMM_API_BASE_URL` when shadow is enabled and still routes `/app/profile.changeCommunity` and `/app/profile.changePassword` to the legacy runtime base.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

TDD 红灯证据符合预期：API 测试失败是因为 profile 端点、清单条目和 adapter 证据还不存在；App runtime-base 测试失败是因为三条 profile 只读路径仍解析到 `http://legacy.example.com`。转绿验证覆盖目标 API profile/runtime/infra/contract 测试、目标 App runtime-base 测试、扩展 API legacy/runtime/infra 测试、`@01s-11comm/api` typecheck、`@01s-11comm/app` type-check、OpenSpec strict 校验和 `git diff --check`。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback：profile 首页 request-id `req_7b9cfaac-8b8c-4c75-bf0b-24f01322cc50` 从 `http://127.0.0.1:3102/app/profile.getUserProfile` 返回 HTTP 200、`x-api-phase=phase3-infra`、`userName=Wang Xiaoming`；切换小区列表 request-id `req_04aec41a-5a9d-49ce-af51-34857a9bbae3` 从 `http://127.0.0.1:3102/app/profile.listCommunities` 返回 HTTP 200、`count=5`、首个小区 `Sunshine Garden`；考勤 request-id `req_69eaae85-3319-4f56-b4b2-70efedb30f4d` 从 `http://127.0.0.1:3102/app/profile.listAttendanceRecords?month=2026-05&staffId=STAFF_001` 返回 HTTP 200、`count=21`、首个规格 `1001/2002`。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d7-profile-readonly-local-app-evidence.md`。

页面层残留风险仍存在：profile 首页出现已知 Vue scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`；切换小区列表出现一次 CORB 提示，但目标只读请求成功且没有发起 change-community 写请求；考勤页反复出现 Vue scheduler 错误，并且页面可见空态，尽管目标 Network 响应包含考勤记录。这些均记录为页面层残留风险，不升级为 API handler 失败，因为目标 Network 响应为 HTTP 200 且旧 App envelope 符合预期。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、DB-backed 个人资料数据、安全切换当前小区、改密码就绪、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。

## 2026-05-24 1D.8 视频只读发现

本批只将具名视频只读端点升级为独立 `apps/api` 精确覆盖：`/app/video.listMonitorArea`、`/app/video.listStaffMonitorMachine`、`/app/video.getPlayVideoUrl`。本批不声称覆盖任何真实摄像头平台、流控制命令、DB-backed 视频 repository、生产 H5 Network、shadow-off/fallback 退役或旧 app server 退役。

The independent video adapter uses deterministic compatibility seed data, not a DB-backed repository. It preserves the app legacy `{ code, msg, data }` envelope, monitor-area list shape, monitor-machine pagination, `maId` filtering, `machineNameLike` filtering, default `machineId=MACHINE_0001`, and POST body over query parameter precedence at the endpoint layer. The returned play URL is the MDN sample video used for compatibility only; it is not real camera connectivity or video-platform evidence.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

Runtime manifest and App H5 shadow allowlist now agree for the three readonly paths. Manifest entries use phase `phase7-video-readonly`, owner `video`, response contract `{ code, msg, data }`, and status `app-shadow-allowlist`. The App H5 runtime-base allowlist routes the three video readonly paths to `VITE_11COMM_API_BASE_URL` when shadow is enabled.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

TDD 红灯证据符合预期：API 测试失败是因为 video 端点、清单条目和 adapter 证据还不存在；App runtime-base 测试失败是因为三条 video 只读路径仍解析到 `http://legacy.example.com`。转绿验证覆盖目标 API video/runtime/infra/contract 测试、目标 App runtime-base 测试、扩展 API legacy/runtime/infra 测试、`@01s-11comm/api` typecheck、`@01s-11comm/app` type-check、OpenSpec strict 校验和 `git diff --check`。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback：列表页区域请求 `req_2bf0385a-0237-4195-87bf-eb90b5669ce7` 从 `http://127.0.0.1:3102/app/video.listMonitorArea?page=1&row=100&communityId=COMM_001` 返回 HTTP 200、`x-api-phase=phase3-infra`、`total=4`、首个区域 `All Areas`；设备列表请求 `req_26bb5798-2d4d-47a8-81cc-ece00bcfa220` 从 `http://127.0.0.1:3102/app/video.listStaffMonitorMachine?page=1&row=10&communityId=COMM_001` 返回 HTTP 200、`total=26`、首台设备 `MACHINE_0001 / Monitor Device-01 / AREA_001`；播放页请求 `req_093cd4c5-0ba2-4c13-93ca-8384ba880505` 从 `http://127.0.0.1:3102/app/video.getPlayVideoUrl?communityId=COMM_001&machineId=MACHINE_0001` 返回 HTTP 200，内容为 MDN 示例 mp4 地址。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d8-video-readonly-local-app-evidence.md`。

页面层残留风险仍存在：视频列表页出现已知 Vue scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`，播放页加载外部示例媒体上下文时出现一次 CORB 提示。这些记录为页面层或外部媒体上下文风险，不升级为 API handler 失败，因为目标 Network 响应为 HTTP 200 且旧 App envelope 符合预期。

A read-only reviewer flagged work-order, visit, profile, and purchase entries visible in the current diff as outside the video-only boundary. That is not treated as a Section 1D.8 blocker because those files contain earlier completed Section 1D.1, 1D.5, 1D.6, and 1D.7 work in the same uncommitted worktree. The video-specific files and declarations do not claim `DB_READY`, real camera connectivity, production H5 evidence, or retirement status.（中文说明：本行保留历史证据中的路径、命令、接口名或状态标识；语义以本文件中文结论和禁止误判口径为准。）

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、DB-backed 视频数据、真实摄像头/视频平台连通、视频流控制、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。

## 2026-05-24 1D.10 App 旧端点模块分层纠偏发现

用户指出 `apps/api/server/modules/profile`、`purchase`、`video`、`visit`、`work-order` 的接口写法与其他 `apps/api/server/modules` 不一致后，已复核 OpenSpec、现有模块和只读子代理审计结论。结论是：OpenSpec 并非没有规范，它在 `app-legacy-cutover` 与统一 `apps/api` 规范中已经要求显式 `adapter/service/repository` 分层、runtime 组装和 legacy adapter 契约边界；问题是此前实现没有贯彻该要求。

偏差根因：此前实现优先把旧路径、旧响应 envelope、确定性兼容种子和测试快速跑通，导致 `legacy-adapter.ts` 同时承载类型、兼容数据、分页筛选、guard 和旧 envelope；`legacy-endpoints.ts` 还在模块顶层直接 `createLegacyXAdapter()`。这种写法能通过旧契约测试，但会形成第二套模块风格，后续切换 DB repository 或注入 runtime 时会继续扩散技术债。

权衡结论：应该改格式，而且已经改。五个模块现在都补齐 `types.ts`、`repository.ts`、`service.ts`、`runtime.ts`、`index.ts`；确定性兼容数据移动到 repository，业务能力经 service 暴露，旧参数兼容和 `{ code, msg, data }` 输出保留在 legacy adapter，端点层统一通过 `getXRuntime(event).legacyAdapter` 分发。`purchase` 虽然仍是默认 409 guard，也改成 repository/service/runtime 注入结构；阻断语义不变，不执行真实写入。

防回归证据：新增 `apps/api/tests/infra/app-legacy-module-layering.test.ts`。红灯阶段 15 个断言全部失败，原因分别是五个模块缺少分层文件、端点未走 runtime、adapter 未接收 service 注入；修复后该测试 1 文件 15 测试通过。结构测试加五个旧端点契约测试共 6 文件 41 测试通过，说明格式统一没有改变旧响应行为。`rg "const legacyAdapter = createLegacy|createLegacy(Profile|Purchase|Video|Visit|WorkOrder)Adapter\(\)"` 对五个模块无命中。

验证边界：本批运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过，并对本批文件运行 `git diff --check` 通过。更宽的 `runtime/endpoint-manifest/phase7-api-contracts` 回归和 `pnpm -F @01s-11comm/api run typecheck` 当前被 §1D.9 公告只读批次已写红灯阻断：测试已预期 `/app/notice.listNotices` 和 `apps/api/server/modules/notice/legacy-adapter.ts`，但公告模块尚未实现。因此 §1D.10 的结构纠偏可记录为已实施和局部绿灯，但完整验证项不能勾选完成。

## 2026-05-24 1D.9 公告只读暂停发现

§1D.9 目前只是打开批次，尚未实现。当前红灯测试刻意描述 `/app/notice.listNotices` 的目标状态；在公告适配器、端点注册、运行时清单条目、App H5 影子放行列表、绿灯验证和浏览器证据都存在之前，不得把这些红灯测试当作迁移完成证据。

当前红灯状态：`apps/api/tests/legacy/notice-legacy-endpoints.test.ts` 是新增文件，失败原因是 `runtimeEndpointDefinitions` 还没有 `/app/notice.listNotices` 精确处理器。`apps/api/tests/runtime/endpoint-registry.test.ts`、`apps/api/tests/infra/endpoint-manifest.test.ts` 和 `apps/api/tests/infra/phase7-api-contracts.test.ts` 已有公告相关预期/导入；在 `apps/api/server/modules/notice/legacy-adapter.ts`、`legacy-endpoints.ts` 和 `runtime-endpoints.ts` 实现前，这些断言会失败。`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` 已有放行列表预期；在 `apps/app/src/http/runtime-base.ts` 纳入公告路径前，该测试会失败。

下次继续可复用的只读审计事实：旧 App runtime 为 `/app/notice.listNotices` 注册 GET 和 POST；自然 H5 调用只使用 GET。旧参数为 `page`、`row`、`communityId`，以及可选 `noticeTypeCd`、`noticeId`、`titleLike`。旧列表/详情响应负载为 `{ notices, total, page, row }`；每条公告包含 `noticeId`、`title`、`context`、`startTime`、可选 `timeStr`、`noticeTypeCd` 和 `communityId`。旧筛选规则是 `communityId`/`noticeTypeCd`/`noticeId` 精确匹配，加上 `title.includes(titleLike)`。空结果仍返回成功响应，`notices=[]` 且 `total=0`。

后续浏览器证据应在配置本地 `apps/api` 与 App H5 影子环境后，使用本地 App H5 页面 `http://localhost:3000/#/pages/notice/index` 和 `http://localhost:3000/#/pages/notice/detail?noticeId=NOTICE_0001`。所需证据必须是 `/app/notice.listNotices` 的 Network 请求命中本地 `apps/api`，而不是旧服务 fallback。

禁止误判：不得把当前 §1D.9 状态写成精确处理器覆盖、绿灯验证、本地浏览器证据、生产 App H5 Network、生产 `DB_READY`、DB-backed 公告数据、真实公告 repository 迁移、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。

## 2026-05-24 1D.9 公告只读完成发现

本批已把 `/app/notice.listNotices` 从旧 app fallback 风险推进为独立 `apps/api` 精确处理器。实现上没有沿用旧 `apps/app/server/modules/notice` 的扁平写法，而是按已经纠偏的 App legacy 模块格式补齐 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 七层；`legacy-adapter.ts` 只负责旧参数兼容、分页筛选入参归一和旧 `{ code, msg, data }` envelope，确定性兼容种子在 `repository.ts`，运行时组装在 `runtime.ts`。

兼容边界：公告数据是确定性兼容种子，不是 DB-backed repository。筛选规则覆盖 `communityId`、`noticeTypeCd`、`noticeId` 精确匹配和 `titleLike` 包含匹配；分页返回 `{ notices, total, page, row }`；空结果保持 `code=0` 成功 envelope；POST 入口保持 body 覆盖 query 的旧端点兼容规则。该设计只服务公告只读列表和详情式查询，不包含公告新增、编辑、删除、真实库样本或发布流程。

运行时和 App H5 影子状态已经对齐：`runtimeEndpointManifest` 中 `/app/notice.listNotices` 为 phase `phase7-notice-readonly`、owner `notice`、response contract `{ code, msg, data }`、status `app-shadow-allowlist`；App H5 的 `PHASE2_API_SHADOW_ENDPOINTS` 已加入 `/app/notice.listNotices`。结构防回归测试也已扩展到 `notice`，避免新的 App legacy 模块重新退回直接在 endpoint 顶层创建 adapter 的写法。

验证证据：红灯阶段 API 失败点是公告精确处理器未注册、manifest 缺项和 `notice/legacy-adapter` 缺文件；App 失败点是公告路径仍解析到旧基础地址。实现后目标 API 矩阵 5 文件 50 测试通过，App notice 影子路由测试 1 文件 2 测试通过；扩展 API 回归 10 文件 76 测试通过；`@01s-11comm/api` typecheck、`@01s-11comm/app` type-check、OpenSpec strict、`git diff --check` 和 `git diff --cached --check` 均通过。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback：公告列表页 request-id `req_4c802807-b15f-4a14-9659-376314d9df9f` 从 `http://127.0.0.1:3102/app/notice.listNotices?page=1&row=10&communityId=COMM_001&noticeTypeCd=1001` 返回 HTTP 200、`x-api-phase=phase3-infra`、`total=25`、首条 `NOTICE_0001 / Elevator Maintenance Notice - Important`；公告详情页 request-id `req_5746ef60-4833-4105-ba24-a330989859ce` 从 `http://127.0.0.1:3102/app/notice.listNotices?page=1&row=1&communityId=COMM_001&noticeId=NOTICE_0001` 返回 HTTP 200、`total=1`、首条 `NOTICE_0001`。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-notice-local-app-network-summary.md`。

页面层残留风险仍存在：公告列表和详情页控制台出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`，详情页还出现一次 CORB 提示。该问题没有阻止目标 Network 请求、响应和页面主要内容展示，但不能把本轮页面证据写成“控制台完全无错误”。它记录为页面层残留风险，不升级为 API handler 失败。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、DB-backed 公告数据、真实公告库样本、公告写入口完成、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。

## 2026-05-24 1D.10 验证阻断解除发现

§1D.10 原先只完成了结构纠偏和局部绿灯，完整验证被 §1D.9 的公告红灯阻断。公告模块实现后，该阻断已解除：结构测试覆盖范围从五个纠偏模块扩展到 `notice`、`profile`、`purchase`、`video`、`visit`、`work-order` 六个模块；扩展 API 回归、`api` typecheck、OpenSpec strict 和 diff check 均已通过。

该解除只说明接口格式统一和当前本地验证闭环完成，不改变各模块的数据源和风险等级。`profile`、`video`、`visit`、`work-order` 和 `notice` 仍是确定性兼容种子或兼容样例数据；`purchase` 仍是默认阻断 guard；所有写入口、真实 DB 样本、生产页面 Network、shadow-off/fallback 与退役台账仍需按后续具名批次单独证明。

## 任务 102 Contract Upload/R2 发现

2026-05-21：task102 对应 `property-manage/contract-manage/upload/{init,sign-part,complete,abort,status}`。当前结论为 BLOCK，不能勾选完成。本轮不是完成 R2 迁移，而是把独立 `apps/api` 内的 mock-like success 收敛为显式阻断，防止 `mock-upload-id`、空 `signedUrl` 或 `unknown` status 被误判为可用。

Implemented evidence：新增 `apps/api/tests/admin/contract-upload-r2-blocked.test.ts`。红灯阶段该测试确认默认 `createAdminContractAdapter(...).uploadInit()` 仍返回 `success=true` 与 `uploadId="mock-upload-id"`；修复后 `apps/api/server/modules/contract/admin-adapter.ts` 的 `uploadInit`、`uploadSignPart`、`uploadComplete`、`uploadAbort`、`uploadStatus` 均返回 `409` JsonVO 阻断响应，message 明确包含 R2 阻断原因。5 个 upload route 文件仍位于 `apps/api/server/routes/api/property-manage/contract-manage/upload/{init,sign-part,complete,abort,status}.post.ts`，均从 `nitro/h3` 导入并分发到 `getContractRuntime(event).adminAdapter.upload*`。

Evidence boundary：专项测试断言 5 个 upload URL 仍不在 `runtimeEndpointManifest`，这是有意保持 blocked，而不是遗漏完成证据。`apps/api/package.json` 仍无 `@aws-sdk/client-s3` 和 `@aws-sdk/s3-request-presigner`；`apps/api` 仍无 R2 env/client/service/repository 迁移。`apps/type` 的 `ctUploadSessions` / `ctUploadSessionParts` schema、旧 `apps/admin/server` upload service、以及前端 `shared-upload/use-resumable-upload.ts` 只能作为 partial/source evidence，不能证明独立 API 已具备 R2 multipart。

Verification evidence：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-upload-r2-blocked.test.ts` 先失败，失败点为 adapter 返回 placeholder success；修复后同命令通过，1 文件 3 tests passed。组合回归 `pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-upload-r2-blocked.test.ts tests/admin/contract-change-draft-crud.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 tests passed + 1 文件 22 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。只读探索/复核报告位于 `.tmp/phase7-agent-reports/2026-05-21-task102-contract-upload-r2-explorer.md` 与 `.tmp/phase7-agent-reports/2026-05-21-task102-contract-upload-r2-review-criteria.md`，结论均为 BLOCK。

No-go：不得把 route file 存在、adapter 409、schema table 存在、旧 admin upload-service、前端 hook/cache 或 skipped HTTP gate 写成 upload/R2 完成。仍缺 `apps/api` AWS SDK 依赖、脱敏 R2 env、真实 R2 multipart create/sign/status/complete/abort、DB upload session/part 写入读回、异常清理与幂等、前端断点续传页面闭环、local/production HTTP 或浏览器证据、生产 `DB_READY`、shadow-off/fallback 和 retirement ledger。5 个 upload route 不得加入 available manifest，不得写成 old path exact covered、生产上传完成或旧服务可退役。

## 2026-05-24 App legacy endpoint 格式统一发现

本轮确认用户指出的格式偏差需要修复：`profile`、`purchase`、`video`、`visit`、`work-order` 这些 App legacy 模块虽然已经具备 `runtime -> legacyAdapter` 分发，但各 `legacy-endpoints.ts` 仍保留本地重复 `mergeInput/asRecord` 胶水，和统一 Nitro 模块分层要求不完全一致。已将输入合并逻辑抽到 `apps/api/server/shared/runtime/legacy-endpoint-input.ts`，并同步收敛 `fee`、`floor`、`repair`、`notice` 等同类 legacy endpoint 文件，避免后续模块各自复制不同版本的 query/body 合并逻辑。

防回归机制已经补到测试层：`app-legacy-module-layering.test.ts` 不再只检查文件存在，而是同时检查 endpoint 层不得直接引入 adapter/service/repository、必须经 `getXRuntime(event).legacyAdapter` 分发、runtime manifest 与 `{ code, msg, data }` response contract 对齐、只读端点保持 GET/POST、guard 写入口保持 POST 和 blocked 状态。`purchase-legacy-endpoints.test.ts` 补充 query/body 同传仍返回 409 guarded legacy envelope，证明统一 helper 没有放开真实写入。

本轮边界：这只是接口格式和自检机制收敛，不是数据源升级。`profile`、`video`、`visit`、`work-order`、`notice` 仍不是生产 `DB_READY`，`purchase` 仍不能真实写入；本轮也没有完成生产 App H5 Network、真实库样本、shadow-off/fallback、写入读回回滚或旧 app server 退役。

## 2026-05-24 1D.11 活动只读发现

本批只将具名活动只读端点 `/app/activities.listActivitiess` 升级为独立 `apps/api` 精确覆盖。列表页和详情页仍共用旧路径，其中详情式查询通过 `activitiesId` 参数筛选；但本轮浏览器采证只打开列表页，没有点击卡片或进入详情页，以避免触发旧页面层的 `/app/activities.increaseView` 写入口。

实现边界已经收敛为统一 App legacy 模块格式：`apps/api/server/modules/activity` 下新增 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 七层。兼容种子位于 `repository.ts`，`service.ts` 只暴露查询能力，`legacy-adapter.ts` 负责旧参数归一、`ActivityStatus` 校验、分页默认值和 `{ code, msg, data }` envelope，`legacy-endpoints.ts` 通过 `getActivityRuntime(event).legacyAdapter` 分发并使用共享 `mergeInput(query, body)`，因此 POST body 覆盖 query 的旧兼容规则保持不变。

活动响应保留旧字段名 `activitiess`，没有改成 `activities`。注册表和运行时清单只包含 `/app/activities.listActivitiess` 的 GET/POST，phase 为 `phase7-activity-readonly`，owner 为 `activity`，response contract 为 `{ code, msg, data }`，cutover status 为 `app-shadow-allowlist`。以下写入口没有注册、没有进入 App H5 shadow allowlist，也没有声明 guard 完成：`/app/activities.saveActivities`、`/app/activities.updateActivities`、`/app/activities.deleteActivities`、`/app/activities.increaseView`、`/app/activities.likeActivity`、`/app/activities.updateStatus`、`/app/activities.updateLike`、`/app/activities.updateCollect`。

TDD 红灯证据符合预期：API 目标测试在实现前失败，原因是活动只读端点未注册且 `apps/api/server/modules/activity/*` 不存在；App runtime-base 测试在放行前失败，原因是 `/app/activities.listActivitiess` 在 shadow enabled 时仍路由到旧 runtime。转绿后 API 目标矩阵 5 文件 76 测试通过，App runtime-base 1 文件 94 测试通过，`api` typecheck、`app` type-check、OpenSpec strict 和 diff check 均通过。App runtime-base 测试还显式断言 8 个活动写入口在 shadow enabled 时仍不放行，避免把活动只读批次误扩展成整个 activity 域迁移。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback：活动列表页 `http://localhost:3000/#/pages/activity/index?currentCommunityId=COMM_001&evidence=1d11` 自然发起 `GET http://127.0.0.1:3102/app/activities.listActivitiess?page=1&row=10&communityId=COMM_001&status=UPCOMING`，返回 HTTP 200、`x-api-phase=phase3-infra`、`x-request-id=req_0d67a420-3828-4ff3-884c-94ba5f239d16`，响应摘要为 `code=0`、`msg=query success`、`total=2`、首条 `ACT_001 / Garden Yoga Morning / COMM_001 / UPCOMING`。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d11-activity-readonly-local-app-evidence.md`，响应体、快照和截图分别保存到 `.tmp/phase7-dev-browser/2026-05-24-1d11-activity-list.network-response`、`.tmp/phase7-dev-browser/2026-05-24-1d11-activity-list.snapshot.txt`、`.tmp/phase7-dev-browser/2026-05-24-1d11-activity-list.png`。

页面层残留风险仍存在：活动列表页控制台出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`，并且页面图片加载失败来自兼容种子中的 `example.test` 图片地址。这些记录为页面层残留风险，不升级为 API handler 失败，因为目标 Network 响应为 HTTP 200 且旧 App envelope 符合预期。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、Neon main 真实活动样本、DB-backed 活动数据、浏览量/点赞/收藏/状态更新写入口完成、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。本批也不得作为 `/app/activities.increaseView` 的 guard 证据；该写入口只是被负向断言为未迁移、未放行。

## 2026-05-24 Task 203 报表费用汇总只读复核发现

本轮只复核 `property-manage/report-manage/expense-summary-table/list` 的独立 report 语义链路和生产 API partial 证据，不勾选任务。

源码链路结论：当前 `apps/api` 没有把 report-manage 费用汇总别名到 expense-manage。`report-manage/expense-summary-table/list` route 调用 `adminAdapter.listReportExpenseSummaryTables`，service 转发到 `repository.listReportExpenseSummaryTables`，DB repository 查询 `rptExpenseSummaries`；`expense-manage/expense-summary-table/list` route 调用 `adminAdapter.listExpenseSummaryTables`，DB repository 查询 `exExpenseSummaryTables`。runtime manifest 中两条同名业务尾段也分属不同路径和 phase，前端 hook/page caller 分别指向各自 URL。

生产只读采样结论：生产 API server 入口来自 `apps/api/package.json` 的 `homepage`。`GET https://01s-11-server.ruan-cat.com/__nitro/ready` 返回 `requestId=req_970b58f8-efac-41ba-8399-84a9944e6fbd`、`code=READY_CONFIGURED`、`connected=null`、`probeEnabled=false`，不是 `DB_READY`。目标 endpoint `POST https://01s-11-server.ruan-cat.com/api/property-manage/report-manage/expense-summary-table/list` 返回 HTTP 200、`x-request-id=req_4d45e5a6-451c-4525-bca1-a24e8e2cbb2e`、`success=true`、`total=2`，首条包含 `feeItem=物业费`、`currentReceivable=50000.00`、`currentActualReceipt=45000.00` 和 `statisticsTime=2024-01-01`。这些只能证明生产 API 入口当前有非空 report 语义响应，不能在 readiness 仍为 `READY_CONFIGURED` 时升级为 Neon main `DB_READY` 完成。

验证结论：本轮本地语义/清单/契约测试 3 文件 33 测试通过，生产 HTTP gate 过滤运行 report-manage canonical list 目标测试通过。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-report-expense-summary-production-refresh.md`。

禁止误判：不得把 `READY_CONFIGURED`、生产 API `HTTP 200`、非空响应样本、Vitest、manifest/contract 或生产 HTTP gate 写成 `DB_READY`、真实库样本完整、生产 admin H5 页面 Network、shadow-off/fallback、retirement ledger 或旧服务退役。缺 `RUN_PHASE7_DB_READINESS_CHECK=1` 下的生产 `DB_READY`、Neon main readiness probe、生产 admin H5 自然 Network、shadow-off/fallback 演练和 retirement ledger 之前，Task 203 必须保持未完成。

## 2026-05-24 1D.12 预约核销发现

本批只处理具名预约核销端点 `/app/communitySpace.listCommunitySpaceConfirmOrder` 和 `/app/communitySpace.saveCommunitySpaceConfirmOrder`。列表端点已升级为独立 `apps/api` 精确覆盖；保存端点只收敛为默认业务 guard，不开放真实核销写入。

实现边界已经收敛为统一 App legacy 模块格式：`apps/api/server/modules/appointment` 下新增 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 七层。兼容订单种子位于 `repository.ts`，共 48 条，保留旧 App H5 使用的 `orderId`、`timeId`、`spaceName`、`appointmentDate`、`hours`、`personName`、`personTel`、`createTime` 和 `state` 字段。`service.ts` 只暴露查询与 guard 决策，`legacy-adapter.ts` 负责旧参数归一、分页默认值、`timeId` 筛选和 `{ code, msg, data }` envelope，`legacy-endpoints.ts` 通过 `getAppointmentRuntime(event).legacyAdapter` 分发并使用共享 `mergeInput(query, body)`。

运行时清单和 App H5 shadow 边界已经对齐。预约列表端点注册 GET/POST，phase 为 `phase7-appointment-readonly`，owner 为 `appointment`，response contract 为 `{ code, msg, data }`，cutover status 为 `app-shadow-allowlist`。保存端点只注册 POST，phase 为 `phase7-appointment-guarded-write`，cutover status 为 `blocked-for-execution`，并加入 mutation blocked 集合。App H5 只把预约列表加入 `PHASE2_API_SHADOW_ENDPOINTS`，保存端点在 shadow enabled 时仍走旧 runtime base。

TDD 红灯证据符合预期：API 目标测试在实现前失败，原因是 appointment 精确端点未注册且 `apps/api/server/modules/appointment/*` 不存在；App runtime-base 测试在放行前失败，原因是预约列表路径在 shadow enabled 时仍路由到旧 runtime。转绿后目标 API 矩阵 5 文件 85 测试通过，App appointment runtime-base 1 文件 1 测试通过；`api` typecheck、`app` type-check、OpenSpec strict 和 diff check 均已纳入复验。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback：预约管理页 `http://127.0.0.1:3000/#/pages-sub/appointment/index` 自然发起 `GET http://127.0.0.1:3102/app/communitySpace.listCommunitySpaceConfirmOrder?page=1&row=10&communityId=COMM_001`，返回 HTTP 200、`x-api-phase=phase3-infra`、`x-request-id=req_100a3416-c08c-47db-989c-fddc01593e8d`，响应摘要为 `code=0`、`msg=query success`、`total=48`、首条 `ORDER_00001 / HEXIAO_100000 / CONFIRMED`。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d12-appointment-readonly-local-app-evidence.md`，响应体和截图分别保存到 `.tmp/phase7-dev-browser/2026-05-24-1d12-appointment-local-app-list.network-response` 与 `.tmp/phase7-dev-browser/2026-05-24-1d12-appointment-local-app.png`。

保存端点 guard 只做本地直打验证，没有通过页面点击核销按钮。Node `fetch` 直打 `POST http://127.0.0.1:3102/app/communitySpace.saveCommunitySpaceConfirmOrder` 返回 HTTP 200 的旧兼容 envelope，响应体为 `code=409`、`errorCode=PHASE7_MUTATION_GUARDED`、`data=null`，`x-request-id=req_0cd92683-35cd-439f-ab77-f9237b0baf76`。HTTP 200 不能写成写入成功；本批阻断语义以 envelope 内业务码和 errorCode 为准。

页面层残留风险仍存在：预约管理页控制台出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`。该问题记录为页面层残留风险，不升级为 API handler 失败，因为目标 Network 响应为 HTTP 200 且旧 App envelope 符合预期。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、Neon main 真实预约样本、DB-backed 预约数据、真实核销写入完成、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。本地 `/__nitro/ready` 一次返回 `DB_READY` 只能说明本机开发环境配置了数据库探针，不能升级为生产或 appointment 模块的数据源证据。

## 2026-05-24 1D.13 投诉小批次发现

本批只处理具名投诉端点：四个只读入口 `/app/auditUser.listAuditComplaints`、`/app/auditUser.listAuditHistoryComplaints`、`/app/complaint.listComplaintEvent`、`/app/complaintAppraise.listComplaintAppraise` 已升级为独立 `apps/api` 精确覆盖；三个写入口 `/app/complaint`、`/app/complaint.auditComplaint`、`/app/complaintAppraise.replyComplaintAppraise` 只收敛为默认业务 guard，不开放真实投诉写入。

实现边界已经收敛为统一 App legacy 模块格式：`apps/api/server/modules/complaint` 下新增 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 七层。兼容投诉种子位于 `repository.ts`，共 40 条投诉、前 15 条事件和评价，保留旧 App H5 使用的 `complaintId`、`taskId`、`state`、`stateName`、`roomName`、`context`、`eventType`、`score`、`replyContext` 等字段。`service.ts` 只暴露查询与 guard 决策，`legacy-adapter.ts` 负责旧参数归一、分页默认值、`complaintId` 校验和 `{ code, msg, data }` envelope，`legacy-endpoints.ts` 通过 `getComplaintRuntime(event).legacyAdapter` 分发并使用共享 `mergeInput(query, body)`。

运行时清单和 App H5 shadow 边界已经对齐。四个只读端点注册 GET/POST，phase 为 `phase7-complaint-readonly`，owner 为 `complaint`，response contract 为 `{ code, msg, data }`，cutover status 为 `app-shadow-allowlist`。三个写入口只注册 POST，phase 为 `phase7-complaint-guarded-write`，cutover status 为 `blocked-for-execution`，并加入 mutation blocked 集合。App H5 只把四个只读路径加入 `PHASE2_API_SHADOW_ENDPOINTS`，三个写入口在 shadow enabled 时仍走旧 runtime base。

TDD 红灯证据符合预期：API 目标测试在实现前失败，原因是 complaint 精确端点未注册、manifest 缺项且 `apps/api/server/modules/complaint/*` 不存在；App runtime-base 测试在放行前失败，原因是投诉只读路径在 shadow enabled 时仍路由到旧 runtime。转绿后目标 API 矩阵 5 文件 95 测试通过，App complaint runtime-base 1 文件 3 测试通过；`api` typecheck、`app` type-check、OpenSpec strict 和 diff check 均已纳入复验。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback。投诉待办页自然发起 `GET http://127.0.0.1:3102/app/auditUser.listAuditComplaints?page=1&row=10&userId=USER_001&storeId=STORE_001&communityId=COMM_001`，返回 HTTP 200、`x-api-phase=phase3-infra`、`x-request-id=req_1c7a0bb5-deff-40b4-9663-bbb7d2d17f71`、`total=40`。投诉已办页自然发起 `GET http://127.0.0.1:3102/app/auditUser.listAuditHistoryComplaints?page=1&row=10&userId=USER_001&storeId=STORE_001&communityId=COMM_001`，返回 HTTP 200、`x-request-id=req_bd34797e-6bdd-47cd-949e-9f21a68eaa5c`、`total=40`。投诉详情页自然发起事件和评价两个请求，分别返回 `req_b31afbd4-311e-4353-b4f1-8159dc229242`、`total=2` 与 `req_a4522030-8153-480e-9a1b-41acf3229578`、`total=1`。证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d13-complaint-readonly-local-app-evidence.md`，响应体、快照和截图均保存到 `.tmp/phase7-dev-browser/`。

写入口 guard 只做本地直打验证，没有通过页面触发投诉提交、审核或评价回复。Node `fetch` 直打三个 POST 写入口均返回 HTTP 200 的旧兼容 envelope，响应体为 `code=409`、`errorCode=PHASE7_MUTATION_GUARDED`、`data=null`，三个 request-id 分别为 `req_f36c7dac-8059-4f0b-a2df-a330ffc160b1`、`req_67af665b-03b1-49be-a3a0-6df19fbf6e85` 和 `req_3cb3bcb5-42d7-451b-b64e-65fdef5da5cc`。HTTP 200 不能写成写入成功；本批阻断语义以 envelope 内业务码和 errorCode 为准。

失败采证路径已经定位：PowerShell `Invoke-WebRequest` 对三个 POST 写入口的首次探针返回 HTTP 500，API dev 日志显示 Nitro dev/undici 在业务 handler 之前因 `Expect` 请求头报 `expect header not supported`。该问题是采证工具请求头与 Nitro dev 转发的兼容问题，不是 complaint handler、adapter 或 guard 决策失败；改用本地 Node `fetch` 后三个 guard 请求均按预期返回业务 `409 PHASE7_MUTATION_GUARDED`。

页面层残留风险仍存在：投诉页面控制台出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`。投诉详情页自然命中了事件和评价两个只读请求，但旧页面展示层对响应结构的消费仍有残留不一致风险，因此本轮只证明 API Network 和 envelope 正确，不声明详情 UI 全量修复完成。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、Neon main 真实投诉样本、DB-backed 投诉数据、真实投诉提交/审核/回复完成、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。投诉兼容种子、HTTP 200、Vitest、guard 和本地页面 Network 都只能作为本地 App H5 shadow 与默认业务 guard 证据。

## 2026-05-24 1D.14 通讯录小批次发现

本批只处理具名通讯录端点：七个只读入口 `/app/contact.listContacts`、`/app/contact.getContactDetail`、`/app/contact.getContactsByDepartment`、`/app/contact.searchContacts`、`/app/contact.getDepartments`、`/app/contact.getFavoriteContacts`、`/app/contact.getEmergencyContacts` 已升级为独立 `apps/api` 精确覆盖；写入口 `/app/contact.updateOnlineStatus` 只收敛为默认业务 guard，不开放真实在线状态写入。

实现边界已经收敛为统一 App legacy 模块格式：`apps/api/server/modules/contact` 下新增 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 七层。兼容通讯录种子位于 `repository.ts`，共 30 条 `CON_001` 到 `CON_030` 确定性联系人、8 条固定常用联系人和 6 条紧急联系人，保留旧 App 需要的 `contactId`、`name`、`position`、`department`、`phone`、`email`、`workTime`、`avatar`、`description`、`isOnline` 等字段。`service.ts` 只暴露查询与 guard 决策，`legacy-adapter.ts` 负责旧参数归一、分页默认值、`contactId` 与 `keyword` 校验和 `{ code, msg, data }` envelope，`legacy-endpoints.ts` 通过 `getContactRuntime(event).legacyAdapter` 分发并使用共享 `mergeInput(query, body)`。

运行时清单和 App H5 shadow 边界已经对齐。七个只读端点注册 GET/POST，phase 为 `phase7-contact-readonly`，owner 为 `contact`，response contract 为 `{ code, msg, data }`，cutover status 为 `app-shadow-allowlist`。在线状态写入口只注册 POST，phase 为 `phase7-contact-guarded-write`，cutover status 为 `blocked-for-execution`，并加入 mutation blocked 集合。App H5 只把七个只读路径加入 `PHASE2_API_SHADOW_ENDPOINTS`，`/app/contact.updateOnlineStatus` 在 shadow enabled 时仍走旧 runtime base。

TDD 红灯证据符合预期：API 目标测试在实现前失败，原因是 contact 精确端点未注册、manifest 缺项且 `apps/api/server/modules/contact/*` 不存在；App runtime-base 测试在放行前失败，原因是 contact 只读路径在 shadow enabled 时仍路由到旧 runtime。转绿后 API 目标矩阵 5 文件 104 测试通过，App contact runtime-base 1 文件 8 测试通过；后续仍需最终 typecheck、OpenSpec strict、diff check 和语言门禁收口。

本地扫描结论维持 server-only compatibility/mock 边界：`apps/app/src` 没有正常 `apps/app/src/api/contact.ts` 或业务页面自然调用 `/app/contact.*`，命中项只包含旧 app server endpoint、`apps/app/src/api/mock/contact.mock.ts`、旧 runtime 测试、当前 `apps/api` 测试和本批 App shadow allowlist。因此本批没有自然 App H5 页面 Network 证据，也不能声称 App H5 页面 cutover；证据只能记录本地 API 直打、guard 直打和 App shadow 解析测试。

本地 API 直打证据命中独立本地 API，而不是旧 fallback：七个只读请求均打到 `http://127.0.0.1:3102` 并返回 HTTP 200、`x-api-phase=phase3-infra` 与 `{ code, msg, data }`。关键 request-id 为 list `req_4b056488-a40c-4bac-91c0-e925edf00878`、detail `req_40958d65-8322-4ba6-aa94-3ff96f3ec5ad`、byDepartment `req_2309cd57-92c5-4957-8194-e12f4c9449c4`、search `req_dfbebae7-334a-4d76-a5d4-0ff7c3d5be91`、departments `req_25d60f27-1d42-4d0d-bbdd-0017e72f17fa`、favorite `req_989279b6-5345-446b-9d48-5278de2840bc`、emergency `req_34f64f23-54e2-4f6f-812f-4f4834520a26`；证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d14-contact-readonly-local-api-evidence.md`，响应汇总为 `.tmp/phase7-dev-browser/2026-05-24-1d14-contact-local-api-responses.json`。

写入口 guard 只做本地直打验证，没有执行真实在线状态更新。Node `fetch` 直打 `POST http://127.0.0.1:3102/app/contact.updateOnlineStatus` 返回 HTTP 200 的旧兼容 envelope，响应体为 `code=409`、`errorCode=PHASE7_MUTATION_GUARDED`、`data=null`，`x-request-id=req_b63e016f-e822-48a3-bbea-792ebc12951c`。HTTP 200 不能写成写入成功；本批阻断语义以 envelope 内业务码和 errorCode 为准。

采证噪音与边界：隐藏 PowerShell 启动本地 API 时 stderr 中出现过环境变量赋值语法噪音，但 Nitro dev 随后实际监听 `127.0.0.1:3102` 并完成所有目标请求，因此该噪音不升级为业务 handler 失败。本地 `GET /__nitro/ready` 本次返回 `DB_READY`，只代表本机 dev 探针状态，不能写成通讯录 `DB_READY`、生产 ready、Neon main 真实通讯录样本或 DB-backed contact repository 证据。

禁止误判：不得把本批写成自然 App H5 页面 Network、生产 App H5 Network、通讯录 `DB_READY`、Neon main 真实通讯录样本、DB-backed 通讯录数据、真实在线状态写入完成、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。通讯录兼容种子、HTTP 200、Vitest、guard、App shadow 解析和无自然页面扫描都只能作为本地 exact handler 与默认业务 guard 证据。

## 2026-05-24 1D.15 房屋单元只读小批次发现

本批只处理具名房屋单元只读端点：`/app/unit.queryUnits`、`/app/unit.queryUnitDetail`、`/app/room.queryRooms` 和 `/app/room.queryRoomDetail` 已升级为独立 `apps/api` 精确覆盖。本批没有任何房屋单元写入口，也没有新增 mutation guard。

实现边界已经收敛为统一 App legacy 模块格式：`apps/api/server/modules/room-unit` 下新增 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 七层。兼容房屋单元种子位于 `repository.ts`，覆盖 `COMM_001` 到 `COMM_003` 的楼栋、单元和房屋组合，保留旧 App 需要的 `floorId`、`unitId`、`roomId`、`floorNum`、`unitNum`、`roomNum` 和 `communityId` 字段。`service.ts` 只暴露查询能力，`legacy-adapter.ts` 负责旧参数归一、分页默认值、ID 校验和 `{ code, msg, data }` envelope，`legacy-endpoints.ts` 通过 `getRoomUnitRuntime(event).legacyAdapter` 分发并使用共享 `mergeInput(query, body)`。

运行时清单和 App H5 shadow 边界已经对齐。四个只读端点注册 GET/POST，phase 为 `phase7-room-unit-readonly`，owner 为 `room-unit`，response contract 为 `{ code, msg, data }`，cutover status 为 `app-shadow-allowlist`。App H5 只把这四个房屋单元只读路径加入 `PHASE2_API_SHADOW_ENDPOINTS`，没有放行任何房屋单元写入口。

TDD 红灯证据符合预期：API 目标测试在实现前失败，原因是 room/unit 精确端点未注册、manifest 缺项且 `apps/api/server/modules/room-unit/*` 不存在；App runtime-base 测试在放行前失败，原因是四个房屋单元只读路径在 shadow enabled 时仍路由到旧 runtime。转绿后 API 目标矩阵 5 文件 114 测试通过，App room/unit runtime-base 1 文件 11 测试通过；`api` typecheck、`app` type-check、OpenSpec strict 和 diff check 均已纳入复验。`api` typecheck 曾暴露 `cutoverStatus` 字面量被宽化为 `string`，已通过显式 helper 保持 union 类型。

本地 API 直打证据命中独立本地 API，而不是旧 fallback：四个只读请求均打到 `http://127.0.0.1:3102` 并返回 HTTP 200、`x-api-phase=phase3-infra` 与 `{ code, msg, data }`。关键 request-id 为单元列表 `req_8c763426-b640-49a2-9972-e4418b0d8889`、单元详情 `req_7dfb6574-ca0f-47be-b264-b678121c6c78`、房屋列表 `req_e0fa7355-5278-4094-8fba-ce9e680c0e85`、房屋详情 `req_861c2a18-087c-42ab-8cb8-e2e5adb33adb`；POST body 覆盖 query 的单元列表和房屋列表 request-id 分别为 `req_8d7a3884-c460-415f-a593-d337ab169559` 与 `req_1b614b70-f388-4891-9720-48ff31204c89`。证据汇总为 `.tmp/phase7-dev-browser/2026-05-24-1d15-room-unit-local-api-responses.json`。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback。单元列表页自然发起 `/app/unit.queryUnits`，request-id 为 `req_e274f434-ee3d-4bf0-9d79-de73b0dd7eb5`；房屋列表页自然发起 `/app/room.queryRooms`，request-id 为 `req_4a255b65-9977-4034-b4e1-6d23b69398cb`；房屋详情页自然发起 `/app/room.queryRoomDetail`，request-id 为 `req_392331e0-18f9-4d68-ac66-5683927683dd`，并附带发起 `/app/room.queryRooms` 房屋信息查询，request-id 为 `req_5b8aab6d-f193-4ce8-b664-aef11863af4d`。证据摘要、响应体、快照和截图均保存到 `.tmp/phase7-dev-browser/`，摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d15-room-unit-readonly-local-evidence.md`。

自然页面覆盖存在明确边界：`/app/unit.queryUnitDetail` 当前没有自然 App H5 页面直接调用。源码扫描只确认 `apps/app/src/api/unit.ts` 暴露 `getUnitDetail()`，没有找到 Vue 页面直接调用，因此本批不能把单元详情写成自然页面 Network 证据，只能写成本地 API 直打、runtime manifest、契约测试和 App shadow 解析证据。

页面层残留风险仍存在：房屋列表和房屋详情页面控制台出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`。房屋详情页的 `getRoomInfo()` 还会复用 `/app/room.queryRooms` 并传入 `floorNum`、`unitNum`、`roomNum`，与列表主路径的 `floorId`、`unitId` 参数存在页面层消费差异风险。本批不修改页面契约，也不把该风险升级为 API handler 失败。

本地 ready 语义必须保守解释：本地 `GET /__nitro/ready` 返回 `DB_READY`，request-id 为 `req_8e453a96-7a54-4f2a-945c-65ae4176b0b5`，只说明本机 dev 服务 readiness 探针可用，不能写成生产 `DB_READY`，也不能写成房屋单元 DB-backed repository、Neon main 真实房屋单元样本或真实库主键证据。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、Neon main 真实房屋单元样本、DB-backed 房屋单元数据、`F_`/`U_`/`R_` 真实数据库主键、下游外键、写入口迁移、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。房屋单元兼容种子、HTTP 200、Vitest、本地页面 Network 和 App shadow 解析都只能作为本地 exact handler 与本地 App H5 shadow 证据。

## 2026-05-24 1D.16 业主资料小批次发现

本批只处理具名 owner 旧 App runtime 端点：只读入口 `/app/owner.queryOwnerAndMembers` 已升级为独立 `apps/api` 精确覆盖；写入口 `/app/owner.saveRoomOwner`、`/app/owner.editOwner`、`/app/owner.deleteOwner` 只收敛为默认业务 guard，不开放真实新增、编辑或删除业主资料。

实现边界已经收敛为统一 App legacy 模块格式：`apps/api/server/modules/owner` 下新增 `types`、`repository`、`service`、`runtime`、`legacy-adapter`、`legacy-endpoints`、`index` 七层。兼容业主种子位于 `repository.ts`，共 36 条确定性 owner/member 记录，保留旧 App 需要的 `memberId`、`ownerId`、`communityId`、`roomId`、`roomName`、`name`、`link`、`idCard`、`address`、`ownerTypeCd`、`ownerTypeName` 等字段。`service.ts` 只暴露查询与 guard 决策，`legacy-adapter.ts` 负责旧参数归一、分页默认值、筛选和 `{ code, msg, data }` envelope，`legacy-endpoints.ts` 通过 `getOwnerRuntime(event).legacyAdapter` 分发并使用共享 `mergeInput(query, body)`。

运行时清单和 App H5 shadow 边界已经对齐。只读端点注册 GET/POST，phase 为 `phase7-owner-readonly`，owner 为 `owner`，response contract 为 `{ code, msg, data }`，cutover status 为 `app-shadow-allowlist`。三个写入口只注册 POST，phase 为 `phase7-owner-guarded-write`，cutover status 为 `blocked-for-execution`，并加入 mutation blocked 集合。App H5 只把 `/app/owner.queryOwnerAndMembers` 加入 `PHASE2_API_SHADOW_ENDPOINTS`，三个写入口在 shadow enabled 时仍走旧 runtime base。

TDD 红灯证据符合预期：API 目标测试在实现前失败，原因是 owner 精确端点未注册、manifest 缺项且 `apps/api/server/modules/owner/*` 不存在；App runtime-base 测试在放行前失败，原因是 owner 只读路径在 shadow enabled 时仍路由到旧 runtime。转绿后 API 目标矩阵 5 文件 121 测试通过，App owner runtime-base 1 文件 10 测试通过；`api` typecheck、`app` type-check、OpenSpec strict 和 diff check 已纳入最终复验队列。

本地 App H5 Network 证据命中独立本地 API，而不是旧 fallback。业主列表页自然发起 `/app/owner.queryOwnerAndMembers`，命中 `http://127.0.0.1:3102` 并返回 HTTP 200；页面快照和截图保存为 `.tmp/phase7-dev-browser/2026-05-24-1d16-owner-list-local-app.txt` 与 `.tmp/phase7-dev-browser/2026-05-24-1d16-owner-list-local-app.png`，证据摘要为 `.tmp/phase7-dev-browser/2026-05-24-1d16-owner-readonly-local-evidence.md`。本地 API 直打覆盖列表、按 `memberId` 详情、`name`、`link`、`roomName` 筛选、POST body 覆盖 query 和空数据路径，响应汇总为 `.tmp/phase7-dev-browser/2026-05-24-1d16-owner-local-api-responses.json`。

写入口 guard 只做本地直打验证，没有通过页面触发真实新增、编辑或删除。Node `fetch` 直打三个 POST 写入口均返回旧兼容 envelope，响应体业务码为 `code=409`、`errorCode=PHASE7_MUTATION_GUARDED`、`data=null`；guard 前后 `MEM_0003` 查询结果保持一致。HTTP 200 或兼容 envelope 不能写成写入成功；本批阻断语义以业务码和 `errorCode` 为准。

页面层残留风险仍存在：业主列表页面控制台出现已知 Vue/z-paging scheduler 错误 `Cannot assign to read only property '_' of object '#<Object>'`。本批只证明目标 Network 请求和旧 envelope 正确，不声明业主列表 UI 渲染层全量修复完成。

本地 ready 语义必须保守解释：本地 `GET /__nitro/ready` 返回 `DB_READY`，只说明本机 dev 服务 readiness 探针可用，不能写成生产 `DB_READY`，也不能写成 owner DB-backed repository、Neon main 真实业主样本或真实库主键证据。

禁止误判：不得把本批写成生产 App H5 Network、生产 `DB_READY`、Neon main 真实业主样本、DB-backed 业主数据、真实业主新增/编辑/删除完成、写入读回回滚、shadow-off/fallback 完成、退役台账完成或旧 app server 退役。业主兼容种子、HTTP 200、Vitest、guard、本地页面 Network 和 App shadow 解析都只能作为本地 exact handler 与默认业务 guard 证据。

## 2026-05-25 §3A.299 fresh scan 发现

本轮只做调用端到目标端的 fresh scan，不实现 `apps/api` 运行时代码。`apps/app/src/api/work-order.ts`、`visit.ts`、`profile.ts`、`video.ts`、`notice.ts`、`repair.ts`、`fee.ts`、`property-application.ts`、`owner.ts`、`room.ts`、`unit.ts` 已可稳定映射到独立 `apps/api` exact handler 或跨模块 `callComponent` 复用；`inspection.ts`、`parking.ts`、`staff.ts` 仍保留 client caller 但在 `apps/api` exact registry 下仍有缺口，且分别牵涉高风险写入口、设备动作和 dynamic route。`contact` 继续保持 server-only compatibility/mock 口径，`mock`、`test`、`foo*`、`login.ts` 不应当当成真实业务 caller。
禁止误判：不得把这轮 fresh scan 写成生产 App H5 Network、`DB_READY`、shadow-off/fallback 完成、真实库样本、写入闭环、页面全量修复或旧 app server 退役。

## 2026-05-25 §3A.300 fresh scan 发现

本轮只做服务端端点差集分类，不实现 `apps/api` 运行时代码。`work-order`、`visit`、`profile`、`owner`、`room`、`unit`、`fee`、`repair`、`oa-workflow`、`appointment`、`complaint`、`maintenance`、`resource`、`purchase`、`item-release`、`floor`、`meter`、`activity`、`coupon`、`renovation`、`property-application` 都已有客户端调用与服务端 endpoint 证据，属于 both 或跨模块复用；`contact` 与 `test` 继续保持 server-only compatibility/mock 口径；`staff` 必须单列 dynamic route；`inspection`、`parking`、`work-order`、`profile`、`visit` 的写入口不能因为只读或页面命中就被误判为完成。`foo*`、`login.ts`、mock/test 支路也不能当成真实业务 caller。
禁止误判：不得把这轮差集分类写成生产切流、`DB_READY`、shadow-off/fallback 完成、真实库样本、写入闭环、页面全量修复或旧 app server 退役。

## 2026-05-25 §3A.301 response contract 发现

- `apps/app` 侧 legacy 响应仍由 `successResponse` / `errorResponse` 统一封装，旧 envelope 维持为 `{ success, code, message, data, timestamp }`，错误路径可显式返回 `400` / `404` / `500`，不会自动切成 admin canonical 的 `JsonVO` 形状。
- `endpoint-registry.ts` 继续把 `query`、`body` 和 path params 合并进 `params`，所以 `GET/POST` 兼容与 POST body 覆盖 query 仍是共享层契约，不是单个模块私货。
- `work-order`、`visit`、`profile`、`owner`、`room`、`unit` 的测试都在锁定旧 list/detail 结构、分页输入或写后回读；`owner` 还明确验证删除后 `queryAfterDelete.data.list` 为空。
- `inspection`、`parking` 继续沿用同一套 app legacy envelope，但它们带有更高风险的写入口；`contact` 与 `test` 更接近 compatibility/mock 边界，其中 `test` 明确验证了参数回显和 `code='500'` 的错误路径。
- 未见 `apps/app/server/modules/**` 改用 `adminSuccess` / `adminFailure`；admin canonical 响应只在 `apps/api` 侧单独存在，不应反写进 app legacy contract。
- ## 2026-05-25 §3A.303-305 app 端横向验证边界

- `legacy dispatch`、runtime manifest、allowlist 与 guard 的一致性已经在 1D.5-1D.16 的各模块 checkpoint 和 `runtime-evidence-alignment-audit.md` 中被持续要求，并由 `phase7-api-contracts.test.ts` / `endpoint-manifest.test.ts` 作为结构性回归兜底；这类一致性不等于 repository 完成，也不等于生产 `DB_READY`。
- `server-only` / `client-only` 的横向调查已经分别落到 `.tmp/phase7-dev-browser/2026-05-21-server-only-endpoint-summary.md` 与 `.tmp/phase7-dev-browser/2026-05-21-client-only-gap-exploration.md`，因此可把 303-305 视为分类与边界记录，而不是新增 runtime 采证需求。
- 这三个任务只解决“不要误删 / 不要忽略”的台账问题，不代表旧服务退役，也不代表 `apps/app/server` 或旧 H5 path 可以删除。

## 2026-05-25 task 306 app retirement ledger baseline 风险边界

本轮新增 [app-retirement-ledger.md](app-retirement-ledger.md) 只是在 `route-inventory.md` 的 App Legacy Explicit Registry 上物化 21 行 baseline，不是 §5 task 339-341 old-service retirement candidate 清单，不是目录级退役门禁通过，不是 `DB_READY`、真实库样本、write/read/rollback、shadow-off/fallback 复验或旧服务可删。

后续若有人把 task 306 误读为旧服务退役完成，应优先回看 ledger 中的保守字段：只读/查询行为 `retirementDecision=keep-source`，写入口行为 `retirementDecision=blocked`，`dataSourceStatus` 只允许保持 `partial-or-mixed` 或 `blocked-for-execution`，`dbReadinessEvidence=READY_CONFIGURED-only`。这些字段共同说明本轮只是 §3A app 端 21 行 ledger baseline，不能据此删除、移动、归档、重命名或清空 `apps/app/server`、`apps/admin/server` 或 `D:\code\ruan-cat\01s-11comm-app`。

## 2026-05-25 task 307/310 apps-api 本地验证边界

本轮本地 `apps/api` 短启、health、ready、build、typecheck 和 test 通过，只能关闭本地运行与 ready 语义边界。`READY_CONFIGURED` 表示配置了数据库 URL 且深度 probe 未开启；它的 `connected=null`、`probeEnabled=false` 明确说明没有真实连接验证，不能写成 `DB_READY`。本地 fake 或占位 DB URL、兼容种子、HTTP 200、Vitest、Nitro build 和 `/app/fee.listFee` 3 条兼容样本都不能写成 Neon main 真实库样本、生产 DB readiness、写入闭环、shadow-off/fallback 或退役证据。

本轮发现 `apps/api/.env` 当前含 `RUN_PHASE7_DB_READINESS_CHECK=1`。在没有真实可用 DB URL 的本地短启里，这会让 `/__nitro/ready` 进入深度探针并返回 `DATABASE_CONNECTION_FAILED`，不能把该 503 误判为服务启动失败，也不能把其与显式 `RUN_PHASE7_DB_READINESS_CHECK=0` 下的 `READY_CONFIGURED` 混写。后续采 ready 证据必须同时记录 `RUN_PHASE7_DB_READINESS_CHECK`、DB URL 是否为脱敏占位、ready code、`connected`、`probeEnabled`。

Windows gotcha：`Start-Process -FilePath pnpm` 可能命中非 Win32 shim，应使用 `pnpm.cmd`；旧版 PowerShell 没有 `Invoke-WebRequest -SkipHttpErrorCheck`，可用 `curl.exe` 采状态；Nitro dev 会留下子进程，停止时必须按端口 owning process 清理，不能只停父进程。

本轮还修复了一个测试断言过期问题：`apps/api/tests/legacy/repair-legacy-endpoints.test.ts` 不应继续否认已合法迁入的 complaint endpoint `/app/auditUser.listAuditComplaints`。该 endpoint 已由 complaint 专项测试、runtime registry 和 manifest 测试正向覆盖；repair 测试应只防止 repair/workorder/resource/machine 等 blocked leftovers 被误注册。

## 2026-05-25 contract upload R2 前置复核边界

本轮只把 R2 前置事实和阻断决策沉淀为证据，不实现上传能力。`apps/api` 仍缺 `@aws-sdk/client-s3`、`@aws-sdk/s3-request-presigner`、R2 client、S3 multipart command、presigner、upload session repository 和断点续传端到端验证。`ctUploadSessions` 与 `ctUploadSessionParts` 已存在于 `apps/type/src/business/property-manage/contract-manage/schema.ts`，但 schema 存在不能替代 `apps/api` repository 写入读回。

当前 `property-manage/contract-manage/upload/{init,sign-part,complete,abort,status}` 继续保持 `blocked-pending-r2-env`。route 壳、前端 shared-upload hook、`R2_*` env 透传、409 阻断响应和 Vitest 通过都不能写成真实 R2 multipart、DB session/part 写入读回、前端断点续传闭环、production HTTP evidence、`DB_READY`、available runtime manifest 或旧服务退役候选。

## 2026-05-25 edge/debug/placeholder route 分类边界

`debug-env.get.ts` 只作为诊断 route 处理，排除业务迁移与退役候选；`j1-dashboard/center/commonmenu/get.ts` 仍是 placeholder 或待决策 route，且前端调用路径不是 `/get`，不能写成 exact route 已迁移；`org-info/tree.post.ts` 虽已进入 `apps/api` manifest 并具备本地 contract/repository 证据，但生产 tree 返回空数组，生产 `org-info/list` 同页有 5 条组织数据，生产 `/__nitro/ready` 仍是 `READY_CONFIGURED`，所以 task 496 不得关闭。

禁止误判：task 515 的分类完成不是 edge route 全量完成，不是生产数据正确性通过，不是 shadow-off/fallback，不是 retirement ledger，也不是 `apps/admin/server` 目录级退役许可。

## 2026-05-25 admin resolver fresh scan 风险

本轮扫描显示 `apps/admin/src/api/**/index.ts` hook index 层没有发现绕过 `resolveAdminApiRequestUrl(...)` 的旧 `/api/**`，但 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/api.ts` 在页面局部 API 中直接定义旧 `/api/property-manage/contract-manage/draft-contract`。该页面属于 `propertyManage.contractManage.draftContract` 业务路径，不能归类为 system、debug、docs 或 test 例外。

因此 admin resolver 完成态必须降级为 regression pending。修复前不得把 task 509、admin resolver 全覆盖、admin shadow-off、production admin H5 evidence 或旧 `apps/admin/server` 退役写成通过。`apps/admin/src/api/auth.ts` 的 `/api/auth/**` 与 OAuth 跳转属于 system/auth 例外，需要单独评审，不混入普通 rank 业务路径完成率。

同日已修复该 `draft-contract` 页面局部 API 回归：`api.ts` 已改用 `resolveAdminApiRequestUrl(...)`，并新增 `tests/api.test.ts` 覆盖 shadow disabled、shadow proxy enabled、proxy disabled + base URL。红灯先证明 shadow 场景仍命中裸旧路径，转绿后目标 Vitest 2 文件 36 测试通过，`admin typecheck` 通过，定向扫描确认旧裸 `BASE_URL` 已无命中。当前禁止误判调整为：可以关闭 task 509 与本条 regression 修复任务，但不能据此关闭 task 521、admin 页面 Network、admin shadow-off/fallback、生产 H5、生产 `DB_READY`、CRUD 写入闭环或旧 `apps/admin/server` 退役。

## 2026-05-25 §4B 测试纪律局部收口边界

本轮只按当前 `apps/api/tests` 与 `apps/app/src/tests` 相关范围关闭测试纪律的一部分。`*.test.ts` 命名、`vitest` 导入、`describe` 与 `test` 标识、写入口 guard 断言、DB repository fake/mock/capture 边界、命令记录和 Vitest 不替代外部证据的红线可以支撑 task 730、731、733、734、736、737。

该记录创建时 task 732 仍未完成，因为 complaint 只读覆盖较完整，但 repair 等 app legacy 只读测试不足以证明所有只读 endpoint 都覆盖 legacy path、method、payload 兼容、response envelope、关键字段映射、空数据和错误路径。后续 task326 专项已补齐该缺口，关闭证据见 `.tmp/phase7-dev-browser/2026-05-25-task326-app-legacy-readonly-test-coverage.md`；task 735 仍未完成，因为本轮不是 admin list/detail/CUD/upload/edge 测试范围隔离的全量专项审计。

禁止误判：Vitest/typecheck/build/OpenSpec strict/diff check 通过不能替代 Chrome 页面证据、Neon main `DB_READY`、真实库样本、写入读回回滚、shadow-off/fallback 或 retirement gate。

## 2026-05-25 task326 app legacy 只读测试覆盖边界

本轮已补齐 task326 / task732 的 app legacy 只读 endpoint 测试覆盖，证据见 `.tmp/phase7-dev-browser/2026-05-25-task326-app-legacy-readonly-test-coverage.md`。新增和更新的测试文件覆盖 `repair`、`complaint`、`profile`、`video`、`fee` 的缺口，并复核既有 `activity`、`appointment`、`callComponent`、`contact`、`floor`、`notice`、`owner`、`room-unit`、`visit`、`work-order` 等测试。验证命令显示 `apps/api` 全量 legacy 加结构回归 20 文件 231 测试通过，`apps/app` legacy runtime 侧 3 文件 10 测试通过。

风险边界：本轮只证明本地 Vitest 覆盖矩阵已经覆盖 legacy path、method、payload 兼容、response envelope、关键字段映射、空数据和错误或兼容路径。测试使用确定性兼容种子与 fallback runtime，不代表生产 `DB_READY`、Neon main 真实库样本、生产 App H5 Network、shadow-off/fallback、写入读回回滚或旧 app server 退役。fee 文件中受控开启写入口兼容形状测试只是保留本地兼容断言，不能升级为真实业务写入完成。

## 2026-05-25 task339 旧服务新增入口回归扫描边界

本轮已完成 task339 的静态回归扫描，证据见 `.tmp/phase7-dev-browser/2026-05-25-task339-old-service-regression-scan.md`。`apps/admin/server` 与 `apps/app/server` 在 unstaged diff、staged diff、工作区状态和未跟踪文件扫描中均无新增入口；子代理复核也确认本轮新增 `/app/**` endpoint 均位于 `apps/api` 的 legacy 兼容入口、manifest/test 或证据，不是旧 `apps/app/server` 新业务入口，`draft-contract` 的 `/api/**` 变更是 `apps/admin/src` 前端 resolver 修复，不是旧 `apps/admin/server` 新入口。

禁止误判：本轮关闭的是“没有新增旧服务入口回归”这一冻结扫描项，不是 old-service retirement candidate 清单，不是 retirement ledger 全覆盖，不是旧服务引用扫描，不是 fallback/shadow-off 复验，不是三端双环境证据，不是生产 `DB_READY`、真实库样本、写入闭环或旧服务删除许可。

## 2026-05-25 task343 旧服务引用扫描边界

本轮已完成 task343 的旧服务引用扫描，证据见 `.tmp/phase7-dev-browser/2026-05-25-task343-old-service-reference-scan.md`。可用子代理报告覆盖 App 前端、统一 API 与配置、文档脚本测试；后台前端子代理未产出报告，主代理已补扫。当前分类结论是：运行时代码中未发现直接字面量引用 `apps/admin/server`、`apps/app/server` 或 `D:\code\ruan-cat\01s-11comm-app`；`apps/api` 未发现直接导入旧服务目录；后台普通业务 hook 未发现未包裹 resolver 的直接旧 `/api/**` 请求；`/api/auth/**` 是 system/auth 例外。

保守风险必须继续保留：`apps/app/src/api/mock` 与 `apps/app/src/tests/nitro-runtime` 仍有相对导入耦合旧 `apps/app/server` 的 Mock/测试代码；`apps/api` 仍保留 legacy fallback base 与 fallback 测试；`apps/app/src/http/runtime-base.ts` 仍保留旧 runtime fallback 和大量未 allowlist 的 `/app/**` 调用；`apps/admin/tests/setup*.ts` 与 `apps/admin/tests/nitro/**` 仍体现旧 admin Nitro 测试体系；`scripts/generate-tasks.ts` 仍会生成面向 `apps/admin/server/api` 的旧任务模板。

禁止误判：task343 只能关闭为“扫描完成并分类”。不得写成旧服务引用清零，不得写成 App 前端旧服务引用已退役，不得写成 fallback/shadow-off 复验完成，不得写成 old-service retirement candidate 或 retirement ledger 完成，也不得据此删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或 `D:\code\ruan-cat\01s-11comm-app`。

## 2026-05-25 task348-349 受保护路径与删除决策边界

本轮已完成 task348 与 task349 的保护/决策记录，证据见 `.tmp/phase7-dev-browser/2026-05-25-task348-349-protected-paths-and-delete-decision.md`。`D:\code\ruan-cat\01s-11comm-app` 继续是永久保留的旧源目录和历史证据来源，只能只读引用、采集迁移证据或记录存在；`apps/admin/server` 与 `apps/app/server` 在 no-go-for-retirement 解除前仍是受保护旧服务目录。

删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或旧源目录不得夹带在 endpoint 迁移任务中。若未来确实要处理旧服务目录，必须发起独立 OpenSpec change 或明确单独评审，并具备回滚方案和用户明确确认。本轮 `openspec list --json` 只显示当前 change 为 in-progress，未发现可承载旧服务目录删除的独立 active change。

禁止误判：task348-349 完成是保护规则和删除决策门禁已落证据，不是旧服务退役许可，不是旧源目录删除许可，不是目录级 cleanup 执行完成，也不能替代 retirement candidate、retirement ledger、fallback/shadow-off、生产 `DB_READY`、真实库样本或写入闭环。

## 2026-05-25 task521 admin caller mapping 边界

本轮已完成 admin caller mapping 静态台账，证据汇总见 `.tmp/phase7-dev-browser/2026-05-25-task521-admin-caller-mapping.md`。四个子代理分片报告共建立 127 行有 hook 或共享调用端的 old `/api/**` 证据，其中 114 行有明确页面入口，5 行是 `contract-manage/upload/*` shared-upload 调用端，8 行有 hook 但未发现页面入口。另有 31 行 inventory route 当前在 `apps/admin/src` 无前端 hook/caller，主要是 `dev-team/config-manage/*` 的 CUD/detail 与 `setting-manage/system-manage/*` 的 CUD；`debug-env` 与 `j1-dashboard/center/commonmenu/get` 继续保持诊断或 placeholder 分类。

禁止误判：task521 完成只代表静态扫描和台账分类完成。它不能替代 Chrome 页面 Network、生产 admin H5、HTTP gate、contract test、真实 CRUD 页面交互、Neon main `DB_READY`、真实库样本、写入读回回滚、shadow-off/fallback 或 retirement ledger。无页面入口的 contract shared/reference hook 和 `operation-team/data-manage/property-company/list` 不得用“页面未访问”跳过；当前无 hook/caller 的 dev/setting CUD inventory rows 也不得被对应 list 页面证据覆盖。

后续自动扫描 gotcha：`report-manage/expense-summary-table` 与 `expense-manage/expense-summary-table` hook 名称相同，必须按目录和业务路径区分；`operation-team/system-manage/community-configuration` 页面使用 alias `useCommunityConfigListQuery`；patrol 的 `useDetailListQuery`、`useItemListQuery` 等名称泛化，必须结合 import 路径；`draft-contract` 的 detail/create/update/delete 位于页面局部 `pages/.../draft-contract/api.ts`，不能只扫描 `apps/admin/src/api/**/index.ts`。

## 2026-05-25 §4A 本地三端证据边界

本轮已关闭 task 316-319，但只代表本地 dev 和本地浏览器证据闭环。`apps/api` 在 3102、`apps/admin` 在 8080、`apps/app` H5 在 3000；admin 通过 `/api-shadow` 指向 3102，app H5 的 shadow allowlist 将 `/app/**` 指向 3102。API browser evidence 覆盖 `GET /__nitro/health`、`GET /__nitro/ready`、`POST /api/property-manage/contract-manage/draft-contract/list` 和 `GET /app/owner.queryOwnerAndMembers`；admin 页面 evidence 覆盖 `draft-contract` 业务页自然发出的 `/api-shadow/.../list`；app 页面 evidence 覆盖 owner list 页面自然发出的 `/app/owner.queryOwnerAndMembers`。

禁止误判：本轮 `RUN_PHASE7_DB_READINESS_CHECK=0`，ready code 是 `READY_CONFIGURED`，`connected=null`、`probeEnabled=false`，不得写成 Neon main `DB_READY` 或真实库样本。admin 页面为了本地采证注入了最小测试登录态，并补充 `roles=["物业团队","admin"]` 才通过路由守卫；这只是本地浏览器上下文，不是认证改造、真实登录链路或生产页面证据。app owner 页面 console 仍有既有 Vue/z-paging 调度错误 `Cannot assign to read only property '_' of object '#<Object>'`，不能写成控制台完全无错误，也不能升级为 API handler 失败。

Windows gotcha：普通 `Start-Process powershell -Command $env:...` 会把 env 赋值切碎，导致 `=true` 或 `true` 被当成命令；本轮最终使用 `-EncodedCommand` 启动三端。PowerShell `Invoke-WebRequest` 直打部分 POST 会触发 Nitro dev/undici `expect header not supported`，Chrome browser fetch 和 admin `/api-shadow` 页面请求均证明目标 handler 可以返回 200，所以该路径只能记录为采证方式问题，不是服务失败。

清理 gotcha：PowerShell 变量名大小写不敏感，`$pid` 等价于内置只读变量 `$PID`，不能作为 `foreach` 循环变量。清理本轮 dev 进程时第一次命令因此没有停止端口；后续改用 `$targetProcessId` 并按命令行归属限定在 `D:\code\ruan-cat\01s-11comm\apps\*` 后，3000、3102、8080 均已无监听残留。

## 2026-05-25 task 314 URL/base 边界风险

本轮已把生产入口、本地 dev base、admin resolver base、app shadow/API base 分开落证据，但这只是 URL/base 归属边界，不是运行状态验证。生产入口只能来自三个 `package.json` 的 `homepage` 字段：admin H5 `https://01s-11comm.ruan-cat.com`、app H5 `https://01s-11-app.ruan-cat.com`、统一 API `https://01s-11-server.ruan-cat.com`；本地 `127.0.0.1` 端口、`/api-shadow` 代理前缀和旧 app fallback `3101` 都不能写成生产入口。

admin resolver 的本地和生产语义必须区分：本地 task316-319 使用 `/api-shadow` 代理到 `http://127.0.0.1:3102`；生产 `.env.production` 使用 `VITE_11COMM_API_USE_PROXY=false` 和 `VITE_11COMM_API_BASE_URL=https://01s-11-server.ruan-cat.com`，因此 `/api-shadow` 不是生产 API 域名。app runtime 的本地和生产语义也必须区分：生产 `VITE_SERVER_BASEURL` 与 `VITE_11COMM_API_BASE_URL` 都指向 `https://01s-11-server.ruan-cat.com`；本地 development-nitro-api 文件里的 `3101` 只是非 allowlist fallback，task316-319 通过进程 env 覆盖 shadow 开启后，allowlist 请求才直连 `3102`。

禁止误判：task 314 完成不能替代生产 API `/__nitro/health`、`/__nitro/ready`、生产 H5 Network、Neon main `DB_READY`、真实库样本、shadow-off/fallback、写入读回回滚或旧服务退役。`READY_CONFIGURED`、HTTP 200、本地页面 Network 和 Vitest 通过都不能升级为这些状态。

## 2026-05-25 task 313 runtime 对齐审计风险

本轮结构性审计证明 manifest、route、adapter 和 tests 有可追踪关系，但不是所有 endpoint 的完成声明。app legacy 走 `nitro.config.ts` 的 `/app/**`、`/callComponent/**` handler 和 `legacy-dispatch` registry；admin canonical 走物理 `routes/api/**/*.ts` route 壳并调用模块 `adminAdapter`。这两条链路不能互相替代。

只读差集显示 `routes/api` 物理文件 160 个、admin manifest URL 142 个，manifest 没有声明不存在的物理 route；但还有 18 个物理 route 未进 manifest。其中 `debug-env`、`j1-dashboard/center/commonmenu/get.ts` 和 5 个 contract upload R2 route 是特例排除，另有 11 个业务 route 必须保持 `partial-manifest-missing`：`/api/dev-team/cache-manage/refresh-cache/list`、`/api/dev-team/menu-manage/catalog/list`、`/api/dev-team/menu-manage/group/list`、`/api/dev-team/menu-manage/item/list`、`/api/setting-manage/organize-manage/data-permission/list`、`/api/setting-manage/organize-manage/org-info/list`、`/api/setting-manage/organize-manage/role-permission/list`、`/api/setting-manage/organize-manage/scheduling-setting/list`、`/api/setting-manage/organize-manage/shift-setting/list`、`/api/setting-manage/organize-manage/staff-info/list`、`/api/setting-manage/organize-manage/working-schedule/list`。这些 route 必须保持 partial 或独立任务状态，不能因 task 313 关闭而写成 cutover 完成。

还有 adapter 层级绕过风险：`/api/property-manage/repairs-manage/return-visit/list` 已进 manifest，也有 admin route 测试，但 route 内部直接调用 `getRepairRuntime(event).service.listOwnerRepairs(...)` 并在 handler 内拼 admin DTO，不是纯 `adminAdapter` 映射。该 endpoint 必须标记为 `partial-adapter-bypass`，不能作为 admin route/adapter 全量严格对齐样板。

禁止误判：`endpoint-manifest.test.ts`、`phase7-api-contracts.test.ts`、`app-legacy-module-layering.test.ts`、`endpoint-registry.test.ts` 通过只能证明结构性约束，不能替代生产 `DB_READY`、真实库样本、生产页面 Network、shadow-off/fallback、写入读回回滚或旧服务退役。manifest 中的 `available-in-apps-api-not-caller-verified` 不能写成页面调用端已验证，`blocked-for-execution` 不能写成写入口完成，`partial-manifest-missing` 或 `partial-adapter-bypass` 不能写成全量对齐。

## 2026-05-25 task 329 admin 测试范围隔离风险

本轮审计只证明 admin 测试文件的范围隔离，不证明业务验收完成。普通 list/read-only 文件如 `fee-admin-endpoints.test.ts`、`report-manage-p1-endpoints.test.ts`、`parking-admin-endpoints.test.ts`、`patrol-admin-endpoints.test.ts`、`repair-admin-endpoints.test.ts` 没有导入 create/update/delete/detail/upload route，只能作为 list/read-only contract、route fallback、adapter failure 或 repository query intent 证据。

detail/CUD 由 `contract-change-draft-crud.test.ts`、`dev-config-manage-*.test.ts`、`setting-system-*.test.ts` 和 `expense-manage-phase5a.test.ts` 等专项文件覆盖；upload/R2 由 `contract-upload-r2-blocked.test.ts` 单独保持阻断；edge/debug/placeholder 由 `setting-organize-edge-routes.test.ts` 单独覆盖。这个分工不能替代页面级新增、编辑、删除、详情弹窗、生产写入窗口、read-back、rollback/cleanup 或 residual check。

payment-like 边界：`payment-details-form/list` 和费用相关 list 仍是 admin canonical 只读 PageDTO 或报表语义，不是 payment mutation、支付回调、费用创建或真实支付写入完成。普通 list test 通过不能升级任何 `blocked-for-execution` 或支付/费用高风险写入口状态。

## 2026-05-25 task540 后台退役 no-go 复核边界

本轮 task540 复核只关闭“不得把局部证据外推为 `apps/admin/server` 删除候选”的规则确认，证据见 `.tmp/phase7-agent-reports/2026-05-25-task540-admin-retirement-no-go-review.md`。`admin old path exact coverage`、resolver/fresh scan 完成、HTTP gate/HTTP 200、页面 list 成功、本地页面 Network 成功、静态 caller map、hook/page caller 分类、runtime manifest、route file、health/ready 和 `READY_CONFIGURED` 都不能替代 §5 退役门禁。

进入旧服务目录删除候选前，仍需 endpoint 级 retirement candidate 清单和 ledger、caller cutover 或无 caller 证明、browser/HTTP 证据、fallback/shadow-off 复验、Neon main `DB_READY`、真实库样本、写入读回回滚或明确不适用说明、三端双环境证据、独立退役复核、回滚方案和用户明确确认。旧服务目录删除、移动、归档、重命名或清空必须走独立 OpenSpec change 或明确单独评审；task540 完成不关闭 §5 的任何未完成项。

## 2026-05-25 task496 edge route 分类收口边界

本轮 task496 只关闭 `org-info/tree`、`debug-env.get`、`j1-dashboard/center/commonmenu/get` 三项的分类和最低证据，不升级生产数据、DB 或退役状态。`org-info/tree` 已迁入 `apps/api` 并有 manifest、contract/repository、本地 admin H5 与生产 admin H5 命中 `apps/api` 的证据，但生产响应仍为 `data=[]`，同页 `org-info/list` 有 5 条组织数据；该差异仍是后续生产数据正确性和真实库样本 blocker。`debug-env.get` 是诊断 route，`j1-dashboard/center/commonmenu/get` 是 placeholder 或待决策 route，二者不进入业务 manifest 或退役候选。

禁止误判：task496 完成不代表 `setting-manage/organize-manage` 全量完成，不代表生产 `DB_READY`、Neon main 真实库样本、shadow-off/fallback、retirement ledger、old-service retirement candidate、三端双环境完整证据或 `apps/admin/server` 删除候选。旧的“生产 tree 为空”阻断仍有效，只是迁移到 §4、§4A、§4C 和 §5 后续任务承接，不再阻断 task496 的分类收口。

## 2026-05-25 task583 写入窗口设计边界

本轮只完成写入窗口设计，不执行真实写入。证据 `.tmp/phase7-dev-browser/2026-05-25-task583-write-window-design.md` 已把 `PHASE7_E2E_*` / `phase7RunId`、可检索 payload 字段、可清理哨兵数据、业务允许范围、读回、回滚或清理、残留检查、guard 恢复和证据模板固化为前置 checklist。

禁止误判：task583 完成不等于授权生产写入，不等于设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1`，不等于 payment/callable/fee-create 写链路放行，也不等于 `DB_READY`、真实库样本、写入读回回滚、shadow-off/fallback 或旧服务退役。没有用户明确授权、可清理测试数据、回滚方案、残留检查和 guard 恢复证据时，task584 继续保持未完成，高风险写入口继续 blocked。

## 2026-05-25 task584 与 §4C 写入规则收口边界

本轮进一步关闭 task584 与 §4C task773-775，但关闭语义只限禁止执行红线、前置 checklist、高风险对象 blocked 规则和写入证据模板已经落地。`.tmp/phase7-dev-browser/2026-05-25-task583-write-window-design.md` 已说明未取得用户授权、未具备生产 `DB_READY`、可清理测试数据、回滚方案、残留检查和 guard 恢复证据时，不得对支付、催缴、费用创建、开门、维修流转、业主资料或审批流执行真实生产写入。

禁止误判：这些 checkbox 完成不代表任何 endpoint 已经产生真实写入证据，不代表 read-back、rollback/cleanup、residual count 为 0 或 guard-after 已完成。后续如果实际开启写入窗口，仍必须重新按 endpoint 记录完整 evidence；任一步失败时，同批次后续写入必须停止并保持 blocked。

## 2026-05-25 task769-770 Schema 规则边界

本轮关闭 schema 事实源确认和 schema 变更同步规则项。`schema-wiring-audit.md` 只证明当前 DB-backed repository 使用的表能反链到 `apps/type/src/business/**/schema.ts` 的 Drizzle table、Zod schema 和 TypeScript 类型；`schema-exists-not-wired`、`unknown-needs-triage`、`non-db-or-fallback` 等缺口仍保持保守状态。当前没有 `apps/type/src/business/**/schema.ts` 或 `.claude/skills/neon-db-query/SKILL.md` 改动，因此 task770 只是规则已落地、本轮无 schema 变更不适用。

禁止误判：schema 规则关闭不代表 DB-backed endpoint 已经生产可用，不代表 `DB_READY`、真实库样本、写入读回回滚、shadow-off/fallback 或 retirement candidate。后续任何 schema 新增、修改或删除仍必须重新触发 schema 变更同步流程，不能在旧 `apps/admin/server/db/schemas` 新增事实源。

## 2026-05-25 task494 R2 阻断复核

task494 继续保持未完成。当前 409 阻断、manifest 排除、缺 AWS SDK/R2 client/repository 与专项测试通过，只能证明 contract upload 仍处于 `blocked-pending-r2-env`。这类证据是安全阻断，不是上传能力完成。

禁止误判：不得把 `contract-upload-r2-blocked.test.ts` 通过、5 个 route 壳存在、前端 shared-upload hook 存在或 `ctUploadSessions` / `ctUploadSessionParts` schema 存在写成 R2 multipart、DB session/part 写入读回、异常清理、幂等、前端断点续传闭环、生产 HTTP/页面证据、`DB_READY` 或退役条件完成。

## 2026-05-25 DB 证据规则收口边界

task719、777、778 已关闭，但只代表 DB 证据记录规则和验收口径落地。证据见 `.tmp/phase7-dev-browser/2026-05-25-task719-777-778-db-evidence-rules.md`。后续任何 `DB_READY` 记录只能写 env 名、脱敏 host、连接类型、required tables、migration count、ready code 和响应摘要，不能写真实连接串或 secret。只读 endpoint 的真实库样本必须能追到 repository、业务表、查询条件和字段映射；空数组、mock、compat 默认值或 fallback 只能记录为缺口。

禁止误判：这些规则项完成不代表生产 Neon main `DB_READY` 已通过，不代表任何 endpoint 的真实库样本完成，也不代表生产浏览器证据、写入读回回滚、shadow-off/fallback 或旧服务退役。task718 与 task721 仍是实际 DB 验收缺口。

## 2026-05-25 旧服务目录删除候选 no-go 复核边界

task796 与 task797 已关闭，但关闭含义是目录删除候选前置规则已复核，且当前仍不得进入删除候选评审。证据见 `.tmp/phase7-dev-browser/2026-05-25-task796-797-directory-retirement-no-go.md`。`apps/admin/server` 和 `apps/app/server` 仍受保护；只有在全部 endpoint 归类、retirement gate、DB/write/fallback/browser evidence、三端双环境证据、保留清单、回滚方案和独立评审满足后，才允许进入单独删除候选评审。

禁止误判：task796、797 完成不代表旧服务可删，不代表 retirement candidate 清单、retirement ledger、fallback/shadow-off、三端双环境证据、生产 `DB_READY`、真实库样本或写入闭环完成。当前 change 仍不得删除、移动、归档、重命名或清空旧服务目录。

## 2026-05-25 生产 API browser evidence 边界

task747 已关闭，但只代表生产 API server 端的 Chrome DevTools MCP 证据已经采集。证据见 `.tmp/phase7-dev-browser/2026-05-25-production-api-browser-evidence.md`。生产 `health`、`ready` 和 `owner.queryOwnerAndMembers` 均返回 200；ready 仍是 `READY_CONFIGURED`，不是 `DB_READY`；owner 响应中仍含 `mock 业主数据`。

禁止误判：生产 API 200 和非空响应不能替代 Neon main `DB_READY` 或真实库样本。task748 的生产 admin H5 页面 Network 仍未关闭；task749 只关闭生产 App H5 的 owner-list 页面证据，不能替代 admin H5。task718 与 task721 也仍是实际 DB 验收缺口。

## 2026-05-25 生产 App H5 browser evidence 边界

task749 已关闭，但只代表生产 App H5 的一个真实页面 Network 已采集。证据见 `.tmp/phase7-dev-browser/2026-05-25-production-app-h5-browser-evidence.md`。页面为 `#/pages-sub/property/owner-list`，业务请求命中生产 `apps/api` 的 `/app/owner.queryOwnerAndMembers`，未观察到旧 app server fallback 请求。

禁止误判：该响应仍含 `mock 业主数据`，所以不能升级为真实库样本或 Neon main `DB_READY`。本项不代表全部 App H5 页面、全局 shadow-off/fallback、写入口闭环或旧 app server 可退役。

## 2026-05-25 生产 admin H5 当前重采阻断

task748 继续保持未完成。当前 Chrome DevTools MCP 打开 `https://01s-11comm.ruan-cat.com/#/setting-manage/organize-manage/org-info` 后实际进入 `#/login`，Network 只有文档、`platform-config.json` 和 iconify 请求，没有自然触发 org-info 业务 API。截图见 `.tmp/phase7-dev-browser/2026-05-25-production-admin-org-info-blocked.png`。2026-05-21 的 org-info 生产 admin 页面 Network 可作为历史证据参考，但本轮缺当前登录态下的完整页面 Network、控制台摘要和业务请求复采，因此不关闭 task748。

追加阻断：第二次注入采证用浏览器态后仍回到 `#/login`，仍无 org-info 业务 API Network。证据见 `.tmp/phase7-dev-browser/2026-05-25-production-admin-h5-current-blocked.md` 和截图 `.tmp/phase7-dev-browser/2026-05-25-production-admin-org-info-login-after-token-injection.png`。后续关闭 task752 需要可用登录态或其它明确允许的生产 admin H5 采证方式，不能把本轮登录页请求或 2026-05-21 历史证据升级为当前重采通过。

## 2026-05-25 task510 admin shadow-off/fallback 当前复验边界

task510 已关闭，但只代表当前代码级 admin resolver 复验完成。证据见 `.tmp/phase7-dev-browser/2026-05-25-task510-admin-shadow-fallback-current-revalidation.md`。有效复验命令运行 41 个测试文件、308 个测试通过，覆盖 shadow disabled、shadow proxy 和 direct apps/api base 三种解析状态。2026-05-16 旧本地证据只保留为 historical local evidence，不再作为本项关闭依据。

禁止误判：task510 完成不代表生产 admin H5 页面 Network、task802 退役前 fallback/shadow-off 复验、生产 `DB_READY`、真实库样本、写入读回回滚或旧服务退役。后续如果要关闭 task802，仍必须按目标 endpoint 证明关闭旧 fallback 或 shadow off 后仍命中 `apps/api`，并记录页面或 HTTP 实证。

## 2026-05-25 生产 admin H5 当前重采通过

task752 已关闭，前一段登录态阻断记录被本轮当前证据取代。有效证据见 `.tmp/phase7-dev-browser/2026-05-25-production-admin-h5-browser-evidence.md`：生产 admin H5 进入 `#/setting-manage/organize-manage/org-info` 后自然请求生产统一 API 的 `org-info/tree` 与 `org-info/list`，均为 HTTP 200，且响应头包含 `x-api-phase=phase3-infra`。本轮关键修正是按源码确认 `storageLocal()` 直接使用 `localStorage` 原始 key，并同时满足 cookie `multiple-tabs=true` 与 `user-info`，因此页面不再回到登录页。

禁止误判：本项仍只是 production/admin 页面 Network 证据。它不证明生产 Neon main `DB_READY`，不证明真实库样本全量复核，也不证明 fallback/shadow-off 全局复验、写入读回回滚、retirement ledger 或旧服务退役。此前 `.tmp/phase7-dev-browser/2026-05-25-production-admin-h5-current-blocked.md` 保留为失败尝试记录，不再代表当前 task752 状态。

## 2026-05-25 task809 三端双环境汇总边界

task809 已关闭，含义仅为本地 API、本地 admin、本地 app、生产 API、生产 admin、生产 app 六个环境单元均已有 §4A 证据记录。汇总见 `.tmp/phase7-dev-browser/2026-05-25-task809-tri-endpoint-dual-environment-evidence.md`。此前 `task754` 记录的生产 admin H5 阻断是当时状态，已由 task752 当前证据取代。

禁止误判：task809 完成不代表目录级删除门禁通过。生产 API ready 仍是 `READY_CONFIGURED`，owner 生产响应仍有 `mock 业主数据`；task720、task723、task803、task804、task805、task808 和写入闭环仍未完成。旧服务目录仍受保护，不得删除、移动、归档、重命名或清空。

## 2026-05-25 task542 无页面入口后台 endpoint 边界

task542 已按窄口径关闭。证据见 `.tmp/phase7-dev-browser/2026-05-25-task542-no-page-admin-endpoint-disposition.md`，只读复核子代理也确认可关闭。关闭含义是：task521 台账中无页面入口或无 caller 的后台 endpoint 都已有 HTTP gate、contract test、blocked 理由或 exclusion 理由，因此没有被“页面未访问”跳过。

覆盖口径：`property-company/list` 与 7 个 `contract-manage` reference list 有 manifest、contract 和生产 HTTP gate；31 个 dev/setting CUD/detail 行有 manifest、contract 和专项 adapter/repository 测试；5 个 `contract-manage/upload/*` route 保持 `blocked-pending-r2-env`；`debug-env` 和 `j1-dashboard/center/commonmenu/get` 分别保持诊断或 placeholder exclusion。

禁止误判：task542 完成不代表 task508、task540、task541、task543、task803、task804、task805 或 task808 完成。无页面处置证据不能替代 Chrome 页面 Network、真实 CRUD 页面交互、生产写入读回回滚、R2 multipart、生产 Neon main `DB_READY`、真实库样本、shadow-off/fallback、retirement candidate 清单、retirement ledger 或旧服务目录退役。

## 2026-05-25 task544 admin 退役台账边界

task544 已按 admin-only 窄口径关闭。证据见 `admin-retirement-ledger.md`：`route-inventory-details.csv.md` 第一个 CSV 区块继续作为 160 行 admin canonical endpoint 的逐 endpoint 基础身份来源，新台账用确定性 overlay 补齐 task544 要求的 old path、business path、target route、runtime manifest、caller evidence、browser/HTTP evidence、DB/write evidence、fallback/shadow-off evidence 和 retirement decision。

覆盖口径：25 行特殊 endpoint 在台账内逐行列出，包含 7 行 `cut-to-apps-api`、5 行 `contract-manage/upload/*` R2 阻断、1 行 `debug-env` 诊断排除、4 行 dev manifest 缺口、1 行 `j1-dashboard` placeholder、7 行 setting organize manifest 缺口；剩余 135 行 `available-in-apps-api-not-caller-verified` exact old path 由选择器精确匹配基础 inventory 行。全部行只允许 `keep-source`、`blocked` 或保守排除，没有任何 `delete-candidate`。

禁止误判：task544 完成不代表全局 old-service retirement candidate 清单、全局 retirement ledger、debug/test/edge/upload/guarded write 全覆盖、fallback/shadow-off 复验、生产 `DB_READY`、真实库样本、真实写入读回回滚、独立退役评审或旧服务目录删除许可。`task804`、`task805`、`task806` 和 `task809` 仍需按各自范围继续保持未完成。

## 2026-05-25 floor app 专项边界

`/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` 已按专项口径关闭。证据见 `.tmp/phase7-dev-browser/2026-05-25-task-floor-app-h5-http-and-fallback-evidence.md`。列表端点有生产 App H5 页面 Network，detail 端点没有自然页面 caller，只能使用生产 HTTP gate 的 list-to-detail 回读证据。

关键边界：`DB_*` floorId 是从 `hp_houses` 的 `communityId + buildingNo + floor` 聚合出的兼容 ID，不是真实 floor 专表主键。floor 请求命中统一 API exact registry，因此不走旧 app server fallback；但这只证明 floor 两个 endpoint 的专项 fallback 边界，不是全局退役前 shadow-off/fallback drill。

禁止误判：不得把该专项关闭写成生产 Neon main `DB_READY`、unit/room 下游外键全部完成、app legacy 全量真实库样本完成、全局 fallback/shadow-off 完成或旧 app server 可退役。

## 2026-05-25 task806-task808 全局退役清单边界

task806-task808 已按“保守清单与 ledger 字段物化”关闭。证据见 `old-service-retirement-candidates.md`。该文件以当前 fresh scan 为准，修正了早期 `route-inventory.md` 中 app legacy 21 exact / 193 fallback 的历史快照口径：当前 app 旧 runtime 仍为 214 个 unique endpoint，但 `apps/api` 已有 62 个 exact legacy handler，其中 61 个对应旧 app source，1 个是 client-only guard exact `/app/purchase/updatePurchaseApply`；剩余 `/app/**` fallback-only 为 150 个，另有 3 个 `/test/**` diagnostic。

覆盖口径：admin exact、admin apps-api-only、app exact legacy、app fallback-only、client-only gap、server-only/dynamic/diagnostic、debug/test/edge、upload/R2 和 guarded write 均已有稳定引用或精确 endpoint 清单。task807 的最低字段通过 `old-service-retirement-candidates.md` 的字段投影和 path 清单组合追溯。

禁止误判：该关闭不代表任何 `delete-candidate`。所有行仍保持 `keep-source`、`blocked` 或保守排除。生产 `DB_READY`、真实库样本、写入读回回滚、全局 fallback/shadow-off drill、旧服务引用清零、独立退役评审和旧服务目录删除许可仍未完成。

## 2026-05-25 剩余任务阻断复核

本轮阻断复核证据见 `.tmp/phase7-dev-browser/2026-05-25-remaining-blockers-ready-fallback-crud-review.md`。生产 API 当前仍是 `READY_CONFIGURED`，不是 `DB_READY`；这会阻断 task725、task728，以及所有要求生产 `DB_READY`、真实库样本、非 mock 或非 fallback 的 report/expense、dev/setting 和 contract 证据升级。

admin CUD 与页面证据仍不能关闭：dev-team config、setting system、contract change/draft-contract 当前多为 manifest、adapter 分发、repository 表意图、只读 list HTTP gate 或 resolver 证据；没有生产写入授权、写入窗口、read-back、rollback/cleanup、residual check。`contract-manage/upload/*` 的 409 是安全阻断证据，不是 R2 multipart 完成证据。

当时 task815 仍不能关闭。2026-05-25 的状态是：`legacy-dispatch` 逻辑虽是 registry exact 先于 fallback，但缺一个专门的 runtime drill 来证明旧 fallback 不可用时 exact handler 仍成功、未注册 `/app/**` endpoint 才进入 fallback 或失败。后续 2026-05-26 已补 runtime fallback-off 与 App production shadow-disabled 窄口径证据并关闭 task815；该历史阻断仍不能替代 admin shadow-off、全局退役前复验或旧服务目录退役结论。

停止边界：用户目标已有八小时停止条件，且当前不允许 git commit/push，所以无法通过推送触发生产重新部署来打开 `RUN_PHASE7_DB_READINESS_CHECK=1` 并完成生产 `DB_READY`。在用户介入生产 env/deploy、授权可控写入窗口和 R2 前置条件前，不得把剩余 open task 强行勾选。

## 2026-05-26 接力授权后的风险边界

本轮用户已授权生产 DB readiness env、CUD 写入窗口和 task815 fallback/shadow-off drill，但授权变化不等于验证完成。后续证据不得记录真实连接串、token、cookie、secret、完整账号凭据或可复用生产写入 payload；`DB_READY` 证据仍只能记录 env 名、脱敏 host、连接类型、required tables、migration count、ready code 和响应摘要。

禁止误判：`READY_CONFIGURED` 不等于 `DB_READY`，HTTP 200、生产已部署、env 已配置或 `RUN_PHASE7_DB_READINESS_CHECK=1` 已允许配置，都不能替代 `/__nitro/ready` 返回 `DB_READY` 的实证。task309 只有在使用 main 分支连接串且受控 env 生效后，生产 ready 响应明确为 `DB_READY`，才允许进入完成判断。

写入口边界：任何 CUD 写入口必须逐 endpoint 记录 guard-before、controlled write、read-back、rollback/cleanup、residual check 和 guard-after；任一环节失败时，同批后续写入必须停止，并保持 blocked 或 partial。费用、支付、开门、维修流转、业主资料、审批流等高风险对象仍不得因为用户授权而跳过可清理哨兵数据、回滚方案和残留检查。

真实库样本边界：task312 不能用空数组、mock、compat 默认值、fallback response 或页面非空列表替代。只读 endpoint 必须证明 repository 读取到真实业务表，并完成字段映射；证据应能区分生产 API 可达、生产页面 Network、真实 DB 样本和 legacy fallback。

fallback/shadow-off 边界：task344 不能用纯 Vitest、task510 的 admin resolver 测试、floor 专项边界、旧本地证据或全局 ledger 物化替代。退役前 drill 必须按目标 endpoint 证明关闭旧 fallback 或 shadow off 后仍命中 `apps/api`，并提供生产或页面级证据；只有旧本地证据时必须标记 stale 或重采。

## 2026-05-26 Neon 真实库验收与 CUD 规范补齐

本轮用户指出主代理已经完成生产 Neon DB_READY、真实库样本和生产 CUD 窄口径测试，但 OpenSpec spec 中缺“Neon 数据库测试流程操作规范”和“唯一的 Neon 数据库测试方式”。编辑子代理 F 只补规范和证据摘要，不改运行时代码，不读取或输出 secret，不执行 git commit/push。

唯一验收方式：Neon 真实库验收只能通过生产或受控 Vercel `apps/api` runtime 的公开 HTTP endpoint，使用 Neon main 分支连接串并通过受控 env 注入；必须先确认 `RUN_PHASE7_DB_READINESS_CHECK=1` 生效，且 `/__nitro/ready` 明确返回 `DB_READY`。Neon 测试分支、local fake DB、in-memory fallback、直接 DB 脚本、`psql`、Drizzle 临时脚本、未部署本地连接、import handler/service/repository、`READY_CONFIGURED`、HTTP 200 或 Vitest mock 都不能替代，也不能关闭 `DB_READY`、真实库样本、写入闭环或退役门禁。

本轮生产事实见 `.tmp/phase7-dev-browser/2026-05-26-neon-main-db-ready-cud-evidence.md`：API 项目 `11comm-nitro-server` 已配置 `RUN_PHASE7_DB_READINESS_CHECK=1` 并 redeploy；生产 `/__nitro/ready` 返回 `DB_READY`，required tables 为 `cm_communities`、`ex_expense_items`、`ex_house_charges`、`hp_houses`、`rpt_expense_summaries`、`rpt_payment_details`，migrations 为 `2/2`。只读样本包括 `report expense summary` 读取 `rpt_expense_summaries`、`org-info list` 读取 setting repository、`floor list` 读取 `hp_houses` 聚合。该事实不得泄漏连接串、token、cookie、secret 或可复用凭据。

CUD 规范边界：生产 CUD 只能选择低风险、可构造哨兵、可 read-back、可 rollback/cleanup、可 residual check 的 endpoint，并且只能通过公开 `apps/api` HTTP endpoint 触发业务 handler。禁止直接写数据库、直接调用 handler/service/repository、import 运行时代码、运行一次性 DB 脚本或绕过公开 HTTP 路径改数据。费用、支付、开门、维修流转、业主资料、审批流等破坏性业务对象继续默认禁止作为生产 CUD 测试对象；任一步失败时必须立即停止同批后续写入，优先清理和查残留。证据只允许保留 request id、HTTP 状态码和脱敏响应摘要，不得保留 token、cookie、secret、完整账号凭据、真实连接串或可复用生产 payload。

本轮 CUD 窄口径事实：`/api/dev-team/config-manage/center/*` 通过公开生产 `apps/api` HTTP endpoint 写入 `dt_configs`，runId 为 `phase7-e2e-20260526010206-f1ae4a0b`；baseline list total 为 0，create/read/update/read/delete 成功，delete 后 detail 返回 404，residual total 为 0。该低风险配置 endpoint 没有单独 mutation guard，本轮证据必须记录为 `guard-not-applicable`，不得把 baseline total 0 写成高风险 guard 生效。该证据只能支持 `dev-team/config-manage/center` 低风险哨兵写入闭环，不得外推到费用、支付、开门、维修流转、业主资料、审批流、R2 multipart、全局 fallback/shadow-off 或旧服务退役。

任务状态边界：本轮只基于既有生产证据关闭 task309 与 task312，不把全量剩余项全部勾选。task309 的关闭含义是生产公开 HTTP `/__nitro/ready` 已返回 `DB_READY`，并记录 required tables 与 migration count；task312 的关闭含义是三个关键只读样本能证明真实业务表或 repository 读取、非空响应和字段映射。task344、R2 multipart、其它真实 CUD 页面交互、retirement candidate、retirement ledger 和旧服务目录删除许可仍不得因本轮关闭自动完成。

## 2026-05-26 task309 与 task312 关闭边界

关闭依据：只读取 `.tmp/phase7-dev-browser/2026-05-26-neon-main-db-ready-cud-evidence.md` 及 OpenSpec canonical 文件，未发起新的生产请求、未写入生产、未读取或输出 secret。该证据显示 API 项目 `11comm-nitro-server` 已配置 `RUN_PHASE7_DB_READINESS_CHECK=1` 并 redeploy，生产 `/__nitro/ready` 返回 `DB_READY`，required tables 覆盖 `cm_communities`、`ex_expense_items`、`ex_house_charges`、`hp_houses`、`rpt_expense_summaries`、`rpt_payment_details`，migrations 为 `2/2`。

真实库样本边界：task312 只按关键样本关闭，样本包括 `report expense summary` 读取 `rpt_expense_summaries`、`org-info list` 读取 setting repository、`floor list` 读取 `hp_houses` 聚合；这些样本均记录 HTTP 200、非空数量和字段摘要。该关闭不能外推为所有 admin/app 只读 endpoint 均已通过真实库样本，也不能替代页面级 Network、fallback/shadow-off drill 或退役评审。

CUD 证据边界：同一 artifact 中的 CUD 证据只支持 `/api/dev-team/config-manage/center/*` 到 `dt_configs` 的低风险哨兵闭环，runId 为 `phase7-e2e-20260526010206-f1ae4a0b`，且 guard 状态应记录为 `guard-not-applicable`。该证据不得外推到费用、支付、开门、维修流转、业主资料、审批流、R2 multipart、全局 fallback/shadow-off 或旧服务目录退役。

## 2026-05-26 center 前端 caller 收口边界

关闭依据：本轮只修改 center 前端 API、页面、弹窗、表单默认值、窄口径测试和 OpenSpec 记录，不访问生产、不 commit/push、不修改 task344。`apps/admin/src/api/dev-team/config-manage/center/index.ts` 已让 list/detail/create/update/delete 全部走 `resolveAdminApiRequestUrl`；页面 detail/copy/toggle/delete 和 add/edit/copy 弹窗提交已接真实 caller 并刷新列表；info 模式显式不提交。

探索反馈处理：`page-api-wiring.test.ts` 已改为正则匹配多行 `openDialog` 对象，避免依赖单行字符串；页面不再给 `mapDetailToListItem` 注入不存在的 `creator` 字段，展示列改为 `createdBy`；`components/form.ts` 的 `defaultForm.configType` 已改为选项值 `system`；ReDialog 继续使用 `hideFooter`，没有新增不确定的 `show` 字段。

保留风险：该关闭只覆盖 `dev-team/config-manage/center` 前端 caller 与既有生产 `dt_configs` 低风险哨兵 CUD 闭环。task344 fallback/shadow-off drill、R2 multipart、其它生产 CUD、生产 admin H5 全局页面 Network、retirement ledger、旧服务目录退役和删除许可仍不得由本轮外推关闭。

## 2026-05-26 center diff 与 task309/task312 归因修正

本轮复核意见修复确认：前一轮复核代理把 task309/task312 关闭误归因到 center diff，这是错误归因。实际 task309/task312 是上一轮 Neon main `/__nitro/ready` 返回 `DB_READY`、真实库只读样本与受控 HTTP 证据检查点关闭；center diff 只支持 `dev-team/config-manage/center` 的前端 caller 与低风险 `dt_configs` 哨兵 CUD 边界。本轮 center 只新增并关闭 center task470，不关闭 task344；剩余 open list 仍包含 task344 fallback/shadow-off drill、R2 multipart、其它真实 CUD 页面交互、retirement ledger 与旧服务目录退役等后续项。
