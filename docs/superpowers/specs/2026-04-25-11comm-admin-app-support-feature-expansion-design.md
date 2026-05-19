<!-- TODO: 长任务 未开始

	先完成旧 app monorepo API 迁移总设计；该设计已迁移至稳定索引 docs\superpowers\phase7-openspec-migration-index.md，canonical OpenSpec change 为 openspec\changes\migrate-superpowers-docs-to-openspec-longtask\
 -->

# 2026-04-25 11comm Admin 支撑 App 的功能扩张总规格

## 1. 文档定位

本文档是 `01s-11comm-app` 迁入 `01s-11comm` 后，admin 后台为了真正支撑 app 业务所需补齐的长期功能规格。

它和旧 app monorepo API 迁移总设计是同一轮迁移设计的上下游关系；旧总设计已迁移至稳定索引 `docs/superpowers/phase7-openspec-migration-index.md`，canonical OpenSpec change 为 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/`：

- 迁移设计文档回答“app 如何迁入 monorepo、唯一 Nitro API 放在哪里、哪些事情先不要做”。
- 本文档回答“迁入以后，admin 还缺哪些后台管理能力，未来应该按什么业务域逐步补齐”。

本文档只做规格沉淀，不做代码实现，不直接提交 git。

## 2. 调研依据

本轮判断基于以下本地项目事实：

- `D:\code\ruan-cat\01s-11comm-app\server\modules` 已经存在大量 app 侧 legacy API 模块，包括 `activity`、`appointment`、`complaint`、`contact`、`coupon`、`fee`、`inspection`、`maintenance`、`meter`、`notice`、`oa-workflow`、`owner`、`parking`、`profile`、`property-application`、`purchase`、`renovation`、`repair`、`resource`、`staff`、`video`、`visit`、`work-order` 等。
- `D:\code\ruan-cat\01s-11comm-app\src\pages` 至少覆盖 `index`、`activity`、`address`、`login`、`me`、`notice`、`profile`、`work-dashboard`、`webview` 等 app 功能入口。
- `apps/admin/src/router/rank/rank-route-keys.ts` 当前 admin 业务路径主要集中在 `settingManage`、`devTeam`、`operationTeam`、`propertyManage`，其中物业域已经包含社区、合同、费用、房产、停车、巡检、报修、报表等传统模块。
- `apps/admin/server/api` 当前有 155 个 TypeScript API 文件，其中 `list.post.ts` 占 108 个，`create/update/delete` 各只有 11 个左右，说明大量后台模块目前仍偏“列表壳子”，没有形成完整 CRUD 与业务动作闭环。
- `apps/type` 已经覆盖社区、合同、费用、房产、停车、巡检、报修、报表、运营、设置等领域 schema，但 app 侧新增的活动、积分券、OA、访客、视频、物资采购、工单等还没有完全沉淀为统一事实来源。

## 3. 总体判断

当前 admin 还不能算 app 的有效后台。

更准确地说，当前 admin 更像是一个按照物业管理菜单搭出来的管理端框架，已有不少业务路径和列表页面，但 app 侧实际暴露的业务已经远远超过 admin 已完成的管理能力。要让 admin 成为 app 的有效后端支撑，需要补齐三层能力：

1. 数据主档：社区、楼栋、单元、房屋、业主、成员、员工、组织、车场、仓库、设备、收费项等基础数据必须统一维护。
2. 业务流转：报修、投诉、工单、费用、抄表、停车、巡检、维保、采购、物品放行、OA、访客等需要后台可配置、可审核、可派单、可追踪。
3. app 运营：公告、活动、积分、优惠券、预约、首页入口、用户资料、社区切换等 app 体验相关能力需要后台可管理。

最终目标不是“把 app 的 mock API 搬到 admin”，而是形成：

```text
admin 后台管理 -> apps/api 统一 Nitro 服务 -> apps/type 统一 Schema -> app 移动端消费
```

## 4. 方案取舍

### 4.1 方案 A：照搬 app legacy API

把 app 现在的 `/app/**`、`/callComponent/**` 直接照搬到 `apps/api`，并围绕这些接口反向补页面。

优点是迁移快，app 改动少。

缺点是会把历史 mock 字段、临时 URL、重复 endpoint、内存 repository 设计一起固化，后续 admin、schema、数据库都会被 legacy 结构拖住。

结论：只适合作为兼容层，不适合作为长期业务模型。

### 4.2 方案 B：以 admin 业务域为主线补齐能力

以 `rank-route-keys.ts` 的业务路径为 canonical 坐标，逐个业务域补齐 schema、API、admin 页面、app 兼容 endpoint。

优点是符合当前项目规范，能让后台成为真正的数据管理中心。

缺点是需要分阶段，不可能一次性完成全部功能。

结论：推荐作为主方案。

### 4.3 方案 C：先做统一 API，不补 admin 页面

先把 app 接口全部迁到 `apps/api`，后台页面以后再补。

优点是能较快替换 app mock server。

缺点是 admin 仍不能管理数据，app 的业务数据来源仍不可维护。

结论：可作为阶段性辅助，但不能作为最终交付标准。

## 5. 统一约束

未来所有实现都必须遵守以下约束：

1. 唯一 Nitro API 服务放在 `apps/api`，长期由它同时支撑 admin 和 app。
2. `apps/type/src/business/{domain}/{module}/schema.ts` 是数据库表、Zod Schema、TypeScript 类型的唯一事实来源。
3. 新增 schema 必须遵循 Trinity Pattern：Drizzle Table、Zod Schemas、TypeScript Types 同文件导出。
4. 类型项目导出必须使用 `export * from "./xxx"`，不能使用 `export type *`，不能逐项枚举导出。
5. Nitro/H3 API 必须从 `"nitro/h3"` 导入 H3 函数，不能从 `"h3"` 直接导入。
6. 本项目 Nitro API 不做接口鉴权，不新增 JWT、Token 校验、Neon Auth、中间件鉴权或插件鉴权。
7. app legacy 路径 `/app/**`、`/callComponent/**` 先保留兼容，再逐步映射到规范 API。
8. app mock/memory repository 只能作为迁移参考或兼容阶段数据源，不能作为最终生产数据源。
9. admin 新功能路径必须先经过 `rank-route-keys.ts` 业务路径评审，不能随意新增菜单和目录。
10. 一个业务模块只有在“admin 可维护、app 可消费、状态可回流、测试可验证”时，才算真正补齐。

## 6. 功能优先级

| 优先级 | 含义               | 业务目标                                                                             |
| ------ | ------------------ | ------------------------------------------------------------------------------------ |
| P0     | 基础设施与兼容底座 | `apps/api`、统一 DTO、legacy route adapter、app/admin API base URL、基础 schema 盘点 |
| P1     | app 高频用户闭环   | 房屋业主、公告活动、报修投诉、费用缴费、停车车辆                                     |
| P2     | 员工工作台闭环     | 派单、抢单、工单、巡检、维保、通讯录、考勤                                           |
| P3     | 运营与资产闭环     | 物资采购、仓库库存、积分券、预约、装修、优惠申请、访客放行                           |
| P4     | 深水区能力         | OA 流程、视频设备、道闸设备、充电设备、复杂报表、BI 聚合                             |

## 7. 功能域总览

### F-01 App 运营中心

app 侧依据：

- `notice`：`/app/notice.listNotices`
- `activity`：`/app/activities.listActivitiess`、`saveActivities`、`updateActivities`、`deleteActivities`、`increaseView`、`likeActivity`、`updateStatus`、`updateLike`、`updateCollect`
- `coupon`：`/app/couponProperty.*`、`/app/integral.*`、`/app/reserveOrder.*`
- `appointment`：`/app/communitySpace.listCommunitySpaceConfirmOrder`、`saveCommunitySpaceConfirmOrder`

admin 当前缺口：

- `propertyManage.communityManage.notice` 已有公告业务路径，但需要从“列表管理”升级为发布、撤回、置顶、附件、阅读范围、阅读统计、app 展示策略。
- 活动、积分、优惠券、预约确认单、app 首页入口配置没有形成完整后台。
- app 用户互动行为，如点赞、收藏、浏览、核销、积分使用，需要后台可追踪。

目标能力：

- 公告管理：分类、发布范围、有效期、置顶、撤回、阅读统计。
- 活动管理：活动 CRUD、封面、时间、报名状态、点赞收藏统计、上下架。
- 优惠券管理：券模板、发放规则、用户券、核销记录。
- 积分管理：积分规则、积分流水、积分使用、异常冲正。
- 预约管理：场地/服务可预约时间、订单确认、取消、核销。
- app 首页管理：banner、快捷入口、公告位、活动位、工作台入口。

建议候选业务路径：

- `operationTeam.appOperationManage.notice`
- `operationTeam.appOperationManage.activity`
- `operationTeam.appOperationManage.coupon`
- `operationTeam.appOperationManage.integral`
- `operationTeam.appOperationManage.appHome`
- `propertyManage.housePropertyManage.reserveVenueOrder`

### F-02 物业主数据与住户关系

app 侧依据：

- `floor`：`/app/floor.queryFloors`、`queryFloorDetail`
- `unit`：`/app/unit.queryUnits`、`queryUnitDetail`
- `room`：`/app/room.queryRooms`、`queryRoomDetail`
- `owner`：`/app/owner.queryOwnerAndMembers`、`saveRoomOwner`、`editOwner`、`deleteOwner`
- `profile`：`/app/profile.getUserProfile`、`listCommunities`、`changeCommunity`
- `staff/contact`：员工、组织、通讯录、在线状态、常用联系人、紧急联系人

admin 当前缺口：

- 已有 `communityManage`、`housePropertyManage.house`、`ownerInformation`、`ownerMember`、`staffInfo`、`orgInfo`，但 app 需要的是更完整的楼栋-单元-房屋-业主-成员-账号-社区切换链路。
- app profile 和 admin 员工/业主体系之间缺少明确映射。
- 房屋申请、业主绑定、成员关系、住户审核等移动端入口没有完整后台闭环。

目标能力：

- 社区、楼栋、单元、楼层、房屋主数据完整 CRUD。
- 业主、家庭成员、租户、房屋绑定关系管理。
- app 用户资料和房屋/业主/员工身份映射管理。
- 社区切换记录与默认社区维护。
- 员工组织、岗位、班次、通讯录、在线状态、常用联系人维护。
- 地址簿与紧急联系人后台维护。

建议优先使用现有业务路径：

- `propertyManage.communityManage.*`
- `propertyManage.housePropertyManage.house`
- `propertyManage.housePropertyManage.ownerInformation`
- `propertyManage.housePropertyManage.ownerMember`
- `settingManage.organizeManage.staffInfo`
- `settingManage.organizeManage.orgInfo`

需要评审的候选补充路径：

- `propertyManage.housePropertyManage.floor`
- `propertyManage.housePropertyManage.unit`
- `propertyManage.housePropertyManage.roomBinding`
- `propertyManage.housePropertyManage.appAccount`

### F-03 报修、投诉与工单中心

app 侧依据：

- `repair`：业主报修、员工待办、员工已办、详情、创建、更新、派单、转单、退单、开工、暂停、完工、结单、抢单、评价、评价回复、维修人员、维修状态、支付类型。
- `complaint`：投诉待审核、审核历史、投诉提交、审核、事件列表、投诉评价、评价回复。
- `work-order`：待办列表、抄送列表、详情、创建、更新、开始、完成、审核、取消、任务列表、任务项、抄送办结。

admin 当前缺口：

- `propertyManage.repairsManage` 已有报修相关路径，但大量接口仍停留在列表层，业务动作不完整。
- 投诉、综合工单、抄送、任务项、审批动作没有统一后台。
- app 员工工作台依赖的状态流转没有完整可视化和可追踪后台。

目标能力：

- 报修设置：维修类型、服务范围、派单规则、维修人员映射。
- 报修池：待派单、待处理、处理中、已完成、已回访、强制回单。
- 报修动作：派单、转单、退单、抢单、开工、暂停、完工、结单、回访、评价回复。
- 投诉管理：投诉分类、审核、处理、事件记录、评价回复。
- 综合工单：工单模板、工单创建、任务拆分、抄送、审核、取消、状态流转。
- 操作轨迹：每个工单类对象必须有状态变更记录和处理日志。

建议优先使用现有业务路径：

- `propertyManage.repairsManage.repairsSetting`
- `propertyManage.repairsManage.repairsTodo`
- `propertyManage.repairsManage.repairsHaveDone`
- `propertyManage.repairsManage.phoneReportRepairs`
- `propertyManage.repairsManage.mandatoryReturnIssue`
- `propertyManage.repairsManage.returnVisit`

需要评审的候选补充路径：

- `propertyManage.repairsManage.complaintTodo`
- `propertyManage.repairsManage.complaintHistory`
- `propertyManage.repairsManage.workOrder`
- `propertyManage.repairsManage.workOrderTask`

### F-04 费用、抄表与支付中心

app 侧依据：

- `fee`：费用列表、费用详情、欠费列表、房屋费用生成、二维码支付、欠费催缴、催缴写入、充电设备、充电订单、充电端口、月度费用汇总、缴费明细、房屋费用明细、费用数据报表、门禁/设备记录、收费配置。
- `meter`：抄表列表、费用类型、费用项、表类型、上期读数、保存读数、公摊读数、公摊表、公摊读数保存、公摊读数审核。
- `property-application`：优惠申请、审批、优惠记录、费用详情。

admin 当前缺口：

- `propertyManage.expenseManage` 菜单很完整，但实际 API 和页面需要补齐完整 CRUD、业务动作、费用状态流转。
- app 依赖二维码支付、充电设备订单、欠费催缴、公摊抄表审核等移动端能力，当前后台没有形成统一操作台。

目标能力：

- 收费项配置：费用类型、费用项、计费周期、折扣类型、折扣规则。
- 房屋费用：生成、调整、取消、欠费、催缴、补打凭证。
- 车辆费用：车辆收费、临停费用、车场支付记录。
- 合同费用：合同账单、应收、实收、退款。
- 抄表：水电表、公摊表、读数录入、审核、异常处理。
- 支付：二维码支付订单、支付回调记录、支付复核、退款复核。
- 充电设备：设备、端口、订单、故障记录。
- 报表：费用汇总、缴费明细、欠费分析、未收费房屋。

建议优先使用现有业务路径：

- `propertyManage.expenseManage.expenseItemSetting`
- `propertyManage.expenseManage.meterReadingType`
- `propertyManage.expenseManage.waterAndElectricityMeterReading`
- `propertyManage.expenseManage.houseCharge`
- `propertyManage.expenseManage.vehicleCharge`
- `propertyManage.expenseManage.contracteCharge`
- `propertyManage.expenseManage.paymentReview`
- `propertyManage.expenseManage.refundReview`
- `propertyManage.expenseManage.reminderForOverduePayments`
- `propertyManage.expenseManage.overduePaymentInformation`
- `propertyManage.expenseManage.cancelFee`

需要评审的候选补充路径：

- `propertyManage.expenseManage.qrcodePaymentOrder`
- `propertyManage.expenseManage.chargeMachine`
- `propertyManage.expenseManage.chargeMachineOrder`
- `propertyManage.expenseManage.floorShareMeter`

### F-05 停车、道闸、通行与视频

app 侧依据：

- `parking`：业主车辆、停车区域、停车场设备、开门、关门、手动进出场、在场车辆、停车券、临停订单、进出明细、支付记录、道闸云视频。
- `video`：监控区域、员工监控设备、播放地址。
- `visit`：访客详情、访客审核。

admin 当前缺口：

- `propertyManage.parkingManage` 有车位、车辆、车场、申请相关路径，但 app 依赖设备控制、进出记录、临停支付、停车券、云视频。
- 访客、视频监控、道闸设备并没有形成统一后台管理。

目标能力：

- 停车主数据：车场、区域、车位、车辆、车位申请。
- 道闸设备：设备列表、设备状态、开门/关门命令、命令日志。
- 车辆通行：入场、出场、手动修正、异常记录。
- 临停费用：费用订单、支付记录、优惠券抵扣。
- 停车券：发放、绑定车辆、核销。
- 视频监控：区域、设备、播放 URL、权限范围、播放日志。
- 访客管理：访客申请、审核、放行记录、关联房屋/业主。

建议优先使用现有业务路径：

- `propertyManage.parkingManage.parkingLot`
- `propertyManage.parkingManage.carportInfo`
- `propertyManage.parkingManage.ownerVehicle`
- `propertyManage.parkingManage.carportApply`

需要评审的候选补充路径：

- `propertyManage.parkingManage.parkingArea`
- `propertyManage.parkingManage.barrierMachine`
- `propertyManage.parkingManage.carInout`
- `propertyManage.parkingManage.carInoutPayment`
- `propertyManage.parkingManage.parkingCoupon`
- `operationTeam.deviceManage.videoMonitor`
- `propertyManage.communityManage.visit`

### F-06 巡检、点检与维保

app 侧依据：

- `inspection`：巡检任务、今日报表、任务明细、巡检项标题、提交巡检、员工列表、转单。
- `maintenance`：维保任务、任务详情、任务明细、开始、完成、单项提交、转单。

admin 当前缺口：

- `propertyManage.patrolManage` 已有点、线、项、计划、任务、明细路径，但 app 侧实际业务还需要员工执行、今日统计、任务转派、维保任务闭环。
- 维保和巡检可能需要统一抽象“计划-任务-执行-审核-报表”模型，但不能牺牲 app legacy 兼容。

目标能力：

- 巡检基础配置：巡检点、巡检路线、巡检项目、巡检计划。
- 巡检任务：任务生成、分派、执行明细、异常上报、转派、补检。
- 巡检报表：今日完成率、异常数量、人员完成情况。
- 维保任务：设备/区域维保计划、任务明细、开始、完成、单项提交、转派。
- 执行记录：图片、视频、位置、耗时、处理意见。

建议优先使用现有业务路径：

- `propertyManage.patrolManage.point`
- `propertyManage.patrolManage.path`
- `propertyManage.patrolManage.item`
- `propertyManage.patrolManage.plan`
- `propertyManage.patrolManage.task`
- `propertyManage.patrolManage.detail`

需要评审的候选补充路径：

- `propertyManage.patrolManage.inspectionReport`
- `propertyManage.patrolManage.maintenanceTask`
- `propertyManage.patrolManage.maintenancePlan`

### F-07 物资、采购、仓库与物品放行

app 侧依据：

- `resource`：资源门店、仓库、采购申请、物品领用、调拨申请、我的审核、物品放行待办、调拨审核、资源类型、采购、领用、调拨、审核、入库、取消、转赠、我的库存、退还、报废。
- `purchase`：资源门店、采购申请、紧急采购。
- `item-release`：物品放行待办、已完成、详情、资源详情、审批人、审核。

admin 当前缺口：

- 当前 admin 没有清晰的物资/仓库/采购/放行中心。
- app 侧已经有比较完整的移动端库存与审批动作，但后台缺少主数据和流程配置。

目标能力：

- 资源主数据：资源类型、资源、规格、单位、库存阈值。
- 仓库管理：仓库、库位、库存、员工持有库存。
- 采购管理：普通采购、紧急采购、采购审核、采购入库。
- 领用出库：领用申请、审核、出库、退还、报废。
- 调拨：调拨申请、调拨审核、调拨入库、转赠。
- 物品放行：放行申请、资源明细、审批人、审核、放行记录。
- 审批轨迹：每个申请类对象都应记录发起人、审核人、审核意见、状态时间线。

建议候选业务路径：

- `propertyManage.resourceManage.resourceType`
- `propertyManage.resourceManage.resource`
- `propertyManage.resourceManage.storehouse`
- `propertyManage.resourceManage.inventory`
- `propertyManage.resourceManage.purchaseApply`
- `propertyManage.resourceManage.itemOut`
- `propertyManage.resourceManage.allocation`
- `propertyManage.resourceManage.itemRelease`
- `propertyManage.resourceManage.returnAndScrap`

### F-08 OA 流程中心

app 侧依据：

- `oa-workflow`：流程查询、表单查询、表单数据查询、保存、更新、待办、已办、审批意见、流程图、下一任务、审批、下一处理人。

admin 当前缺口：

- 当前 admin 没有 OA 流程设计器、表单设计、任务实例、审批历史等后台能力。
- app 已经假设存在流程定义、表单定义、流程图和任务流转。

目标能力：

- 流程定义：流程列表、启停、版本、适用范围。
- 表单定义：字段、校验、布局、默认值、业务绑定。
- 流程实例：表单数据、当前节点、发起人、状态。
- 审批任务：待办、已办、下一处理人、审批意见、驳回、通过。
- 流程图：节点、连线、运行态高亮。
- 与业务域绑定：物资、放行、优惠申请、访客、装修等可接入流程。

建议候选业务路径：

- `operationTeam.workflowManage.flow`
- `operationTeam.workflowManage.form`
- `operationTeam.workflowManage.instance`
- `operationTeam.workflowManage.task`
- `operationTeam.workflowManage.auditLog`

### F-09 装修、优惠申请与住户服务申请

app 侧依据：

- `renovation`：装修查询、审核、装修明细保存、状态更新、记录查询、记录详情、装修记录更新、删除。
- `property-application`：房屋优惠申请、优惠申请更新、审核、费用折扣、费用详情、优惠记录、优惠记录详情、新增、终止。

admin 当前缺口：

- `propertyManage.communityManage.houseDecoration` 已有装修路径，但 app 需要完整审核和施工记录。
- 优惠申请、折扣生效、终止、费用联动还没有形成后台闭环。

目标能力：

- 装修申请：申请、审核、保证金、施工人员、施工周期、附件。
- 装修过程：进度记录、图片/视频、违规记录、状态变更。
- 装修验收：验收记录、退款、关闭。
- 优惠申请：申请、审核、折扣方案、费用联动、生效、终止。
- 服务申请记录：所有住户服务申请需要统一查询和追踪。

建议优先使用现有业务路径：

- `propertyManage.communityManage.houseDecoration`
- `propertyManage.expenseManage.discountApply`
- `propertyManage.expenseManage.discountSetting`

需要评审的候选补充路径：

- `propertyManage.communityManage.serviceApplication`
- `propertyManage.expenseManage.discountRecord`

### F-10 报表与数据看板

app 侧依据：

- fee 模块已经暴露费用汇总、缴费明细、房屋费用明细、费用数据报表。
- inspection 模块暴露今日巡检报表。
- repair 模块暴露维修统计。
- parking 模块暴露车辆进出、支付记录。

admin 当前缺口：

- `propertyManage.reportManage` 业务路径较完整，但需要从静态列表升级为跨业务域聚合。
- 报表必须基于真实业务表和状态流，不应由 mock 数据或页面静态数据支撑。

目标能力：

- 费用类：月度费用汇总、缴费明细、欠费明细、欠费分析、未收费房屋。
- 服务类：报修统计、投诉统计、回访统计、满意度。
- 巡检类：任务完成率、异常趋势、人员执行情况。
- 停车类：进出记录、临停收入、优惠券使用。
- 运营类：公告阅读、活动参与、积分使用、优惠券核销。
- 数据导出：按权限范围导出 Excel 或 CSV。

建议优先使用现有业务路径：

- `propertyManage.reportManage.dataStatistics`
- `propertyManage.reportManage.expenseSummaryTable`
- `propertyManage.reportManage.paymentDetailsForm`
- `propertyManage.reportManage.repairReportForm`
- `propertyManage.reportManage.repairReportsSummaryTable`
- `propertyManage.reportManage.patrolReport`
- `propertyManage.reportManage.arrearsDetailsList`

### F-11 App 用户、个人中心与员工工作台

app 侧依据：

- `profile`：用户资料、社区列表、切换社区、修改密码、考勤记录。
- `work-dashboard` 页面暗示员工移动端工作台。
- `staff/contact`：员工查询、组织、在线状态、通讯录。

admin 当前缺口：

- 本项目 Nitro API 明确不做接口鉴权，所以这里不能设计 JWT 登录或 token 校验。
- 但 app 所需的“用户资料、员工身份、社区切换、考勤记录、工作台数据”仍需要后台数据管理。

目标能力：

- app 用户资料维护：昵称、头像、电话、关联业主/员工、默认社区。
- 社区切换配置：用户可访问社区、默认社区、最近访问社区。
- 员工工作台配置：待办类型、统计卡片、快捷入口。
- 考勤记录：记录查询、异常标记、班次关联。
- 密码修改：仅作为资料字段或兼容接口处理，不引入 Nitro 鉴权。

建议优先使用现有业务路径：

- `settingManage.organizeManage.staffInfo`
- `settingManage.organizeManage.workingSchedule`
- `settingManage.organizeManage.schedulingSetting`
- `settingManage.organizeManage.shiftSetting`

需要评审的候选补充路径：

- `operationTeam.appOperationManage.appUser`
- `settingManage.organizeManage.attendanceRecord`
- `operationTeam.appOperationManage.workDashboard`

### F-12 API 兼容与迁移管理中心

app 侧依据：

- app legacy API 当前大量使用 `/app/**`、`/callComponent/**`，并存在重复 URL 和 compatibility dispatcher。
- `repair`、`resource`、`property-application` 等模块已经出现 legacy conflict set。

admin 当前缺口：

- 缺少一张“legacy app endpoint -> 规范 API -> schema/entity -> admin 页面”的迁移登记表。
- 缺少兼容接口的回归测试清单。

目标能力：

- Endpoint Registry：登记 legacy URL、HTTP method、参数、响应、归属模块、迁移状态。
- Adapter Mapping：登记 legacy 字段和规范 DTO 字段映射关系。
- Compatibility Tests：每个 app legacy endpoint 至少有一个兼容测试。
- Deprecation Plan：只有在 app 调用全部切换后，才能标记 legacy endpoint 可退役。

建议候选业务路径：

- `devTeam.apiManage.endpointRegistry`
- `devTeam.apiManage.compatibilityMapping`
- `devTeam.apiManage.compatibilityTest`

## 8. Schema 补全候选域

未来新增或扩展 schema 时，建议按以下领域拆分，避免把 app legacy 字段直接污染现有表：

| 候选领域               | 可能实体                                                                         |
| ---------------------- | -------------------------------------------------------------------------------- |
| app-operation          | 公告、活动、活动互动、优惠券模板、用户券、积分规则、积分流水、预约订单、首页配置 |
| property-core          | 楼栋、楼层、单元、房屋、业主、成员、房屋绑定、app 用户、社区切换                 |
| service-workflow       | 报修单、报修事件、投诉单、投诉事件、综合工单、工单任务、抄送、评价               |
| fee-payment            | 费用配置、账单、支付订单、二维码支付、公摊抄表、催缴、充电设备、充电订单         |
| parking-access         | 停车区域、道闸设备、设备命令、车辆进出、临停订单、停车券、支付记录               |
| inspection-maintenance | 巡检计划、巡检任务、巡检明细、巡检异常、维保计划、维保任务、转派记录             |
| resource-inventory     | 资源类型、资源、仓库、库存、采购申请、领用出库、调拨、退还、报废、物品放行       |
| oa-workflow            | 流程定义、表单定义、表单数据、流程实例、任务实例、审批记录、流程图               |
| device-video           | 监控区域、监控设备、播放地址、播放日志、设备状态                                 |
| report-snapshot        | 报表快照、统计口径、导出任务、聚合缓存                                           |

每个候选领域正式实施前都必须先拆成独立 OpenSpec 或任务计划，并同步 `.claude/skills/neon-db-query/SKILL.md` 的数据库表清单。

## 9. 每个模块的完成定义

一个业务模块不能只做列表页。未来每个模块至少需要满足以下完成定义：

1. 业务路径：明确对应 `rank-route-keys.ts` 的三级业务路径；如果要新增路径，先评审路径命名。
2. Schema：`apps/type/src/business/{domain}/{module}/schema.ts` 有 Trinity Pattern 定义。
3. 导出链：类型项目每层 `index.ts` 使用 `export * from "./xxx"` 完整导出。
4. 数据库：有 Drizzle migration、必要 seed 或初始化数据。
5. API：`apps/api` 提供 admin 规范 API 和 app legacy 兼容 API。
6. 页面：admin 有列表、详情、创建、编辑、删除或禁用，以及必要业务动作。
7. app 回流：admin 变更的数据能被 app 对应页面或 endpoint 消费。
8. 状态流：涉及审批、派单、支付、核销、入库、出库的模块必须有状态机和操作日志。
9. 测试：schema、repository、API adapter、关键状态动作有 vitest 测试。
10. 验收：至少有一个“admin 操作 -> apps/api -> app 查询/动作 -> admin 看到状态变化”的端到端业务场景。

## 10. 分阶段路线图

### 阶段 0：统一 API 与盘点

- 建立 `apps/api` 最小 Nitro 服务。
- 建立 app legacy endpoint registry。
- 建立 admin 业务路径与 app endpoint 对照表。
- 标记每个 app endpoint 的数据来源：mock、memory、已有 schema、待新增 schema。
- 不删除 `apps/admin/server` 和 `apps/app/server`。

### 阶段 1：核心主数据

- 社区、楼栋、单元、房屋、业主、成员、员工、组织、车辆、车位。
- 目标是让 app 的个人中心、社区切换、房屋查询、业主车辆查询先能从统一 API 获取真实数据。

### 阶段 2：高频住户业务

- 公告、活动、报修、投诉、费用、缴费、抄表、装修、优惠申请。
- 目标是覆盖业主端最常用的 app 页面和后台维护动作。

### 阶段 3：员工工作台业务

- 派单、抢单、工单、巡检、维保、通讯录、考勤、任务统计。
- 目标是让员工 app 工作台不再依赖 mock 数据。

### 阶段 4：资产与审批业务

- 物资、仓库、采购、调拨、退还、报废、物品放行、访客、预约、积分券。
- 目标是补齐社区运营和内部协作能力。

### 阶段 5：设备、OA 与报表

- 道闸、视频、充电设备、OA 流程、跨域报表、导出任务。
- 目标是处理复杂集成和数据聚合，不应过早抢跑。

### 阶段 6：legacy 收口

- app 调用切换到规范 API。
- legacy endpoint 全部有兼容测试。
- 逐个标记可退役 endpoint。
- 最后再考虑删除 `apps/app/server` 和 `apps/admin/server` 的旧服务职责。

## 11. 后续可拆分的子规格

建议后续按以下顺序拆成独立规格文件或 OpenSpec change：

1. `11comm-core-property-master-data`：社区、楼栋、单元、房屋、业主、成员、员工主数据。
2. `11comm-app-operation-center`：公告、活动、积分、优惠券、预约、app 首页。
3. `11comm-repair-complaint-work-order`：报修、投诉、综合工单、状态流转。
4. `11comm-fee-meter-payment`：费用、抄表、支付、催缴、充电设备。
5. `11comm-parking-access-video`：停车、道闸、通行、视频、访客。
6. `11comm-inspection-maintenance`：巡检、点检、维保、任务执行。
7. `11comm-resource-inventory-purchase`：资源、仓库、采购、调拨、物品放行。
8. `11comm-oa-workflow`：流程、表单、任务、审批。
9. `11comm-report-data-center`：费用、报修、巡检、停车、运营报表。
10. `11comm-legacy-api-compatibility`：app legacy endpoint registry、adapter、兼容测试、退役计划。

## 12. 明确不要做的事情

以下事项应继续记录为长期约束：

1. 不直接 git commit，除非用户明确要求。
2. 不一次性实现所有新增后台功能。
3. 不把 app legacy mock repository 当成生产数据模型。
4. 不把 app legacy 字段直接塞进现有 schema，必须通过领域建模和 adapter 映射。
5. 不新增 Nitro 鉴权。
6. 不直接删除 `/app/**`、`/callComponent/**` 兼容路径。
7. 不绕过 `rank-route-keys.ts` 随意创建 admin 菜单路径。
8. 不在 `apps/api` 内私自定义数据库表事实来源。
9. 不用全局安装工具包。
10. 不通过批量脚本粗暴改写大批量业务代码。

## 13. 关键验收场景

未来每个阶段至少要能跑通下列验收场景的一部分：

1. admin 发布公告，app `notice` 页面可以看到，admin 能看到阅读统计。
2. admin 创建活动，app 能浏览、点赞、收藏，admin 能看到互动数据。
3. admin 维护楼栋/单元/房屋/业主，app 个人中心能切换社区并查询自己的房屋。
4. app 提交报修，admin 能派单，员工 app 能开工/完工，admin 能回访和查看评价。
5. app 提交投诉，admin 能审核和处理，app 能查看处理轨迹并评价。
6. admin 生成房屋费用，app 能查账单并发起二维码支付，admin 能复核支付和退款。
7. 员工 app 提交抄表，admin 能审核并生成费用。
8. app 查询车辆和停车记录，admin 能维护车场、车位、车辆、道闸设备和临停支付。
9. 员工 app 执行巡检或维保，admin 能配置计划并查看完成率。
10. app 发起采购、调拨或物品放行，admin 能审核，库存或放行状态能同步变化。
11. app 发起 OA 表单，admin 能维护流程和查看任务实例。
12. admin 报表能聚合费用、报修、巡检、停车、运营数据，而不是读取静态 mock。
