# 2026-04-25 Phase4 App Legacy API 迁移汇总报告

## 1. Scope Lock

- Phase4 只处理 app legacy API 迁移波次规划和首批兼容迁移，不做 app/admin 全量切流，不退役旧服务，不做 Phase5 全量 admin CRUD。
- 本报告编辑子代理的所有权范围仅限 `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`；未修改、暂存或提交任何源代码文件。
- 不删除、移动、归档、重命名、清空 `apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。
- 不新增 Nitro 鉴权、JWT、Token、Neon Auth、Bearer/Authorization 校验。
- H3 helper 只允许从 `nitro/h3` 导入。
- 数据库 schema 事实来源只在 `apps/type/src/business/**/schema.ts`；Wave 4A 不在 `apps/api` 内定义 `pgTable`、`createInsertSchema`、`createSelectSchema`。
- Wave 4A 首批 runtime scope 仅允许 repair 最小兼容切片，具体业务坐标为 `propertyManage.repairsManage.repairsSetting`、`propertyManage.repairsManage.repairsTodo`、`propertyManage.repairsManage.issues`。
- `complaint`、`work-order`、`resourceStore`、`resourceStoreType`、parking、charge-machine、open-door、machine-record 只进入矩阵或后续评审队列，不在 Wave 4A runtime 注册。

## 2. Read-only Inventory

本次只读输入包含 Phase4 计划、迁移总设计、admin/app 支撑扩展设计、Phase3 计划、admin 业务路径、app legacy endpoint 文件和 repairs-manage 类型源文件。

设计输入结论：

- 总设计确认 `apps/api` 是唯一 Nitro API 服务，`apps/admin/server` 与 `apps/app/server` 只作为迁移来源或临时兼容层，旧源目录 `D:\code\ruan-cat\01s-11comm-app` 永久保留。
- Phase3 计划确认 Phase3 不迁移 repair/resource/parking，不删除旧服务，不新增鉴权；Phase4 输入包括 repair、resource、parking 映射和 charge-machine/open-door/machine-record 业务路径评审。
- admin/app 支撑扩展设计确认 app legacy 模块中已存在 `repair`、`complaint`、`work-order`，但长期 canonical 坐标必须以 `rank-route-keys.ts` 和 `apps/type` schema 为准，不能把 legacy 字段直接固化成长期模型。

只读盘点结论：

- `apps/api`、`apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app` 均存在。
- `rank-route-keys.ts` 中存在 Phase4 Wave 4A 需要的三项 repair 业务坐标：`issues`、`repairsSetting`、`repairsTodo`。
- `apps/app/server/modules` 中存在 `repair`、`complaint`、`work-order` legacy endpoint 与 repository 文件。
- `apps/type/src/business/property-manage/repairs-manage` 中存在 `schema.ts` 与 `index.ts`，并包含 repairs setting/todo/issues/return visit 等分文件。
- repair legacy endpoint 文件同时包含 Wave 4A 可入 runtime 的 owner repair、repair settings、repair states，也包含 staff workflow、appraise、resourceStore、core/list 等必须排除或后续评审的 endpoint。
- 探索子代理补充确认：repair 文件内除计划首表外，还存在 staff finish、update、repair end、appraise reply、repair staffs、type users、statistics、stop、grabbing、staff records、pay types 等 URL；这些全部是 `wave4b-review` 或 review-only，不得写成 Wave 4A runtime。
- 探索子代理补充确认：repair 文件混有 `resourceStore.*`、`resourceStoreType.*` 与 `/callComponent/core/list`，这些明确为 Phase4A 排除项。
- 探索子代理补充确认：complaint 包含 history/audit/event/appraise list/reply；work-order 包含 copy/detail/update/start/complete/audit/cancel/task/copy finish 等完整动作链。它们只进入 `matrix-only` 与 review queue，不进入 Wave 4A runtime。
- complaint 与 work-order endpoint 当前只进入迁移矩阵和 Wave 4B+ review queue，不进入 Wave 4A runtime。
- 收口复核时已确认 `apps/api/server/modules/repair` 存在，且 runtime manifest 已包含 `phase4a-repair-minimal` 的 repair 条目；旧版阻塞结论已过期，下面的验证证据以收口复核状态为准。

## 3. Migration Matrix

Runtime scope：仅 `Phase4 status = wave4a-runtime` 的 5 行进入 Wave 4A repair runtime 注册候选。

Review-only scope：`wave4b-review`、`matrix-only` 与 `excluded-review-only` 行只记录迁移判断，不在 Wave 4A runtime 注册。

| app legacy URL                                | Method   | Source module                                   | Canonical business path                      | Phase4 status        | Handling                                                                                  |
| --------------------------------------------- | -------- | ----------------------------------------------- | -------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| /app/ownerRepair.listOwnerRepairs             | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4a-runtime       | Register in apps/api repair legacy endpoints.                                             |
| /app/ownerRepair.queryOwnerRepair             | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4a-runtime       | Register in apps/api repair legacy endpoints.                                             |
| /app/ownerRepair.saveOwnerRepair              | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.issues          | wave4a-runtime       | Register in apps/api repair legacy endpoints.                                             |
| /app/repairSetting.listRepairSettings         | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsSetting  | wave4a-runtime       | Register in apps/api repair legacy endpoints.                                             |
| /app/dict.queryRepairStates                   | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4a-runtime       | Register only as repair dictionary compatibility.                                         |
| /app/ownerRepair.listStaffRepairs             | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review        | Keep out of runtime until staff workflow ownership is reviewed.                           |
| /app/ownerRepair.listStaffFinishRepairs       | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsHaveDone | wave4b-review        | Keep out of runtime until staff finished-workflow ownership is reviewed.                  |
| /app/ownerRepair.updateOwnerRepair            | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.issues          | wave4b-review        | Keep out of runtime until owner update fields and issue lifecycle are reviewed.           |
| /app/ownerRepair.repairDispatch               | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review        | Keep out of runtime until dispatch state transitions are reviewed.                        |
| /app/ownerRepair.repairStart                  | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review        | Keep out of runtime until staff action permissions and status mapping are reviewed.       |
| /app/ownerRepair.repairStop                   | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review        | Keep out of runtime until pause/stop state transitions are reviewed.                      |
| /app/ownerRepair.grabbingRepair               | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review        | Keep out of runtime until grab-order workflow ownership is reviewed.                      |
| /app/ownerRepair.repairFinish                 | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsHaveDone | wave4b-review        | Keep out of runtime until finish/cost fields are reviewed.                                |
| /app/ownerRepair.repairEnd                    | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsHaveDone | wave4b-review        | Keep out of runtime until close/end state semantics are reviewed.                         |
| /callComponent/ownerRepair.appraiseRepair     | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.returnVisit     | wave4b-review        | Keep out of runtime until /callComponent compatibility policy is reviewed.                |
| /app/repair.replyRepairAppraise               | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.returnVisit     | wave4b-review        | Keep out of runtime until appraise reply ownership and return-visit mapping are reviewed. |
| /app/ownerRepair.listRepairStaffs             | GET/POST | apps/app/server/modules/repair/endpoints.ts     | route-review-required                        | wave4b-review        | Keep out of runtime until repair staff directory ownership is reviewed.                   |
| /app/repair.listRepairTypeUsers               | GET/POST | apps/app/server/modules/repair/endpoints.ts     | route-review-required                        | wave4b-review        | Keep out of runtime until repair type-to-user mapping and schema ownership are reviewed.  |
| /app/ownerRepair.getRepairStatistics          | GET/POST | apps/app/server/modules/repair/endpoints.ts     | route-review-required                        | wave4b-review        | Keep out of runtime until repair report/statistics canonical path is reviewed.            |
| /app/ownerRepair.listRepairStaffRecords       | GET/POST | apps/app/server/modules/repair/endpoints.ts     | route-review-required                        | wave4b-review        | Keep out of runtime until staff record history ownership is reviewed.                     |
| /app/dict.queryPayTypes                       | GET/POST | apps/app/server/modules/repair/endpoints.ts     | route-review-required                        | wave4b-review        | Keep out of runtime until pay-type dictionary compatibility policy is reviewed.           |
| /app/resourceStore.listUserStorehouses        | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.resourceManage.storehouse     | excluded-review-only | Explicitly exclude from Phase4A runtime; resource domain requires separate review.        |
| /app/resourceStoreType.listResourceStoreTypes | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.resourceManage.resourceType   | excluded-review-only | Explicitly exclude from Phase4A runtime; resource type domain requires separate review.   |
| /callComponent/core/list                      | GET/POST | apps/app/server/modules/repair/endpoints.ts     | route-review-required                        | excluded-review-only | Explicitly exclude from Phase4A runtime; /callComponent core compatibility needs review.  |
| /app/resourceStore.listResources              | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.resourceManage.resource       | excluded-review-only | Explicitly exclude from Phase4A runtime; resource domain requires separate review.        |
| /app/auditUser.listAuditComplaints            | GET/POST | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/auditUser.listAuditHistoryComplaints     | GET/POST | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/complaint                                | POST     | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/complaint.auditComplaint                 | POST     | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/complaint.listComplaintEvent             | GET/POST | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/complaintAppraise.listComplaintAppraise  | GET/POST | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/complaintAppraise.replyComplaintAppraise | POST     | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/todo/list                      | GET/POST | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/copy/list                      | GET/POST | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/detail                         | GET/POST | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/create                         | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/update                         | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/start                          | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/complete                       | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/audit                          | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/cancel                         | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/task/list                      | GET/POST | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/task/items                     | GET/POST | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |
| /app/workorder/copy/finish                    | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only          | Do not register in runtime during Wave 4A.                                                |

Wave 4A explicitly excludes `/app/resourceStore.*`, `/app/resourceStoreType.*`, `/callComponent/core/list`, parking, charge-machine, open-door, machine-record, complaint, and work-order runtime registration. These entries require separate business-path and schema review before they can become runtime endpoints. The additional repair action/staff/statistics/pay-type URLs are also review-only and must not be registered as Wave 4A runtime endpoints.

## 4. Wave 4A Implementation Notes

- 本报告初始版本仅完成 Phase4 Task 1、Task 2 和 Task 6 的报告部分；收口复核时，Wave 4A repair runtime 已由后续实现落地在 `apps/api/server/modules/repair/**`。
- 本轮未新建 worktree：当前仓库没有现成 `.worktrees` 或 `worktrees` 目录，也没有可直接沿用的 CLAUDE worktree 偏好；同时 Phase4 计划文件与上一轮 API 修复已经在当前 `dev` 工作区暂存。为避免重排他人并行修改，本轮继续在当前 `dev` 工作区执行，并通过 Scope Lock、只改单一报告文件和 `git status` 边界验证控制风险。
- 当前 `apps/api/server/shared/runtime/runtime-endpoints.ts` 已同时纳入 Phase2 fee/payment/report 与 Wave 4A repair endpoint definitions，repair manifest 条目标记为 `phase4a-repair-minimal`、`ownerModule: "repair"`。
- 当前 `apps/api/server/modules/repair` 已包含 runtime、repository、service、legacy adapter、admin adapter、legacy endpoint 与统一导出文件；三条 admin read-only repair routes 也已存在。
- 后续实现只能把矩阵中 `wave4a-runtime` 的 5 条 repair endpoint 注册进 runtime；staff workflow、update、dispatch/start/stop/grab/finish/end/appraise、repair staff/type/statistics/pay types、complaint、work-order、resource、parking、device 类 endpoint 必须保持在 review-only 队列。
- 收口复核确认 `getRepairRuntime(event)` 当前仍返回 fallback runtime，未观察到 repair DB adapter、Drizzle query、`DbType`、`useDb(event)` 或 `hasDatabaseUrl(event)` 分支。
- 如果后续发现必须新增或修改 schema，应停止当前 Wave 4A runtime 落地，把 schema 变更拆成独立评审任务。
- 主代理已在收口编辑后复跑 Task 7 门禁：targeted tests、`verify:phase4`、API typecheck/build、type typecheck、full CI 均通过；`git diff --check` 作为最终 workspace 检查单独复跑。

## 5. Verification Evidence

### 5.1 Preserved Sources And Boundaries

```log
PS> Test-Path apps/api
True
```

```log
PS> Test-Path apps/admin/server
True
```

```log
PS> Test-Path apps/app/server
True
```

```log
PS> Test-Path "D:\code\ruan-cat\01s-11comm-app"
True
```

### 5.2 Repair Coordinates And Schema Sources

```log
PS> rg -n '"propertyManage\.repairsManage\.(issues|repairsSetting|repairsTodo)"' apps/admin/src/router/rank/rank-route-keys.ts
128:	"propertyManage.repairsManage.issues",
132:	"propertyManage.repairsManage.repairsSetting",
133:	"propertyManage.repairsManage.repairsTodo",
```

```log
PS> rg --files apps/app/server/modules | rg "repair|complaint|work-order"
apps/app/server/modules\work-order\repository.ts
apps/app/server/modules\work-order\endpoints.ts
apps/app/server/modules\repair\repository.ts
apps/app/server/modules\repair\endpoints.ts
apps/app/server/modules\complaint\repository.ts
apps/app/server/modules\complaint\endpoints.ts
```

```log
PS> rg --files apps/type/src/business/property-manage/repairs-manage
apps/type/src/business/property-manage/repairs-manage\schema.ts
apps/type/src/business/property-manage/repairs-manage\return-visit.ts
apps/type/src/business/property-manage/repairs-manage\repairs-todo.ts
apps/type/src/business/property-manage/repairs-manage\repairs-setting.ts
apps/type/src/business/property-manage/repairs-manage\repairs-have-done.ts
apps/type/src/business/property-manage/repairs-manage\phone-report-repairs.ts
apps/type/src/business/property-manage/repairs-manage\mandatory-return-issue.ts
apps/type/src/business/property-manage/repairs-manage\issues.ts
apps/type/src/business/property-manage/repairs-manage\index.ts
```

### 5.3 Legacy Endpoint Inventory

```log
PS> rg -n "url: '(/app|/callComponent)" apps/app/server/modules/repair/endpoints.ts
18:      url: '/app/ownerRepair.listOwnerRepairs',
31:      url: '/app/ownerRepair.listStaffRepairs',
51:      url: '/app/ownerRepair.listStaffFinishRepairs',
70:      url: '/app/ownerRepair.queryOwnerRepair',
87:      url: '/app/ownerRepair.saveOwnerRepair',
100:      url: '/app/ownerRepair.updateOwnerRepair',
117:      url: '/app/ownerRepair.repairDispatch',
149:      url: '/app/ownerRepair.repairFinish',
174:      url: '/app/ownerRepair.repairEnd',
191:      url: '/callComponent/ownerRepair.appraiseRepair',
213:      url: '/app/repair.replyRepairAppraise',
234:      url: '/app/ownerRepair.listRepairStaffs',
242:      url: '/app/repair.listRepairTypeUsers',
250:      url: '/app/resourceStore.listUserStorehouses',
263:      url: '/app/ownerRepair.getRepairStatistics',
268:      url: '/app/resourceStoreType.listResourceStoreTypes',
274:      url: '/app/repairSetting.listRepairSettings',
284:      url: '/callComponent/core/list',
290:      url: '/app/ownerRepair.repairStart',
307:      url: '/app/ownerRepair.repairStop',
324:      url: '/app/ownerRepair.grabbingRepair',
350:      url: '/app/dict.queryRepairStates',
355:      url: '/app/ownerRepair.listRepairStaffRecords',
372:      url: '/app/dict.queryPayTypes',
377:      url: '/app/resourceStore.listResources',
```

```log
PS> rg -n "url: '(/app|/callComponent)" apps/app/server/modules/complaint/endpoints.ts
12:      url: '/app/auditUser.listAuditComplaints',
21:      url: '/app/auditUser.listAuditHistoryComplaints',
30:      url: '/app/complaint',
42:      url: '/app/complaint.auditComplaint',
69:      url: '/app/complaint.listComplaintEvent',
85:      url: '/app/complaintAppraise.listComplaintAppraise',
101:      url: '/app/complaintAppraise.replyComplaintAppraise',
```

```log
PS> rg -n "url: '(/app|/callComponent)" apps/app/server/modules/work-order/endpoints.ts
12:      url: '/app/workorder/todo/list',
24:      url: '/app/workorder/copy/list',
35:      url: '/app/workorder/detail',
52:      url: '/app/workorder/create',
65:      url: '/app/workorder/update',
81:      url: '/app/workorder/start',
98:      url: '/app/workorder/complete',
114:      url: '/app/workorder/audit',
130:      url: '/app/workorder/cancel',
147:      url: '/app/workorder/task/list',
163:      url: '/app/workorder/task/items',
180:      url: '/app/workorder/copy/finish',
```

### 5.4 Baseline Forbidden Scan

PowerShell 有效执行时使用等价正则 `from [''"]h3[''"]`，匹配语义与计划中的 `from ['\"]h3['\"]` 相同。

```log
PS> rg -n 'from [''"]h3[''"]' apps/api/server apps/api/tests
<no output; rg exit 1, no matches>
```

```log
PS> rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 校验|token 校验|Bearer|Authorization" apps/api/server apps/api/tests
<no output; rg exit 1, no matches>
```

```log
PS> rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
<no output; rg exit 1, no matches>
```

```log
PS> rg -n "chargeMachine|openDoor|machine/listMachineRecords|iot/listChargeMachine|parking|resourceStore|workorder|complaint" apps/api/server/shared/runtime/runtime-endpoints.ts apps/api/server/modules
<no output; rg exit 1, no matches>
```

### 5.5 Task 6 Excluded Domain Runtime Scan

```log
PS> Test-Path apps/api/server/modules/repair
True
```

```log
PS> rg --files apps/api/server/modules/repair
apps/api/server/modules/repair\types.ts
apps/api/server/modules/repair\service.ts
apps/api/server/modules/repair\runtime.ts
apps/api/server/modules/repair\repository.ts
apps/api/server/modules/repair\legacy-endpoints.ts
apps/api/server/modules/repair\legacy-adapter.ts
apps/api/server/modules/repair\index.ts
apps/api/server/modules/repair\admin-adapter.ts
```

```log
PS> rg -n "resourceStore|resourceStoreType|parking|chargeMachine|openDoor|machine/listMachineRecords|workorder|complaint|auditUser" apps/api/server/shared/runtime/runtime-endpoints.ts apps/api/server/modules/repair
<no output; rg exit 1, no matches>
```

```log
PS> Select-String -Path apps/api/server/shared/runtime/runtime-endpoints.ts -Pattern 'feeLegacyEndpointDefinitions|repairLegacyEndpointDefinitions|phase4a-repair-minimal|ownerModule'
1: import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";
2: import { repairLegacyEndpointDefinitions } from "../../modules/repair/legacy-endpoints";
5: ...feeLegacyEndpointDefinitions.map((definition) => ({
8: 		ownerModule: "fee",
10: ...repairLegacyEndpointDefinitions.map((definition) => ({
12: 		phase: "phase4a-repair-minimal",
13: 		ownerModule: "repair",
23: 	ownerModule: entry.ownerModule,
```

```log
PS> Select-String -Path apps/api/server/modules/repair/runtime.ts -Pattern 'getRepairRuntime|fallbackRuntime|useDb|DbType|Drizzle|createRepairRuntime'
14: const fallbackRuntime = createRepairRuntime(createRepairRepository());
16: export function getRepairRuntime(event?: H3Event): RepairRuntime {
18: 	return fallbackRuntime;
21: export function createRepairRuntime(repository: RepairRepository): RepairRuntime {
```

### 5.6 Current Git Scope Evidence

```log
PS> Test-Path .worktrees
False
```

```log
PS> Test-Path worktrees
False
```

```log
PS> git branch --show-current
dev
```

```log
PS> git status --short -- docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase4.md apps/api/tests/legacy/fee-legacy-endpoints.test.ts
 M apps/api/tests/legacy/fee-legacy-endpoints.test.ts
AM docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase4.md
AM docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md
```

说明：`AM` 表示计划与报告文件在收口编辑前已处于 index 新增状态，本收口编辑子代理未暂存、未提交、未回滚任何文件。

### 5.7 Final Verification Evidence

```log
PS> pnpm -F @01s-11comm/api test -- tests/modules/repair-service.test.ts tests/legacy/repair-legacy-endpoints.test.ts tests/admin/repair-admin-endpoints.test.ts tests/infra/endpoint-manifest.test.ts tests/runtime/endpoint-registry.test.ts
Test Files 13 passed (13)
Tests 43 passed (43)
Exit code: 0
```

```log
PS> pnpm -F @01s-11comm/api run verify:phase4
vitest run tests/legacy tests/admin tests/modules tests/runtime tests/infra
Test Files 12 passed (12)
Tests 40 passed (40)
pnpm run typecheck
tsc --noEmit
pnpm run build:node
nitro build --preset node-server
Exit code: 0
```

```log
PS> pnpm -F @01s-11comm/api typecheck
tsc --noEmit
Exit code: 0
```

```log
PS> pnpm -F @01s-11comm/api build
nitro build
Exit code: 0
```

```log
PS> pnpm -F @01s-11comm/type typecheck
tsc --noEmit
Exit code: 0
```

```log
PS> pnpm run ci
turbo build
Tasks: 4 successful, 4 total
Exit code: 0
```

```log
PS> git diff --check
<no output>
Exit code: 0
```

## 6. Phase4 Pass/Fail Gate

当前执行时点的 Phase4 gate 结论：**Pass**。

原因是 Wave 4A repair runtime 与 manifest 注册已经落地，Task 7 targeted tests、`verify:phase4`、API typecheck/build、type typecheck、full CI 和最终 workspace 检查均已由主代理复跑通过。

Gate 对照：

| Gate item                                                                      | Current result                                                                                                  |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 单一 Phase4 报告包含 inventory、matrix、verification evidence、gate conclusion | Pass, 本文件已记录。                                                                                            |
| runtime manifest 包含 Phase2 fee/payment/report 加 Wave 4A repair only         | Pass（收口复核）, manifest 已纳入 `repairLegacyEndpointDefinitions`，repair 条目标记 `phase4a-repair-minimal`。 |
| Wave 4A repair legacy endpoint list/detail/create/settings/dictionary 测试通过 | Pass, targeted tests 与 `verify:phase4` 均通过。                                                                |
| admin read-only repair routes 共用同一 repair service/repository               | Pass, 三条 admin route 存在并调用 `getRepairRuntime(event).adminAdapter`，admin repair endpoint tests 通过。    |
| runtime code 不注册 complaint/work-order/parking/resourceStore/device endpoint | Pass（收口复核）, Task 6 runtime exclusion scan 无匹配。                                                        |
| 无 `"h3"` 直接导入                                                             | Pass, forbidden scan 无匹配。                                                                                   |
| 无 Nitro auth/JWT/Token/Neon Auth/Bearer/Authorization 校验                    | Pass, forbidden scan 无匹配。                                                                                   |
| 无 apps/api 私有 schema 定义                                                   | Pass, forbidden scan 无匹配。                                                                                   |
| repair runtime fallback-only                                                   | Pass（收口复核）, `getRepairRuntime(event)` 返回 `fallbackRuntime`，未观察到 DB adapter/Drizzle/useDb 分支。    |
| `apps/admin/server`、`apps/app/server`、旧源目录仍存在                         | Pass, 三者均为 `True`。                                                                                         |
| `verify:phase4`、typecheck、CI、`git diff --check`                             | Pass, final verification evidence 已记录在 5.7。                                                                |

后续约束：

- Phase4A 不应继续扩大到 complaint、work-order、resource、parking、charge-machine、open-door 或 machine-record runtime 注册。
- repair DB adapter、Drizzle query、`useDb(event)` runtime 分支必须拆成独立后续任务。

## Wave 4B+ Review Queue

| Candidate domain                        | Required review before runtime registration                                                                                                                                                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| repair staff/action extension           | Confirm owner/staff workflow ownership, state transitions, permissions, staff directory, repair type users, statistics, staff records, and pay-type dictionary policy before registering any repair URL beyond the 5 Wave 4A runtime endpoints.                                      |
| repair resource/callComponent mix       | Keep `resourceStore.listUserStorehouses`, `resourceStoreType.listResourceStoreTypes`, `/callComponent/core/list`, and `resourceStore.listResources` out of Phase4A; split resource and core callComponent compatibility into separate review.                                        |
| complaint                               | Confirm admin business path and schema ownership before registering `/app/auditUser.*`, `/app/complaint*`, `/app/complaint.auditComplaint`, `/app/complaint.listComplaintEvent`, `/app/complaintAppraise.listComplaintAppraise`, or `/app/complaintAppraise.replyComplaintAppraise`. |
| work-order                              | Confirm whether new business paths are allowed in `rank-route-keys.ts` before registering `/app/workorder/todo/list`, `/app/workorder/copy/list`, `/app/workorder/detail`, `/app/workorder/create`, update/start/complete/audit/cancel, task list/items, or copy finish endpoints.   |
| resource                                | Confirm `propertyManage.resourceManage.*` business paths and schema plan before registering `resourceStore*` endpoints.                                                                                                                                                              |
| parking                                 | Confirm parking device/open-door boundary before registering parking runtime endpoints.                                                                                                                                                                                              |
| charge-machine/open-door/machine-record | Keep out of Phase4A; requires separate device integration and admin route review.                                                                                                                                                                                                    |
