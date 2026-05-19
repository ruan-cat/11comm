## Task Source Rules

- [x] 本文件是 `migrate-superpowers-docs-to-openspec-longtask` 的唯一可执行任务源。
- [x] 旧三文档只作为迁移来源和核对材料，不再作为后续执行 checklist。
- [x] `agent-progress.md` 只记录 checkpoint、验证命令和证据路径。
- [x] `agent-findings.md` 只记录风险、冲突、失败路径和禁止误判。
- [x] 每次状态变更后必须更新 `agent-progress.md`，并写入 Memorix。
- [x] 任一任务没有验证证据时不得勾选完成。
- [x] 临时来源审计已完成并迁入 canonical 文件；后续可执行任务、风险说明、接力 checkpoint 和规范要求必须落入 `tasks.md`、`agent-findings.md`、`agent-progress.md`、`design.md` 或 `specs/**`，不得维护第四份来源覆盖矩阵。

## 0. Carrier Migration Completed

- [x] [新增] `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md` - 初始化 do-long-task 进度文件。
- [x] [新增] `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md` - 初始化发现文件。
- [x] [新增] `docs/superpowers/phase7-openspec-migration-index.md` - 创建稳定 OpenSpec 入口索引。
- [x] [审计] 完成一次性来源覆盖审计 - 已核对旧三文档当前章节、git 历史、Memorix 编号和证据 artifact，并将长期价值内容迁入 canonical 文件。
- [x] [新增] `specs/unified-nitro-api-consolidation/spec.md` - 补回 admin/app 两套旧 Nitro API 责任合并到独立 `apps/api` 的总体目标。
- [x] [修改] `proposal.md`、`design.md`、`specs/**/spec.md` - 迁移 Phase7 证据模型、统一 Nitro 主线、no-go 约束和旧服务保护路径。
- [x] [新增/修改] `specs/app-legacy-cutover/spec.md`、`specs/db-readiness-and-write-verification/spec.md`、`specs/vitest-and-runtime-verification/spec.md` - 补齐 app Nitro 迁移实现规范、Neon/Drizzle 使用规范和 Vitest 触发/写法/验证边界。
- [x] [新增] `specs/browser-and-environment-verification/spec.md` - 补齐 Chrome DevTools MCP 三端双环境验收矩阵：本地 `apps/api`/`apps/admin`/`apps/app` 三个 dev 服务和三个 package `homepage` 指向的生产入口。
- [x] [新增] `specs/agent-team-batch-execution/spec.md` - 补齐旧计划中的 Agent Team 分工、batch 0-8 调度语义、每批固定流程和独立复核要求。
- [x] [新增] `specs/source-history-and-memory-governance/spec.md` - 补齐旧三文档来源覆盖、git 历史溯源、Memorix、文档/skills/AI 记忆治理和证据 artifact 索引要求。
- [x] [记录] Memorix - 已记录 `#4405 OpenSpec restored unified Nitro mainline`。

## 0A. Source History Re-Audit And Coverage Matrix

- [x] [探索] 搜索 Memorix：Phase7、OpenSpec、Nitro 合并、DB_READY、Chrome MCP、App repair、旧 Superpowers 文档迁移。
- [x] [探索] 使用子代理独立审计三份旧文档当前内容、OpenSpec 覆盖情况、Memorix 接力记录和三文件 git history。
- [x] [探索] 运行 `git log --follow --numstat` 覆盖三份旧文档，记录关键提交、日期、增删规模和迁移意义。
- [x] [审计] 完成旧文档章节覆盖、legacy batch equivalence、git history provenance、Memorix index 和 artifact index 的一次性核对。
- [x] [修改] `agent-findings.md` - 写入来源覆盖、git 历史、Memorix、CDP fallback、旧文档恢复状态和仍不可删除结论。
- [x] [修改] `agent-progress.md` - 修正“旧三文档已删除”的陈旧表述，记录用户已恢复旧文档且当前仅作为迁移来源。

## 1. Baseline Reconciliation

- [x] [探索] 重新扫描当前 working tree：`apps/api/server/routes/api/**/*.ts`、`apps/admin/server/api/**/*.ts`、`apps/app/server/modules/**/endpoints.ts`、`apps/api/server/shared/runtime/runtime-endpoints.ts`。
- [x] [探索] 重新扫描调用端：`apps/admin/src/**/*.{ts,vue}` 中 `/api/**` 调用，`apps/app/src/**/*.{ts,vue}` 中 `/app/**` 与 `/callComponent/**` 调用。
- [x] [修改] `agent-findings.md` - 记录旧矩阵内的冲突口径：前文写 admin old path exact coverage 155/155，末尾仍残留“未覆盖约 51 个”的旧说法；以后必须以 fresh scan 为准。
- [x] [修改] `agent-progress.md` - 记录用户已手动恢复三份旧 Superpowers 文档；旧文档存在不代表恢复为任务源。
- [x] [校验] 运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`，确认本 backlog 格式有效。

## 1A. Spec-To-Task Traceability And Task Source Hygiene

- [x] [修改] `tasks.md` - 补齐 spec-to-task 覆盖、统一 `apps/api` runtime 对账、调用端证据、Vitest/HTTP/Neon/Chrome MCP 证据矩阵和退役门禁任务层，避免只剩 endpoint 数量块。
- [ ] [复核] 对 `specs/**/spec.md` 每个 `### Requirement` 建立任务落点复核：`unified-nitro-api-consolidation` 必须落到 §1B/§2/§3/§4/§5，`admin-api-cutover` 必须落到 §2/§2A，`app-legacy-cutover` 必须落到 §3/§3A，`agent-team-batch-execution` 必须落到 §1C，`vitest-and-runtime-verification` 必须落到 §4B，`db-readiness-and-write-verification` 必须落到 §4/§4C，`browser-and-environment-verification` 必须落到 §4A，`retirement-gate-and-archive` 必须落到 §5/§6。
- [x] [复核] 取消临时来源覆盖审计文件的长期维护要求；每次新增、删除或合并 endpoint 任务行后，只核对 `tasks.md`、相关 specs、`design.md` 与 `agent-findings.md`。
- [ ] [复核] `agent-progress.md` 只能记录 checkpoint、命令、结果和证据路径；不得新增未完成 checkbox、不得成为 Nitro 迁移任务源。
- [ ] [复核] `agent-findings.md` 只能记录风险、冲突、失败路径、禁止误判和不迁移理由；不得承载可执行任务清单。
- [ ] [复核] 若 `tasks.md` 中仍出现“剩余模块”“数量块”“压缩桶”表述，必须同时写明 endpoint 级展开位置、fresh scan 命令和不能展开的原因。
- [x] [复核] 删除临时来源覆盖审计文件前，已逐项确认旧三文档覆盖信息被 canonical 文件消化：可执行项进入 `tasks.md`，风险/禁止误判进入 `agent-findings.md`，接力状态进入 `agent-progress.md`，架构/验收规则进入 `design.md` 或 `specs/**`。
- [ ] [记录] 每轮继续本 change 前先检索 Memorix 中 Phase7、Nitro 合并、DB_READY、Chrome MCP、旧三文档迁移和当前切片关键词；如本会话没有 Memorix MCP，必须在 `agent-findings.md` 记录环境缺口。
- [ ] [记录] 每轮状态变更完成后写入 Memorix，摘要必须包含变更文件、任务源变化、验证命令和剩余阻断项；不得把未执行的 endpoint 迁移写成已完成。

## 1B. Unified `apps/api` Runtime Traceability

- [ ] [探索] 建立当前 `apps/api` route inventory：扫描 `apps/api/server/routes/api/**/*.ts`、runtime manifest、legacy dispatch、admin adapter 和 app legacy adapter，记录 route 文件、runtime key、legacy path、canonical path、method 和 owner module 的一一对应关系。
- [ ] [探索] 对所有已迁入或待迁入业务域复核模块分层：`types`、`repository`、`service`、`runtime`、`admin-adapter`、`legacy-adapter`、`index` 缺一项时必须记录缺口；handler 不得直接堆业务查询、DTO 拼装和兼容逻辑。
- [ ] [验证] 所有新增或修改的 Nitro/H3 handler 必须从 `nitro/h3` 导入 H3 API，禁止直接从 `h3` 导入；禁止新增 JWT、Token、Neon Auth 或任意鉴权中间件。
- [ ] [验证] 数据库连接只能从 Nitro 事件上下文或项目既有 DB helper 获取，不得在模块顶层创建 Neon/Drizzle 连接。
- [ ] [验证] admin canonical contract 与 app legacy contract 必须分开：同一业务同时服务 admin 和 app 时，允许共用 service/repository，但不得用 admin DTO 覆盖 app 旧响应 envelope。
- [ ] [验证] 每个 DB-backed endpoint 必须指向 `apps/type/src/business/**/schema.ts` 的 Drizzle table、Zod schema 和 TypeScript 类型；若 schema 缺失，保持 `schema-missing` 或 `schema-exists-not-wired`，不得写成 DB 完成。
- [ ] [验证] 每个 status 升级必须同时填写或引用 `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision`；缺字段时不得勾选完成。
- [ ] [复核] `apps/api` health/ready、runtime manifest、contract tests、HTTP gate 和 browser/API evidence 必须互相一致；route 存在但 runtime manifest 缺失时不得升级为 old path exact covered。

## 1C. Batch Execution Control And Agent Handoff

- [ ] [调度] 后续每个实施批次必须先声明 batch 目标、涉及 endpoint、owner 文件、预期测试、DB/浏览器/生产证据需求和不触碰范围；不得一次性吞掉整域。
- [ ] [调度] admin 批次按三级业务路径拆分，每个编辑子代理只负责 2-3 个 endpoint 或一个小子模块；app legacy 批次每次只处理 2-3 个 endpoint 或一个小模块。
- [ ] [调度] 每个批次至少有探索、编辑、复核三类角色；复核角色必须独立检查 source coverage、任务勾选、测试命令、证据文件和禁止误判。
- [ ] [记录] 子代理输出只能作为临时报告或证据来源；有效事实必须合并回 `tasks.md`、`agent-progress.md`、`agent-findings.md` 或 specs 后才可用于接力。
- [ ] [复核] 若复核发现任务缺漏、证据不足、状态越权升级或旧服务退役误判，必须退回对应 endpoint 或新建后续编辑切片，不能用总结文字覆盖缺口。
- [ ] [校验] 每个批次结束前至少运行与本批相关的 OpenSpec strict 校验、包级测试/typecheck、`git diff --check` 或记录不可运行原因；失败不得勾选完成。

## 2. Admin Legacy Nitro Stream

### 2.1 Next Slice: `property-manage/contract-manage` 12 Normal List Endpoints

- [ ] [探索] 对照 `rank-route-keys.ts`、旧 `apps/admin/server/api/property-manage/contract-manage/**`、现有 `apps/api` route、admin hook 和 runtime manifest，确认 12 个普通 list endpoint 的当前覆盖状态。
- [ ] [实施] `archive/list`、`attachment/list`、`clause/list` - 补 runtime manifest、contract test、HTTP gate 或明确阻断原因；不纳入 upload/R2、write、delete、detail。
- [ ] [实施] `change/list`、`draft-contract/list`、`expire/list` - 补 runtime manifest、contract test、HTTP gate 或明确阻断原因；不纳入 change/draft-contract 的 CUD/detail。
- [ ] [实施] `first-party/list`、`print/list`、`review/list` - 补 runtime manifest、contract test、HTTP gate 或明确阻断原因。
- [ ] [实施] `second-party/list`、`template/list`、`type/list` - 补 runtime manifest、contract test、HTTP gate 或明确阻断原因。
- [ ] [校验] 运行目标 API Vitest、runtime manifest/contract tests、fetch 型 gated HTTP test、`pnpm -F @01s-11comm/api run typecheck` 和 `git diff --check`。
- [ ] [记录] 更新 `agent-progress.md` 与 Memorix，明确该切片只代表本地 manifest/contract/HTTP gate，不代表生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 CRUD/交互或旧服务退役。

### 2.2 Admin Evidence Backlog

- [x] [修改] 将 `expense-summary`、`report-manage`、`dev-team/config-manage`、`setting-manage/system-manage` 从旧文档数量块补成当前 `tasks.md` 显式任务行；旧数量口径只作为历史证据，不再作为可执行清单本身。
- [ ] [复核] 先统一 admin 数量口径：`dev-team/config-manage` 旧文档“16”指四个子模块的 CRUD 方法，当前 legacy 文件树为 20 个文件；`setting-manage/system-manage` 旧文档“15”指五个子模块的 CUD 方法，当前 legacy 文件树为 20 个文件；`property-manage/expense-manage` 旧 runtime/HTTP gate 口径为 14 个 Phase7 list，当前 legacy list 文件为 16 个；`property-manage/report-manage` 旧 runtime/HTTP gate 口径为 12 个 Phase7 list，当前 legacy list 文件为 13 个。执行时必须在 `agent-progress.md` 写明采用哪一种口径。
- [ ] [验证] `property-manage/report-manage/expense-summary-table/list` - 保持独立 report 语义链路，确认读取 `rptExpenseSummaries` / `listReportExpenseSummaryTables`，不得 alias 到 `expense-manage/expense-summary-table/list` 或 `exExpenseSummaryTables`；补生产 `DB_READY`、真实库样本、shadow-off/fallback 和退役前证据。
- [ ] [验证] `property-manage/report-manage` P1 四端点：`owner-payment-details/list`、`repair-report-form/list`、`repair-reports-summary-table/list`、`statement-expenses/list` - 复核本地语义 Vitest 与页面 Network 仍有效，并继续补生产 `DB_READY`、真实库样本、shadow-off/fallback；不得把 fake DB 语义测试写成真实库完成。
- [ ] [验证] `property-manage/report-manage` 剩余七页：`arrears-details-list/list`、`data-statistics/list`、`deposit-report/list`、`fee-reminder/list`、`no-charge-house/list`、`outstanding-fees-analysis/list`、`patrol-report/list` - 复核 2026-05-18 本地页面 Network 证据，补生产环境、真实库样本和 fallback evidence。
- [ ] [验证] `property-manage/report-manage/payment-details-form/list` - 作为当前 legacy 文件树中的第 13 个 report-manage list 单独复核；确认其 phase、manifest/contract/HTTP gate 归属和是否已由历史 `fee-admin-endpoints` 覆盖，不能被 12 个 Phase7 list 口径漏掉。
- [ ] [验证] `property-manage/expense-manage` Phase7 14 个 list：`cancel-fee/list`、`contracte-charge/list`、`discount-apply/list`、`discount-setting/list`、`discount-type/list`、`expense-summary-table/list`、`meter-reading-type/list`、`overdue-payment-information/list`、`payment-review/list`、`refund-review/list`、`reminder-for-overdue-payments/list`、`reprint-voucher/list`、`vehicle-charge/list`、`water-and-electricity-meter-reading/list` - 复核 runtime manifest/contract/HTTP gate、页面 Network、生产 `DB_READY`、真实库样本和 fallback evidence。
- [ ] [验证] `property-manage/expense-manage/expense-summary-table/list` - 与 report-manage 同名路径分开记录证据；确认页面、hook、ownerModule、数据表和响应字段语义不与 report-manage 混用。
- [ ] [验证] `property-manage/expense-manage/house-charge/list` 与 `property-manage/expense-manage/expense-item-setting/list` - 作为当前 legacy 文件树中不在 Phase7 14 个 list 内的两个 list 单独复核；确认它们的 phase5a/历史覆盖、detail/create/update/delete 关联和退役证据状态。
- [ ] [验证] `dev-team/config-manage/center/{list,create,detail,update,delete}` - 区分 list 页面证据、detail GET 证据和 create/update/delete 真实 Drizzle DB CRUD 证据；补真实页面交互或明确无独立页面入口原因。
- [ ] [验证] `dev-team/config-manage/dictionary/{list,create,detail,update,delete}` - 区分 list 页面证据、detail GET 证据和 create/update/delete 真实 Drizzle DB CRUD 证据；复核有子项时外键约束阻止删除的证据。
- [ ] [验证] `dev-team/config-manage/item/{list,create,detail,update,delete}` - 区分 list 页面证据、detail GET 证据和 create/update/delete 真实 Drizzle DB CRUD 证据；补生产 `DB_READY` 与真实库样本。
- [ ] [验证] `dev-team/config-manage/type/{list,create,detail,update,delete}` - 区分 list 页面证据、detail GET 证据和 create/update/delete 真实 Drizzle DB CRUD 证据；不得把旧“16 个 CRUD 方法”误写成 20 个文件全完成。
- [ ] [验证] `setting-manage/system-manage/change-password/{list,create,update,delete}` - list 与 CUD 分开验收；CUD 已接 `smChangePasswordRecords` 的历史事实仍需生产 `DB_READY`、真实库样本、页面交互或 HTTP gate 证据。
- [ ] [验证] `setting-manage/system-manage/community-configuration/{list,create,update,delete}` - list 与 CUD 分开验收；CUD 已接 `smCommunityConfigurations` 的历史事实仍需补生产和退役前证据。
- [ ] [验证] `setting-manage/system-manage/initialize-cell/{list,create,update,delete}` - list 与 CUD 分开验收；CUD 已接 `smInitializeCells` 的历史事实仍需补生产和退役前证据。
- [ ] [验证] `setting-manage/system-manage/register-protocol/{list,create,update,delete}` - list 与 CUD 分开验收；CUD 已接 `smRegisterProtocols` 的历史事实仍需补生产和退役前证据。
- [ ] [验证] `setting-manage/system-manage/system-config/{list,create,update,delete}` - list 与 CUD 分开验收；CUD 已接 `smSystemConfigs` 的历史事实仍需补生产和退役前证据；不得把旧“15 个 CUD 方法”误写成 20 个文件全完成。
- [ ] [验证] `property-manage/contract-manage/change/{create,detail,update,delete}` 与 `property-manage/contract-manage/draft-contract/{create,detail,update,delete}` - 复核 8 个 CRUD/DB 证据、HTTP gate、真实页面交互和 rollback 证据；继续与 2.1 的普通 list 切片隔离。
- [ ] [验证] `property-manage/contract-manage/upload/{init,sign-part,complete,abort,status}` - 继续保持 R2 阻断前置项；没有 R2 env、AWS SDK 依赖、upload session 表和前端断点续传闭环前，不得写成完成。
- [ ] [验证] 边缘 route：`org-info/tree`、`j1-dashboard/center/commonmenu/get`、`debug-env.get` - 分别判断是否迁入 `apps/api`、保留旧服务或排除退役候选；每一项都要有 HTTP gate/contract 或明确的不迁移理由。
- [ ] [验证] 对有页面入口的 admin route 采集 Chrome DevTools MCP 页面 Network；无独立页面入口的 route 必须补 HTTP gate 或 contract evidence，并在 `agent-progress.md` 说明原因。
- [ ] [验证] 对真实 CRUD 交互补页面级证据：在 list 页面触发新增、编辑、删除或详情弹窗，不能只用直接 HTTP gate 代替页面交互。
- [ ] [验证] 对 admin shadow-off/fallback 做当前环境复验；若只存在本地 2026-05-16 旧证据，应标记为历史证据并评估是否需要重采。
- [ ] [复核] 确认 admin 前端 resolver 迁移仍为完成状态；如 fresh scan 发现新的硬编码 `/api/**`，记录为 Phase7 regression。

### 2.3 Admin DB / R2 / Edge Decisions

- [ ] [探索] 对 contract upload 5 个 route 做 R2 前置复核：`@aws-sdk/client-s3`、`@aws-sdk/s3-request-presigner` 依赖、R2 env、`ctUploadSessions` 和 `ctUploadSessionParts` 表、前端断点续传 hook。
- [ ] [决策] 在 R2 env 和表结构确认前，contract upload 保持 `blocked-pending-r2-env`，不得把 mock/in-memory response 写成完成。
- [ ] [探索] 复核 `debug-env.get.ts`、`j1-dashboard/center/commonmenu/get.ts`、`org-info/tree.post.ts` 是否应迁入统一 `apps/api`、保留旧服务、或标记为不参与退役候选。

## 2A. Admin Caller, Business Path, And Retirement Ledger

- [ ] [探索] 扫描 `apps/admin/src/api/**/index.ts`、`apps/admin/src/**/*.{ts,vue}`、`apps/admin/src/router/rank/rank-route-keys.ts`，为每个 admin legacy endpoint 建立业务路径、前端 hook、页面入口和 old `/api/**` 调用端证据。
- [ ] [复核] admin resolver 完成态必须 fresh scan：确认 `resolveAdminApiRequestUrl` 或当前 resolver 仍覆盖目标 hooks；发现硬编码旧 `/api/**` 时记录 Phase7 regression 并新增 endpoint 任务。
- [ ] [复核] 对 `rank-route-keys.ts` 无法匹配的 endpoint，先分类为 edge/debug/shared/system，不得凭空创建业务路径；必要时写入 `agent-findings.md` 的“不迁移或待决策原因”。
- [ ] [验证] 每个有页面入口的 admin list endpoint 必须补 Chrome MCP 页面 Network；页面证据要包含业务路由、触发动作、Network URL、method、status、响应摘要、console 摘要和是否命中 `apps/api`。
- [ ] [验证] 每个 admin detail/create/update/delete endpoint 必须分开验收：detail 需要真实读取或明确拼装来源，create/update/delete 需要 DB 写入、read-back、rollback/cleanup、residual check 或保持 blocked。
- [ ] [验证] 无页面入口的 admin endpoint 不得用“页面未访问”跳过；必须补 HTTP gate、contract test 或明确保留旧服务/排除退役候选理由。
- [ ] [汇总] admin retirement candidate 行必须逐 endpoint 记录：old path、business path、target route、runtime manifest、caller evidence、browser/HTTP evidence、DB/write evidence、fallback/shadow-off evidence、retirement decision。
- [ ] [复核] admin old path exact coverage、resolver 完成、HTTP gate 通过、页面 list 成功均不能单独触发 `apps/admin/server` 删除候选；必须等待 §5 退役门禁。

## 3. App Legacy Nitro Stream

### 3.1 `/callComponent/**` And Floor Follow-Up

- [ ] [探索] `/callComponent/core/list` - 复核 repair 与 property-application 两类调用语义、`name/type/domain` 参数、旧服务数据源和 `apps/api` compat handler。
- [ ] [实施] `/callComponent/core/list` - 若可迁移，补 canonical service/repository 或明确保留 fallback；如果仍为 in-memory compat，必须保持 `legacy-fallback` 或 `candidate-after-evidence`，不得写 DB 完成。
- [ ] [验证] `/callComponent/core/list` - 用 App H5 页面或 HTTP gate 证明命中 `apps/api`，并记录是否仍依赖 fallback。
- [ ] [验证] `/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` - 补 App H5 页面 Network、真实库样本复核和 shadow-off/fallback evidence；合成 `floorId` 不得误写为真实 floor 主键。

### 3.2 Repair Legacy Follow-Up

- [ ] [验证] `/app/repairSetting.listRepairSettings` - 补 App H5 页面 Network 或明确无页面入口原因。
- [ ] [验证] `/app/ownerRepair.listOwnerRepairs`、`/app/dict.queryRepairStates`、`/app/ownerRepair.queryOwnerRepair` - 复核 2026-05-18 页面证据是否仍有效；如需 MCP 工具级证据，重采。
- [ ] [实施] `/app/ownerRepair.saveOwnerRepair` - 默认保持 `409 PHASE7_MUTATION_GUARDED`；只有具备测试数据、read-back、rollback、residual check、guard restored 时才允许受控写入。
- [ ] [实施] `/callComponent/ownerRepair.appraiseRepair` - 默认保持 guarded；评价写入不得用 in-memory 演练替代真实写入闭环。

### 3.3 Fee / Report Legacy Follow-Up

- [ ] [探索] `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` - 先补 join 来源、字段语义和兼容 DTO 设计，不得直接做不可信 DB wiring。
- [ ] [验证] `/app/feeConfig.listFeeConfigs`、`/app/reportFeeMonthStatistics.queryReportFeeSummary`、`/app/reportFeeMonthStatistics/queryPayFeeDetail`、`/app/dataReport.queryFeeDataReport` - 补 App 页面或 HTTP gate、真实库样本、shadow-off/fallback evidence。
- [ ] [探索] `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` - 确认房间维度报表数据源；没有明确来源前保持 `schema-exists-not-wired` 或 `unknown-needs-triage`。

### 3.4 App Guarded Writes

- [ ] [验证] 默认 guard：`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee` 必须继续返回 `409 PHASE7_MUTATION_GUARDED`。
- [ ] [设计] 如需开启写入窗口，先定义 `PHASE7_E2E_*` / `phase7RunId`、测试数据、业务允许范围、read-back、rollback/cleanup、residual check、guard restored。
- [ ] [执行] 未取得明确授权与回滚方案前，不得对支付、催缴、费用创建执行真实生产写入。

### 3.5 Remaining App Modules

- [x] [修改] 将 app remaining modules 从压缩桶补成当前 `apps/app/server/modules/**/endpoints.ts` 的显式 URL 台账；下面每一行 URL 都是待归类 endpoint，执行时不得只按模块桶结算。
- [ ] [探索] `activity` 9 个 endpoint：`/app/activities.listActivitiess`、`/app/activities.saveActivities`、`/app/activities.updateActivities`、`/app/activities.deleteActivities`、`/app/activities.increaseView`、`/app/activities.likeActivity`、`/app/activities.updateStatus`、`/app/activities.updateLike`、`/app/activities.updateCollect`；逐项区分只读、计数/点赞写、状态写和 guard 策略。
- [ ] [探索] `appointment` 2 个 endpoint：`/app/communitySpace.listCommunitySpaceConfirmOrder`、`/app/communitySpace.saveCommunitySpaceConfirmOrder`；补页面入口、写入 guard、DB 来源和 rollback 设计。
- [ ] [探索] `complaint` 7 个 endpoint：`/app/auditUser.listAuditComplaints`、`/app/auditUser.listAuditHistoryComplaints`、`/app/complaint`、`/app/complaint.auditComplaint`、`/app/complaint.listComplaintEvent`、`/app/complaintAppraise.listComplaintAppraise`、`/app/complaintAppraise.replyComplaintAppraise`；区分创建/审核/回复写入与只读列表。
- [ ] [探索] `contact` 8 个 endpoint：`/app/contact.listContacts`、`/app/contact.getContactDetail`、`/app/contact.getContactsByDepartment`、`/app/contact.searchContacts`、`/app/contact.getDepartments`、`/app/contact.updateOnlineStatus`、`/app/contact.getFavoriteContacts`、`/app/contact.getEmergencyContacts`；server-only 不能因当前客户端未命中而删除。
- [ ] [探索] `coupon` 7 个 endpoint：`/app/couponProperty.listCouponPropertyUserDetail`、`/app/couponProperty.writeOffCouponPropertyUser`、`/app/integral.listIntegralSetting`、`/app/integral.useIntegral`、`/app/integral.listIntegralUserDetail`、`/app/reserveOrder.listReserveGoodsConfirmOrder`、`/app/reserveOrder.saveReserveGoodsConfirmOrder`；核对核销、积分消耗和预约确认写入的 guard/read-back/rollback。
- [ ] [探索] `inspection` 7 个 endpoint：`/app/inspection.listInspectionTasks`、`/app/inspection.getTodayReport`、`/app/inspection.listInspectionTaskDetails`、`/app/inspection.listInspectionItemTitles`、`/app/inspection.submitInspection`、`/app/staff.listStaffs`、`/app/inspection.transferTask`；提交和转派写入必须独立 guard。
- [ ] [探索] `item-release` 6 个 endpoint：`/app/itemRelease.queryUndoItemReleaseV2`、`/app/itemRelease.queryFinishItemReleaseV2`、`/app/itemRelease.getItemRelease`、`/app/itemRelease.getItemReleaseRes`、`/app/itemRelease.queryOaWorkflowUser`、`/app/itemRelease.auditItemRelease`；同时核对 client-only gap 中的非 V2 `/app/itemRelease.queryFinishItemRelease`。
- [ ] [探索] `maintenance` 7 个 endpoint：`/app/maintenance.listMaintenanceTasks`、`/app/maintenance.queryMaintenanceTask`、`/app/maintenance.listMaintenanceTaskDetails`、`/app/maintenance.startMaintenanceTask`、`/app/maintenance.completeMaintenanceTask`、`/app/maintenance.submitMaintenanceSingle`、`/app/maintenance.transferMaintenanceTask`；开始、完成、提交、转派均按写入闭环处理。
- [ ] [探索] `meter` 10 个 endpoint：`/app/meter.listMeterWaters`、`/app/meter.queryFeeTypes`、`/app/meter.queryFeeTypesItems`、`/app/meter.listMeterType`、`/app/meter.queryPreMeterWater`、`/app/meter.saveMeterWater`、`/app/meter.listFloorShareReading`、`/app/meter.listFloorShareMeter`、`/app/meter.saveFloorShareReading`、`/app/meter.auditFloorShareReading`；抄表保存和审核写入必须补 guard/rollback。
- [ ] [探索] `owner` 4 个 endpoint：`/app/owner.queryOwnerAndMembers`、`/app/owner.saveRoomOwner`、`/app/owner.editOwner`、`/app/owner.deleteOwner`；业主新增、编辑、删除不得在无授权数据窗口下真实生产写入。
- [ ] [探索] `parking` 12 个 endpoint：`/app/owner.queryOwnerCars`、`/app/parkingArea.listParkingAreas`、`/app/machine.listParkingAreaMachines`、`/app/machine/openDoor`、`/app/machine/closeDoor`、`/app/machine.customCarInOutCmd`、`/app/carInout.listCarInParkingAreaCmd`、`/app/parkingCoupon.listParkingCouponCar`、`/app/tempCarFee.getTempCarFeeOrder`、`/app/carInoutDetail.listCarInoutDetail`、`/app/carInoutPayment.listCarInoutPayment`、`/app/machine.getBarrierCloudVideo`；开闸/关闸/自定义指令属于高风险阻断。
- [ ] [探索] `property-application` 10 个 endpoint：`/app/applyRoomDiscount/queryApplyRoomDiscount`、`/app/applyRoomDiscount/updateApplyRoomDiscount`、`/app/applyRoomDiscount/updateReviewApplyRoomDiscount`、`/callComponent/core/list`、`/app/feeDiscount/queryFeeDiscount`、`/app/fee.queryFeeDetail`、`/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord`、`/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail`、`/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord`、`/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord`；与 3.1 的 `/callComponent/core/list` 共享调查结论。
- [ ] [探索] `purchase` 3 个 endpoint：`/app/resourceStore.listResourceStores`、`/app/purchase/purchaseApply`、`/app/purchase/urgentPurchaseApply`；同时核对 client-only gap `/app/purchase/updatePurchaseApply` 与 `/app/purchaseApply.listAuditHistoryOrders`。
- [ ] [探索] `renovation` 8 个 endpoint：`/app/roomRenovation/queryRoomRenovation`、`/app/roomRenovation/updateRoomToExamine`、`/app/roomRenovation/saveRoomRenovationDetail`、`/app/roomRenovation/updateRoomRenovationState`、`/app/roomRenovation/queryRoomRenovationRecord`、`/app/roomRenovation/queryRoomRenovationRecordDetail`、`/app/roomRenovation/updateRoomDecorationRecord`、`/app/roomRenovation/deleteRoomRenovationRecord`；装修审核、保存、状态更新、删除均为写入闭环。
- [ ] [探索] `repair-extra` 其余 endpoint：`/app/ownerRepair.listStaffRepairs`、`/app/ownerRepair.listStaffFinishRepairs`、`/app/ownerRepair.updateOwnerRepair`、`/app/ownerRepair.repairDispatch`、`/app/ownerRepair.repairFinish`、`/app/ownerRepair.repairEnd`、`/app/repair.replyRepairAppraise`、`/app/ownerRepair.listRepairStaffs`、`/app/repair.listRepairTypeUsers`、`/app/resourceStore.listUserStorehouses`、`/app/ownerRepair.getRepairStatistics`、`/app/resourceStoreType.listResourceStoreTypes`、`/app/ownerRepair.repairStart`、`/app/ownerRepair.repairStop`、`/app/ownerRepair.grabbingRepair`、`/app/ownerRepair.listRepairStaffRecords`、`/app/dict.queryPayTypes`、`/app/resourceStore.listResources`；与 3.2 已列 endpoint 分开验收。
- [ ] [探索] `resource` 24 个 endpoint：`/app/resourceStore.listResourceStores`、`/app/resourceStore.listStorehouses`、`/app/purchaseApply.listPurchaseApplys`、`/app/itemRelease.listItemRelease`、`/app/resourceStore.listAllocationStorehouseApplys`、`/app/purchaseApply.listMyAuditOrders`、`/app/itemRelease.queryUndoItemRelease`、`/app/resourceStore.listAllocationStoreAuditOrders`、`/app/resourceStoreType.listResourceStoreTypes`、`/app/purchase/purchaseApply`、`/app/collection/resourceOut`、`/app/resourceStore.saveAllocationStorehouse`、`/app/purchaseApply.auditApplyOrder`、`/app/itemRelease.auditUndoItemRelease`、`/app/resourceStore.auditAllocationStoreOrder`、`/app/purchase/resourceEnter`、`/app/purchaseApply.deletePurchaseApply`、`/app/resourceStore.deleteAllocationStorehouse`、`/app/resourceStore.allocationStoreEnter`、`/app/resourceStore.saveAllocationUserStorehouse`、`/app/resourceStore.listAllocationStorehouses`、`/app/resourceStore.queryMyResourceStoreInfo`、`/app/resourceStore.saveResourceReturn`、`/app/resourceStore.saveResourceScrap`；入库、出库、调拨、审核、删除、归还、报废均需受控写入策略。
- [ ] [探索] `room` 与 `unit` 4 个 endpoint：`/app/room.queryRooms`、`/app/room.queryRoomDetail`、`/app/unit.queryUnits`、`/app/unit.queryUnitDetail`；复核楼栋/单元/房屋 ID 语义，不得用合成 ID 冒充真实主键。
- [ ] [探索] `staff` 8 个 endpoint：`/app/query.staff.infos`、`/app/staff/by-department`、`/app/staff/search`、`/app/staff/organizations`、`/app/staff/update-online-status`、`/app/staff/online`、`/app/staff/add`、`/app/staff/:staffId`；动态路径 `/app/staff/:staffId` 必须明确路由匹配、HTTP method 和退役策略。
- [ ] [探索] `notice`、`profile`、`video` 合计 9 个 endpoint：`/app/notice.listNotices`、`/app/profile.getUserProfile`、`/app/profile.listCommunities`、`/app/profile.changeCommunity`、`/app/profile.changePassword`、`/app/profile.listAttendanceRecords`、`/app/video.listMonitorArea`、`/app/video.listStaffMonitorMachine`、`/app/video.getPlayVideoUrl`；个人资料/切换小区/改密码必须区分 mock、公开接口和写入风险。
- [ ] [探索] `oa-workflow` 13 个 endpoint：`/app/oa/workflow/query`、`/app/oa/workflow/form/query`、`/app/oa/workflow/form/data/query`、`/app/oa/workflow/form/save`、`/app/oa/workflow/form/update`、`/app/oa/workflow/task/undo/query`、`/app/oa/workflow/task/his/query`、`/app/oa/workflow/user/query`、`/app/oa/workflow/image/run`、`/app/oa/workflow/task/next`、`/app/oa/workflow/audit`、`/app/oa/workflow/undo/next-deal-user`、`/app/oa/workflow/undo/audit`；表单保存、更新、审批必须独立写入窗口。
- [ ] [探索] `visit` 3 个 endpoint：`/app/visit.getVisit`、`/app/visit.getVisitDetail`、`/app/visit.auditVisit`；访客审核写入必须补 guard/read-back/rollback。
- [ ] [探索] `work-order` 12 个 endpoint：`/app/workorder/todo/list`、`/app/workorder/copy/list`、`/app/workorder/detail`、`/app/workorder/create`、`/app/workorder/update`、`/app/workorder/start`、`/app/workorder/complete`、`/app/workorder/audit`、`/app/workorder/cancel`、`/app/workorder/task/list`、`/app/workorder/task/items`、`/app/workorder/copy/finish`；工单创建、流转、完成、审批、取消必须按写入闭环验证。
- [ ] [探索] `test` 3 个 endpoint：`/test`、`/test/params`、`/test/error` - 判断是否为开发诊断 route、是否应排除 app legacy 退役清单，不能混入业务完成率。
- [ ] [探索] 对 client-only gap 建立调查项：`/app/itemRelease.queryFinishItemRelease`、`/app/purchase/updatePurchaseApply`、`/app/purchaseApply.listAuditHistoryOrders`、`/app/resourceStore.listAllocationStoreHisAuditOrders`。
- [ ] [探索] 对 server-only endpoint 建立调查项：activity、contact、notice、oa-workflow、profile、staff、test、video 等当前未在旧压缩桶中充分体现的模块；不能因为客户端暂未命中就标记删除。
- [ ] [实施] 每次只选 2-3 个 app legacy endpoint 或一个小模块，先补 manifest/allowlist/contract/guard，再考虑 DB repository。
- [ ] [复核] app 端任何 endpoint 迁移完成前都必须区分只读 POST、受控写、真实写、高风险阻断和 legacy fallback。

## 3A. App Caller, Legacy Compatibility, And Difference Ledger

- [ ] [探索] 扫描 `apps/app/src/**/*.{ts,vue}` 中 `/app/**`、`/callComponent/**`、旧 base URL、legacy request helper 和 shadow/API base 配置，建立 client call -> legacy endpoint -> `apps/api` target 的映射。
- [ ] [探索] 对 `apps/app/server/modules/**/endpoints.ts` 建立 server endpoint -> client caller 差集：client-only、server-only、both、dynamic route、test/debug route 必须分开标记。
- [ ] [复核] app legacy response contract 必须保留旧 envelope、字段名、分页结构、空数据行为、错误码和 POST-as-query/body 兼容；不得用 admin canonical 响应替代。
- [ ] [验证] app H5 调用端切流必须证明真实页面请求命中统一 `apps/api`，记录 H5 页面、触发动作、legacy path、method、payload 摘要、response contract、fallback/allowlist/guard 状态。
- [ ] [验证] legacy dispatch、runtime manifest、allowlist 与 guard 配置必须一致；manifest 存在但仍走旧 fallback 时只能标记 fallback evidence，不能升级为 repository 完成。
- [ ] [验证] app server-only endpoint 不能因当前 H5 未命中而删除；必须给出业务归属、历史来源、是否生产可达、是否保留兼容和退役决策。
- [ ] [验证] app client-only call 不能因旧 server 未扫描到 endpoint 而忽略；必须判断是否旧外部项目、动态 route、proxy、mock、已迁入 `apps/api` 或实际死调用。
- [ ] [汇总] app retirement candidate 行必须逐 endpoint 记录：legacy path、method、old module、caller evidence、target handler/adapter、manifest/allowlist、guard/fallback、dataSourceStatus、browser/HTTP evidence、retirement decision。

## 4. Unified `apps/api` Runtime And DB Readiness

- [ ] [验证] `apps/api` 独立启动、health、ready、build、typecheck、test；记录端口、环境变量、命令和结果。
- [ ] [验证] Neon main `DB_READY`：只使用 main 分支连接串，通过环境变量注入；`RUN_PHASE7_DB_READINESS_CHECK=1` 后 `/__nitro/ready` 必须返回 `DB_READY`。
- [ ] [记录] `DB_READY` 证据只能记录 env 名、脱敏 host、连接类型、required tables、migration count 和 response 摘要；禁止写真实连接串。
- [ ] [复核] `READY_CONFIGURED`、本地 fake DB、in-memory fallback、HTTP 200 都不得升级为 `DB_READY`。
- [ ] [验证] 对已迁移的 admin/app 关键只读 endpoint 做真实库样本复核，确认不是空数组、mock、兼容默认或旧 fallback 冒充真实 DB 结果。
- [ ] [验证] `apps/api` runtime manifest 与 `apps/api/server/routes/api/**/*.ts` 文件树、admin adapter、app legacy adapter、contract tests 互相对齐；缺任一层时 endpoint 只能保持 partial。
- [ ] [验证] `apps/api` 生产 `homepage`、本地 dev base URL、admin resolver base、app shadow/API base 必须在证据中分开记录；不得把 preview、local 或旧域名混写成生产。

## 4A. Chrome MCP Three-Surface Environment Verification

- [ ] [探索] 重新读取 `apps/admin/package.json`、`apps/app/package.json`、`apps/api/package.json` 的 `homepage` 字段，记录本轮生产 admin H5、app H5、API server 入口。
- [ ] [验证] 本地三 dev 启动矩阵：启动或复用 `apps/api` dev、`apps/admin` dev、`apps/app` H5 dev，记录命令、端口、关键环境变量和互相指向关系。
- [ ] [验证] 本地 API server Chrome MCP/browser evidence：访问 `/__nitro/health`、`/__nitro/ready` 和本切片目标 endpoint，记录 ready code、响应摘要和是否使用 Neon main env。
- [ ] [验证] 本地 admin H5 Chrome MCP 页面 Network：对有页面入口的 admin endpoint 记录业务路由、真实 Network、`/api-shadow` 或 resolver 目标、console 摘要和证据文件。
- [ ] [验证] 本地 app H5 Chrome MCP 页面 Network：对 app legacy endpoint 记录 H5 页面、legacy path、response contract、是否命中本地 `apps/api`、fallback 和 guard 状态。
- [ ] [验证] 生产 API server Chrome MCP/browser evidence：读取 `apps/api` homepage 后访问生产 `/__nitro/health`、`/__nitro/ready` 和目标 endpoint；记录 `DB_READY` 或阻断原因。
- [ ] [验证] 生产 admin H5 Chrome MCP 页面 Network：读取 admin homepage 后进入目标业务页面，记录请求是否命中生产 `apps/api`、控制台错误、fallback/shadow 状态和证据文件。
- [ ] [验证] 生产 app H5 Chrome MCP 页面 Network：读取 app homepage 后进入目标业务页面，记录 `/app/**` 或 `/callComponent/**` 请求目标、response contract、fallback 和证据文件。
- [ ] [记录] 更新 `agent-progress.md`、`agent-findings.md` 和 Memorix；明确每条证据属于 local-dev 还是 production，属于 admin/app/API 哪一端，不能跨端或跨环境升级状态。

## 4B. Vitest, Contract, Typecheck, And HTTP Gate Matrix

- [ ] [验证] 修改 `apps/api` handler、adapter、service、repository、runtime manifest、legacy dispatch、guard、admin resolver、app legacy caller 或 response contract 时，必须新增或更新对应 `*.test.ts`，或在 `agent-findings.md` 写明不可写原因。
- [ ] [验证] Vitest 文件必须使用 `import { describe, test } from "vitest"` 或同时导入所需断言工具，放在对应 monorepo 子包 `tests/`、`src/tests/` 或既有本地测试目录；不得用临时脚本冒充测试用例。
- [ ] [验证] app legacy 只读 endpoint 测试至少覆盖 legacy path、method、payload 兼容、response envelope、关键字段映射、空数据和错误路径。
- [ ] [验证] app legacy 写入口测试默认断言 guard：未开启 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 或对应授权变量时返回 `409 PHASE7_MUTATION_GUARDED` 或等价受保护响应。
- [ ] [验证] DB-backed repository/service 测试优先使用 fake/mock adapter 验证 query intent、表、where 条件、字段映射、分页、空数据和异常路径；Vitest 不得默认连接 Neon main。
- [ ] [验证] admin list/detail/CUD/upload/edge 的测试范围必须分开；普通 list contract test 不得覆盖 detail、create、update、delete、upload、file 或 payment-like endpoint。
- [ ] [验证] 每个实施切片记录实际运行的命令：相关 Vitest、package typecheck、runtime manifest/contract test、HTTP gate、OpenSpec strict 校验和 `git diff --check`；失败或跳过原因写入 `agent-findings.md`。
- [ ] [复核] Vitest 通过不能替代 Chrome MCP 页面证据、Neon main `DB_READY`、真实库样本、写入读回回滚、shadow-off/fallback 或 retirement gate。

## 4C. Neon Main, Schema, And Write-Read-Rollback Matrix

- [ ] [探索] 每个 DB-backed endpoint 执行前确认 `apps/type/src/business/**/schema.ts` 是否已有对应表、Zod schema 和类型；缺 schema 时先走 schema 变更流程，不得在 `apps/admin/server/db/schemas` 新增事实源。
- [ ] [验证] 若新增或修改 schema，必须同步 `apps/type` 导出、迁移生成、相关 service/repository、前端类型使用、seed 或测试数据策略，并按项目规则更新 Neon 表清单技能文档。
- [ ] [验证] Neon main 验收只允许使用 main 分支连接串和受控 env；证据记录脱敏 host、ready code、required tables、migration count 和响应摘要，禁止记录 secret。
- [ ] [验证] 只读 endpoint 的真实库样本必须证明 repository 读取到业务表并完成字段映射；空数组、mock、compat 默认值或 fallback 只能记录为缺口。
- [ ] [验证] 写入口开启前必须有 `PHASE7_E2E_*` 或 `phase7RunId`、测试数据范围、可清理字段、guard-before、controlled write、read-back、rollback/cleanup、residual check、guard-after。
- [ ] [验证] 费用、支付、开门、维修流转、业主资料、审批流等真实业务对象默认禁止生产破坏性写入；无法构造可清理哨兵数据时保持 blocked。
- [ ] [记录] 写入证据必须写入 endpoint、env、guard state、phase7RunId、insert/update/delete target、read-back query、cleanup result、residual count、guard restored 和 artifact path。

## 5. Retirement Gate

- [ ] [冻结] 建立旧服务新增入口回归扫描：任何新业务能力进入 `apps/admin/server` 或 `apps/app/server` 都记录为 Phase7 regression。
- [ ] [汇总] 生成 old-service retirement candidate 清单：每个旧 endpoint 必须有 target status、caller evidence、browser/HTTP evidence、fallback evidence、DB/write evidence、retirement decision。
- [ ] [汇总] retirement candidate 清单必须覆盖 admin exact endpoint、app legacy endpoint、client-only gap、server-only endpoint、debug/test/edge route、upload/R2 route、guarded write route；不得只统计普通 list。
- [ ] [验证] 退役评审前运行旧服务引用扫描：`apps/admin/src`、`apps/app/src`、`apps/api`、配置、docs、scripts 和 tests 中对 `apps/admin/server`、`apps/app/server`、旧 `/api/**`、旧 `/app/**` base 的引用必须分类处理。
- [ ] [验证] 退役评审前运行 fallback/shadow-off 复验：确认目标 endpoint 在关闭旧 fallback 或 shadow off 后仍命中 `apps/api`；只有旧本地证据时必须标记 stale 或重采。
- [ ] [验证] 退役评审前完成三端双环境证据：本地 admin H5、本地 app H5、本地 API server、生产 admin H5、生产 app H5、生产 API server 均需按 §4A 记录，任一缺口都阻断目录级删除。
- [ ] [复核] `apps/admin/server` 只有在全部 endpoint 归类并通过 retirement gate 后，才允许进入单独删除候选评审。
- [ ] [复核] `apps/app/server` 只有在 app legacy endpoint、client-only gap、server-only endpoint 全部归类并通过 retirement gate 后，才允许进入单独删除候选评审。
- [ ] [保护] `D:\code\ruan-cat\01s-11comm-app` 永久保留，只能只读引用和采集迁移证据，不作为删除对象。
- [ ] [决策] 删除、移动、归档、重命名或清空旧服务目录必须是独立 OpenSpec change 或明确单独评审，不得夹带在 endpoint 迁移任务里。

## 6. Legacy Superpowers Document Final Cleanup

- [x] [探索] 对照三份已恢复旧文档逐段确认：目标架构、Phase1-7 阶段链、P0-P8 批次、矩阵字段、当前接力状态、Memorix 编号、Neon main 流程、no-go 约束均已进入 OpenSpec。
- [x] [探索] 对照三份旧文档 git history 确认关键提交已进入 `agent-findings.md`：`2af48327`、`611c5f99`、`828a019e`、`cf85abbd`、`e3b377fa`、`058a9680`、`0a68f7d7`、`1969bbac`、`04a8e56c`、`6bf1dbc2`。
- [x] [修改] 将临时来源覆盖审计中仍有长期价值的 provenance、artifact index、Memorix index、禁止误判和临时审计边界迁入 canonical 文件；不再维护独立覆盖大表。
- [ ] [修改] 所有对旧三文档的执行入口引用必须指向 OpenSpec canonical 或稳定索引；历史文档如需保留旧文件名，只能作为“迁移来源”文字，不作为任务源链接。
- [ ] [校验] 运行旧路径引用扫描，区分 OpenSpec 内的迁移来源记录与外部死链。
- [ ] [校验] `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过，且 `openspec list --json` 显示本 change 仍有未完成 Nitro 合并任务。
- [ ] [删除] 只有在用户确认 OpenSpec 已完整承接信息后，才删除三份旧 Superpowers 文档。
- [x] [删除] 删除临时来源覆盖审计文件；后续不再要求 agent 持续同步更新该文件。
- [ ] [记录] 删除旧文档后，更新 `agent-progress.md`、`agent-findings.md`、稳定索引和 Memorix。
