# 任务清单：修复 61 个类型错误

## 前置准备

- [ ] 0.1 运行类型检查获取基准错误数：`pnpm -F @01s-11comm/admin typecheck 2>&1 | tee typecheck-baseline.log`
- [ ] 0.2 验证类型项目状态：`pnpm -F @01s-11comm/type typecheck`

## 第一阶段：批量修复（预计修复 35+ 错误）

### 1. 修复 FieldValues 类型转换错误（6 个错误）

- [ ] 1.1 修复 `src/pages/dev-team/config-manage/type/components/form.vue`
  - 文件路径：`apps/admin/src/pages/dev-team/config-manage/type/components/form.vue`
  - 错误行：23, 34
  - 修复方式：使用 `as unknown as FieldValues & DictionaryTypeFormVO` 进行类型转换
  - 验证：检查组件功能正常

- [ ] 1.2 修复 `src/pages/operation-team/system-manage/initialize-cell/components/form.vue`
  - 文件路径：`apps/admin/src/pages/operation-team/system-manage/initialize-cell/components/form.vue`
  - 错误行：16, 29
  - 修复方式：使用 `as unknown as FieldValues & InitializeCellFormVO` 进行类型转换
  - 验证：检查组件功能正常

- [ ] 1.3 运行类型检查验证 FieldValues 修复：`pnpm -F @01s-11comm/admin typecheck`

### 2. 修复 doFetch 方法缺失错误（8 个错误）

- [ ] 2.1 检查 `useListQuery` 组合式函数定义
  - 查找文件：`apps/admin/src/composables/use-list-query.ts`（或类似路径）
  - 确认返回值类型定义包含 `doFetch` 方法

- [ ] 2.2 修复报表管理页面的 doFetch 引用（5 个文件）
  - `apps/admin/src/pages/property-manage/report-manage/owner-payment-details/index.vue`（行 256, 258）
  - `apps/admin/src/pages/property-manage/report-manage/payment-details-form/index.vue`（行 319）
  - `apps/admin/src/pages/property-manage/report-manage/repair-report-form/index.vue`（行 300）
  - `apps/admin/src/pages/property-manage/report-manage/repair-reports-summary-table/index.vue`（行 196）
  - 修复方式：确保从 `useListQuery` 正确解构 `doFetch` 方法

- [ ] 2.3 修复数据管理页面的 doFetch 引用
  - `apps/admin/src/pages/operation-team/data-manage/-detail-page/manage-community-[id].vue`（行 279）
  - 修复方式：确保从 `useListQuery` 正确解构 `doFetch` 方法

- [ ] 2.4 修复组织管理页面的 doFetch 引用（2 个文件）
  - `apps/admin/src/pages/setting-manage/organize-manage/data-permission/components/staff-relation/table.vue`（行 163）
  - `apps/admin/src/pages/setting-manage/organize-manage/data-permission/components/unit-auth/table.vue`（行 190）
  - 修复方式：确保从组合式函数正确解构 `doFetch` 方法

- [ ] 2.5 运行类型检查验证 doFetch 修复：`pnpm -F @01s-11comm/admin typecheck`

### 3. 修复 Options 变量未定义错误（15+ 个错误）

#### 3.1 类型项目 - 补充缺失的 Options 定义

- [ ] 3.1.1 检查并补充 `apps/type/src/common/business-options.ts` 中的 Options
  - 需要补充的 Options：
    - `contractTypeOptionsData` / `contractTypeOptions`（合同类型选项）
    - `feeItemNameOptions`（费用项名称选项）
    - `chargeObjectTypeOptions`（收费对象类型选项）
    - `refundStatusOptions`（退款状态选项）
    - `提醒类型Options` → 重命名为 `reminderTypeOptions`
    - `expenseItemNameOptions`（费用项名称选项）
    - `支付方式Options` → 重命名为 `paymentMethodOptions`
    - `费用状态Options` → 重命名为 `expenseStatusOptions`
    - `feeTypeOptions`（费用类型选项）
    - `费用项Options` → 重命名为 `expenseItemOptions`
    - `小区Options` → 重命名为 `communityOptions`
    - `巡检类型Options` → 重命名为 `patrolTypeOptions`
    - `巡检级别Options` → 重命名为 `patrolLevelOptions`
    - `状态Options` → 重命名为 `statusOptions`（或更具体的命名）
  - 验证：确保所有 Options 都有正确的 TypeScript 类型定义

- [ ] 3.1.2 更新 `apps/type/src/common/index.ts` 导出新增的 Options

- [ ] 3.1.3 运行类型项目类型检查：`pnpm -F @01s-11comm/type typecheck`

#### 3.2 后台项目 - 导入缺失的 Options

- [ ] 3.2.1 修复合同管理页面
  - `apps/admin/src/pages/property-manage/contract-manage/draft-contract/index.vue`（行 81）
  - 导入：`import { contractTypeOptions } from "@01s-11comm/type"`

- [ ] 3.2.2 修复押金报表页面
  - `apps/admin/src/pages/property-manage/report-manage/deposit-report/index.vue`（行 172, 184, 200）
  - 导入：`import { feeItemNameOptions, chargeObjectTypeOptions, refundStatusOptions } from "@01s-11comm/type"`

- [ ] 3.2.3 修复费用提醒页面
  - `apps/admin/src/pages/property-manage/report-manage/fee-reminder/index.vue`（行 142）
  - 导入：`import { reminderTypeOptions } from "@01s-11comm/type"`
  - 注意：将 `提醒类型Options` 替换为 `reminderTypeOptions`

- [x] 3.2.4 修复业主缴费明细页面
  - `apps/admin/src/pages/property-manage/report-manage/owner-payment-details/index.vue`（行 145, 147, 237, 242）
  - 补充缺失的变量定义（`tableData`, `pagination`, `resetParams`, `updateParams`）
  - 检查是否需要从 `useListQuery` 或其他组合式函数中获取
  - **已修复**：调用 useOwnerPaymentDetailsListQuery 组合式函数获取所需变量

- [ ] 3.2.5 修复巡检报表页面
  - `apps/admin/src/pages/property-manage/report-manage/patrol-report/index.vue`（行 126, 132, 143, 149）
  - 导入：`import { patrolTypeOptions, patrolLevelOptions, statusOptions, communityOptions } from "@01s-11comm/type"`

- [x] 3.2.6 修复缴费明细表页面
  - `apps/admin/src/pages/property-manage/report-manage/payment-details-form/index.vue`（行 19, 186, 192, 198, 204, 215, 230）
  - 导入：`import { paymentMethodOptions, expenseStatusOptions, feeTypeOptions, expenseItemOptions, communityOptions } from "@01s-11comm/type"`
  - 补充 `mockTableData` 定义或从 API 获取真实数据
  - 修复 dayjs 类型断言
  - 移除 doFetch 引用，使用 handleReSearch 替代
  - **注意**：此页面使用中文属性名，需要更新 ExpenseSummaryTableListItem 类型定义或修改页面使用英文属性名

- [ ] 3.2.7 运行类型检查验证 Options 修复：`pnpm -F @01s-11comm/admin typecheck`

## 第二阶段：专项修复（预计修复 15+ 错误）

### 4. 修复枚举类型值错误（6 个错误）

- [ ] 4.1 修复房屋装修状态类型
  - `apps/admin/src/pages/property-manage/community-manage/house-decoration/index.vue`（行 264）
  - 问题：`status` 字段使用 `string` 而非 `HouseDecorationStatusType`
  - 修复：使用正确的枚举值或类型断言

- [ ] 4.2 修复房屋管理枚举空字符串
  - `apps/admin/src/pages/property-manage/house-property-manage/house/index.vue`（行 29, 30）
  - 问题：`houseStatus` 和 `houseType` 使用空字符串
  - 修复：改为 `undefined` 或枚举的默认值

- [ ] 4.3 修复停车场管理中文枚举值
  - `apps/admin/src/pages/property-manage/parking-manage/parking-lot/index.vue`（行 31, 32）
  - 问题：`parkingLotType` 使用 "地下停车场"，应为 "underground"
  - 问题：`parkingSpaceType` 使用 "标准车位"，应为 "standard"
  - 修复：将中文值映射为英文枚举值

- [ ] 4.4 修复巡检详情巡检方法类型
  - `apps/admin/src/pages/property-manage/patrol-manage/detail/index.vue`（行 263）
  - 问题：`patrolMethod` 字段类型不匹配
  - 修复：确保使用正确的 `PatrolMethodType` 枚举值

- [ ] 4.5 运行类型检查验证枚举修复：`pnpm -F @01s-11comm/admin typecheck`

### 5. 补充 ReturnVisitListItem 类型定义（7 个错误）

- [ ] 5.1 更新类型定义
  - 文件：`apps/type/src/business/property-manage/repairs-manage/return-visit.ts`
  - 补充属性：
    - `workOrderNumber?: string` - 工单号
    - `location?: string` - 位置
    - `repairType?: string` - 维修类型
    - `reporter?: string` - 报修人
    - `contactInfo?: string` - 联系方式
    - `appointmentTime?: string` - 预约时间
    - `returnVisitStatus?: string` - 回访状态

- [ ] 5.2 运行类型项目类型检查：`pnpm -F @01s-11comm/type typecheck`

- [ ] 5.3 验证回访管理页面
  - `apps/admin/src/pages/property-manage/repairs-manage/return-visit/index.vue`（行 206-212）
  - 确认类型错误已解决

- [ ] 5.4 运行类型检查验证：`pnpm -F @01s-11comm/admin typecheck`

### 6. 修复 import type 错误（1 个错误）

- [ ] 6.1 修复费用提醒页面的导入
  - `apps/admin/src/pages/property-manage/report-manage/fee-reminder/index.vue`（行 18, 132）
  - 问题：`expenseItemNameOptions` 使用 `import type` 导入但作为值使用
  - 修复：将 `import type { expenseItemNameOptions }` 改为 `import { expenseItemNameOptions }`

- [ ] 6.2 运行类型检查验证：`pnpm -F @01s-11comm/admin typecheck`

## 第三阶段：剩余错误修复（预计修复 10+ 错误）

### 7. 修复导出成员名称错误（4 个错误）

- [ ] 7.1 修复已完成维修表单类型名称
  - `apps/admin/src/pages/property-manage/repairs-manage/repairs-have-done/components/form.vue`（行 4）
  - `apps/admin/src/pages/property-manage/repairs-manage/repairs-have-done/index.vue`（行 16）
  - 问题：使用 `RepairsHaveDoneFormVO`，应为 `RepairsHaveDoneFormProps`
  - 修复：更正导入的类型名称

- [ ] 7.2 修复费用报表页面选项名称
  - `apps/admin/src/pages/property-manage/report-manage/statement-expenses/index.vue`（行 17）
  - 问题：使用 `expenseStatusOptions`，应为 `expireStatusOptions`
  - 修复：更正导入的变量名称（或在类型项目中添加正确的导出）

- [ ] 7.3 修复系统配置表单类型名称
  - `apps/admin/src/pages/setting-manage/system-manage/system-config/index.vue`（行 14）
  - 问题：使用 `SystemConfigFormVO`，应为 `SystemConfigFormProps`
  - 修复：更正导入的类型名称

- [ ] 7.4 运行类型检查验证：`pnpm -F @01s-11comm/admin typecheck`

### 8. 修复值被用作类型错误（3 个错误）

- [ ] 8.1 修复我的社区页面类型使用
  - `apps/admin/src/pages/property-manage/community-manage/my/index.vue`（行 224, 229, 238）
  - 问题：`CommunityManageMyFormVO` 值被用作类型
  - 修复方式：
    - 选项 1：使用 `typeof CommunityManageMyFormVO`
    - 选项 2：检查 `CommunityManageMyFormVO` 的定义，如果应该是类型则修改定义

- [ ] 8.2 运行类型检查验证：`pnpm -F @01s-11comm/admin typecheck`

### 9. 修复模块导出缺失错误（4 个错误）

- [ ] 9.1 修复车位结构图表单类型导出
  - `apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram/components/form.vue`（行 8）
  - 问题：导入 `车位结构图表单_VO` 不存在
  - 修复：检查对应的 `form.ts` 文件，添加正确的类型导出或修正导入名称

- [ ] 9.2 修复初始化小区表单导出（设置管理）
  - `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/components/form.vue`（行 3, 8, 21）
  - 问题：导入 `statusOptions` 和 `InitializeCommunityFormVO` 不存在
  - 修复：在对应的 `form.ts` 文件中添加导出，或修正导入名称

- [ ] 9.3 补充系统配置类型定义
  - `apps/admin/src/pages/setting-manage/system-manage/system-config/index.vue`（行 22）
  - 问题：`SystemConfig` 类型在 `@01s-11comm/type` 中不存在
  - 修复：在类型项目中添加 `SystemConfig` 类型定义并导出

- [ ] 9.4 运行类型检查验证：`pnpm -F @01s-11comm/admin typecheck`

### 10. 修复 dayjs 函数重载不匹配错误（2 个错误）

- [ ] 10.1 修复缴费明细表的 dayjs 类型
  - `apps/admin/src/pages/property-manage/report-manage/payment-details-form/index.vue`（行 233, 234）
  - 问题：`plusSearchModel.value.缴费开始时间` 和 `plusSearchModel.value.缴费结束时间` 类型不兼容
  - 修复：在传递给 dayjs 前进行类型断言 `as string`

- [ ] 10.2 运行类型检查验证：`pnpm -F @01s-11comm/admin typecheck`

### 11. 修复对象字面量错误（1 个错误）

- [ ] 11.1 修复标签页 TreeSelect 配置
  - `apps/admin/src/views/tabs/index.vue`（行 84）
  - 问题：`props` 配置中 `value` 属性不存在
  - 修复：检查 Element Plus TreeSelect 文档，使用正确的属性名（可能是 `key`）

- [ ] 11.2 运行类型检查验证：`pnpm -F @01s-11comm/admin typecheck`

## 最终验证

- [ ] 12.1 运行完整类型检查：`pnpm -F @01s-11comm/admin typecheck`
- [ ] 12.2 验证错误数为零
- [ ] 12.3 运行类型项目类型检查：`pnpm -F @01s-11comm/type typecheck`
- [ ] 12.4 运行全项目类型检查：`pnpm typecheck`
- [ ] 12.5 运行构建验证：`pnpm -F @01s-11comm/admin build`
- [ ] 12.6 记录最终类型检查结果：`pnpm typecheck 2>&1 | tee typecheck-final.log`

## 文档更新

- [ ] 13.1 更新修复报告，记录实际修复的错误数量和方式
- [ ] 13.2 如有需要，更新 CLAUDE.md 中的类型管理相关指导

## 注意事项

1. **禁止批处理脚本**：所有修复必须通过阅读文件和精确编辑完成，不允许使用脚本批量处理
2. **保持功能不变**：修复类型错误时不改变业务逻辑
3. **中文命名规范**：将中文的 Options 变量名改为英文驼峰命名
4. **类型一致性**：确保类型定义与实际使用保持一致
5. **分阶段验证**：每个阶段完成后运行类型检查验证进度
6. **独立子任务**：每个子任务可以独立由子代理完成
