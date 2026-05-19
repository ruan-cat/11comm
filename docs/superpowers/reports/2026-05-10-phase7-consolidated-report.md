# 2026-05-10 Phase7 阶段探索与状态汇总报告

**日期**: 2026-05-10
**阶段**: Phase 7 旧服务退役准备
**探索团队**: phase7-exploration（4 个并行探索子代理）

---

## 1. Admin 旧 API 端点状态

### 1.1 统计摘要

| 指标                | 数量          |
| ------------------- | ------------- |
| 旧 API 文件总数     | **155**       |
| 旧 endpoint 总数    | **155**       |
| 已迁移到 `apps/api` | **11** (7.1%) |
| 未迁移 endpoint     | **144**       |

### 1.2 已迁移端点清单

已迁移至 `apps/api/server/routes/api/` 的 11 个端点，分布在 3 个业务域：

#### expense-manage (7 endpoints)

- `property-manage/expense-manage/expense-item-setting/create.post.ts`
- `property-manage/expense-manage/expense-item-setting/delete.post.ts`
- `property-manage/expense-manage/expense-item-setting/detail.post.ts`
- `property-manage/expense-manage/expense-item-setting/list.post.ts`
- `property-manage/expense-manage/expense-item-setting/update.post.ts`
- `property-manage/expense-manage/house-charge/detail.post.ts`
- `property-manage/expense-manage/house-charge/list.post.ts`

#### repairs-manage (3 endpoints)

- `property-manage/repairs-manage/issues/list.post.ts`
- `property-manage/repairs-manage/repairs-setting/list.post.ts`
- `property-manage/repairs-manage/repairs-todo/list.post.ts`

#### report-manage (1 endpoint)

- `property-manage/report-manage/payment-details-form/list.post.ts`

### 1.3 未迁移端点清单（按业务域）

#### property-manage (88 endpoints across 8 sub-domains)

| 子域                  | 端点数量 | 典型路径示例                                                                     |
| --------------------- | -------- | -------------------------------------------------------------------------------- |
| contract-manage       | 25       | `property-manage/contract-manage/archive/list.post.ts`                           |
| expense-manage        | 16       | `property-manage/expense-manage/cancel-fee/list.post.ts`                         |
| report-manage         | 13       | `property-manage/report-manage/arrears-details-list/list.post.ts`                |
| house-property-manage | 10       | `property-manage/house-property-manage/owner-account/list.post.ts`               |
| repairs-manage        | 7        | `property-manage/repairs-manage/repairs-have-done/list.post.ts`                  |
| community-manage      | 7        | `property-manage/community-manage/building-space-structure-diagram/list.post.ts` |
| patrol-manage         | 6        | `property-manage/patrol-manage/plan/list.post.ts`                                |
| parking-manage        | 4        | `property-manage/parking-manage/carport-info/list.post.ts`                       |

#### setting-manage (28 endpoints across 2 sub-domains)

| 子域            | 端点数量 | 典型路径示例                                                        |
| --------------- | -------- | ------------------------------------------------------------------- |
| system-manage   | 20       | `setting-manage/system-manage/community-configuration/list.post.ts` |
| organize-manage | 8        | `setting-manage/organize-manage/org-info/list.post.ts`              |

#### dev-team (24 endpoints across 3 sub-domains)

| 子域          | 端点数量 | 典型路径示例                                       |
| ------------- | -------- | -------------------------------------------------- |
| config-manage | 20       | `dev-team/config-manage/center/list.post.ts`       |
| menu-manage   | 3        | `dev-team/menu-manage/catalog/list.post.ts`        |
| cache-manage  | 1        | `dev-team/cache-manage/refresh-cache/list.post.ts` |

#### operation-team (13 endpoints across 4 sub-domains)

| 子域                 | 端点数量 | 典型路径示例                                                    |
| -------------------- | -------- | --------------------------------------------------------------- |
| system-manage        | 5        | `operation-team/system-manage/change-password/list.post.ts`     |
| data-manage          | 3        | `operation-team/data-manage/community-information/list.post.ts` |
| report-configuration | 3        | `operation-team/report-configuration/report-info/list.post.ts`  |
| merchant-manage      | 2        | `operation-team/merchant-manage/merchant-admin/list.post.ts`    |

#### 其他 (2 endpoints)

| 路径             | 端点数量 |
| ---------------- | -------- |
| j1-dashboard     | 1        |
| debug-env.get.ts | 1        |

### 1.4 典型未迁移端点示例路径

#### contract-manage (未迁移 25 endpoints)

```plain
property-manage/contract-manage/archive/list.post.ts
property-manage/contract-manage/attachment/list.post.ts
property-manage/contract-manage/change/create.post.ts
property-manage/contract-manage/change/delete.post.ts
property-manage/contract-manage/change/detail.post.ts
property-manage/contract-manage/change/list.post.ts
property-manage/contract-manage/change/update.post.ts
property-manage/contract-manage/clause/list.post.ts
property-manage/contract-manage/draft-contract/create.post.ts
property-manage/contract-manage/draft-contract/delete.post.ts
property-manage/contract-manage/draft-contract/detail.post.ts
property-manage/contract-manage/draft-contract/list.post.ts
property-manage/contract-manage/draft-contract/update.post.ts
property-manage/contract-manage/expire/list.post.ts
property-manage/contract-manage/first-party/list.post.ts
property-manage/contract-manage/print/list.post.ts
property-manage/contract-manage/review/list.post.ts
property-manage/contract-manage/second-party/list.post.ts
property-manage/contract-manage/template/list.post.ts
property-manage/contract-manage/type/list.post.ts
property-manage/contract-manage/upload/abort.post.ts
property-manage/contract-manage/upload/complete.post.ts
property-manage/contract-manage/upload/init.post.ts
property-manage/contract-manage/upload/sign-part.post.ts
property-manage/contract-manage/upload/status.post.ts
```

#### expense-manage (未迁移 16 endpoints)

```plain
property-manage/expense-manage/cancel-fee/list.post.ts
property-manage/expense-manage/contracte-charge/list.post.ts
property-manage/expense-manage/discount-apply/list.post.ts
property-manage/expense-manage/discount-setting/list.post.ts
property-manage/expense-manage/discount-type/list.post.ts
property-manage/expense-manage/expense-summary-table/list.post.ts
property-manage/expense-manage/meter-reading-type/list.post.ts
property-manage/expense-manage/overdue-payment-information/list.post.ts
property-manage/expense-manage/payment-review/list.post.ts
property-manage/expense-manage/refund-review/list.post.ts
property-manage/expense-manage/reminder-for-overdue-payments/list.post.ts
property-manage/expense-manage/reprint-voucher/list.post.ts
property-manage/expense-manage/vehicle-charge/list.post.ts
property-manage/expense-manage/water-and-electricity-meter-reading/list.post.ts
```

#### report-manage (未迁移 13 endpoints)

```plain
property-manage/report-manage/arrears-details-list/list.post.ts
property-manage/report-manage/data-statistics/list.post.ts
property-manage/report-manage/deposit-report/list.post.ts
property-manage/report-manage/expense-summary-table/list.post.ts
property-manage/report-manage/fee-reminder/list.post.ts
property-manage/report-manage/no-charge-house/list.post.ts
property-manage/report-manage/outstanding-fees-analysis/list.post.ts
property-manage/report-manage/owner-payment-details/list.post.ts
property-manage/report-manage/patrol-report/list.post.ts
property-manage/report-manage/repair-report-form/list.post.ts
property-manage/report-manage/repair-reports-summary-table/list.post.ts
property-manage/report-manage/statement-expenses/list.post.ts
```

### 1.5 迁移进度分析

| 业务域                | 未迁移数 | 迁移率 |
| --------------------- | -------- | ------ |
| contract-manage       | 25       | 0%     |
| expense-manage        | 16       | 8%     |
| report-manage         | 13       | 8%     |
| system-manage         | 20       | 0%     |
| house-property-manage | 10       | 0%     |
| repairs-manage        | 7        | 43%    |

---

## 2. App Legacy API 端点状态

### 2.1 统计摘要

| 指标                                | 数值 |
| :---------------------------------- | :--- |
| endpoints.ts 模块文件数             | 29   |
| Endpoint 总数（含 test）            | ~228 |
| 业务 endpoint 总数（剔除 /test/\*） | ~221 |
| 已迁移到 `apps/api` Nitro 层        | 19   |
| 仍在 legacy fallback 兼容           | ~209 |
| Legacy fallback 已识别冲突端点      | 4    |

### 2.2 已迁移端点清单（apps/api Nitro 层）

| #   | URL                                                      | 方法     | 模块                        | 状态                      |
| :-- | :------------------------------------------------------- | :------- | :-------------------------- | :------------------------ |
| 1   | `/app/fee.listFee`                                       | GET/POST | fee                         | app-shadow-allowlist      |
| 2   | `/app/fee.queryFeeDetail`                                | GET/POST | fee                         | app-shadow-allowlist      |
| 3   | `/app/feeApi/listOweFees`                                | GET/POST | fee                         | app-shadow-allowlist      |
| 4   | `/app/payment.nativeQrcodePayment`                       | POST     | fee                         | **blocked-for-execution** |
| 5   | `/app/oweFeeCallable.listOweFeeCallable`                 | GET/POST | fee                         | app-shadow-allowlist      |
| 6   | `/app/oweFeeCallable.writeOweFeeCallable`                | POST     | fee                         | **blocked-for-execution** |
| 7   | `/app/fee.saveRoomCreateFee`                             | POST     | fee                         | **blocked-for-execution** |
| 8   | `/app/feeConfig.listFeeConfigs`                          | GET/POST | fee                         | app-shadow-allowlist      |
| 9   | `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | GET/POST | fee                         | app-shadow-allowlist      |
| 10  | `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | GET/POST | fee                         | app-shadow-allowlist      |
| 11  | `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | GET/POST | fee                         | app-shadow-allowlist      |
| 12  | `/app/dataReport.queryFeeDataReport`                     | GET/POST | fee                         | app-shadow-allowlist      |
| 13  | `/app/ownerRepair.listOwnerRepairs`                      | GET/POST | repair                      | app-shadow-allowlist      |
| 14  | `/app/ownerRepair.queryOwnerRepair`                      | GET/POST | repair                      | app-shadow-allowlist      |
| 15  | `/app/ownerRepair.saveOwnerRepair`                       | POST     | repair                      | **blocked-for-execution** |
| 16  | `/app/repairSetting.listRepairSettings`                  | GET/POST | repair                      | app-shadow-allowlist      |
| 17  | `/app/dict.queryRepairStates`                            | GET/POST | repair                      | app-shadow-allowlist      |
| 18  | `/callComponent/core/list`                               | GET/POST | repair/property-application | app-shadow-allowlist      |
| 19  | `/callComponent/ownerRepair.appraiseRepair`              | POST     | repair                      | **blocked-for-execution** |

### 2.3 Legacy Fallback 端点清单

以下端点是 Batch 1 前的 fallback 关注项；Batch 1 后 `/callComponent/core/list` 已由 apps/api in-memory compat handler 承载，`/callComponent/ownerRepair.appraiseRepair` 已登记但默认 guard，均不能写成 DB 完成：

#### /callComponent/\*\* 端点（2 个）

| #   | URL                                         | 方法     | 定义位置                                                   | 说明                                                       |
| :-- | :------------------------------------------ | :------- | :--------------------------------------------------------- | :--------------------------------------------------------- |
| 1   | `/callComponent/core/list`                  | GET/POST | `repair/endpoints.ts`, `property-application/endpoints.ts` | 已迁入 apps/api compat；in-memory-only；需 Chrome MCP 证据 |
| 2   | `/callComponent/ownerRepair.appraiseRepair` | POST     | `repair/endpoints.ts`                                      | 已登记 apps/api compat；默认 `409 PHASE7_MUTATION_GUARDED` |

#### /app/\*\* Legacy Fallback 端点（部分冲突示例）

| #   | URL                                             | 方法     | 冲突位置                                                 | 说明                                |
| :-- | :---------------------------------------------- | :------- | :------------------------------------------------------- | :---------------------------------- |
| 1   | `/app/fee.queryFeeDetail`                       | GET/POST | `fee/endpoints.ts` + `property-application/endpoints.ts` | 费用详情，property-application 复用 |
| 2   | `/app/resourceStore.listResourceStores`         | GET      | `purchase/endpoints.ts` + `resource/endpoints.ts`        | 物资查询，两模块冲突                |
| 3   | `/app/purchase/purchaseApply`                   | POST     | `purchase/endpoints.ts` + `resource/endpoints.ts`        | 采购申请，两模块冲突                |
| 4   | `/app/resourceStoreType.listResourceStoreTypes` | GET/POST | `repair/endpoints.ts` + `resource/endpoints.ts`          | 物资类型，两模块冲突                |

### 2.4 未迁移端点按业务域分类统计

#### activity（活动管理）— 11 端点

| URL                                | 方法     |
| :--------------------------------- | :------- |
| `/app/activities.listActivitiess`  | GET/POST |
| `/app/activities.saveActivities`   | POST     |
| `/app/activities.updateActivities` | POST     |
| `/app/activities.deleteActivities` | POST     |
| `/app/activities.increaseView`     | POST     |
| `/app/activities.likeActivity`     | POST     |
| `/app/activities.updateStatus`     | POST     |
| `/app/activities.updateLike`       | POST     |
| `/app/activities.updateCollect`    | POST     |

#### appointment（预约管理）— 2 端点

| URL                                                  | 方法     |
| :--------------------------------------------------- | :------- |
| `/app/communitySpace.listCommunitySpaceConfirmOrder` | GET/POST |
| `/app/communitySpace.saveCommunitySpaceConfirmOrder` | POST     |

#### complaint（投诉管理）— 7 端点

| URL                                             | 方法     |
| :---------------------------------------------- | :------- |
| `/app/auditUser.listAuditComplaints`            | GET/POST |
| `/app/auditUser.listAuditHistoryComplaints`     | GET/POST |
| `/app/complaint`                                | POST     |
| `/app/complaint.auditComplaint`                 | POST     |
| `/app/complaint.listComplaintEvent`             | GET/POST |
| `/app/complaintAppraise.listComplaintAppraise`  | GET/POST |
| `/app/complaintAppraise.replyComplaintAppraise` | POST     |

#### contact（通讯录）— 8 端点

| URL                                    | 方法     |
| :------------------------------------- | :------- |
| `/app/contact.listContacts`            | GET/POST |
| `/app/contact.getContactDetail`        | GET/POST |
| `/app/contact.getContactsByDepartment` | GET/POST |
| `/app/contact.searchContacts`          | GET/POST |
| `/app/contact.getDepartments`          | GET/POST |
| `/app/contact.updateOnlineStatus`      | POST     |
| `/app/contact.getFavoriteContacts`     | GET/POST |
| `/app/contact.getEmergencyContacts`    | GET/POST |

#### coupon（优惠券/积分）— 6 端点

| URL                                                | 方法     |
| :------------------------------------------------- | :------- |
| `/app/couponProperty.listCouponPropertyUserDetail` | GET/POST |
| `/app/couponProperty.writeOffCouponPropertyUser`   | POST     |
| `/app/integral.listIntegralSetting`                | GET/POST |
| `/app/integral.useIntegral`                        | POST     |
| `/app/integral.listIntegralUserDetail`             | GET/POST |
| `/app/reserveOrder.listReserveGoodsConfirmOrder`   | GET/POST |
| `/app/reserveOrder.saveReserveGoodsConfirmOrder`   | POST     |

#### floor（楼层管理）— 2 端点

| URL                           | 方法     |
| :---------------------------- | :------- |
| `/app/floor.queryFloors`      | GET/POST |
| `/app/floor.queryFloorDetail` | GET/POST |

#### inspection（巡检管理）— 8 端点

| URL                                         | 方法     |
| :------------------------------------------ | :------- |
| `/app/inspection.listInspectionTasks`       | GET/POST |
| `/app/inspection.getTodayReport`            | GET/POST |
| `/app/inspection.listInspectionItemTitles`  | GET/POST |
| `/app/inspection.listInspectionTaskDetails` | GET/POST |
| `/app/inspection.submitInspection`          | POST     |
| `/app/inspection.transferTask`              | POST     |
| `/app/staff.listStaffs`                     | GET/POST |

#### item-release（物品放行）— 6 端点

| URL                                         | 方法     |
| :------------------------------------------ | :------- |
| `/app/itemRelease.queryUndoItemReleaseV2`   | GET/POST |
| `/app/itemRelease.queryFinishItemReleaseV2` | GET/POST |
| `/app/itemRelease.getItemRelease`           | GET/POST |
| `/app/itemRelease.getItemReleaseRes`        | GET/POST |
| `/app/itemRelease.queryOaWorkflowUser`      | GET/POST |
| `/app/itemRelease.auditItemRelease`         | POST     |

#### maintenance（设备保养）— 7 端点

| URL                                           | 方法     |
| :-------------------------------------------- | :------- |
| `/app/maintenance.listMaintenanceTasks`       | GET/POST |
| `/app/maintenance.queryMaintenanceTask`       | GET/POST |
| `/app/maintenance.listMaintenanceTaskDetails` | GET/POST |
| `/app/maintenance.startMaintenanceTask`       | POST     |
| `/app/maintenance.completeMaintenanceTask`    | POST     |
| `/app/maintenance.submitMaintenanceSingle`    | POST     |
| `/app/maintenance.transferMaintenanceTask`    | POST     |

#### meter（仪表管理）— 10 端点

| URL                                 | 方法     |
| :---------------------------------- | :------- |
| `/app/meter.listMeterWaters`        | GET/POST |
| `/app/meter.queryFeeTypes`          | GET/POST |
| `/app/meter.queryFeeTypesItems`     | GET/POST |
| `/app/meter.listMeterType`          | GET/POST |
| `/app/meter.queryPreMeterWater`     | GET/POST |
| `/app/meter.saveMeterWater`         | POST     |
| `/app/meter.listFloorShareReading`  | GET/POST |
| `/app/meter.listFloorShareMeter`    | GET/POST |
| `/app/meter.saveFloorShareReading`  | POST     |
| `/app/meter.auditFloorShareReading` | POST     |

#### notice（公告管理）— 1 端点

| URL                       | 方法     |
| :------------------------ | :------- |
| `/app/notice.listNotices` | GET/POST |

#### oa-workflow（工作流）— 15 端点

| URL                                    | 方法     |
| :------------------------------------- | :------- |
| `/app/oa/workflow/query`               | GET/POST |
| `/app/oa/workflow/form/query`          | GET/POST |
| `/app/oa/workflow/form/data/query`     | GET/POST |
| `/app/oa/workflow/form/save`           | POST     |
| `/app/oa/workflow/form/update`         | POST     |
| `/app/oa/workflow/task/undo/query`     | GET/POST |
| `/app/oa/workflow/task/his/query`      | GET/POST |
| `/app/oa/workflow/user/query`          | GET/POST |
| `/app/oa/workflow/image/run`           | GET/POST |
| `/app/oa/workflow/task/next`           | GET/POST |
| `/app/oa/workflow/audit`               | POST     |
| `/app/oa/workflow/undo/next-deal-user` | GET/POST |
| `/app/oa/workflow/undo/audit`          | POST     |

#### owner（业主管理）— 4 端点

| URL                               | 方法     |
| :-------------------------------- | :------- |
| `/app/owner.queryOwnerAndMembers` | GET/POST |
| `/app/owner.saveRoomOwner`        | POST     |
| `/app/owner.editOwner`            | POST     |
| `/app/owner.deleteOwner`          | POST     |

#### parking（停车场管理）— 13 端点

| URL                                        | 方法     |
| :----------------------------------------- | :------- |
| `/app/owner.queryOwnerCars`                | GET/POST |
| `/app/parkingArea.listParkingAreas`        | GET/POST |
| `/app/machine.listParkingAreaMachines`     | GET/POST |
| `/app/machine.openDoor`                    | POST     |
| `/app/machine/closeDoor`                   | POST     |
| `/app/machine.customCarInOutCmd`           | POST     |
| `/app/carInout.listCarInParkingAreaCmd`    | GET/POST |
| `/app/parkingCoupon.listParkingCouponCar`  | GET/POST |
| `/app/tempCarFee.getTempCarFeeOrder`       | GET/POST |
| `/app/carInoutDetail.listCarInoutDetail`   | GET/POST |
| `/app/carInoutPayment.listCarInoutPayment` | GET/POST |
| `/app/machine.getBarrierCloudVideo`        | GET/POST |

#### profile（用户档案）— 5 端点

| URL                                  | 方法     |
| :----------------------------------- | :------- |
| `/app/profile.getUserProfile`        | GET/POST |
| `/app/profile.listCommunities`       | GET/POST |
| `/app/profile.changeCommunity`       | POST     |
| `/app/profile.changePassword`        | POST     |
| `/app/profile.listAttendanceRecords` | GET/POST |

#### property-application（房屋申请）— 10 端点

| URL                                                               | 方法     |
| :---------------------------------------------------------------- | :------- |
| `/app/applyRoomDiscount/queryApplyRoomDiscount`                   | GET/POST |
| `/app/applyRoomDiscount/updateApplyRoomDiscount`                  | POST     |
| `/app/applyRoomDiscount/updateReviewApplyRoomDiscount`            | POST     |
| `/app/feeDiscount.queryFeeDiscount`                               | GET/POST |
| `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord`       | GET/POST |
| `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail` | GET/POST |
| `/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord`         | POST     |
| `/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord`         | POST     |

#### purchase（采购管理）— 3 端点

| URL                                 | 方法 |
| :---------------------------------- | :--- |
| `/app/purchase/urgentPurchaseApply` | POST |

#### renovation（装修管理）— 8 端点

| URL                                                   | 方法     |
| :---------------------------------------------------- | :------- |
| `/app/roomRenovation/queryRoomRenovation`             | GET/POST |
| `/app/roomRenovation/updateRoomToExamine`             | POST     |
| `/app/roomRenovation/saveRoomRenovationDetail`        | POST     |
| `/app/roomRenovation/updateRoomRenovationState`       | POST     |
| `/app/roomRenovation/queryRoomRenovationRecord`       | GET/POST |
| `/app/roomRenovation/queryRoomRenovationRecordDetail` | GET/POST |
| `/app/roomRenovation/updateRoomDecorationRecord`      | POST     |
| `/app/roomRenovation/deleteRoomRenovationRecord`      | POST     |

#### repair（维修管理）— 28 端点

| URL                                       | 方法     |
| :---------------------------------------- | :------- |
| `/app/ownerRepair.listStaffRepairs`       | GET/POST |
| `/app/ownerRepair.listStaffFinishRepairs` | GET/POST |
| `/app/ownerRepair.updateOwnerRepair`      | POST     |
| `/app/ownerRepair.repairDispatch`         | POST     |
| `/app/ownerRepair.repairFinish`           | POST     |
| `/app/ownerRepair.repairEnd`              | POST     |
| `/app/repair.replyRepairAppraise`         | POST     |
| `/app/ownerRepair.listRepairStaffs`       | GET/POST |
| `/app/repair.listRepairTypeUsers`         | GET/POST |
| `/app/resourceStore.listUserStorehouses`  | GET/POST |
| `/app/ownerRepair.getRepairStatistics`    | GET/POST |
| `/app/ownerRepair.repairStart`            | POST     |
| `/app/ownerRepair.repairStop`             | POST     |
| `/app/ownerRepair.grabbingRepair`         | POST     |
| `/app/ownerRepair.listRepairStaffRecords` | GET/POST |
| `/app/dict.queryPayTypes`                 | GET/POST |
| `/app/resourceStore.listResources`        | GET/POST |

#### resource（物资管理）— 20 端点

| URL                                                 | 方法 |
| :-------------------------------------------------- | :--- |
| `/app/resourceStore.listStorehouses`                | GET  |
| `/app/purchaseApply.listPurchaseApplys`             | GET  |
| `/app/itemRelease.listItemRelease`                  | GET  |
| `/app/resourceStore.listAllocationStorehouseApplys` | GET  |
| `/app/purchaseApply.listMyAuditOrders`              | GET  |
| `/app/itemRelease.queryUndoItemRelease`             | GET  |
| `/app/resourceStore.listAllocationStoreAuditOrders` | GET  |
| `/app/collection/resourceOut`                       | POST |
| `/app/resourceStore.saveAllocationStorehouse`       | POST |
| `/app/purchaseApply.auditApplyOrder`                | POST |
| `/app/itemRelease.auditUndoItemRelease`             | POST |
| `/app/resourceStore.auditAllocationStoreOrder`      | POST |
| `/app/purchase/resourceEnter`                       | POST |
| `/app/purchaseApply.deletePurchaseApply`            | POST |
| `/app/resourceStore.deleteAllocationStorehouse`     | POST |
| `/app/resourceStore.allocationStoreEnter`           | POST |
| `/app/resourceStore.saveAllocationUserStorehouse`   | POST |
| `/app/resourceStore.listAllocationStorehouses`      | GET  |
| `/app/resourceStore.queryMyResourceStoreInfo`       | GET  |
| `/app/resourceStore.saveResourceReturn`             | POST |
| `/app/resourceStore.saveResourceScrap`              | POST |

#### room（房屋管理）— 2 端点

| URL                         | 方法     |
| :-------------------------- | :------- |
| `/app/room.queryRooms`      | GET/POST |
| `/app/room.queryRoomDetail` | GET/POST |

#### staff（员工管理）— 9 端点

| URL                               | 方法     |
| :-------------------------------- | :------- |
| `/app/query.staff.infos`          | GET/POST |
| `/app/staff/by-department`        | GET/POST |
| `/app/staff/search`               | GET/POST |
| `/app/staff/organizations`        | GET      |
| `/app/staff/update-online-status` | POST     |
| `/app/staff/online`               | GET      |
| `/app/staff/add`                  | POST     |
| `/app/staff/:staffId`             | GET      |

#### unit（单元管理）— 2 端点

| URL                         | 方法     |
| :-------------------------- | :------- |
| `/app/unit.queryUnits`      | GET/POST |
| `/app/unit.queryUnitDetail` | GET/POST |

#### video（视频监控）— 3 端点

| URL                                  | 方法     |
| :----------------------------------- | :------- |
| `/app/video.listMonitorArea`         | GET/POST |
| `/app/video.listStaffMonitorMachine` | GET/POST |
| `/app/video.getPlayVideoUrl`         | GET/POST |

#### visit（访问管理）— 3 端点

| URL                         | 方法     |
| :-------------------------- | :------- |
| `/app/visit.getVisit`       | GET/POST |
| `/app/visit.getVisitDetail` | GET/POST |
| `/app/visit.auditVisit`     | POST     |

#### work-order（工作单管理）— 15 端点

| URL                          | 方法     |
| :--------------------------- | :------- |
| `/app/workorder/todo/list`   | GET/POST |
| `/app/workorder/copy/list`   | GET/POST |
| `/app/workorder/detail`      | GET/POST |
| `/app/workorder/create`      | POST     |
| `/app/workorder/update`      | POST     |
| `/app/workorder/start`       | POST     |
| `/app/workorder/complete`    | POST     |
| `/app/workorder/audit`       | POST     |
| `/app/workorder/cancel`      | POST     |
| `/app/workorder/task/list`   | GET/POST |
| `/app/workorder/task/items`  | GET/POST |
| `/app/workorder/copy/finish` | POST     |

#### iot（充电桩/开门记录）— 3 端点

| URL                                      | 方法     |
| :--------------------------------------- | :------- |
| `/app/iot/listChargeMachineBmoImpl`      | GET/POST |
| `/app/iot/listChargeMachineOrderBmoImpl` | GET/POST |
| `/app/iot/listChargeMachinePortBmoImpl`  | GET/POST |

#### machine（设备管理）— 1 端点

| URL                               | 方法     |
| :-------------------------------- | :------- |
| `/app/machine/listMachineRecords` | GET/POST |

### 2.5 关键发现

#### 多模块冲突端点

以下端点在多个模块中重复定义：

| URL                                             | 冲突模块                     |
| :---------------------------------------------- | :--------------------------- |
| `/callComponent/core/list`                      | repair, property-application |
| `/app/fee.queryFeeDetail`                       | fee, property-application    |
| `/app/resourceStore.listResourceStores`         | purchase, resource           |
| `/app/purchase/purchaseApply`                   | purchase, resource           |
| `/app/resourceStoreType.listResourceStoreTypes` | repair, resource             |

#### 已迁移覆盖率

- **fee 模块**: 12/17 端点已迁移（70.6%）
- **repair/callComponent 模块**: 7/30 端点已迁移到 Nitro 兼容层（DB 覆盖仍为 0）
- **整体覆盖率**: 19/~221 端点（8.6%）

#### Legacy Fallback 机制

所有 `/app/**` 和 `/callComponent/**` 路径的请求，如果在 Nitro 层 404，会自动 fallback 代理到 `PHASE7_LEGACY_APP_FALLBACK_BASE_URL`（默认 `https://01s-11-app-server.ruan-cat.com`）。Batch 1 后两条 `/callComponent/**` 已进入 registry，不再依赖 404 fallback，但仍是 in-memory/guard 状态。

---

## 3. apps/api 覆盖状态

### 3.1 apps/api Routes 统计

#### Admin Canonical Routes（11 个）

所有路由位于 `apps/api/server/routes/api/property-manage/`：

| #   | 路由路径                                                          | Method | Module | 状态                                      |
| --- | ----------------------------------------------------------------- | ------ | ------ | ----------------------------------------- |
| 1   | `/api/property-manage/expense-manage/expense-item-setting/list`   | POST   | fee    | cut-to-apps-api                           |
| 2   | `/api/property-manage/expense-manage/expense-item-setting/detail` | POST   | fee    | cut-to-apps-api                           |
| 3   | `/api/property-manage/expense-manage/expense-item-setting/create` | POST   | fee    | cut-to-apps-api                           |
| 4   | `/api/property-manage/expense-manage/expense-item-setting/update` | POST   | fee    | cut-to-apps-api                           |
| 5   | `/api/property-manage/expense-manage/expense-item-setting/delete` | POST   | fee    | cut-to-apps-api                           |
| 6   | `/api/property-manage/expense-manage/house-charge/list`           | POST   | fee    | cut-to-apps-api                           |
| 7   | `/api/property-manage/expense-manage/house-charge/detail`         | POST   | fee    | cut-to-apps-api                           |
| 8   | `/api/property-manage/report-manage/payment-details-form/list`    | POST   | fee    | available-in-apps-api-not-caller-verified |
| 9   | `/api/property-manage/repairs-manage/repairs-todo/list`           | POST   | repair | available-in-apps-api-not-caller-verified |
| 10  | `/api/property-manage/repairs-manage/repairs-setting/list`        | POST   | repair | available-in-apps-api-not-caller-verified |
| 11  | `/api/property-manage/repairs-manage/issues/list`                 | POST   | repair | available-in-apps-api-not-caller-verified |

#### App Legacy Routes（19 个）

来自 `runtime-endpoints.ts` 的 fee(12) + repair/callComponent(7) 定义：

##### Fee Legacy Endpoints（12 个）

| #   | 路由路径                                                 | Method   | 状态                      |
| --- | -------------------------------------------------------- | -------- | ------------------------- |
| 1   | `/app/fee.listFee`                                       | GET/POST | app-shadow-allowlist      |
| 2   | `/app/fee.queryFeeDetail`                                | GET/POST | app-shadow-allowlist      |
| 3   | `/app/feeApi/listOweFees`                                | GET/POST | app-shadow-allowlist      |
| 4   | `/app/payment.nativeQrcodePayment`                       | POST     | **blocked-for-execution** |
| 5   | `/app/oweFeeCallable.listOweFeeCallable`                 | GET/POST | app-shadow-allowlist      |
| 6   | `/app/oweFeeCallable.writeOweFeeCallable`                | POST     | **blocked-for-execution** |
| 7   | `/app/fee.saveRoomCreateFee`                             | POST     | **blocked-for-execution** |
| 8   | `/app/feeConfig.listFeeConfigs`                          | GET/POST | app-shadow-allowlist      |
| 9   | `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | GET/POST | app-shadow-allowlist      |
| 10  | `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | GET/POST | app-shadow-allowlist      |
| 11  | `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | GET/POST | app-shadow-allowlist      |
| 12  | `/app/dataReport.queryFeeDataReport`                     | GET/POST | app-shadow-allowlist      |

##### Repair / CallComponent Legacy Endpoints（7 个）

| #   | 路由路径                                    | Method   | 状态                  |
| --- | ------------------------------------------- | -------- | --------------------- |
| 1   | `/app/ownerRepair.listOwnerRepairs`         | GET/POST | app-shadow-allowlist  |
| 2   | `/app/ownerRepair.queryOwnerRepair`         | GET/POST | app-shadow-allowlist  |
| 3   | `/app/ownerRepair.saveOwnerRepair`          | POST     | blocked-for-execution |
| 4   | `/app/repairSetting.listRepairSettings`     | GET/POST | app-shadow-allowlist  |
| 5   | `/app/dict.queryRepairStates`               | GET/POST | app-shadow-allowlist  |
| 6   | `/callComponent/core/list`                  | GET/POST | app-shadow-allowlist  |
| 7   | `/callComponent/ownerRepair.appraiseRepair` | POST     | blocked-for-execution |

#### Nitro System Routes（4 个）

| 路由路径             | 用途     |
| -------------------- | -------- |
| `/__nitro/endpoints` | 端点列表 |
| `/__nitro/env`       | 环境变量 |
| `/__nitro/health`    | 健康检查 |
| `/__nitro/ready`     | 就绪检查 |

### 3.2 Service/Repository 层实现清单

#### Fee Module（完整四层架构）

| 层级               | 文件                            | 数据来源                                    |
| ------------------ | ------------------------------- | ------------------------------------------- |
| **Repository**     | `modules/fee/repository.ts`     | Neon/Drizzle DB（部分） + InMemory fallback |
| **Service**        | `modules/fee/service.ts`        | 依赖 Repository                             |
| **Admin Adapter**  | `modules/fee/admin-adapter.ts`  | 依赖 Service，输出 JsonVO                   |
| **Legacy Adapter** | `modules/fee/legacy-adapter.ts` | 依赖 Service，输出 { code, msg, data }      |
| **Runtime**        | `modules/fee/runtime.ts`        | 负责 DI，检测 hasDatabaseUrl                |

##### Repository DB 覆盖情况（Fee，已按 Batch4 更新）

| 方法                          | DB 实现          | Fallback          |
| ----------------------------- | ---------------- | ----------------- |
| `listHouseCharges`            | ✅ Drizzle       | InMemory          |
| `getHouseChargeDetail`        | ✅ Drizzle       | InMemory          |
| `listExpenseItemSettings`     | ✅ Drizzle       | InMemory          |
| `getExpenseItemSettingDetail` | ✅ Drizzle       | InMemory          |
| `createExpenseItemSetting`    | ✅ Drizzle       | InMemory          |
| `updateExpenseItemSetting`    | ✅ Drizzle       | InMemory          |
| `deleteExpenseItemSetting`    | ⚠️ 软删除策略    | InMemory          |
| `getPayFeeDetailReport`       | ✅ Drizzle       | InMemory          |
| `getDataReport`               | ✅ Drizzle       | InMemory          |
| `createNativeQrcodePayment`   | ❌ 调用 fallback | InMemory mock     |
| `listLegacyFees`              | ❌ 无 DB         | **InMemory only** |
| `listFeeDetails`              | ❌ 无 DB         | **InMemory only** |
| `listOweFees`                 | ❌ 无 DB         | **InMemory only** |
| `listOweFeeCallables`         | ❌ 无 DB         | **InMemory only** |
| `writeOweFeeCallable`         | ❌ 无 DB         | **InMemory only** |
| `saveRoomCreateFee`           | ❌ 无 DB         | **InMemory only** |
| `listFeeConfigs`              | ✅ Drizzle       | InMemory          |
| `getFeeSummaryReport`         | ✅ Drizzle       | InMemory          |
| `getRoomFeeReport`            | ❌ 无 DB         | **InMemory only** |

#### Repair Module（历史快照；最新 Batch3 状态见 §10）

| 层级               | 文件                               | 数据来源                                           |
| ------------------ | ---------------------------------- | -------------------------------------------------- |
| **Repository**     | `modules/repair/repository.ts`     | Batch3 前仅 InMemory；最新只读 DB 分支见 §10       |
| **Service**        | `modules/repair/service.ts`        | 依赖 Repository                                    |
| **Admin Adapter**  | `modules/repair/admin-adapter.ts`  | 依赖 Service，输出 JsonVO                          |
| **Legacy Adapter** | `modules/repair/legacy-adapter.ts` | 依赖 Service                                       |
| **Runtime**        | `modules/repair/runtime.ts`        | Batch3 前固定 fallback；最新只读 DB runtime 见 §10 |

##### Repository DB 覆盖情况（Repair）

| 方法                 | DB 实现  | Fallback      |
| -------------------- | -------- | ------------- |
| `listOwnerRepairs`   | ❌ 无 DB | InMemory only |
| `getOwnerRepair`     | ❌ 无 DB | InMemory only |
| `createOwnerRepair`  | ❌ 无 DB | InMemory only |
| `listRepairSettings` | ❌ 无 DB | InMemory only |
| `listRepairStates`   | ❌ 无 DB | InMemory only |

### 3.3 DB/Repository 迁移状态

#### Canonical DB 迁移完成（已接入 Neon/Drizzle）

| 端点                            | Schema 支撑         | 状态                       |
| ------------------------------- | ------------------- | -------------------------- |
| `house-charge/list`             | `exHouseCharges`    | ✅                         |
| `house-charge/detail`           | `exHouseCharges`    | ✅                         |
| `expense-item-setting/*` (CRUD) | `exExpenseItems`    | ✅                         |
| `payment-details-form/list`     | `rptPaymentDetails` | ✅                         |
| `repairs-todo/list`             | `rpRepairOrders`    | ⚠️ **Schema 存在但未接入** |
| `repairs-setting/list`          | `rpRepairSettings`  | ⚠️ **Schema 存在但未接入** |
| `issues/list`                   | `rpRepairOrders`    | ⚠️ **Schema 存在但未接入** |

#### Legacy Fallback 状态

| 类别                            | 数量  | 说明                                                                    |
| ------------------------------- | ----- | ----------------------------------------------------------------------- |
| **Legacy-only（无 DB）**        | 14 个 | fee 的欠费/催缴/配置相关全部仅 InMemory                                 |
| **blocked-for-execution**       | 4 个  | mutation 类被 phase7 guard 拦截                                         |
| **not-in-app-shadow-allowlist** | 5 个  | repair 全部 5 个 endpoint 未在 app 侧开放                               |
| **callComponent compat**        | 1 个  | `/callComponent/core/list` 已进入 app shadow allowlist，但仍是 InMemory |

### 3.4 Schema 覆盖状态

#### 费用管理（expense-manage）

| Schema Table          | API 使用                  | 状态        |
| --------------------- | ------------------------- | ----------- |
| `exExpenseItems`      | expense-item-setting CRUD | ✅ 完整支撑 |
| `exHouseCharges`      | house-charge list/detail  | ✅ 完整支撑 |
| `exPayments`          | payment-details-form      | ✅ 完整支撑 |
| `rptPaymentDetails`   | payment-details-form/list | ✅ 完整支撑 |
| `rptExpenseSummaries` | dataReport                | ✅ 完整支撑 |
| `exVehicleCharges`    | -                         | ❌ 未使用   |
| `exContractCharges`   | -                         | ❌ 未使用   |
| `exMeterReadings`     | -                         | ❌ 未使用   |
| `exOverdueReminders`  | -                         | ❌ 未使用   |

#### 报修管理（repairs-manage）

| Schema Table             | API 使用            | 状态                       |
| ------------------------ | ------------------- | -------------------------- |
| `rpRepairOrders`         | repairs-todo/issues | ⚠️ **Schema 存在但未接入** |
| `rpRepairSettings`       | repairs-setting     | ⚠️ **Schema 存在但未接入** |
| `rpRepairOrderHistories` | -                   | ❌ 未使用                  |
| `rpReturnVisits`         | -                   | ❌ 未使用                  |
| `rpPhoneRepairReports`   | -                   | ❌ 未使用                  |

#### 报表管理（report-manage）

| Schema Table          | API 使用                  | 状态      |
| --------------------- | ------------------------- | --------- |
| `rptPaymentDetails`   | payment-details-form/list | ✅        |
| `rptExpenseSummaries` | dataReport                | ✅        |
| 其他报表表            | -                         | ❌ 未使用 |

### 3.5 缺失 DB/Repository 迁移的端点清单

#### Critical（必须迁移）

| 端点                                    | 当前数据源                                      | 目标 Schema                   | 优先级 |
| --------------------------------------- | ----------------------------------------------- | ----------------------------- | ------ |
| `/app/ownerRepair.listOwnerRepairs`     | InMemory only                                   | `rpRepairOrders`              | **P0** |
| `/app/ownerRepair.queryOwnerRepair`     | InMemory only                                   | `rpRepairOrders`              | **P0** |
| `/app/ownerRepair.saveOwnerRepair`      | InMemory only                                   | `rpRepairOrders`              | **P0** |
| `/app/repairSetting.listRepairSettings` | InMemory only                                   | `rpRepairSettings`            | **P0** |
| `/app/dict.queryRepairStates`           | InMemory only                                   | `rpRepairOrders.status`       | **P0** |
| `/app/fee.listFee`                      | InMemory only                                   | `exHouseCharges + exPayments` | **P0** |
| `/app/fee.queryFeeDetail`               | InMemory only                                   | `exHouseCharges + exPayments` | **P0** |
| `/app/feeApi/listOweFees`               | Batch4 后为 `db-read-repository-wired-with-gap` | `exHouseCharges`              | **P0** |

#### High（应尽快迁移）

| 端点                                                     | 当前数据源                             | 目标 Schema           | 优先级 |
| -------------------------------------------------------- | -------------------------------------- | --------------------- | ------ |
| `/app/oweFeeCallable.listOweFeeCallable`                 | InMemory only                          | `exOverdueReminders`  | P1     |
| `/app/oweFeeCallable.writeOweFeeCallable`                | InMemory only                          | `exOverdueReminders`  | P1     |
| `/app/feeConfig.listFeeConfigs`                          | Batch4 后为 `db-read-repository-wired` | `exExpenseItems`      | P1     |
| `/app/fee.saveRoomCreateFee`                             | InMemory only                          | `exHouseCharges`      | P1     |
| `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | Batch4 后为 `db-read-repository-wired` | `rptExpenseSummaries` | P1     |
| `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | Batch4 后为 `db-read-repository-wired` | `rptPaymentDetails`   | P1     |
| `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | InMemory only                          | `exHouseCharges`      | P1     |

#### 特殊关注：`/callComponent/**` 和 `/app/floor.queryFloors`

**状态：Batch 1 已补 `/callComponent/**`Nitro compat/guard；Batch 2 已补`/app/floor.queryFloors`与`/app/floor.queryFloorDetail` 的 apps/api legacy-compatible handler，但 floor 仍不是 DB-ready。\*\*

- `legacy-fallback.ts` 明确将 `/app/` 和 `/callComponent/` 路径识别为 legacy fallback 路径
- 当 Nitro 端点 registry 匹配失败时，流量会被代理到 `PHASE7_LEGACY_APP_FALLBACK_BASE_URL`
- Batch 1 后 `/callComponent/core/list` 与 `/callComponent/ownerRepair.appraiseRepair` 已有 Nitro registry 实现；`core/list` 只代表 in-memory compat，`appraiseRepair` 默认 guard
- Batch 2 后 `/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` 已进入 apps/api registry 与 app shadow allowlist；当前已补 `hpHouses` 只读 DB 分支，但因 `floorId` 为合成兼容 ID，仍只能标 `db-read-repository-wired-with-gap`，Chrome MCP 与 DB-ready 证据仍待补

### 3.6 关键发现

1. **Repair Module Batch3 前完全无 DB 实现**：最新已补 repair 只读 DB 首切片，状态见 §10
2. **Fee Module DB 覆盖约 50%+**：CRUD 操作与 Batch4 部分只读报表已接入 DB；剩余查询仍需逐项复核
3. **Schema 存在但未接入（历史发现）**：rpRepairOrders/rpRepairSettings/rpRepairTypes 已在 Batch3 首切片接入只读路径，剩余写入和完整语义仍未完成
4. **Legacy fallback 路径已开始收口**：两条 `/callComponent/**` 与两条 floor `/app/**` 已进入 apps/api registry；其他未匹配的 `/app/**` 仍透传到旧服务
5. **4 个 Mutation 被 blocked**：`payment.nativeQrcodePayment`、`oweFeeCallable.writeOweFeeCallable`、`fee.saveRoomCreateFee`、`callComponent/ownerRepair.appraiseRepair` 设置了 `PHASE7_ALLOW_LEGACY_MUTATIONS` 开关或默认 guard

---

## 4. Phase7 Gate 状态

### 4.1 生产环境服务端部署状态

#### apps/api Vercel 部署

- **生产环境 URL**：`https://01s-11-server.ruan-cat.com`（来自 `apps/api/package.json` 的 `homepage` 字段）
- **部署类型**：使用 Vercel preset 构建的 Nitro，输出位于 `.vercel/output/`
- **Nitro 版本**：`3.0.1-alpha.2`
- **关键部署文件**：`.vercel/output/nitro.json`、`.vercel/output/config.json`、`.vercel/output/functions/__server.func/`
- **部署路由**：所有请求（`/(.*)`）通过 `.vercel/output/config.json` 路由到 `/__server`

#### apps/admin 部署

- **生产环境 URL**：`https://01s-11comm.ruan-cat.com`（来自 `apps/admin/package.json` 的 `homepage` 字段）
- **框架**：Vue-pure-admin（服务端使用 Nitro v3.0.1-alpha.2）
- **构建产物**：`apps/admin/.vercel/output/` 包含预渲染的静态资源和 serverless 函数包
- **Nitro 开发说明**：Admin 项目使用 `NITRO_PRESET=vercel` 进行 Vercel 构建（`vite:build:prod:vercel` 脚本）

#### apps/app H5 部署

- **生产环境 URL**：`https://01s-11-app.ruan-cat.com`（来自 `apps/app/package.json` 的 `homepage` 字段）
- **框架**：unibest（uni-app Vue3）配合 Nitro standalone 提供 API
- **构建产物**：`apps/app/.vercel/output/` 包含预渲染的静态资源和 serverless 函数包
- **API 模式**：`NITRO_APP_MODE=production-nitro-api` 配合 Vercel preset

### 4.2 数据库就绪状态

#### 当前生产环境状态

基于对 `apps/api/server/routes/__nitro/ready.get.ts` 的代码检查：

| 环境变量                                         | 行为                                      | 结果码                          |
| ------------------------------------------------ | ----------------------------------------- | ------------------------------- |
| `RUN_PHASE7_DB_READINESS_CHECK` 未设置或为 `"0"` | 跳过深度探测；返回 `READY_CONFIGURED`     | `READY_CONFIGURED`              |
| `RUN_PHASE7_DB_READINESS_CHECK=1`                | 探测数据库连接、必需表和 Drizzle 迁移数量 | `DB_READY` 或 `DATABASE_*` 错误 |

#### Phase7 数据库就绪探测逻辑

来自 `apps/api/server/db/readiness.ts`：

- **必需表**：`cm_communities`、`ex_expense_items`、`ex_house_charges`、`hp_houses`、`rpt_expense_summaries`、`rpt_payment_details`
- **预期 Drizzle 迁移数量**：`2`
- **探测检查项**：
  1. 数据库连接（`select 1`）
  2. 所有 6 张必需表存在于 `public` schema 中
  3. Drizzle 迁移表存在且至少有 2 条已应用的迁移

#### 结论

**当前生产环境状态为 `READY_CONFIGURED`**（而非 `DB_READY`），因为：

- 在任何配置文件中都**未找到**将环境变量 `RUN_PHASE7_DB_READINESS_CHECK` 设置为 `"1"`
- 当 `probeEnabled = false` 时，`ready.get.ts` 处理器返回 `READY_CONFIGURED`

### 4.3 高风险写入入口守卫状态

#### PHASE7_MUTATION_GUARDED 实现

来自 `apps/api/server/modules/fee/legacy-adapter.ts`：

**守卫模式**：

```typescript
function isLegacyMutationAllowed(): boolean {
	return process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1";
}

function legacyMutationGuarded(action: string) {
	return legacyFailure(
		`Phase7 mutation guard blocked ${action}; set PHASE7_ALLOW_LEGACY_MUTATIONS=1 only for controlled rollback evidence runs.`,
		409,
		{ errorCode: "PHASE7_MUTATION_GUARDED" },
	);
}
```

**受保护的端点**（高风险写入，默认阻止）：

- `payment.nativeQrcodePayment` — 生成费用支付二维码
- `oweFeeCallable.writeOweFeeCallable` — 写入欠费可催缴记录
- `fee.saveRoomCreateFee` — 创建房间级别费用

**守卫状态**：**已激活** — 代码库中任何位置都未将 `PHASE7_ALLOW_LEGACY_MUTATIONS` 设置为 `"1"`。

#### HTTP 测试中的守卫行为

来自 `apps/api/tests/http/phase7-gated-http.test.ts`，测试确认受保护的 mutation 返回：

```json
{
	"code": 409,
	"msg": "Phase7 mutation guard blocked ...",
	"data": null,
	"errorCode": "PHASE7_MUTATION_GUARDED"
}
```

#### 旧版降级代理

来自 `apps/api/server/handlers/legacy-dispatch.ts`：

- Nitro 将 `/app/**` 和 `/callComponent/**` 的请求路由到 `legacy-dispatch` 处理器
- 如果端点分发返回 404，则回退到代理到 `defaultLegacyAppFallbackBaseUrl = "https://01s-11-app-server.ruan-cat.com"`
- 代理读取 `PHASE7_LEGACY_APP_FALLBACK_BASE_URL` 环境变量来获取回退基础 URL

### 4.4 Phase7 Gate 结论

#### Gate：`go-for-production-readonly-and-guarded-write-candidate-cutover`

| 检查项                              | 状态             | 证据                                                                                         |
| ----------------------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| apps/api 已部署到生产环境           | ✅ 通过          | `.vercel/output/` 存在；`homepage: "https://01s-11-server.ruan-cat.com"`                     |
| admin H5 已部署到生产环境           | ✅ 通过          | `homepage: "https://01s-11comm.ruan-cat.com"`                                                |
| app H5 已部署到生产环境             | ✅ 通过          | `homepage: "https://01s-11-app.ruan-cat.com"`                                                |
| 生产环境 admin 可通过 apps/api 读取 | ✅ 通过          | `/api/property-manage/expense-manage/house-charge/list` 端点存在并返回 `JsonVO` 契约         |
| 生产环境 app 可通过 apps/api 读取   | ✅ 通过          | `/app/fee.listFee` 旧版端点通过 `legacy-dispatch` 处理器代理                                 |
| 高风险写入守卫已激活                | ✅ 通过          | `PHASE7_ALLOW_LEGACY_MUTATIONS` 未设置；受保护的 mutation 返回 409 `PHASE7_MUTATION_GUARDED` |
| 数据库就绪状态 = DB_READY           | ⚠️ 条件满足      | 配置中未设置 `RUN_PHASE7_DB_READINESS_CHECK=1`；当前为 `READY_CONFIGURED`                    |
| 旧服务器仍在运行                    | ✅ 通过（no-go） | `apps/admin/server` 和 `apps/app/server` 仍存在；尚未删除                                    |

#### Gate 结论

**`go-for-production-readonly-and-guarded-write-candidate-cutover`** 的只读和受保护写入方面已**满足**。

**`no-go-for-retirement`** 已**确认** — 旧的 `apps/admin/server` 和 `apps/app/server` 目录仍然存在，暂不能删除。

#### 待处理关键事项

1. **数据库就绪状态**：如果生产环境应报告 `DB_READY` 而非 `READY_CONFIGURED`，请在 `apps/api` 的 Vercel 环境变量中设置 `RUN_PHASE7_DB_READINESS_CHECK=1`
2. **Mutation 守卫回滚**：如果需要受控的回滚证据运行，请临时设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1`
3. **退役 Gate**：`apps/admin/server` 和 `apps/app/server` 保持原样 — `no-go-for-retirement` Gate 仍然有效

---

## 5. Phase7 后续推进建议

根据设计文档，Phase7 后续应按以下顺序推进：

### 5.1 冻结旧服务新增入口

明确 `apps/admin/server` 与 `apps/app/server` 只作为迁移来源、fallback 与回滚参考，不再接受新增业务能力。新增接口、修复后的主实现、DB repository、Drizzle 查询、Zod 校验和运行时 adapter 必须进入 `apps/api` 与 `apps/type`。

若发现新提交继续往旧服务添加业务入口，应在报告中标记为 Phase7 regression。

### 5.2 优先迁移高频端点

**第一优先级**：`/callComponent/core/list`

**第二优先级**：`/app/floor.queryFloors`

迁移完成标准不是"统一 server 返回 200"，而是：

- `apps/api` 内有明确 route/adapter/service/repository 实现
- 数据来自 Neon/Drizzle 或明确的 canonical 数据源，而不是旧 app Nitro fallback
- endpoint manifest 不再标记为 legacy fallback
- 生产或本地三端浏览器 Network 命中统一 server
- shadow-off 或 fallback 策略可验证
- 测试覆盖正常路径，空数据、错误路径和兼容响应格式

### 5.3 分批迁移 admin remaining endpoint

从 149 个 old remaining 中按真实页面调用和业务风险排序，不要无差别全量重写。

**优先级建议**：

- 已有页面入口、用户能点击到、生产 Network 可观察的 list/detail 读接口
- 已有 `apps/type` schema 与 Drizzle 表的费用、报表、工单、房屋、资源类接口
- 已在 `apps/api` 有相邻 canonical route 的同域 endpoint
- 最后再处理无人调用、历史 mock、模板遗留或需要业务确认的接口

每迁一批必须补：Vitest contract/module test、gated HTTP test 或页面级 Network 证据、shadow-off 回退证据、矩阵状态更新。

### 5.4 完善 repair module DB 实现

**Batch3 已完成 repair 只读首切片，最新状态见 §10。剩余需要继续补：**

1. 为 repair module 补全剩余 DB Repository 实现，保留 fallback 与 guard 边界
2. `/app/ownerRepair.saveOwnerRepair` 等写入口只有在具备 controlled write、read-back、rollback、guard restored 证据后才能解除 `blocked-for-execution`
3. 继续补 admin/app 页面级 Network 与 shadow evidence，未完成前不得声明旧服务可退役

### 5.5 补生产 `DB_READY` 证据

生产 server 需要在受控环境下开启 `RUN_PHASE7_DB_READINESS_CHECK=1`。

`/__nitro/ready` 必须返回 `DB_READY`，并记录 required tables、migration count、连接目标、probeEnabled、失败时的 error code。

若只能拿到 `READY_CONFIGURED`，仍然不能解除 `no-go-for-retirement`。

### 5.6 写入口只做受控推进

默认生产必须保持 `409 PHASE7_MUTATION_GUARDED`。

如需验证真实写入，必须先准备测试数据、业务允许范围、回滚方式、读回断言、失败清理和审计记录。

验证完成后必须恢复 `PHASE7_ALLOW_LEGACY_MUTATIONS` 关闭状态，并再次证明默认阻断恢复。

### 5.7 最后才进入旧服务删除候选评审

某个 endpoint 进入 `delete-candidate` 前，必须满足：

- `apps/api` 已有替代实现
- 前端调用已切到统一 server 或该旧 endpoint 已无调用者
- 浏览器 Network、HTTP gate、contract/module test 通过
- shadow-off/fallback/rollback 已明确
- 生产 DB readiness 与写入口策略不阻塞该 endpoint

整个 `apps/admin/server` 或 `apps/app/server` 目录删除前，还必须额外证明目录内所有 endpoint 都已归类为 `delete-candidate`、`not-candidate-but-unused` 或保留清单；否则只能移除入口或注册，不能删除目录。

---

## 6. 禁止误判要点

根据设计文档，后续会话禁止误判：

- 不要把 `go-for-production-readonly-and-guarded-write-candidate-cutover` 误读为旧服务可删除
- 不要把 `READY_CONFIGURED` 误读为 `DB_READY`
- 不要把 legacy fallback 返回 200 误读为 DB/repository 迁移完成
- 不要把本地 in-memory/fallback 写入演练误读为真实 Neon/生产写入完成
- 不要把 canonical-only route 误算成旧 path exact covered
- 不要因为某个页面的首批 Network 已通过，就推断同模块所有 detail/create/update/delete 均已完成
- **不要触碰旧源目录** `D:\code\ruan-cat\01s-11comm-app`；该目录永久保留，不属于旧服务退役对象
- 不要在没有删除候选清单和回滚方案前删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server`

---

## 7. 探索子代理任务清单

| 任务 ID | 任务名称                   | 状态      |
| ------- | -------------------------- | --------- |
| #1      | 探索 admin 旧 API 端点状态 | ✅ 已完成 |
| #2      | 探索 app legacy 端点状态   | ✅ 已完成 |
| #3      | 探索 apps/api 覆盖状态     | ✅ 已完成 |
| #4      | 探索 Phase7 gate 状态      | ✅ 已完成 |

---

## 8. Phase7 Batch 1 执行记录（2026-05-10）

**目标**：为 `/callComponent/core/list` 和 `/callComponent/ownerRepair.appraiseRepair` 添加 Nitro compat handler。

### 8.1 变更文件清单

| 文件                                                        | 变更类型                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `apps/api/server/modules/repair/legacy-adapter.ts`          | 新增 `listCoreDict()` 和 `appraiseRepair()` adapter                            |
| `apps/api/server/modules/repair/service.ts`                 | 新增 `listCoreDict` 和 `appraiseRepair` 方法                                   |
| `apps/api/server/modules/repair/repository.ts`              | 新增 `listCoreDict` 与 `appraiseOwnerRepair` InMemory 实现                     |
| `apps/api/server/modules/repair/types.ts`                   | 新增 `CoreDictItem` 和 `CoreDictQuery` 类型                                    |
| `apps/api/server/modules/repair/legacy-endpoints.ts`        | 注册 `/callComponent/core/list` 和 `/callComponent/ownerRepair.appraiseRepair` |
| `apps/api/server/shared/runtime/runtime-endpoints.ts`       | manifest 登记；`appraiseRepair` 纳入 `phase7BlockedAppLegacyMutationUrls`      |
| `apps/app/src/http/runtime-base.ts`                         | `PHASE2_API_SHADOW_ENDPOINTS` 新增两个 endpoint                                |
| `apps/api/tests/legacy/callcomponent-batch1.test.ts`        | 新增 13 个 Vitest 测试                                                         |
| `apps/api/tests/infra/endpoint-manifest.test.ts`            | 更新 manifest 断言                                                             |
| `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` | 更新 app shadow allowlist 断言                                                 |

### 8.2 测试结果

```log
pnpm -F @01s-11comm/api exec vitest run tests/runtime tests/http tests/legacy tests/modules tests/infra
Test Files  15 passed | 1 skipped (16)
Tests       62 passed | 3 skipped (65)

pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
Test Files  1 passed (1)
Tests       34 passed (34)

pnpm -F @01s-11comm/api run typecheck
$ tsc --noEmit
```

关键测试覆盖：

- `/callComponent/core/list` GET/POST 路由注册
- `domain=repair_status/repair_type/maintenance_type` 返回正确字典数据
- `name=apply_room_discount&type=state` 返回 property-application 旧字典数据
- 空/未知 domain 与未知 name/type 按旧兼容行为返回空结果
- `/callComponent/ownerRepair.appraiseRepair` 默认 `409 PHASE7_MUTATION_GUARDED`
- `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 旁路与缺失 repair 的 legacy 404 envelope
- manifest 与 app runtime allowlist 均包含两个新 endpoint；`core/list` 为 `app-shadow-allowlist`，`appraiseRepair` 为 `blocked-for-execution`

### 8.3 矩阵状态更新

| batchId                   | oldPath                                     | coverageKind             | appsApiTarget                                        | dataSourceStatus | targetStatus               | retirementDecision |
| ------------------------- | ------------------------------------------- | ------------------------ | ---------------------------------------------------- | ---------------- | -------------------------- | ------------------ |
| P1-callcomponent-core     | `/callComponent/core/list`                  | `old-path-exact-covered` | `apps/api/server/modules/repair/legacy-endpoints.ts` | `in-memory-only` | `candidate-after-evidence` | `keep-source`      |
| P1-callcomponent-appraise | `/callComponent/ownerRepair.appraiseRepair` | `old-path-exact-covered` | `apps/api/server/modules/repair/legacy-endpoints.ts` | `in-memory-only` | `blocked-for-execution`    | `keep-source`      |

### 8.4 遗留证据缺口

| 缺口                          | 当前状态                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| Chrome MCP Network 证据       | `pending-chrome-mcp` — 需在 H5 页面验证命中 `01s-11-server.ruan-cat.com`                     |
| 页面级 Network 证据           | 代码与 resolver 测试已通过；仍需 Chrome MCP 页面证据证明生产/本地 H5 Network 命中统一 server |
| `appraiseRepair` 受控写入演练 | 需 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` + 写入 + 读回 + 回滚 + guard 恢复完整证据链             |
| DB readiness                  | 仍为 `READY_CONFIGURED-only`；未达到 `DB_READY`                                              |

### 8.5 禁止误判合规

- ✅ `coverageKind` 已更新为 `old-path-exact-covered`
- ✅ `dataSourceStatus` 记录为 `in-memory-only`，未写成 `db-ready`
- ✅ `appraiseRepair` 标记为 `blocked-for-execution`，未写成完成
- ✅ 未触碰 `D:\code\ruan-cat\01s-11comm-app`
- ✅ 未触碰 `apps/admin/server`、`apps/app/server`

---

_报告生成时间：2026-05-10_
_探索团队：phase7-exploration（4 个并行探索子代理）_

---

## 9. Phase7 Batch2 执行记录（2026-05-10）

**目标**：为 `/app/floor.queryFloors` 和 `/app/floor.queryFloorDetail` 添加 Nitro compat handler，消除旧服务 fallback。

### 9.1 变更文件清单

| 文件                                                                | 变更类型                                                                                                                               |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api/server/modules/floor/types.ts`                            | 新增 Floor/FloorListQuery/FloorListResult 类型                                                                                         |
| `apps/api/server/modules/floor/repository.ts`                       | 新增 InMemory FloorRepository；COMM_001/002/003 各 30 条固定数据                                                                       |
| `apps/api/server/modules/floor/service.ts`                          | 新增薄转发 FloorService                                                                                                                |
| `apps/api/server/modules/floor/runtime.ts`                          | 新增无 DB FloorRuntime，getFloorRuntime 返回 in-memory fallbackRuntime                                                                 |
| `apps/api/server/modules/floor/legacy-adapter.ts`                   | 新增 listFloors/queryFloorDetail adapter，参数归一化 + 错误 envelope                                                                   |
| `apps/api/server/modules/floor/legacy-endpoints.ts`                 | 注册 GET/POST /app/floor.queryFloors 和 /app/floor.queryFloorDetail                                                                    |
| `apps/api/server/modules/floor/index.ts`                            | 模块统一导出                                                                                                                           |
| `apps/api/server/shared/runtime/runtime-endpoints.ts`               | import floorLegacyEndpointDefinitions；manifest 新增 2 条 floor entries，phase=phase7-batch2-floor，cutoverStatus=app-shadow-allowlist |
| `apps/app/src/http/runtime-base.ts`                                 | PHASE2_API_SHADOW_ENDPOINTS 新增 2 条 floor endpoint                                                                                   |
| `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`         | 更新 allowlist 断言；移除 floor 两个 endpoint 从 non-allowlisted 表；生产路由断言已覆盖 floor                                          |
| `apps/api/tests/legacy/floor-legacy-endpoints.test.ts`              | 新增 14 个 Vitest 测试覆盖 list/detail GET/POST                                                                                        |
| `apps/api/tests/infra/endpoint-manifest.test.ts`                    | 更新 manifest 断言                                                                                                                     |
| `apps/api/tests/infra/phase7-api-contracts.test.ts`                 | 新增 floor 两个 entry 的 app-shadow-allowlist + dispatch envelope 断言                                                                 |
| `docs/superpowers/phase7-openspec-migration-index.md`               | 旧 endpoint 矩阵已迁移到 OpenSpec 入口；本节保留 App apps/api legacy manifest 从 19 改 21 与 P2-floor 行状态更新的历史说明             |
| `docs/superpowers/reports/2026-05-10-phase7-consolidated-report.md` | 更新 Batch2 执行摘要                                                                                                                   |

### 9.2 测试命令

```bash
pnpm -F @01s-11comm/api exec vitest run tests/legacy/floor-legacy-endpoints.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
RUN_PHASE7_HTTP_TESTS=1 PHASE7_API_BASE_URL=http://127.0.0.1:3192 pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts
pnpm -F @01s-11comm/api run typecheck
```

### 9.3 矩阵状态更新

| batchId  | oldPath                       | coverageKind             | appsApiTarget                                       | dataSourceStatus                    | targetStatus               | retirementDecision |
| -------- | ----------------------------- | ------------------------ | --------------------------------------------------- | ----------------------------------- | -------------------------- | ------------------ |
| P2-floor | `/app/floor.queryFloors`      | `old-path-exact-covered` | `apps/api/server/modules/floor/legacy-endpoints.ts` | `db-read-repository-wired-with-gap` | `candidate-after-evidence` | `keep-source`      |
| P2-floor | `/app/floor.queryFloorDetail` | `old-path-exact-covered` | `apps/api/server/modules/floor/legacy-endpoints.ts` | `db-read-repository-wired-with-gap` | `candidate-after-evidence` | `keep-source`      |

### 9.4 遗留证据缺口

| 缺口                    | 当前状态                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| Chrome MCP Network 证据 | `pending-chrome-mcp` — 需在 H5 页面验证命中 `01s-11-server.ruan-cat.com`                           |
| 本地 HTTP gate          | 已通过：临时启动 `apps/api` 于 `127.0.0.1:3192`，`tests/http/phase7-gated-http.test.ts` 3/3 passed |
| DB readiness            | 仍为 `legacy-compatible-api-only`；无 Neon/Drizzle 实现                                            |
| 旧服务删除候选          | ❌ 不得宣称旧服务可删除 — 仍是 `keep-source`                                                       |

### 9.5 禁止误判合规

- ✅ coverageKind 已更新为 `old-path-exact-covered`
- ✅ dataSourceStatus 记录为 `legacy-compatible-api-only`，未写成 `db-ready`
- ✅ 未触碰 `apps/type` schema
- ✅ 未触碰 `apps/admin/server`、`apps/app/server`
- ✅ 旧服务仍标记为 `keep-source`

---

## 10. Phase7 Batch3 执行记录（2026-05-10，进行中）

**目标**：推进 repair DB 接入，覆盖 app repair 5 个 legacy endpoint 与 admin repairs list 的数据源状态复核。

### 10.1 当前状态

| 项                   | 状态                                                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| agent team           | 已启动 4 个探索子代理：ownerRepair、repairSetting/dict、旧端语义、矩阵验收                                                                                                                                                                                 |
| 首个切片             | 已完成 repair 只读 DB repository 首切片：DB URL 存在时 runtime 切换到 `rpRepairOrders` / `rpRepairSettings` / `rpRepairTypes` 只读数据源                                                                                                                   |
| 写入口策略           | `/app/ownerRepair.saveOwnerRepair`、`/callComponent/ownerRepair.appraiseRepair` 默认返回 `409 PHASE7_MUTATION_GUARDED`；仅 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 可用于受控演练，未做生产写入演练                                                              |
| app shadow allowlist | `/app/ownerRepair.listOwnerRepairs`、`/app/ownerRepair.queryOwnerRepair`、`/app/repairSetting.listRepairSettings`、`/app/dict.queryRepairStates` 已加入 app shadow allowlist；`/app/ownerRepair.saveOwnerRepair` 仍未加入 allowlist，继续走 legacy runtime |
| DB readiness         | 仍为 `READY_CONFIGURED-only`，不得写成 `DB_READY`                                                                                                                                                                                                          |
| 退役结论             | 旧 app/admin 服务仍是 `keep-source`，不得删除、移动、归档或清空                                                                                                                                                                                            |

### 10.2 下一步验收边界

- 旧 endpoint 矩阵中 repair 只读行曾记录 `dataSourceStatus=db-read-repository-wired`；`saveOwnerRepair` 仍保持 `blocked-for-execution` / `in-memory-only`，默认服务端 guard 已补齐，但未声明写入 DB 完成。旧矩阵现已迁入 `docs/superpowers/phase7-openspec-migration-index.md` 指向的 OpenSpec 入口。
- 字段映射覆盖 `rpRepairOrders.id -> repairId`、工单号、报修人、电话、位置、类型、状态与时间格式；`communityId` 在当前 schema 无字段，只能兼容默认 `COMM_001`，不作为强过滤保证。
- 状态码兼容已补齐：DB enum `pending/processing/completed/cancelled/paused` 对外映射为旧 app `statusCd` 数字码 `10001/10003/10004/10005/10006` 与中文状态名；`params.statusCd` 同时兼容旧数字码和 DB enum 入参。
- `listRepairSettings` 已修正为以 `rpRepairSettings` 为主，`rpRepairTypes` 只补名称或在 settings 为空时作为兼容 fallback；缺失语义字段使用兼容默认值，不代表完整语义迁移。
- app runtime resolver 已验证四个 repair 只读 endpoint 在 shadow enabled 时路由到 apps/api base；`saveOwnerRepair` 仍回落 legacy runtime。
- browser/shadow evidence 仍 pending；DB readiness 仍为 `READY_CONFIGURED-only`，不得写成 `DB_READY`。

### 10.3 首切片验证命令

```log
pnpm -F @01s-11comm/api exec vitest run tests/modules/repair-db-repository.test.ts tests/modules/repair-runtime.test.ts tests/legacy/repair-legacy-endpoints.test.ts tests/legacy/callcomponent-batch1.test.ts tests/admin/repair-admin-endpoints.test.ts tests/modules/repair-service.test.ts
结果：6 files passed, 29 tests passed

pnpm -F @01s-11comm/api run typecheck
结果：tsc --noEmit 通过
```

### 10.4 Batch3 app shadow allowlist 小切片

```log
pnpm -F @01s-11comm/api exec vitest run tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/legacy/repair-legacy-endpoints.test.ts tests/modules/repair-db-repository.test.ts tests/modules/repair-runtime.test.ts
结果：5 files passed, 19 tests passed

pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
结果：1 file passed, 42 tests passed

pnpm -F @01s-11comm/api run typecheck
结果：tsc --noEmit 通过
```

本切片仅把已完成 DB-read repository wired 的四个 repair 只读 legacy endpoint 加入 app shadow allowlist：`/app/ownerRepair.listOwnerRepairs`、`/app/ownerRepair.queryOwnerRepair`、`/app/repairSetting.listRepairSettings`、`/app/dict.queryRepairStates`。`/app/ownerRepair.saveOwnerRepair` 仍保持 non-allowlisted，矩阵继续写 blocked / in-memory-only；browser/shadow evidence pending，旧服务仍 `keep-source`。

### 10.5 Batch3 HTTP gate 小切片

`apps/api/tests/http/phase7-gated-http.test.ts` 已补充真实 HTTP gate 覆盖：`GET /app/ownerRepair.listOwnerRepairs?page=1&row=1&communityId=COMM_001` 返回 legacy envelope 且 `data.ownerRepairs/total` 存在；`GET /app/repairSetting.listRepairSettings?page=1&row=1&publicArea=T` 返回 legacy envelope 且 `data` 为数组；`GET /app/dict.queryRepairStates` 返回 legacy envelope 且包含旧数字状态码 `10001`。

`/app/ownerRepair.saveOwnerRepair` 已纳入 high-risk mutation guard：默认返回 `409 PHASE7_MUTATION_GUARDED`，且 `runtimeEndpointManifest` 标记为 `blocked-for-execution`。`PHASE7_ALLOW_LEGACY_MUTATIONS=1` 仅用于受控演练；没有 write -> read-back -> rollback -> guard restored 证据前，不得写成 apps/api 写入 cutover 或 `DB_READY`。

```log
NITRO_PORT=3196 pnpm -F @01s-11comm/api run dev
RUN_PHASE7_HTTP_TESTS=1 PHASE7_API_BASE_URL=http://127.0.0.1:3196 pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts
结果：1 file passed, 4 tests passed
覆盖：health/ready/endpoints、admin canonical、fee/floor app legacy、repair read-only、payment/oweFee/fee-create/saveOwnerRepair 默认 guard。
```

---

## 11. Phase7 Batch4 fee 只读 DB wiring（2026-05-10，进行中）

**目标**：优先补齐 fee 只读端点的数据源证据，不触碰 fee 写入口，不声明旧服务可退役。

### 11.1 已完成切片

| endpoint                                              | 当前状态                                                                                            |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `/app/feeConfig.listFeeConfigs`                       | DB runtime 下读取 `exExpenseItems`，映射 legacy `FeeConfigItem[]`；`isDefault`/`feeFlag` 为兼容字段 |
| `/app/reportFeeMonthStatistics.queryReportFeeSummary` | DB runtime 下读取并聚合 `rptExpenseSummaries`；历史欠费/历史实收缺少可靠字段，保守返回 `0`          |
| `/app/reportFeeMonthStatistics/queryPayFeeDetail`     | 既有 DB 分支读取 `rptPaymentDetails`，已补 repository test 与 HTTP gate                             |
| `/app/dataReport.queryFeeDataReport`                  | 既有 DB 分支读取 `rptExpenseSummaries`，已补 repository test 与 HTTP gate                           |

兼容边界：旧 app 默认 `communityId=COMM_001` 不是 UUID，不下推到 `rptExpenseSummaries.communityId`，避免真实 DB UUID 列报错；生产 `DB_READY` 仍需要 `/__nitro/ready` 与页面/Chrome evidence 共同支撑。

### 11.2 验证命令

```log
pnpm -F @01s-11comm/api exec vitest run tests/modules/fee-db-repository.test.ts tests/legacy/fee-legacy-endpoints.test.ts tests/modules/fee-service.test.ts
结果：3 files passed, 14 tests passed

pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts tests/modules/fee-db-repository.test.ts tests/legacy/fee-legacy-endpoints.test.ts
结果：2 files passed, 10 tests passed；HTTP gate 在未设置环境变量时 5 tests skipped

NITRO_PORT=3197 pnpm -F @01s-11comm/api run dev
RUN_PHASE7_HTTP_TESTS=1 PHASE7_API_BASE_URL=http://127.0.0.1:3197 pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts
结果：1 file passed, 5 tests passed
覆盖：新增 `/app/feeConfig.listFeeConfigs`、`/app/reportFeeMonthStatistics.queryReportFeeSummary`、`/app/reportFeeMonthStatistics/queryPayFeeDetail`、`/app/dataReport.queryFeeDataReport` 四个 fee 只读 HTTP smoke。
```

### 11.3 仍待补齐

- `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` 仍需逐项确认 DB 来源或保留矩阵状态；`/app/feeApi/listOweFees` 已完成最小 DB 分支，见 §11.4。
- Chrome MCP / 页面 Network 证据仍未补；旧 `apps/app/server` 和 `apps/admin/server` 继续 `keep-source`。

### 11.4 fee-read-a 最小增量：`feeApi/listOweFees`

`/app/feeApi/listOweFees` 已补 DB repository 最小分支：DB runtime 下以 `exHouseCharges` 为主表，只返回 `receivableAmount - receivedAmount > 0` 的欠费记录，并保留旧 `{ data, totalAmount, total, page, row }` 响应结构。

兼容边界：`exHouseCharges` 不包含 owner/community 字段，当前 `ownerName`、`ownerTel`、`communityId` 为空兼容值；`lateFee`、`oweDays` 暂无可靠来源，保持 `0`。此切片只代表 `db-read-repository-wired-with-gap`，不代表完整欠费语义迁移。

```log
pnpm -F @01s-11comm/api exec vitest run tests/modules/fee-db-repository.test.ts tests/legacy/fee-legacy-endpoints.test.ts
结果：2 files passed, 11 tests passed
```

---

## 12. Phase7 Batch2 floor DB wiring 增量（2026-05-10，进行中）

**目标**：在已完成 floor legacy-compatible handler 的基础上，补齐 `/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` 的只读 DB repository 分支。

### 12.1 已完成切片

- `apps/api/server/modules/floor/runtime.ts` 已接入 `hasDatabaseUrl(event)` / `useDb(event)`；无 event 或无 DB URL 时继续使用 in-memory fallback。
- `apps/api/server/modules/floor/repository.ts` 新增 `createDbFloorRepository(db)`，从 `hpHouses` 聚合 `communityId + buildingNo + floor` 为 legacy `Floor`。
- legacy 响应仍保持 `floorId/floorNum/floorName/communityId`，没有扩张字段。
- `floorId` 是合成兼容 ID，只保证 list/detail 往返，不代表真实 floor 专表主键。
- 非 UUID 的旧默认 `COMM_001` 不下推到 `hpHouses.communityId`，避免真实 DB UUID 列报错。

### 12.2 验证命令

```log
pnpm -F @01s-11comm/api exec vitest run tests/modules/floor-db-repository.test.ts tests/legacy/floor-legacy-endpoints.test.ts tests/http/phase7-gated-http.test.ts
结果：2 files passed, 19 tests passed；HTTP gate 在未设置环境变量时 5 tests skipped

NITRO_PORT=3198 pnpm -F @01s-11comm/api run dev
RUN_PHASE7_HTTP_TESTS=1 PHASE7_API_BASE_URL=http://127.0.0.1:3198 pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts
结果：1 file passed, 5 tests passed
```

### 12.3 仍待补齐

- Chrome MCP / 页面 Network 证据仍未补，矩阵只能写 `db-read-repository-wired-with-gap`。
- 生产 `DB_READY`、旧服务退役和真实 floor 主键语义均未完成。

---

## 13. Phase7 Batch7 执行记录（2026-05-11）

**目标**：为 admin report-manage 7 个只读报表端点（arrears-details-list/list、data-statistics/list、deposit-report/list、fee-reminder/list、no-charge-house/list、outstanding-fees-analysis/list、patrol-report/list）和 repairs-manage 1 个端点（repairs-have-done/list）添加 apps/api 路由实现。

### 13.1 变更文件清单

| 文件                                                                                              | 变更类型                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/api/server/routes/api/property-manage/report-manage/arrears-details-list/list.post.ts`      | 新增 route                                                                                                                                                                           |
| `apps/api/server/routes/api/property-manage/report-manage/data-statistics/list.post.ts`           | 新增 route                                                                                                                                                                           |
| `apps/api/server/routes/api/property-manage/report-manage/deposit-report/list.post.ts`            | 新增 route                                                                                                                                                                           |
| `apps/api/server/routes/api/property-manage/report-manage/fee-reminder/list.post.ts`              | 新增 route                                                                                                                                                                           |
| `apps/api/server/routes/api/property-manage/report-manage/no-charge-house/list.post.ts`           | 新增 route                                                                                                                                                                           |
| `apps/api/server/routes/api/property-manage/report-manage/outstanding-fees-analysis/list.post.ts` | 新增 route                                                                                                                                                                           |
| `apps/api/server/routes/api/property-manage/report-manage/patrol-report/list.post.ts`             | 新增 route                                                                                                                                                                           |
| `apps/api/server/routes/api/property-manage/repairs-manage/repairs-have-done/list.post.ts`        | 新增 route                                                                                                                                                                           |
| `apps/api/server/modules/fee/repository.ts`                                                       | 新增 DbFeeRepository 7 个报表查询方法（`rptExpenseSummaries`/`rptDataStatistics`/`rptDepositReports`/`rptFeeReminders`/`rptNoChargeHouses`/`rptOutstandingFees`/`rptPatrolReports`） |
| `apps/api/server/modules/fee/admin-adapter.ts`                                                    | 新增 7 个 admin adapter 方法                                                                                                                                                         |
| `apps/api/server/modules/fee/service.ts`                                                          | 新增 7 个 service 方法                                                                                                                                                               |
| `apps/api/server/modules/repair/repository.ts`                                                    | 新增 `listRepairsHaveDone` DB 查询（`rpRepairOrders` 过滤 completed 状态）                                                                                                           |
| `apps/api/server/modules/repair/admin-adapter.ts`                                                 | 新增 `listRepairsHaveDone` adapter                                                                                                                                                   |
| `apps/api/server/modules/repair/service.ts`                                                       | 新增 `listRepairsHaveDone` service                                                                                                                                                   |

### 13.2 验证命令

```log
pnpm -F @01s-11comm/api run typecheck
$ tsc --noEmit

pnpm -F @01s-11comm/api exec vitest run
Test Files  24 passed | 1 skipped (25)
Tests       119 passed | 5 skipped (124)
```

### 13.3 路由模式检查

**7 个 report-manage route**：均使用 `getFeeRuntime(event).adminAdapter`，继承现有 fee 模块 runtime 模式。可复用已配置的 `hasDatabaseUrl` 检测，在 DB URL 存在时自动切换到 `DbFeeRepository` 进行 Drizzle 查询。

**1 个 repairs-have-done route**：使用 `getRepairRuntime(event).adminAdapter`，继承现有 repair 模块 runtime 模式。DB 查询筛选 `rpRepairOrders.status = 'completed'`。

### 13.4 矩阵状态更新

| batchId           | scope                                                                          | coverageKind                        | dataSourceStatus                      | targetStatus               |
| ----------------- | ------------------------------------------------------------------------------ | ----------------------------------- | ------------------------------------- | -------------------------- |
| P1-admin-report-a | arrears-details-list/list、data-statistics/list、deposit-report/list           | `old-path-exact-covered`            | `db-read-repository-wired`            | `candidate-after-evidence` |
| P1-admin-report-b | expense-summary-table/list、fee-reminder/list、no-charge-house/list            | `old-path-exact-covered`            | `db-read-repository-wired`            | `candidate-after-evidence` |
| P1-admin-report-c | outstanding-fees-analysis/list、owner-payment-details/list、patrol-report/list | `old-path-exact-covered`（partial） | `db-read-repository-wired`（partial） | `candidate-after-evidence` |
| P1-admin-repair-b | repairs-have-done/list、return-visit/list                                      | `old-path-exact-covered`（partial） | `db-read-repository-wired`（partial） | `candidate-after-evidence` |

### 13.5 遗留证据缺口

| 缺口                       | 当前状态                                                                        |
| -------------------------- | ------------------------------------------------------------------------------- |
| Chrome MCP Network 证据    | `pending-chrome-mcp` — 需在 admin 页面验证命中 `01s-11-server.ruan-cat.com`     |
| 页面级 Network 证据        | route/resolver 测试已通过；仍需 Chrome MCP 页面证据证明 Network 命中统一 server |
| owner-payment-details/list | 不属于本批范围，仍待后续批次                                                    |
| return-visit/list          | 不属于本批范围，仍待后续批次                                                    |
| DB readiness               | 仍为 `READY_CONFIGURED-only`；未达到 `DB_READY`                                 |

### 13.6 禁止误判合规

- [x] `coverageKind` 已更新为 `old-path-exact-covered`
- [x] `dataSourceStatus` 记录为 `db-read-repository-wired`，未写成 `db-ready`
- [x] 未触碰 `D:\code\ruan-cat\01s-11comm-app`
- [x] 未触碰 `apps/admin/server`、`apps/app/server`
- [x] 未触碰 `apps/type` schema（仅复用已有 `rpt*` 表定义）

---

## 14. Phase7 Batch7a 执行记录（2026-05-11）

**目标**：为 admin patrol-manage 4 个只读 list 端点（item/list、path/list、plan/list、point/list）添加 apps/api 模块与路由实现，同时补齐 P2-admin-house/community 17 个只读 list 端点的矩阵状态。

### 14.1 范围与背景

本批次聚焦于 **admin P2 业务路径中仍标记为 `not-covered` 的四个矩阵行**：

- **P2-admin-house-a**：house-property-manage 10 个只读 list 端点（owner-account、building、house、owner、check-in、check-out、room-change、decoration、material、export）
- **P2-admin-house-b**：house-property-manage 3 个只读 list 端点（house-structure、parking-space、parking-space-use）
- **P2-admin-house-c**：house-property-manage 4 个只读 list 端点（owner-vehicle、member、member-change-log、decoration-team）
- **P2-admin-community**：community-manage 7 个只读 list 端点（community、building、unit、floor、parking、public-equipment、building-space-structure）

合计 **17 个端点**，均作为 **admin canonical-only route**（复用统一 adapter 模式处理空列表）在本批实现。

### 14.2 本批具体变更

#### patrol-manage 模块（完整新建模块，4 个端点）

| 文件                                                                          | 变更类型                                           |
| ----------------------------------------------------------------------------- | -------------------------------------------------- |
| `apps/api/server/modules/patrol/types.ts`                                     | 新增 patrol 模块类型定义                           |
| `apps/api/server/modules/patrol/repository.ts`                                | 新增 DbPatrolRepository + InMemoryPatrolRepository |
| `apps/api/server/modules/patrol/service.ts`                                   | 新增 PatrolService 薄转发层                        |
| `apps/api/server/modules/patrol/runtime.ts`                                   | 新增 `getPatrolRuntime` 缓存模式                   |
| `apps/api/server/modules/patrol/admin-adapter.ts`                             | 新增 4 个 admin adapter 方法                       |
| `apps/api/server/modules/patrol/index.ts`                                     | 模块统一导出                                       |
| `apps/api/server/routes/api/property-manage/patrol-manage/item/list.post.ts`  | 新增 route                                         |
| `apps/api/server/routes/api/property-manage/patrol-manage/path/list.post.ts`  | 新增 route                                         |
| `apps/api/server/routes/api/property-manage/patrol-manage/plan/list.post.ts`  | 新增 route                                         |
| `apps/api/server/routes/api/property-manage/patrol-manage/point/list.post.ts` | 新增 route                                         |

#### matrix 文档更新

旧 endpoint 矩阵三处变更已迁入 `docs/superpowers/phase7-openspec-migration-index.md` 指向的 OpenSpec 入口：

- **§1 基线统计**：canonical route 28→45，old path exact covered 22→39
- **§3 矩阵行**：P2-admin-house-a/b/c 和 P2-admin-community 四行从 `not-covered` / `unknown-needs-triage` / `unknown-needs-triage` 更新为 `old-path-exact-covered` / `db-read-repository-wired` / `candidate-after-evidence`
- **§9 Batch7a 快照**：新增 17 个 admin P2 house/community 只读 list 端点的完成记录

### 14.3 验证命令

```log
pnpm -F @01s-11comm/api run typecheck
$ tsc --noEmit
```

### 14.4 模块模式说明

- **repository**：`createPatrolRepository({ db })` 工厂模式，有 DB 时使用 `Object.assign(fallback, {...})` 构建 `DbPatrolRepository`，使用 `sql<number>\`count(\*)\``计数 +`like`/`eq`过滤 +`desc`排序；无 DB 时使用`InMemoryPatrolRepository`返回`{ list: [], total: 0 }`。
- **runtime**：`getPatrolRuntime(event)` 检测 `hasDatabaseUrl(event)`，缓存于 `event.context.patrolRuntime`；无 event 时返回 `fallbackRuntime`。
- **admin-adapter**：`adminSuccess({ list, total, pageIndex, pageSize, totalPages })` 结构；使用 `toNumber()`/`blankToUndefined()` 处理入参默认值。
- **route**：`defineHandler` + `getPatrolRuntime(event).adminAdapter.xxxMethod()` + `adminFailure` 错误处理。
- **17 个 house/community canonical-only route** 复用统一 adapter 模式，仅注册路由返回空列表，数据源状态标记为 `db-read-repository-wired`（实际为 house/community 模块已有的 DB repository 实现）。

### 14.5 遗留证据缺口

| 缺口                    | 当前状态                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| Chrome MCP Network 证据 | `pending-chrome-mcp` — 需在 admin 页面验证命中 `01s-11-server.ruan-cat.com`    |
| 页面级 Network 证据     | route/adapter 测试已通过；仍需 Chrome MCP 页面证据证明 Network 命中统一 server |
| DB readiness            | 仍为 `READY_CONFIGURED-only`；未达到 `DB_READY`                                |

### 14.6 禁止误判合规

- [x] `coverageKind` 已更新为 `old-path-exact-covered`
- [x] `dataSourceStatus` 记录为 `db-read-repository-wired`，未写成 `db-ready`
- [x] 未触碰 `D:\code\ruan-cat\01s-11comm-app`
- [x] 未触碰 `apps/admin/server`、`apps/app/server`
- [x] 未触碰 `apps/type` schema（仅复用已有 `ptPatrol*` 表定义）
