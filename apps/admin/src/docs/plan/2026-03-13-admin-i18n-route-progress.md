# 2026-03-13 admin 后台 i18n 路由级改造进度

## 目标

本文件用于记录 `apps/admin/src/router/rank/rank-route-keys.ts` 对应的全部三级业务路由的 i18n 改造进度，避免后续继续推进时失忆。

本次大规模改造的统一目标如下：

- 组件内统一直接写 `transformI18n($t("..."))`
- 不再新增本地 `renderI18n`
- 配置对象统一使用 `computed(...)` / `withLocale(...)`
- 表格列标题统一使用 `headerRenderer`
- `PlusSearch` 按钮文案统一使用 `plusSearchButtonTexts`
- 弹窗标题与 `footerButtons.label` 统一使用函数
- `definePage.meta.title` 改成 i18n key 后，必须补原中文注释
- 表单默认使用 `cloneDeep(props.form)`，不要继续用 `structuredClone(props.form)`

## 状态定义

- `A 已确认完成`
  - 本轮已经逐文件确认主页面内不再存在本地 `renderI18n`
  - 结构已经切到 `transformI18n($t(...)) + withLocale/computed`
  - `PlusSearch`、表头、弹窗、表单已按新规范落地
- `B 已改造待复核`
  - 之前已经改过一轮，或本轮只核过主文件但没有重新逐组件复核
  - 后续仍需做一次整路由复查，必要时补 Chrome MCP 自测
- `C 已发现残留`
  - 已确认仍存在 `renderI18n`、静态 `ref`、旧搜索按钮写法、或表单/子组件残留
  - 属于优先继续清理的路由
- `D 未开始`
  - 还没有进入该三级业务路由
  - 需要先扫描目录，再决定具体改造动作

## 当前统计

- 三级业务路由总数：`100`
- `A 已确认完成`：`7`
- `B 已改造待复核`：`19`
- `C 已发现残留`：`10`
- `D 未开始`：`64`

## 全局待办模板

每个三级业务路由后续推进时，默认按以下检查项逐条完成：

- [ ] `definePage.meta.title` 改成 i18n key，并补中文注释
- [ ] 列表页文本统一改为 `transformI18n($t(...))`
- [ ] 表头统一改为 `headerRenderer`
- [ ] 搜索区配置统一改为 `withLocale/computed`
- [ ] `PlusSearch` 按钮文案统一改为 `plusSearchButtonTexts`
- [ ] 表单配置统一改为 `withLocale/computed`
- [ ] 弹窗标题和 `footerButtons.label` 改为函数
- [ ] 清理本地 `renderI18n`
- [ ] 清理承载 i18n 文本的静态 `ref({...})`
- [ ] 路由级 Chrome MCP 自测

## 路由索引

### settingManage.organizeManage

- `settingManage.organizeManage.staffInfo` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/staff-info`
  - 说明：之前已做过搜索按钮、表头、弹窗和表单 i18n 收口；下次需要整路由复核一次。
  - 下一步：复查是否仍有旧 helper / 静态 `ref` 残留，并补浏览器复测。

- `settingManage.organizeManage.orgInfo` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/org-info`
  - 说明：列表页和表单已做过一轮 i18n 收口。
  - 下一步：复核所有子组件与弹窗文案，确认是否还存在旧式写法。

- `settingManage.organizeManage.workingSchedule` `C 已发现残留`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/working-schedule`
  - 已知残留：`index.vue` 仍存在本地 `renderI18n`
  - 下一步：优先清理列表页、搜索区、弹窗按钮、状态映射和弹窗标题。

- `settingManage.organizeManage.schedulingSetting` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting`
  - 说明：已做过一轮搜索按钮与动态 i18n 收口。
  - 下一步：复核是否仍存在旧 helper、静态 `ref` 和未切换的表单子组件。

- `settingManage.organizeManage.shiftSetting` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/shift-setting`
  - 说明：弹窗标题、footerButtons、搜索区和表头已改过。
  - 下一步：补一轮代码复核和 Chrome MCP 回归。

- `settingManage.organizeManage.rolePermission` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/role-permission`
  - 说明：已做过 `PlusSearch` 按钮和列表页 i18n 收口。
  - 下一步：确认整路由无本地 `renderI18n` 残留。

- `settingManage.organizeManage.dataPermission` `D 未开始`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/data-permission`
  - 下一步：先扫描 `index.vue` 与子表格组件，再决定改造范围。

### settingManage.systemManage

- `settingManage.systemManage.changePassword` `C 已发现残留`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/change-password`
  - 已知残留：`index.vue`、`components/form.vue`
  - 下一步：清理部门/修改类型/状态映射、搜索区、表单 labels/rules、`renderI18n`。

- `settingManage.systemManage.systemConfig` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/system-config`
  - 已完成：列表描述区、弹窗标题、footerButtons、`form.vue`、`cloneDeep(props.form)`、本地 `renderI18n` 清理。
  - 下一步：后续只需要做整站回归时顺带复测。

- `settingManage.systemManage.registerProtocol` `D 未开始`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/register-protocol`
  - 下一步：先扫描是否仍用旧 helper，再决定是否与 `operationTeam.systemManage.registerProtocol` 一起清理。

- `settingManage.systemManage.initializeCell` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/initialize-cell`
  - 已完成：`index.vue`、`components/form.vue`、`components/format-form.vue`
  - 已完成项：`plusSearchButtonTexts`、映射文案、弹窗函数文案、本地 `renderI18n` 清理。

- `settingManage.systemManage.communityConfiguration` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/community-configuration`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：状态/类型映射、表头、搜索区、弹窗按钮、`cloneDeep(props.form)`、本地 `renderI18n` 清理。

### devTeam.menuManage

- `devTeam.menuManage.catalog` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/dev-team/menu-manage/catalog`
  - 说明：之前已做过列表与表单 i18n 收口。
  - 下一步：补一轮整路由无 `renderI18n` 复核。

- `devTeam.menuManage.group` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/dev-team/menu-manage/group`
  - 说明：`index.vue` 已清理到新写法。
  - 下一步：复查整路由，尤其确认 `components/form.vue` 是否仍有旧 helper。

- `devTeam.menuManage.item` `C 已发现残留`
  - 目录：`apps/admin/src/pages/dev-team/menu-manage/item`
  - 已知残留：`components/form.vue`
  - 下一步：继续清理父级菜单、菜单类型、布尔状态映射、表单 placeholder/rules。

### devTeam.cacheManage

- `devTeam.cacheManage.refreshCache` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/dev-team/cache-manage/refresh-cache`
  - 说明：页面已经做过一轮 i18n 改造。
  - 下一步：补整路由复核，确认无旧 helper 残留。

### devTeam.configManage

- `devTeam.configManage.type` `C 已发现残留`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/type`
  - 已知残留：`index.vue`
  - 下一步：清理字典类型状态映射、表头、搜索区和按钮文案。

- `devTeam.configManage.item` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/item`
  - 说明：已做过一轮弹窗标题和列表 i18n 改造。
  - 下一步：确认是否仍有旧 helper / 静态 `ref`。

- `devTeam.configManage.dictionary` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/dictionary`
  - 说明：已改过列表、弹窗标题和搜索区。
  - 下一步：补代码复核与浏览器验证。

- `devTeam.configManage.center` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/center`
  - 说明：已完成核心页面的新规范改造。
  - 下一步：复核子组件和细节文案，确认无旧 helper 回流。

### operationTeam.systemManage

- `operationTeam.systemManage.changePassword` `D 未开始`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/change-password`
  - 下一步：先扫描目录，确认是否已有旧 helper / 静态 `ref`。

- `operationTeam.systemManage.systemConfig` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/system-config`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：状态/类型/系统字段映射、`plusSearchButtonTexts`、弹窗文案、本地 `renderI18n` 清理。

- `operationTeam.systemManage.registerProtocol` `C 已发现残留`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/register-protocol`
  - 已知残留：`index.vue`
  - 下一步：清理协议类型、启用状态、必填状态映射，以及搜索区和弹窗按钮文案。

- `operationTeam.systemManage.initializeCell` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/initialize-cell`
  - 说明：更早一轮已经做过改造，但本轮未重新逐文件复核。
  - 下一步：复核无 `renderI18n` 残留后再升级为完成。

- `operationTeam.systemManage.communityConfiguration` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/community-configuration`
  - 说明：更早一轮已改造。
  - 下一步：补整路由代码复核和 Chrome MCP 检查。

### operationTeam.dataManage

- `operationTeam.dataManage.communityInformation` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/data-manage/community-information`
  - 说明：之前已处理过列表、表单和乱码问题。
  - 下一步：补一次整路由 `renderI18n` 与静态 `ref` 复核。

- `operationTeam.dataManage.propertyManagementCompany` `C 已发现残留`
  - 目录：`apps/admin/src/pages/operation-team/data-manage/property-management-company`
  - 已知残留：`index.vue`、`components/form.vue`
  - 下一步：优先处理列表页、表单页、搜索区、弹窗按钮和各种选项映射。

### operationTeam.merchantManage

- `operationTeam.merchantManage.merchantInfo` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/merchant-manage/merchant-info`
  - 说明：已做过列表页、弹窗标题、表单和 locale 收口。
  - 下一步：补一次代码复核与浏览器验证。

- `operationTeam.merchantManage.merchantAdmin` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/merchant-manage/merchant-admin`
  - 说明：已做过列表页、表单和动态 i18n 收口。
  - 下一步：复核无旧 helper 残留。

### operationTeam.reportConfiguration

- `operationTeam.reportConfiguration.reportGroup` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/report-configuration/report-group`
  - 说明：已做过弹窗标题 key 化和表单 i18n 收口。
  - 下一步：整路由复核。

- `operationTeam.reportConfiguration.reportInfo` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/report-configuration/report-info`
  - 说明：之前已处理过主页面残留。
  - 下一步：复核 `index.vue`、`components/form.vue` 是否完全符合新规范。

- `operationTeam.reportConfiguration.reportComponent` `B 已改造待复核`
  - 目录：`apps/admin/src/pages/operation-team/report-configuration/report-component`
  - 说明：已处理过弹窗标题和搜索区。
  - 下一步：补整路由复核。

### propertyManage.communityManage

- `propertyManage.communityManage.houseDecoration` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/house-decoration`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头、搜索区、弹窗、校验文案、本地 `renderI18n` 清理。

- `propertyManage.communityManage.buildingSpaceStructureDiagram` `C 已发现残留`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/building-space-structure-diagram`
  - 已知残留：`index.vue`、`components/form.vue`
  - 下一步：优先清理搜索区、表头、弹窗文案和表单校验。

- `propertyManage.communityManage.notice` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/notice`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：批量操作文案、弹窗标题/按钮、列表页、表单页、本地 `renderI18n` 清理。

- `propertyManage.communityManage.propertyRegister` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/property-register`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：状态/楼栋/单元映射、搜索区、弹窗、表单、本地 `renderI18n` 清理。

- `propertyManage.communityManage.handingBusiness` `C 已发现残留`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/handing-business`
  - 已知残留：至少 `components/form.vue`
  - 下一步：补扫 `index.vue`，再统一清理表单和列表旧写法。

- `propertyManage.communityManage.my` `C 已发现残留`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/my`
  - 已知残留：`index.vue`、`components/form.vue`
  - 下一步：清理地区/状态映射、表头、搜索区、弹窗、表单 rules。

- `propertyManage.communityManage.parkingSpaceStructureDiagram` `C 已发现残留`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram`
  - 已知残留：`index.vue`、`components/form.vue`
  - 下一步：优先清理列表页和表单页的本地 `renderI18n`。

### propertyManage.contractManage

- `propertyManage.contractManage.change` `D 未开始`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/change`
  - 下一步：先扫目录。

- `propertyManage.contractManage.draftContract` `D 未开始`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/draft-contract`
  - 下一步：先扫目录。

- `propertyManage.contractManage.expire` `D 未开始`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/expire`
  - 下一步：先扫目录。

- `propertyManage.contractManage.firstParty` `D 未开始`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/first-party`
  - 下一步：先扫目录。

- `propertyManage.contractManage.type` `D 未开始`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/type`
  - 下一步：先扫目录。

### propertyManage.expenseManage

- `propertyManage.expenseManage.waterAndElectricityMeterReading` `D 未开始`
- `propertyManage.expenseManage.vehicleCharge` `D 未开始`
- `propertyManage.expenseManage.reminderForOverduePayments` `D 未开始`
- `propertyManage.expenseManage.reprintVoucher` `D 未开始`
- `propertyManage.expenseManage.overduePaymentInformation` `D 未开始`
- `propertyManage.expenseManage.paymentReview` `D 未开始`
- `propertyManage.expenseManage.refundReview` `D 未开始`
- `propertyManage.expenseManage.houseCharge` `D 未开始`
- `propertyManage.expenseManage.meterReadingType` `D 未开始`
- `propertyManage.expenseManage.discountType` `D 未开始`
- `propertyManage.expenseManage.expenseSummaryTable` `D 未开始`
- `propertyManage.expenseManage.discountApply` `D 未开始`
- `propertyManage.expenseManage.discountSetting` `D 未开始`
- `propertyManage.expenseManage.contracteCharge` `D 未开始`
- `propertyManage.expenseManage.expenseItemSetting` `D 未开始`
- `propertyManage.expenseManage.cancelFee` `D 未开始`
  - 统一下一步：进入该模块前先做目录扫描，再按“列表页 -> 表单页 -> 弹窗 -> 自测”的顺序推进。

### propertyManage.housePropertyManage

- `propertyManage.housePropertyManage.house` `D 未开始`
- `propertyManage.housePropertyManage.invoice` `D 未开始`
- `propertyManage.housePropertyManage.invoiceTitle` `D 未开始`
- `propertyManage.housePropertyManage.ownerAccount` `D 未开始`
- `propertyManage.housePropertyManage.ownerInformation` `D 未开始`
- `propertyManage.housePropertyManage.ownerMember` `D 未开始`
- `propertyManage.housePropertyManage.ownersCommittee` `D 未开始`
- `propertyManage.housePropertyManage.reserveVenue` `D 未开始`
- `propertyManage.housePropertyManage.reserveVenueOrder` `D 未开始`
- `propertyManage.housePropertyManage.siteManagement` `D 未开始`
  - 统一下一步：该模块整体尚未进入，后续应整模块推进。

### propertyManage.parkingManage

- `propertyManage.parkingManage.carportApply` `D 未开始`
- `propertyManage.parkingManage.carportInfo` `D 未开始`
- `propertyManage.parkingManage.ownerVehicle` `D 未开始`
- `propertyManage.parkingManage.parkingLot` `D 未开始`
  - 统一下一步：整模块扫描后再拆优先级。

### propertyManage.patrolManage

- `propertyManage.patrolManage.detail` `D 未开始`
- `propertyManage.patrolManage.item` `D 未开始`
- `propertyManage.patrolManage.path` `D 未开始`
- `propertyManage.patrolManage.plan` `D 未开始`
- `propertyManage.patrolManage.point` `D 未开始`
- `propertyManage.patrolManage.task` `D 未开始`
  - 统一下一步：整模块尚未进入。

### propertyManage.repairsManage

- `propertyManage.repairsManage.issues` `D 未开始`
- `propertyManage.repairsManage.mandatoryReturnIssue` `D 未开始`
- `propertyManage.repairsManage.phoneReportRepairs` `D 未开始`
- `propertyManage.repairsManage.repairsHaveDone` `D 未开始`
- `propertyManage.repairsManage.repairsSetting` `D 未开始`
- `propertyManage.repairsManage.repairsTodo` `D 未开始`
- `propertyManage.repairsManage.returnVisit` `D 未开始`
  - 统一下一步：整模块尚未进入。

### propertyManage.reportManage

- `propertyManage.reportManage.arrearsDetailsList` `D 未开始`
- `propertyManage.reportManage.dataStatistics` `D 未开始`
- `propertyManage.reportManage.depositReport` `D 未开始`
- `propertyManage.reportManage.expenseSummaryTable` `D 未开始`
- `propertyManage.reportManage.feeReminder` `D 未开始`
- `propertyManage.reportManage.noChargeHouse` `D 未开始`
- `propertyManage.reportManage.outstandingFeesAnalysis` `D 未开始`
- `propertyManage.reportManage.ownerPaymentDetails` `D 未开始`
- `propertyManage.reportManage.patrolReport` `D 未开始`
- `propertyManage.reportManage.paymentDetailsForm` `D 未开始`
- `propertyManage.reportManage.repairReportForm` `D 未开始`
- `propertyManage.reportManage.repairReportsSummaryTable` `D 未开始`
- `propertyManage.reportManage.statementExpenses` `D 未开始`
  - 统一下一步：整模块尚未进入。

## 建议的下次启动顺序

按当前残留和收益比，建议下次从以下顺序继续：

1. `settingManage.systemManage.changePassword`
2. `settingManage.organizeManage.workingSchedule`
3. `operationTeam.systemManage.registerProtocol`
4. `operationTeam.dataManage.propertyManagementCompany`
5. `devTeam.menuManage.item`
6. `devTeam.configManage.type`
7. `propertyManage.communityManage.buildingSpaceStructureDiagram`
8. `propertyManage.communityManage.my`
9. `propertyManage.communityManage.parkingSpaceStructureDiagram`
10. `propertyManage.communityManage.handingBusiness`

## 使用说明

后续每完成一个三级业务路由，更新本文件时至少要同步三件事：

- 把该路由状态从 `C/D` 提升到 `B` 或 `A`
- 写清楚已完成的文件范围
- 写清楚下一步是否还需要 Chrome MCP 复测
