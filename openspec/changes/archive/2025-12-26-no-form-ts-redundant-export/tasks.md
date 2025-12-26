# 任务清单

## 1. 类型项目准备工作

- [x] 1.1 扫描全部 form.ts 文件,收集需要迁移的类型和变量
- [x] 1.2 在 `apps/type/src/common/business-options.ts` 中补充缺失的下拉选项 (已有975行下拉选项定义)
- [x] 1.3 在 `apps/type/src/common/business-types.ts` 中补充缺失的通用类型
- [x] 1.4 在 `apps/type/src/business/**` 对应的业务路径中补充业务特定类型
- [x] 1.5 确保类型项目的导出链路完整(检查各级 index.ts)
- [x] 1.6 对类型项目运行类型检查: `pnpm -F @01s-11comm/type typecheck`

## 2. 清理 form.ts 文件(按业务路径分批处理)

### 2.1 setting-manage 模块

- [x] 2.1.1 处理 `setting-manage/organize-manage` 下的全部 form.ts
- [x] 2.1.2 处理 `setting-manage/system-manage` 下的全部 form.ts
- [x] 2.1.3 验证 form.vue 和 index.vue 的导入调整

### 2.2 dev-team 模块

- [x] 2.2.1 处理 `dev-team/menu-manage` 下的全部 form.ts
- [x] 2.2.2 处理 `dev-team/cache-manage` 下的全部 form.ts
- [x] 2.2.3 处理 `dev-team/config-manage` 下的全部 form.ts
- [x] 2.2.4 验证 form.vue 和 index.vue 的导入调整

### 2.3 operation-team 模块

- [x] 2.3.1 处理 `operation-team/system-manage` 下的全部 form.ts
- [x] 2.3.2 处理 `operation-team/data-manage` 下的全部 form.ts
- [x] 2.3.3 处理 `operation-team/merchant-manage` 下的全部 form.ts
- [x] 2.3.4 处理 `operation-team/report-configuration` 下的全部 form.ts
- [x] 2.3.5 验证 form.vue 和 index.vue 的导入调整

### 2.4 property-manage.community-manage 模块

- [x] 2.4.1 处理 `property-manage/community-manage` 下的全部 form.ts
- [x] 2.4.2 验证 form.vue 和 index.vue 的导入调整

### 2.5 property-manage.contract-manage 模块

- [x] 2.5.1 处理 `property-manage/contract-manage` 下的全部 form.ts
- [x] 2.5.2 验证 form.vue 和 index.vue 的导入调整

### 2.6 property-manage.expense-manage 模块(分多批)

- [x] 2.6.1 处理 `expense-manage` 的第 1 批: waterAndElectricityMeterReading, vehicleCharge, reminderForOverduePayments
- [x] 2.6.2 处理 `expense-manage` 的第 2 批: reprintVoucher, overduePaymentInformation, paymentReview
- [x] 2.6.3 处理 `expense-manage` 的第 3 批: refundReview, houseCharge, meterReadingType
- [x] 2.6.4 处理 `expense-manage` 的第 4 批: discountType, expenseSummaryTable, discountApply
- [x] 2.6.5 处理 `expense-manage` 的第 5 批: discountSetting, contracteCharge, expenseItemSetting, cancelFee
- [x] 2.6.6 验证 form.vue 和 index.vue 的导入调整

### 2.7 property-manage.house-property-manage 模块(分多批)

- [x] 2.7.1 处理 `house-property-manage` 的第 1 批: house, invoice, invoiceTitle
- [x] 2.7.2 处理 `house-property-manage` 的第 2 批: ownerAccount, ownerInformation, ownerMember
- [x] 2.7.3 处理 `house-property-manage` 的第 3 批: ownersCommittee, reserveVenue, reserveVenueOrder, siteManagement
- [x] 2.7.4 验证 form.vue 和 index.vue 的导入调整

### 2.8 property-manage.parking-manage 模块

- [x] 2.8.1 处理 `property-manage/parking-manage` 下的全部 form.ts
- [x] 2.8.2 验证 form.vue 和 index.vue 的导入调整

### 2.9 property-manage.patrol-manage 模块

- [x] 2.9.1 处理 `property-manage/patrol-manage` 下的全部 form.ts
- [x] 2.9.2 验证 form.vue 和 index.vue 的导入调整

### 2.10 property-manage.repairs-manage 模块

- [x] 2.10.1 处理 `property-manage/repairs-manage` 下的全部 form.ts
- [x] 2.10.2 验证 form.vue 和 index.vue 的导入调整

### 2.11 property-manage.report-manage 模块

- [x] 2.11.1 处理 `property-manage/report-manage` 下的全部 form.ts
- [x] 2.11.2 验证 form.vue 和 index.vue 的导入调整

## 3. 验证和测试

- [x] 3.1 对整个项目运行类型检查: `pnpm typecheck`
- [x] 3.2 对后台项目运行类型检查: `pnpm -F @01s-11comm/admin typecheck`
- [x] 3.3 运行 lint 检查: `pnpm -F @01s-11comm/admin lint`
- [x] 3.4 确认没有遗留的冗余导出
- [x] 3.5 确认所有导入路径正确指向类型项目

## 4. 文档更新

- [x] 4.1 更新项目文档,说明 form.ts 的导出规范
- [x] 4.2 在 CLAUDE.md 中补充相关说明(如需要)

## 当前进度总结

### 已完成
1. ✅ 类型项目准备工作全部完成
2. ✅ 所有 form.ts 文件的冗余导出已清理完毕
3. ✅ 类型项目类型检查通过
4. ✅ 添加了所有缺失的 FormVO 类型到类型项目，并解决了所有类型冲突（如 FeeType 重命名为 ExpenseItemFeeType 等）
5. ✅ 修复了所有 Vue 文件（form.vue 和 index.vue）的导入语句
6. ✅ 验证了 admin 和 type 项目的类型检查均通过

### 进行中
- (无)

### 待处理
- (无)

### 关键进展
- 错误数量：0 (所有类型错误已修复)
- 类型项目已通过类型检查 ✅
- 所有 form.ts 文件的冗余导出已清理 ✅
- 所有 form.ts 相关的导入错误已修复 ✅
