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
- `A 已确认完成`：`36`
- `B 已改造待复核`：`0`
- `C 已发现残留`：`0`
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

- `settingManage.organizeManage.staffInfo` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/staff-info`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)。本轮清理了 renderI18n 残留（替换为 transformI18n）。

- `settingManage.organizeManage.orgInfo` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/org-info`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。本轮清理了 renderI18n 残留（替换为 transformI18n）。

- `settingManage.organizeManage.workingSchedule` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/working-schedule`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)。无 renderI18n 残留。
  - 备注：`plusSearchProps` 存在轻微的 searchText/resetText 重复传递（searchProps 内部展开 + 模板 props），不影响功能。

- `settingManage.organizeManage.schedulingSetting` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。本轮清理了 renderI18n 残留（替换为 transformI18n）。

- `settingManage.organizeManage.shiftSetting` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/shift-setting`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。本轮清理了 renderI18n 残留（替换为 transformI18n）。

- `settingManage.organizeManage.rolePermission` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/role-permission`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。本轮清理了 renderI18n 残留（替换为 transformI18n）。

- `settingManage.organizeManage.dataPermission` `D 未开始`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/data-permission`
  - 下一步：先扫描 `index.vue` 与子表格组件，再决定改造范围。

### settingManage.systemManage

- `settingManage.systemManage.changePassword` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/change-password`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)、部门/修改类型/状态映射。无 renderI18n 残留。

- `settingManage.systemManage.systemConfig` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/system-config`
  - 已完成：列表描述区、弹窗标题、footerButtons、`form.vue`、`cloneDeep(props.form)`、本地 `renderI18n` 清理。
  - 下一步：后续只需要做整站回归时顺带复测。

- `settingManage.systemManage.registerProtocol` `D 未开始`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/register-protocol`
  - 下一步：先扫描是否仍用旧 helper，再决定是否与 `operationTeam.systemManage.registerProtocol` 一起清理。
  - 备注：`operationTeam.systemManage.registerProtocol` 已确认完成（A 状态），本路由为 settingManage 侧的独立路由。

- `settingManage.systemManage.initializeCell` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/initialize-cell`
  - 已完成：`index.vue`、`components/form.vue`、`components/format-form.vue`
  - 已完成项：`plusSearchButtonTexts`、映射文案、弹窗函数文案、本地 `renderI18n` 清理。

- `settingManage.systemManage.communityConfiguration` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/community-configuration`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：状态/类型映射、表头、搜索区、弹窗按钮、`cloneDeep(props.form)`、本地 `renderI18n` 清理。

### devTeam.menuManage

- `devTeam.menuManage.catalog` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/menu-manage/catalog`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。本轮清理了 renderI18n 残留并标准化 plusSearchButtonTexts。

- `devTeam.menuManage.group` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/menu-manage/group`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts。本轮清理了 form.vue 的 renderI18n 残留。

- `devTeam.menuManage.item` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/menu-manage/item`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、cloneDeep(props.form)。纯列表页无弹窗。无 renderI18n 残留。

### devTeam.cacheManage

- `devTeam.cacheManage.refreshCache` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/cache-manage/refresh-cache`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：本轮对 form.vue 做了完整 i18n 改造（从 1/10 到 10/10），引入 useI18nConfig、withLocale、$t。index.vue 清理了 renderI18n 残留并标准化 plusSearchButtonTexts。

### devTeam.configManage

- `devTeam.configManage.type` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/type`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、cloneDeep(props.form)。纯列表页无弹窗。无 renderI18n 残留。

- `devTeam.configManage.item` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/item`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：本轮对 index.vue 做了重度重构（从 4/10 到 10/10），引入 useI18nConfig、withLocale、createHeaderRenderer、plusSearchButtonTexts，弹窗 title 和 footerButtons.label 改为函数。form.vue 清理了 renderI18n 残留。

- `devTeam.configManage.dictionary` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/dictionary`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：本轮清理了 renderI18n 残留并标准化 plusSearchButtonTexts。

- `devTeam.configManage.center` `A 已确认完成`
  - 目录：`apps/admin/src/pages/dev-team/config-manage/center`
  - 已完成：`index.vue`、`components/form.vue`、`components/dialog.ts`
  - 已完成项：本轮清理了 form.vue 的 renderI18n 残留，标准化 plusSearchButtonTexts。dialog.ts 使用 transformI18n 函数形式。

### operationTeam.systemManage

- `operationTeam.systemManage.changePassword` `D 未开始`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/change-password`
  - 下一步：先扫描目录，确认是否已有旧 helper / 静态 `ref`。

- `operationTeam.systemManage.systemConfig` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/system-config`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：状态/类型/系统字段映射、`plusSearchButtonTexts`、弹窗文案、本地 `renderI18n` 清理。

- `operationTeam.systemManage.registerProtocol` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/register-protocol`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)（变量名 toRefForm）。无 renderI18n 残留。

- `operationTeam.systemManage.initializeCell` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/initialize-cell`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：本轮清理了 renderI18n 残留并标准化 plusSearchButtonTexts。

- `operationTeam.systemManage.communityConfiguration` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/community-configuration`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：本轮清理了 renderI18n 残留、标准化 plusSearchButtonTexts、将 form.vue 的 structuredClone(props.form) 改为 cloneDeep(props.form)。

### operationTeam.dataManage

- `operationTeam.dataManage.communityInformation` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/data-manage/community-information`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：本轮清理了 renderI18n 残留并标准化 plusSearchButtonTexts。

- `operationTeam.dataManage.propertyManagementCompany` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/data-manage/property-management-company`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)。无 renderI18n 残留。

### operationTeam.merchantManage

- `operationTeam.merchantManage.merchantInfo` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/merchant-manage/merchant-info`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。本轮清理了 renderI18n 残留。

- `operationTeam.merchantManage.merchantAdmin` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/merchant-manage/merchant-admin`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。本轮清理了 renderI18n 残留。

### operationTeam.reportConfiguration

- `operationTeam.reportConfiguration.reportGroup` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/report-configuration/report-group`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：index.vue 从 2/10 大幅重构——表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、renderI18n 清理。form.vue 清理 renderI18n 残留。

- `operationTeam.reportConfiguration.reportInfo` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/report-configuration/report-info`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：index.vue renderI18n 清理、plusSearchButtonTexts 补充、structuredClone→cloneDeep 修复。form.vue 清理 renderI18n 残留。

- `operationTeam.reportConfiguration.reportComponent` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/report-configuration/report-component`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：index.vue 从 5/10 重构——表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、renderI18n 清理。form.vue 清理 renderI18n 残留。

### propertyManage.communityManage

- `propertyManage.communityManage.houseDecoration` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/house-decoration`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头、搜索区、弹窗、校验文案、本地 `renderI18n` 清理。

- `propertyManage.communityManage.buildingSpaceStructureDiagram` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/building-space-structure-diagram`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)。无 renderI18n 残留。

- `propertyManage.communityManage.notice` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/notice`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：批量操作文案、弹窗标题/按钮、列表页、表单页、本地 `renderI18n` 清理。

- `propertyManage.communityManage.propertyRegister` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/property-register`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：状态/楼栋/单元映射、搜索区、弹窗、表单、本地 `renderI18n` 清理。

- `propertyManage.communityManage.handingBusiness` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/handing-business`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)、费用类型/状态映射。本轮清理了 renderI18n 残留（替换为 transformI18n）。

- `propertyManage.communityManage.my` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/my`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)、地区/状态映射。无 renderI18n 残留。

- `propertyManage.communityManage.parkingSpaceStructureDiagram` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)、车位类型/状态/朝向/楼层映射。本轮清理了 renderI18n 残留（替换为 transformI18n）。

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

A=36、B=0、C=0、D=64。全部 B/C 状态路由已升级为 A 已确认完成。

下一阶段进入 64 个 D 状态路由的全新 i18n 改造。建议按模块分批推进：

1. **settingManage.systemManage** (2 个 D)：changePassword、systemConfig
2. **operationTeam.systemManage** (1 个 D)：registerProtocol
3. **operationTeam.dataManage** (1 个 D)：propertyManagementCompany
4. **propertyManage.communityManage** (4 个 D)：buildingSpaceStructureDiagram、handingBusiness、my、parkingSpaceStructureDiagram
5. **propertyManage.contractManage** (4 个 D)：draftContract、expire、firstParty、type
6. **propertyManage.expenseManage** (16 个 D)：整模块推进
7. **propertyManage.housePropertyManage** (10 个 D)：整模块推进
8. **propertyManage.parkingManage** (4 个 D)：整模块推进
9. **propertyManage.patrolManage** (6 个 D)：整模块推进
10. **propertyManage.repairsManage** (6 个 D)：整模块推进
11. **propertyManage.reportManage** (13 个 D)：整模块推进

每批建议 4~6 个子代理并行，按"列表页 → 表单页 → 弹窗 → 自测"顺序推进。

## 使用说明

后续每完成一个三级业务路由，更新本文件时至少要同步三件事：

- 把该路由状态从 `C/D` 提升到 `B` 或 `A`
- 写清楚已完成的文件范围
- 写清楚下一步是否还需要 Chrome MCP 复测
