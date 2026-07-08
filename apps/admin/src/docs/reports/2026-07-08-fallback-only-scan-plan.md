# §7C fallback-only 收口扫描与执行计划

> 任务编号：task1200、task1201  
> 扫描日期：2026-07-08  
> 扫描范围：`apps/api/server/shared/runtime/runtime-endpoints.ts`、`apps/api/server/modules/**/legacy-endpoints.ts` 与 `git HEAD:apps/app/server/modules/**/endpoints.ts`  
> 报告路径：`D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-fallback-only-scan-plan.md`

## 1. 扫描结论

### 1.1 剩余 fallback-only 总数

- **旧 app runtime 端点总数**：214 个 unique URL（`apps/app/server/modules/**/endpoints.ts`）。
- **已迁入 `apps/api` 的 exact/guarded 端点**：165 个 unique URL（`apps/api/server/modules/**/legacy-endpoints.ts`）。
- **剩余 fallback-only 端点**：**49 个 unique URL**。
- **状态说明**：这些端点目前仍由旧 `apps/app/server` 的 fallback 承接；关闭 fallback 时会触发旧 app 调用或 fail-closed 404。

> 备注：当前 `apps/api/tests/runtime/app-legacy-gap-registry.test.ts` 中的 `remainingAppLegacyGapPaths` 显式跟踪了 36 个 gap URL，另有 13 个（repair 12 个 + staff 动态路由 1 个）未被该测试纳入 gap 清单。本报告按实际扫描结果列出全部 49 个，并给出分类建议。

### 1.2 按目标模块分布

| 目标模块 | 剩余 fallback-only 数 | 只读 exact 建议 | POST-only guarded 建议 | not-candidate 建议 |
| :--- | :--- | :--- | :--- | :--- |
| oa-workflow | 13 | 10 | 3 | 0 |
| property-application | 6 | 2 | 4 | 0 |
| renovation | 8 | 3 | 5 | 0 |
| repair | 10 | 2 | 8 | 0 |
| resource | 11 | 2 | 9 | 0 |
| staff | 1 | 0 | 0 | 1 |
| **合计** | **49** | **19** | **29** | **1** |

其他模块（activity、coupon、fee、inspection、item-release、maintenance、meter、parking、profile、purchase、visit、work-order）当前已无 fallback-only URL。

### 1.3 状态收敛目标

- **只读 exact（GET/POST readonly）**：优先处理，返回 deterministic compat seed 数据，不修改旧 app 内存态。
- **POST-only guarded**：写入口统一返回 `409 PHASE7_MUTATION_GUARDED`，不执行真实 CUD，不调用旧 app fallback。
- **not-candidate**：无法通过当前 exact registry 承载的动态路由或明确不再迁移的端点，需在 `runtime-endpoints.ts` 及 evidence 中显式标记。

## 2. 各模块剩余端点清单与分类

### 2.1 oa-workflow（13 个）

建议新建模块 `apps/api/server/modules/oa-workflow/`。旧 app 响应包为 `{ success, code, message, data, timestamp }`，但现有新模块多采用 `{ code, msg, data }` 归一化包，本批建议按 `{ code, msg, data }` 实现。

| URL | 旧方法 | 旧行为 | 建议分类 |
| :--- | :--- | :--- | :--- |
| `/app/oa/workflow/query` | GET/POST | 查询流程列表 | 只读 exact |
| `/app/oa/workflow/form/query` | GET/POST | 查询表单 | 只读 exact |
| `/app/oa/workflow/form/data/query` | GET/POST | 查询表单数据 | 只读 exact |
| `/app/oa/workflow/task/undo/query` | GET/POST | 查询待办任务 | 只读 exact |
| `/app/oa/workflow/task/his/query` | GET/POST | 查询历史任务 | 只读 exact |
| `/app/oa/workflow/user/query` | GET/POST | 查询流程评论 | 只读 exact |
| `/app/oa/workflow/image/run` | GET/POST | 获取流程图 | 只读 exact |
| `/app/oa/workflow/task/next` | GET/POST | 获取下一任务 | 只读 exact |
| `/app/oa/workflow/undo/next-deal-user` | GET/POST | 获取下一处理人 | 只读 exact |
| `/app/oa/workflow/form/save` | POST | 保存表单数据 | POST-only guarded |
| `/app/oa/workflow/form/update` | POST | 更新表单数据 | POST-only guarded |
| `/app/oa/workflow/audit` | POST | 提交审批 | POST-only guarded |
| `/app/oa/workflow/undo/audit` | POST | 提交撤销审批 | POST-only guarded |

### 2.2 property-application（6 个）

模块已存在，响应包为 `{ code, msg, data }`。

| URL | 旧方法 | 旧行为 | 建议分类 |
| :--- | :--- | :--- | :--- |
| `/app/applyRoomDiscount/queryApplyRoomDiscount` | GET/POST | 查询验房申请列表/详情 | 只读 exact |
| `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord` | GET/POST | 查询跟踪记录列表 | 只读 exact |
| `/app/applyRoomDiscount/updateApplyRoomDiscount` | POST | 更新验房信息 | POST-only guarded |
| `/app/applyRoomDiscount/updateReviewApplyRoomDiscount` | POST | 更新审核信息 | POST-only guarded |
| `/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord` | POST | 新增跟踪记录 | POST-only guarded |
| `/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord` | POST/DELETE | 删除跟踪记录 | POST-only guarded |

### 2.3 renovation（8 个）

建议新建模块 `apps/api/server/modules/renovation/`。响应包建议按 `{ code, msg, data }` 归一化。

| URL | 旧方法 | 旧行为 | 建议分类 |
| :--- | :--- | :--- | :--- |
| `/app/roomRenovation/queryRoomRenovation` | GET/POST | 查询装修申请列表 | 只读 exact |
| `/app/roomRenovation/queryRoomRenovationRecord` | GET/POST | 查询装修记录列表 | 只读 exact |
| `/app/roomRenovation/queryRoomRenovationRecordDetail` | GET/POST | 查询装修记录详情 | 只读 exact |
| `/app/roomRenovation/updateRoomToExamine` | POST | 更新验收状态 | POST-only guarded |
| `/app/roomRenovation/saveRoomRenovationDetail` | POST | 保存装修详情（复用 updateExamine） | POST-only guarded |
| `/app/roomRenovation/updateRoomRenovationState` | POST | 完成装修 | POST-only guarded |
| `/app/roomRenovation/updateRoomDecorationRecord` | POST | 新增装修记录 | POST-only guarded |
| `/app/roomRenovation/deleteRoomRenovationRecord` | POST | 删除装修记录 | POST-only guarded |

### 2.4 repair（10 个）

模块已存在，新侧响应包为 `{ code, msg, data }`。其中 8 个已在 `repairLegacyAdapterEvidence.notCovered` 中明确为未覆盖写入口；2 个只读列表未在该清单中，需补入。

| URL | 旧方法 | 旧行为 | 建议分类 |
| :--- | :--- | :--- | :--- |
| `/app/ownerRepair.listStaffFinishRepairs` | GET/POST | 查询师傅已完成工单 | 只读 exact |
| `/app/ownerRepair.listStaffRepairs` | GET/POST | 查询师傅已派单工单 | 只读 exact |
| `/app/ownerRepair.updateOwnerRepair` | POST | 更新维修工单 | POST-only guarded |
| `/app/ownerRepair.repairDispatch` | POST | 派单/转单/退单 | POST-only guarded |
| `/app/ownerRepair.repairFinish` | POST | 办结工单 | POST-only guarded |
| `/app/ownerRepair.repairEnd` | POST | 结束订单 | POST-only guarded |
| `/app/ownerRepair.repairStart` | POST | 开始维修 | POST-only guarded |
| `/app/ownerRepair.repairStop` | POST | 暂停维修 | POST-only guarded |
| `/app/ownerRepair.grabbingRepair` | POST | 抢单 | POST-only guarded |
| `/app/repair.replyRepairAppraise` | POST | 回复评价 | POST-only guarded |

### 2.5 resource（11 个）

模块已存在，响应包为 `{ success, code, message, data, timestamp }`。包含 2 个从旧 repair 模块划入的只读端点（`listUserStorehouses`、`listResourceStoreTypes`）。

| URL | 旧方法 | 旧行为 | 建议分类 |
| :--- | :--- | :--- | :--- |
| `/app/resourceStore.listUserStorehouses` | GET/POST | 查询用户仓库 | 只读 exact |
| `/app/resourceStoreType.listResourceStoreTypes` | GET/POST | 查询仓库类型 | 只读 exact |
| `/app/collection/resourceOut` | POST | 物资出库 | POST-only guarded |
| `/app/purchase/resourceEnter` | POST | 采购入库 | POST-only guarded |
| `/app/purchaseApply.deletePurchaseApply` | POST | 删除采购申请 | POST-only guarded |
| `/app/resourceStore.allocationStoreEnter` | POST | 调拨入库 | POST-only guarded |
| `/app/resourceStore.deleteAllocationStorehouse` | POST | 删除调拨仓库 | POST-only guarded |
| `/app/resourceStore.saveAllocationUserStorehouse` | POST | 转赠用户仓库 | POST-only guarded |
| `/app/resourceStore.saveResourceReturn` | POST | 物资归还 | POST-only guarded |
| `/app/resourceStore.saveResourceScrap` | POST | 物资报废 | POST-only guarded |

> 注：resource 模块现有 9 个未收口 URL，加上从 repair 划入的 2 个，共 11 个。

### 2.6 staff（1 个）

| URL | 旧方法 | 旧行为 | 建议分类 |
| :--- | :--- | :--- | :--- |
| `/app/staff/:staffId` | GET | 动态员工详情 | **not-candidate** |

说明：当前 `apps/api` 的 endpoint registry 为精确字符串匹配，不支持 `:staffId` 动态参数。现有 `/app/staff/STAFF_001` 仅作为样例 exact 存在。建议将 `/app/staff/:staffId` 标记为 **not-candidate**，或在完成更高级路由匹配改造后再行处理；task1201 应在 `runtime-endpoints.ts` 及 `staffLegacyAdapterEvidence` 中显式说明该动态路由未覆盖。

## 3. 执行计划（按小批次）

原则：每批 2–3 个 endpoint；新模块先搭骨架，再逐步填端点；每批均需通过 TDD 红灯 → 实现 → 绿灯流程。

### 3.1 批次总览

| 批次 | 目标模块 | 内容 | 数量 |
| :--- | :--- | :--- | :--- |
| 1 | property-application | 2 个只读 exact | 2 |
| 2 | property-application | 4 个写入口 guarded | 4 |
| 3 | renovation | 3 个只读 exact + 新建模块骨架 | 3 |
| 4 | renovation | 3 个写入口 guarded | 3 |
| 5 | renovation | 2 个写入口 guarded | 2 |
| 6 | oa-workflow | 3 个只读 exact + 新建模块骨架 | 3 |
| 7 | oa-workflow | 3 个只读 exact | 3 |
| 8 | oa-workflow | 3 个只读 exact | 3 |
| 9 | oa-workflow | 2 个写入口 guarded | 2 |
| 10 | oa-workflow | 2 个写入口 guarded | 2 |
| 11 | repair | 2 个只读 exact | 2 |
| 12 | repair | 3 个写入口 guarded | 3 |
| 13 | repair | 3 个写入口 guarded | 3 |
| 14 | repair | 2 个写入口 guarded | 2 |
| 15 | resource | 2 个只读 exact | 2 |
| 16 | resource | 3 个写入口 guarded | 3 |
| 17 | resource | 3 个写入口 guarded | 3 |
| 18 | resource | 3 个写入口 guarded | 3 |
| 19 | staff | 1 个动态路由标记 not-candidate | 1 |

合计 19 批，49 个端点。

### 3.2 详细批次与文件改动

#### 批次 1：property-application 只读 exact

- 端点：
  - `GET/POST /app/applyRoomDiscount/queryApplyRoomDiscount`
  - `GET/POST /app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord`
- 文件改动：
  - `apps/api/server/modules/property-application/types.ts`：新增 `ApplyRoomDiscount`、`ApplyRoomDiscountRecord` 类型。
  - `apps/api/server/modules/property-application/repository.ts`：新增 `getApplicationById`、`getApplicationList`、`getRecordList` 的 compat seed 实现。
  - `apps/api/server/modules/property-application/service.ts`：新增对应 service 方法。
  - `apps/api/server/modules/property-application/legacy-adapter.ts`：新增 `queryApplyRoomDiscount`、`queryApplyRoomDiscountRecord` adapter 方法；更新 `endpoints` 与 `notCovered`。
  - `apps/api/server/modules/property-application/legacy-endpoints.ts`：注册两条 GET/POST 端点。
  - `apps/api/server/shared/runtime/runtime-endpoints.ts`：保持 `phase7-property-application-readonly` 与 `app-shadow-allowlist`（已注册定义会自动纳入）。
  - `apps/api/tests/legacy/property-application-legacy-endpoints.test.ts`：增加只读响应断言。
  - `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`：将两条从 `remainingAppLegacyGapPaths` 移除。
  - `apps/api/tests/infra/phase7-api-contracts.test.ts`、`endpoint-manifest.test.ts`、`app-legacy-module-layering.test.ts`：同步 evidence。

#### 批次 2：property-application 写入口 guarded

- 端点：
  - `POST /app/applyRoomDiscount/updateApplyRoomDiscount`
  - `POST /app/applyRoomDiscount/updateReviewApplyRoomDiscount`
  - `POST /app/applyRoomDiscountRecord/addApplyRoomDiscountRecord`
  - `POST/DELETE /app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord`
- 文件改动：
  - 同批次 1 的 `types.ts`、`repository.ts`、`service.ts`（可选扩展 `getWriteGuardDecision`）。
  - `apps/api/server/modules/property-application/legacy-adapter.ts`：新增 `guardedWrite` 或复用 `getWriteGuardDecision`。
  - `apps/api/server/modules/property-application/legacy-endpoints.ts`：注册 4 条 POST-only（`cutApplyRoomDiscountRecord` 只注册 POST）。
  - `apps/api/server/shared/runtime/runtime-endpoints.ts`：将 4 条 URL 加入 `phase7BlockedAppLegacyMutationUrls`（或模块内 blocked set），返回 `blocked-for-execution`。
  - 相关测试文件：同步 `remainingAppLegacyGapPaths`、`guardedEndpoints`、`endpoint-manifest`、fallback disabled drill 断言。

#### 批次 3：renovation 只读 exact + 新建模块

- 端点：
  - `GET/POST /app/roomRenovation/queryRoomRenovation`
  - `GET/POST /app/roomRenovation/queryRoomRenovationRecord`
  - `GET/POST /app/roomRenovation/queryRoomRenovationRecordDetail`
- 文件改动：
  - 新建 `apps/api/server/modules/renovation/types.ts`：定义 `Renovation`、`RenovationRecord`、`RenovationRecordMedia` 等。
  - 新建 `apps/api/server/modules/renovation/repository.ts`：in-memory compat seed 与 `queryRenovations`、`queryRecords`、`getRecordMedia`。
  - 新建 `apps/api/server/modules/renovation/service.ts`。
  - 新建 `apps/api/server/modules/renovation/runtime.ts`：工厂函数。
  - 新建 `apps/api/server/modules/renovation/legacy-adapter.ts`：使用 `legacySuccess`（`{ code, msg, data }`）。
  - 新建 `apps/api/server/modules/renovation/legacy-endpoints.ts`：注册 3 条只读端点。
  - 新建 `apps/api/server/modules/renovation/index.ts`：导出 runtime。
  - `apps/api/server/shared/runtime/runtime-endpoints.ts`：导入 `renovationLegacyEndpointDefinitions`，ownerModule=`renovation`，phase=`phase7-renovation-readonly`，cutoverStatus=`app-shadow-allowlist`。
  - 新建 `apps/api/tests/legacy/renovation-legacy-endpoints.test.ts`。
  - 更新 `app-legacy-gap-registry.test.ts`、`endpoint-manifest.test.ts`、`app-legacy-module-layering.test.ts`、`phase7-api-contracts.test.ts`。

#### 批次 4：renovation 写入口 guarded（状态变更）

- 端点：
  - `POST /app/roomRenovation/updateRoomToExamine`
  - `POST /app/roomRenovation/saveRoomRenovationDetail`
  - `POST /app/roomRenovation/updateRoomRenovationState`
- 文件改动：
  - `apps/api/server/modules/renovation/{legacy-adapter,legacy-endpoints}.ts`：注册 POST-only，返回 `409 PHASE7_MUTATION_GUARDED`。
  - `runtime-endpoints.ts`：phase 升级为 `phase7-renovation-guarded-write`，cutoverStatus=`blocked-for-execution`。
  - 测试文件：同步 `guardedEndpoints`、fallback disabled 断言。

#### 批次 5：renovation 写入口 guarded（记录 CUD）

- 端点：
  - `POST /app/roomRenovation/updateRoomDecorationRecord`
  - `POST /app/roomRenovation/deleteRoomRenovationRecord`
- 文件改动：
  - 同批次 4，追加 2 条 POST-only guarded。
  - 测试文件同步。

#### 批次 6：oa-workflow 只读 exact + 新建模块

- 端点：
  - `GET/POST /app/oa/workflow/query`
  - `GET/POST /app/oa/workflow/form/query`
  - `GET/POST /app/oa/workflow/form/data/query`
- 文件改动：
  - 新建 `apps/api/server/modules/oa-workflow/{types,repository,service,runtime,legacy-adapter,legacy-endpoints,index}.ts`。
  - `runtime-endpoints.ts`：ownerModule=`oa-workflow`，phase=`phase7-oa-workflow-readonly`，cutoverStatus=`app-shadow-allowlist`。
  - 新建 `apps/api/tests/legacy/oa-workflow-legacy-endpoints.test.ts`。
  - 更新 `app-legacy-gap-registry.test.ts` 等 infra/runtime 测试。

#### 批次 7：oa-workflow 只读 exact（任务相关）

- 端点：
  - `GET/POST /app/oa/workflow/task/undo/query`
  - `GET/POST /app/oa/workflow/task/his/query`
  - `GET/POST /app/oa/workflow/user/query`
- 文件改动：
  - 扩展 `apps/api/server/modules/oa-workflow/{repository,service,legacy-adapter,legacy-endpoints}.ts`。
  - `runtime-endpoints.ts`：保持同一 phase。

#### 批次 8：oa-workflow 只读 exact（流程图/下一节点）

- 端点：
  - `GET/POST /app/oa/workflow/image/run`
  - `GET/POST /app/oa/workflow/task/next`
  - `GET/POST /app/oa/workflow/undo/next-deal-user`
- 文件改动：
  - 扩展 `apps/api/server/modules/oa-workflow/{repository,service,legacy-adapter,legacy-endpoints}.ts`。

#### 批次 9：oa-workflow 写入口 guarded（表单保存/更新）

- 端点：
  - `POST /app/oa/workflow/form/save`
  - `POST /app/oa/workflow/form/update`
- 文件改动：
  - `oa-workflow/legacy-adapter.ts`：新增 `guardedWrite`。
  - `oa-workflow/legacy-endpoints.ts`：注册 POST-only。
  - `runtime-endpoints.ts`：phase=`phase7-oa-workflow-guarded-write`，cutoverStatus=`blocked-for-execution`。

#### 批次 10：oa-workflow 写入口 guarded（审批）

- 端点：
  - `POST /app/oa/workflow/audit`
  - `POST /app/oa/workflow/undo/audit`
- 文件改动：
  - 同批次 9，追加 2 条 POST-only guarded。

#### 批次 11：repair 只读 exact

- 端点：
  - `GET/POST /app/ownerRepair.listStaffFinishRepairs`
  - `GET/POST /app/ownerRepair.listStaffRepairs`
- 文件改动：
  - `apps/api/server/modules/repair/{types,repository,service,legacy-adapter,legacy-endpoints}.ts`：新增只读方法。
  - `repairLegacyAdapterEvidence`：移出 `notCovered`，加入 `endpoints`。
  - `runtime-endpoints.ts`：保持 `phase7-repair-readonly` 与 `app-shadow-allowlist`。
  - 更新 `repair-legacy-endpoints.test.ts`、`app-legacy-gap-registry.test.ts`、infra 测试。

#### 批次 12：repair 写入口 guarded（工单更新/派单/办结）

- 端点：
  - `POST /app/ownerRepair.updateOwnerRepair`
  - `POST /app/ownerRepair.repairDispatch`
  - `POST /app/ownerRepair.repairFinish`
- 文件改动：
  - `apps/api/server/modules/repair/legacy-adapter.ts`：新增/复用 `guardedWrite`。
  - `apps/api/server/modules/repair/legacy-endpoints.ts`：注册 3 条 POST-only。
  - `runtime-endpoints.ts`：对应 URL 返回 `blocked-for-execution`。
  - `repairLegacyAdapterEvidence`：将 3 条加入 `guardedEndpoints`，移出 `notCovered`。

#### 批次 13：repair 写入口 guarded（结束/开始/暂停）

- 端点：
  - `POST /app/ownerRepair.repairEnd`
  - `POST /app/ownerRepair.repairStart`
  - `POST /app/ownerRepair.repairStop`
- 文件改动：同批次 12。

#### 批次 14：repair 写入口 guarded（抢单/评价回复）

- 端点：
  - `POST /app/ownerRepair.grabbingRepair`
  - `POST /app/repair.replyRepairAppraise`
- 文件改动：同批次 12。

#### 批次 15：resource 只读 exact

- 端点：
  - `GET/POST /app/resourceStore.listUserStorehouses`
  - `GET/POST /app/resourceStoreType.listResourceStoreTypes`
- 文件改动：
  - `apps/api/server/modules/resource/{types,repository,service,legacy-adapter,legacy-endpoints}.ts`：新增 `listUserStorehouses`、`listResourceStoreTypes` 只读方法；响应包为 `{ success, code, message, data, timestamp }`。
  - `resourceLegacyAdapterEvidence`：将 2 条加入 `endpoints`，移出 `notCovered`。
  - `runtime-endpoints.ts`：保持 `phase7-resource-readonly` 与 `app-shadow-allowlist`。
  - 更新 `resource-legacy-endpoints.test.ts`、`app-legacy-gap-registry.test.ts`、infra 测试。

#### 批次 16：resource 写入口 guarded（出入库/采购）

- 端点：
  - `POST /app/collection/resourceOut`
  - `POST /app/purchase/resourceEnter`
  - `POST /app/purchaseApply.deletePurchaseApply`
- 文件改动：
  - `apps/api/server/modules/resource/legacy-adapter.ts`：复用 `guardedWrite`。
  - `apps/api/server/modules/resource/legacy-endpoints.ts`：注册 3 条 POST-only。
  - `runtime-endpoints.ts`：对应 URL 返回 `blocked-for-execution`。
  - `resourceLegacyAdapterEvidence`：加入 `guardedEndpoints`。

#### 批次 17：resource 写入口 guarded（调拨/删除/转赠）

- 端点：
  - `POST /app/resourceStore.allocationStoreEnter`
  - `POST /app/resourceStore.deleteAllocationStorehouse`
  - `POST /app/resourceStore.saveAllocationUserStorehouse`
- 文件改动：同批次 16。

#### 批次 18：resource 写入口 guarded（归还/报废）

- 端点：
  - `POST /app/resourceStore.saveResourceReturn`
  - `POST /app/resourceStore.saveResourceScrap`
- 文件改动：同批次 16。

#### 批次 19：staff 动态路由标记 not-candidate

- 端点：
  - `GET /app/staff/:staffId`
- 文件改动：
  - `apps/api/server/modules/staff/legacy-adapter.ts`：`staffLegacyAdapterEvidence.notCovered` 显式保留 `/app/staff/:staffId`，并说明为动态路由、当前 exact registry 不支持。
  - `apps/api/server/shared/runtime/runtime-endpoints.ts`：无需注册，但需在 `getStaffLegacyPhase`/`getStaffLegacyCutoverStatus` 或 evidence 注释中说明该路径为 `not-candidate`。
  - `apps/api/tests/infra/phase7-api-contracts.test.ts`：增加 `/app/staff/:staffId` 未注册且为 not-candidate 的断言。

## 4. 验证命令

### 4.1 每批通用验证

每批实现后先运行对应模块的 legacy 测试，再运行 runtime/infra 矩阵：

```bash
# 新模块/已有模块 legacy 测试（例如 property-application）
pnpm -F @01s-11comm/api exec vitest run \
  tests/legacy/property-application-legacy-endpoints.test.ts

# runtime/infra 矩阵
pnpm -F @01s-11comm/api exec vitest run \
  tests/runtime/app-legacy-gap-registry.test.ts \
  tests/runtime/endpoint-registry.test.ts \
  tests/runtime/legacy-dispatch-fallback-drill.test.ts \
  tests/infra/endpoint-manifest.test.ts \
  tests/infra/app-legacy-module-layering.test.ts \
  tests/infra/phase7-api-contracts.test.ts

# typecheck
pnpm -F @01s-11comm/api run typecheck
```

### 4.2 全量验证（所有批次完成后）

```bash
# 包级测试
pnpm -F @01s-11comm/api test:infra

# legacy/runtime 全量
pnpm -F @01s-11comm/api exec vitest run \
  tests/runtime tests/legacy tests/infra

# 指定关键测试文件（与任务 1208 检查点对齐）
pnpm -F @01s-11comm/api exec vitest run \
  tests/legacy tests/runtime \
  tests/admin/contract-upload-r2-blocked.test.ts \
  tests/admin/contract-change-draft-crud.test.ts

# 类型检查与构建
pnpm -F @01s-11comm/api run typecheck
pnpm -F @01s-11comm/api build:node

# OpenSpec 严格校验
openspec validate migrate-superpowers-docs-to-openspec-longtask --strict

# 行尾检查
git diff --check -- apps/api/server/modules apps/api/server/shared/runtime \
  apps/api/tests
```

### 4.3 关键断言（每批必须覆盖）

- 红灯阶段：`findEndpointDefinition` 返回 `undefined`、dispatch 404、`remainingAppLegacyGapPaths` 包含该 URL。
- 绿灯阶段：
  - 只读 exact：fallback 关闭时由 `apps/api` 返回数据，不触发旧 app fallback `fetch`。
  - POST-only guarded：fallback 关闭时返回 `409 PHASE7_MUTATION_GUARDED`，`GET` 为 `undefined`。
  - not-candidate：`/app/staff/:staffId` 仍保持未注册，测试明确断言其为动态路由不支持 exact。
- `runtimeEndpointManifest` 中对应 URL 的 `cutoverStatus` 必须收敛为 `app-shadow-allowlist`（只读）或 `blocked-for-execution`（guarded），不允许残留模糊状态。

## 5. 风险与 no-go 声明

1. **本计划只处理 exact handler 注册与状态收敛**，不代表真实 DB-backed、生产 App H5 Network、写入读回回滚、shadow-off、dry-run 或 `apps/app/server/**` 删除许可。
2. 所有写入口当前按 **guarded exact** 处理，不执行真实 CUD；真实写入需单独开启受控写入窗口并补充 read-back/rollback/residual check 证据。
3. `oa-workflow` 与 `renovation` 为新模块，需按现有分层（types/repository/service/runtime/legacy-adapter/legacy-endpoints）新建，避免直接调用旧 `apps/app/server`。
4. `/app/staff/:staffId` 因当前 registry 不支持动态路由，建议列为 **not-candidate**；若后续需要泛化详情，应改造 registry 或迁移为 admin-canonical REST 路径。
5. 每批完成后必须同步 `old-service-retirement-candidates.md`、`app-retirement-ledger.md`、`retirement-evidence-matrix.md` 及 OpenSpec 台账，确保后续 fresh scan 基线一致。
