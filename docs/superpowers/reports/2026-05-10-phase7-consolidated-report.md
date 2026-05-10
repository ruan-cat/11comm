<!-- TODO: 未完成 -->

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
| 已迁移到 `apps/api` Nitro 层        | 17   |
| 仍在 legacy fallback 兼容           | ~211 |
| Legacy fallback 已识别冲突端点      | 4    |

### 2.2 已迁移端点清单（apps/api Nitro 层）

| #   | URL                                                      | 方法     | 模块   | 状态                        |
| :-- | :------------------------------------------------------- | :------- | :----- | :-------------------------- |
| 1   | `/app/fee.listFee`                                       | GET/POST | fee    | app-shadow-allowlist        |
| 2   | `/app/fee.queryFeeDetail`                                | GET/POST | fee    | app-shadow-allowlist        |
| 3   | `/app/feeApi/listOweFees`                                | GET/POST | fee    | app-shadow-allowlist        |
| 4   | `/app/payment.nativeQrcodePayment`                       | POST     | fee    | **blocked-for-execution**   |
| 5   | `/app/oweFeeCallable.listOweFeeCallable`                 | GET/POST | fee    | app-shadow-allowlist        |
| 6   | `/app/oweFeeCallable.writeOweFeeCallable`                | POST     | fee    | **blocked-for-execution**   |
| 7   | `/app/fee.saveRoomCreateFee`                             | POST     | fee    | **blocked-for-execution**   |
| 8   | `/app/feeConfig.listFeeConfigs`                          | GET/POST | fee    | app-shadow-allowlist        |
| 9   | `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | GET/POST | fee    | app-shadow-allowlist        |
| 10  | `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | GET/POST | fee    | app-shadow-allowlist        |
| 11  | `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | GET/POST | fee    | app-shadow-allowlist        |
| 12  | `/app/dataReport.queryFeeDataReport`                     | GET/POST | fee    | app-shadow-allowlist        |
| 13  | `/app/ownerRepair.listOwnerRepairs`                      | GET/POST | repair | not-in-app-shadow-allowlist |
| 14  | `/app/ownerRepair.queryOwnerRepair`                      | GET/POST | repair | not-in-app-shadow-allowlist |
| 15  | `/app/ownerRepair.saveOwnerRepair`                       | POST     | repair | not-in-app-shadow-allowlist |
| 16  | `/app/repairSetting.listRepairSettings`                  | GET/POST | repair | not-in-app-shadow-allowlist |
| 17  | `/app/dict.queryRepairStates`                            | GET/POST | repair | not-in-app-shadow-allowlist |

### 2.3 Legacy Fallback 端点清单

以下端点仍在统一 server 上通过 fallback 兼容：

#### /callComponent/\*\* 端点（2 个）

| #   | URL                                         | 方法     | 定义位置                                                   | 说明                 |
| :-- | :------------------------------------------ | :------- | :--------------------------------------------------------- | :------------------- |
| 1   | `/callComponent/core/list`                  | GET/POST | `repair/endpoints.ts`, `property-application/endpoints.ts` | 字典查询，多模块冲突 |
| 2   | `/callComponent/ownerRepair.appraiseRepair` | POST     | `repair/endpoints.ts`                                      | 维修评价             |

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
- **repair 模块**: 5/28 端点已迁移（17.9%）
- **整体覆盖率**: 17/~221 端点（7.7%）

#### Legacy Fallback 机制

所有 `/app/**` 和 `/callComponent/**` 路径的请求，如果在 Nitro 层 404，会自动 fallback 代理到 `PHASE7_LEGACY_APP_FALLBACK_BASE_URL`（默认 `https://01s-11-app-server.ruan-cat.com`）。

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

#### App Legacy Routes（17 个）

来自 `runtime-endpoints.ts` 的 fee(12) + repair(5) 定义：

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

##### Repair Legacy Endpoints（5 个）

| #   | 路由路径                                | Method   | 状态                        |
| --- | --------------------------------------- | -------- | --------------------------- |
| 1   | `/app/ownerRepair.listOwnerRepairs`     | GET/POST | not-in-app-shadow-allowlist |
| 2   | `/app/ownerRepair.queryOwnerRepair`     | GET/POST | not-in-app-shadow-allowlist |
| 3   | `/app/ownerRepair.saveOwnerRepair`      | POST     | not-in-app-shadow-allowlist |
| 4   | `/app/repairSetting.listRepairSettings` | GET/POST | not-in-app-shadow-allowlist |
| 5   | `/app/dict.queryRepairStates`           | GET/POST | not-in-app-shadow-allowlist |

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

##### Repository DB 覆盖情况（Fee）

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
| `listFeeConfigs`              | ❌ 无 DB         | **InMemory only** |
| `getFeeSummaryReport`         | ❌ 无 DB         | **InMemory only** |
| `getRoomFeeReport`            | ❌ 无 DB         | **InMemory only** |

#### Repair Module（仅 InMemory，**无 DB 实现**）

| 层级               | 文件                               | 数据来源                                               |
| ------------------ | ---------------------------------- | ------------------------------------------------------ |
| **Repository**     | `modules/repair/repository.ts`     | **仅 InMemory**                                        |
| **Service**        | `modules/repair/service.ts`        | 依赖 Repository                                        |
| **Admin Adapter**  | `modules/repair/admin-adapter.ts`  | 依赖 Service，输出 JsonVO                              |
| **Legacy Adapter** | `modules/repair/legacy-adapter.ts` | 依赖 Service                                           |
| **Runtime**        | `modules/repair/runtime.ts`        | **无数据库连接**（getRepairRuntime 直接返回 fallback） |

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

| 类别                            | 数量  | 说明                                      |
| ------------------------------- | ----- | ----------------------------------------- |
| **Legacy-only（无 DB）**        | 14 个 | fee 的欠费/催缴/配置相关全部仅 InMemory   |
| **blocked-for-execution**       | 3 个  | mutation 类被 phase7 guard 拦截           |
| **not-in-app-shadow-allowlist** | 5 个  | repair 全部 5 个 endpoint 未在 app 侧开放 |

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

| 端点                                    | 当前数据源    | 目标 Schema                   | 优先级 |
| --------------------------------------- | ------------- | ----------------------------- | ------ |
| `/app/ownerRepair.listOwnerRepairs`     | InMemory only | `rpRepairOrders`              | **P0** |
| `/app/ownerRepair.queryOwnerRepair`     | InMemory only | `rpRepairOrders`              | **P0** |
| `/app/ownerRepair.saveOwnerRepair`      | InMemory only | `rpRepairOrders`              | **P0** |
| `/app/repairSetting.listRepairSettings` | InMemory only | `rpRepairSettings`            | **P0** |
| `/app/dict.queryRepairStates`           | InMemory only | `rpRepairOrders.status`       | **P0** |
| `/app/fee.listFee`                      | InMemory only | `exHouseCharges + exPayments` | **P0** |
| `/app/fee.queryFeeDetail`               | InMemory only | `exHouseCharges + exPayments` | **P0** |
| `/app/feeApi/listOweFees`               | InMemory only | `exHouseCharges`              | **P0** |

#### High（应尽快迁移）

| 端点                                                     | 当前数据源    | 目标 Schema           | 优先级 |
| -------------------------------------------------------- | ------------- | --------------------- | ------ |
| `/app/oweFeeCallable.listOweFeeCallable`                 | InMemory only | `exOverdueReminders`  | P1     |
| `/app/oweFeeCallable.writeOweFeeCallable`                | InMemory only | `exOverdueReminders`  | P1     |
| `/app/feeConfig.listFeeConfigs`                          | InMemory only | `exExpenseItems`      | P1     |
| `/app/fee.saveRoomCreateFee`                             | InMemory only | `exHouseCharges`      | P1     |
| `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | InMemory only | `rptExpenseSummaries` | P1     |
| `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | InMemory only | `rptPaymentDetails`   | P1     |
| `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | InMemory only | `exHouseCharges`      | P1     |

#### 特殊关注：`/callComponent/**` 和 `/app/floor.queryFloors`

**状态：DB/Repository 迁移覆盖为 0**

- `legacy-fallback.ts` 明确将 `/app/` 和 `/callComponent/` 路径识别为 legacy fallback 路径
- 当 Nitro 端点 registry 匹配失败时，流量会被代理到 `PHASE7_LEGACY_APP_FALLBACK_BASE_URL`
- 目前 `/callComponent/**` 和 `floor.queryFloors` **没有任何 Nitro 实现**，完全依赖 legacy fallback 代理

### 3.6 关键发现

1. **Repair Module 完全无 DB 实现**：所有 repair 相关端点（admin 和 app）均依赖 InMemory Repository，`getRepairRuntime` 固定返回 fallback
2. **Fee Module DB 覆盖约 50%**：CRUD 操作已接入 DB，但查询和报表类大部分仍仅 InMemory
3. **Schema 存在但未接入**：rpRepairOrders/rpRepairSettings/rpRepairTypes 等 schema 已定义但未被使用
4. **Legacy fallback 路径零迁移**：所有 `/callComponent/**` 和未匹配的 `/app/**` 路径仍然透传到旧服务
5. **3 个 Mutation 被 blocked**：`payment.nativeQrcodePayment`、`oweFeeCallable.writeOweFeeCallable`、`fee.saveRoomCreateFee` 设置了 `PHASE7_ALLOW_LEGACY_MUTATIONS` 开关

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

**Repair Module 当前完全无 DB 实现**，所有 repair 相关端点均依赖 InMemory Repository。需要：

1. 为 repair module 创建 DB Repository 实现，替换 InMemory 实现
2. 将 `/app/ownerRepair.listOwnerRepairs`、`/app/ownerRepair.queryOwnerRepair`、`/app/ownerRepair.saveOwnerRepair` 等端点接入 `rpRepairOrders` schema
3. 将 `/app/repairSetting.listRepairSettings` 接入 `rpRepairSettings` schema

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

_报告生成时间：2026-05-10_
_探索团队：phase7-exploration（4 个并行探索子代理）_
