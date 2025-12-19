# 将全部后台项目的 form.ts 文件做迁移重构 - 任务清单

## 任务概述

本任务清单详细列出了将后台项目所有 form.ts 文件迁移到类型项目的具体工作项。任务按模块分组，确保全面覆盖所有三级路由对应的文件。

## 执行顺序

### 准备阶段

1. **建立工作目录结构**
   - [ ] 创建 `apps/type/src/business/` 下各模块目录
   - [ ] 验证目录结构与 `RANK_ROUTE_KEYS` 对应关系

2. **分析现有文件**
   - [ ] 扫描所有 form.ts 文件，建立文件清单
   - [ ] 识别需要迁移的业务类型
   - [ ] 识别需要迁移的公共选项

### 阶段一：业务类型迁移（按模块执行）

#### 1.1 setting-manage 模块（12 个三级路由）

**1.1.1 setting-manage/organize-manage（7 个）**
- [ ] `setting-manage/organize-manage/staff-info/components/form.ts`
  - [ ] 迁移 `StaffInfoFormVO` 到 `apps/type/src/business/setting-manage/organize-manage/staff-info.ts`
  - [ ] 更新 form.ts 导入 `@01s-11comm/type`
  - [ ] 添加 `mode?: Mode` 字段到 `StaffInfoFormProps`

- [ ] `setting-manage/organize-manage/org-info/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/organize-manage/working-schedule/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/organize-manage/scheduling-setting/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/organize-manage/shift-setting/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/organize-manage/role-permission/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/organize-manage/data-permission/unit-auth/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.1.2 setting-manage/system-manage（5 个）**
- [ ] `setting-manage/system-manage/change-password/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/system-manage/system-config/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/system-manage/register-protocol/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/system-manage/initialize-cell/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `setting-manage/system-manage/community-configuration/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

#### 1.2 dev-team 模块（8 个三级路由）

**1.2.1 dev-team/menu-manage（3 个）**
- [ ] `dev-team/menu-manage/catalog/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `dev-team/menu-manage/group/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `dev-team/menu-manage/item/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.2.2 dev-team/cache-manage（1 个）**
- [ ] `dev-team/cache-manage/refresh-cache/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.2.3 dev-team/config-manage（4 个）**
- [ ] `dev-team/config-manage/type/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `dev-team/config-manage/item/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `dev-team/config-manage/dictionary/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `dev-team/config-manage/center/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

#### 1.3 operation-team 模块（12 个三级路由）

**1.3.1 operation-team/system-manage（5 个）**
- [ ] `operation-team/system-manage/change-password/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/system-manage/system-config/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/system-manage/register-protocol/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/system-manage/initialize-cell/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/system-manage/community-configuration/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.3.2 operation-team/data-manage（2 个）**
- [ ] `operation-team/data-manage/community-information/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/data-manage/property-management-company/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.3.3 operation-team/merchant-manage（2 个）**
- [ ] `operation-team/merchant-manage/merchant-info/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/merchant-manage/merchant-admin/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.3.4 operation-team/report-configuration（3 个）**
- [ ] `operation-team/report-configuration/report-group/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/report-configuration/report-info/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `operation-team/report-configuration/report-component/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

#### 1.4 property-manage 模块（57 个三级路由）

**1.4.1 property-manage/community-manage（7 个）**
- [ ] `property-manage/community-manage/house-decoration/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/community-manage/building-space-structure-diagram/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/community-manage/notice/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/community-manage/property-register/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/community-manage/handing-business/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/community-manage/my/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/community-manage/parking-space-structure-diagram/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.4.2 property-manage/contract-manage（5 个）**
- [ ] `property-manage/contract-manage/change/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/contract-manage/draft-contract/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/contract-manage/expire/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/contract-manage/first-party/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/contract-manage/type/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.4.3 property-manage/expense-manage（16 个）**
- [ ] `property-manage/expense-manage/water-and-electricity-meter-reading/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/vehicle-charge/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/reminder-for-overdue-payments/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/reprint-voucher/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/overdue-payment-information/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/payment-review/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/refund-review/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/house-charge/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/meter-reading-type/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/discount-type/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/expense-summary-table/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/discount-apply/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/discount-setting/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/contracte-charge/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/expense-item-setting/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/expense-manage/cancel-fee/components/form.ts`
  - [ ] 迁移业务类型（注意：此文件已部分迁移，需检查）
  - [ ] 更新导入
  - [ ] 验证 `mode` 字段已存在

**1.4.4 property-manage/house-property-manage（10 个）**
- [ ] `property-manage/house-property-manage/house/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/invoice/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/invoice-title/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/owner-account/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/owner-information/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/owner-member/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/owners-committee/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/reserve-venue/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/reserve-venue-order/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/house-property-manage/site-management/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.4.5 property-manage/parking-manage（4 个）**
- [ ] `property-manage/parking-manage/carport-apply/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/parking-manage/carport-info/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/parking-manage/owner-vehicle/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/parking-manage/parking-lot/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.4.6 property-manage/patrol-manage（6 个）**
- [ ] `property-manage/patrol-manage/detail/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/patrol-manage/item/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/patrol-manage/path/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/patrol-manage/plan/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/patrol-manage/point/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/patrol-manage/task/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.4.7 property-manage/repairs-manage（7 个）**
- [ ] `property-manage/repairs-manage/issues/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/repairs-manage/mandatory-return-issue/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/repairs-manage/phone-report-repairs/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/repairs-manage/repairs-have-done/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/repairs-manage/repairs-setting/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/repairs-manage/repairs-todo/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/repairs-manage/return-visit/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

**1.4.8 property-manage/report-manage（12 个）**
- [ ] `property-manage/report-manage/arrears-details-list/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/data-statistics/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/deposit-report/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/expense-summary-table/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/fee-reminder/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/no-charge-house/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/outstanding-fees-analysis/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/owner-payment-details/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/patrol-report/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/payment-details-form/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/repair-report-form/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/repair-reports-summary-table/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

- [ ] `property-manage/report-manage/statement-expenses/components/form.ts`
  - [ ] 迁移业务类型
  - [ ] 更新导入
  - [ ] 添加 `mode` 字段

### 阶段二：公共选项迁移

2. **识别重复选项**
   - [ ] 扫描所有 form.ts 文件中的选项数组
   - [ ] 建立重复选项清单
   - [ ] 确认公共选项列表

3. **迁移到 business-options.ts**
   - [ ] 将识别的公共选项迁移到 `apps/type/src/common/business-options.ts`
   - [ ] 为每个选项添加 JSDoc 注释
   - [ ] 更新选项数组变量名为英文

4. **更新引用**
   - [ ] 更新所有 form.ts 文件中的选项引用
   - [ ] 从 `@01s-11comm/type` 导入公共选项
   - [ ] 删除本地重复定义

### 阶段三：类型项目集成

5. **更新类型项目导出**
   - [ ] 更新 `apps/type/src/business/*/index.ts` 文件
   - [ ] 导出所有新迁移的类型
   - [ ] 更新 `apps/type/src/index.ts` 文件

6. **验证类型项目**
   - [ ] 运行 `pnpm -F @01s-11comm/type typecheck`
   - [ ] 修复类型检查错误
   - [ ] 确保所有导出正确

### 阶段四：Admin 项目更新

7. **更新 form.ts 导入**
   - [ ] 更新所有 form.ts 文件导入路径
   - [ ] 从 `@01s-11comm/type` 导入类型
   - [ ] 移除本地类型定义

8. **添加 mode 字段**
   - [ ] 为所有 Props 接口添加 `mode?: Mode` 字段
   - [ ] 添加 JSDoc 注释：`/** 表单模式 */`
   - [ ] 验证类型检查通过

### 阶段五：验证与测试

9. **类型检查**
   - [ ] 运行 `pnpm -F @01s-11comm/admin typecheck`
   - [ ] 修复所有类型错误
   - [ ] 确保无类型报错

10. **代码审查**
    - [ ] 检查所有迁移文件的命名规范
    - [ ] 验证 JSDoc 注释完整性
    - [ ] 确认导入路径正确性

11. **功能测试**
    - [ ] 启动 Admin 项目
    - [ ] 测试各个页面的表单功能
    - [ ] 验证下拉选项显示正确

### 阶段六：文档与总结

12. **更新文档**
    - [ ] 更新 `apps/type/README.md`（如果存在）
    - [ ] 记录迁移过程中的注意事项
    - [ ] 总结最佳实践

13. **创建迁移报告**
    - [ ] 记录迁移的文件列表
    - [ ] 记录迁移的公共选项
    - [ ] 记录遇到的问题及解决方案

## 任务依赖关系

### 前置依赖
- 阶段一必须在阶段二之前完成（业务类型迁移完成后才能识别公共选项）
- 阶段三必须在阶段四之前完成（类型项目更新完成才能在 Admin 项目中使用）

### 并行执行
- 同一模块内的多个文件可以并行迁移
- 不同模块之间的迁移可以并行进行

### 验证依赖
- 每个阶段完成后必须进行类型检查
- 所有阶段完成后进行最终验证

## 质量标准

1. **代码规范**
   - [ ] 所有类型和字段使用英文命名
   - [ ] 保留所有 JSDoc 注释
   - [ ] 遵循 TypeScript 最佳实践

2. **类型安全**
   - [ ] 通过 `pnpm -F @01s-11comm/type typecheck`
   - [ ] 通过 `pnpm -F @01s-11comm/admin typecheck`
   - [ ] 无类型错误或警告

3. **功能完整**
   - [ ] 所有表单功能正常
   - [ ] 所有下拉选项正确显示
   - [ ] 所有 Props 接口包含 mode 字段

## 交付物

1. **迁移后的类型文件**
   - `apps/type/src/business/*/` 下的所有类型文件

2. **更新的 form.ts 文件**
   - 所有 `apps/admin/src/pages/*/components/form.ts` 文件

3. **公共选项文件**
   - `apps/type/src/common/business-options.ts`

4. **验证报告**
   - 类型检查通过报告
   - 功能测试报告

## 风险控制

### 回滚方案
- 保留原始 form.ts 文件备份
- 使用 Git 分支进行开发
- 分阶段提交，便于回滚

### 质量保证
- 每完成一个模块进行类型检查
- 及时修复发现的问题
- 不遗留未完成的工作项

---

**任务总数：约 89 个 form.ts 文件需要迁移**

**预计工作量：3-5 个工作日**

**优先级：高（影响全项目类型管理）**
