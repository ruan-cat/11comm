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
- `A 已确认完成`：`100`
- `B 已改造待复核`：`0`
- `C 已发现残留`：`0`
- `D 未开始`：`0`

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

- `settingManage.organizeManage.dataPermission` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/organize-manage/data-permission`
  - 已完成：`index.vue`、子表格组件。已完成项：非标准布局（左侧面板+右侧标签页），transformI18n 配置。

### settingManage.systemManage

- `settingManage.systemManage.changePassword` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/change-password`
  - 已完成：`index.vue`、`components/form.vue`
  - 已完成项：表头 headerRenderer、withLocale 配置、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)、部门/修改类型/状态映射。无 renderI18n 残留。

- `settingManage.systemManage.systemConfig` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/system-config`
  - 已完成：列表描述区、弹窗标题、footerButtons、`form.vue`、`cloneDeep(props.form)`、本地 `renderI18n` 清理。
  - 下一步：后续只需要做整站回归时顺带复测。

- `settingManage.systemManage.registerProtocol` `A 已确认完成`
  - 目录：`apps/admin/src/pages/setting-manage/system-manage/register-protocol`
  - 已完成：`index.vue`。已完成项：简单展示页（卡片+协议内容），transformI18n($t(...)) 配置。无列表/表单/弹窗。

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

- `operationTeam.systemManage.changePassword` `A 已确认完成`
  - 目录：`apps/admin/src/pages/operation-team/system-manage/change-password`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、cloneDeep(props.form)。

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

- `propertyManage.contractManage.change` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/change`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

- `propertyManage.contractManage.draftContract` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/draft-contract`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

- `propertyManage.contractManage.expire` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/expire`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

- `propertyManage.contractManage.firstParty` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/first-party`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

- `propertyManage.contractManage.type` `A 已确认完成`
  - 目录：`apps/admin/src/pages/property-manage/contract-manage/type`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

### propertyManage.expenseManage

- `propertyManage.expenseManage.waterAndElectricityMeterReading` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.vehicleCharge` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.reminderForOverduePayments` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.reprintVoucher` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.overduePaymentInformation` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.paymentReview` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.refundReview` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.houseCharge` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.meterReadingType` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.discountType` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.expenseSummaryTable` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.discountApply` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.discountSetting` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.contracteCharge` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.expenseItemSetting` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.expenseManage.cancelFee` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

### propertyManage.housePropertyManage

- `propertyManage.housePropertyManage.house` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.invoice` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.invoiceTitle` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.ownerAccount` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.ownerInformation` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.ownerMember` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.ownersCommittee` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.reserveVenue` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.reserveVenueOrder` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.housePropertyManage.siteManagement` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

### propertyManage.parkingManage

- `propertyManage.parkingManage.carportApply` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.parkingManage.carportInfo` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.parkingManage.ownerVehicle` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.parkingManage.parkingLot` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

### propertyManage.patrolManage

- `propertyManage.patrolManage.detail` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.patrolManage.item` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.patrolManage.path` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.patrolManage.plan` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.patrolManage.point` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.patrolManage.task` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

### propertyManage.repairsManage

- `propertyManage.repairsManage.issues` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、@reset 事件。
- `propertyManage.repairsManage.mandatoryReturnIssue` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、@reset 事件。
- `propertyManage.repairsManage.phoneReportRepairs` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、@reset 事件。
- `propertyManage.repairsManage.repairsHaveDone` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、@reset 事件。
- `propertyManage.repairsManage.repairsSetting` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、@reset 事件。
- `propertyManage.repairsManage.repairsTodo` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、@reset 事件。
- `propertyManage.repairsManage.returnVisit` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label、@reset 事件。

### propertyManage.reportManage

- `propertyManage.reportManage.arrearsDetailsList` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.dataStatistics` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.depositReport` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.expenseSummaryTable` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.feeReminder` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.noChargeHouse` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.outstandingFeesAnalysis` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.ownerPaymentDetails` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.patrolReport` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.paymentDetailsForm` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.repairReportForm` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.repairReportsSummaryTable` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。
- `propertyManage.reportManage.statementExpenses` `A 已确认完成`
  - 已完成：`index.vue`、`components/form.vue`。已完成项：useI18nConfig、withLocale、headerRenderer、plusSearchButtonTexts、弹窗函数标题、footerButtons 函数 label。

## 完成总结

A=100、B=0、C=0、D=0。全部 100 个三级业务路由已完成 i18n 改造。

所有路由已通过自动化验证：useI18nConfig、headerRenderer、withLocale、plusSearchButtonTexts 均已到位。

## 使用说明

后续每完成一个三级业务路由，更新本文件时至少要同步三件事：

- 把该路由状态从 `C/D` 提升到 `B` 或 `A`
- 写清楚已完成的文件范围
- 写清楚下一步是否还需要 Chrome MCP 复测
