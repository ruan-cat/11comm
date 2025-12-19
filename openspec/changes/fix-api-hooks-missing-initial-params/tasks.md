# 实施任务清单

## 1. 准备阶段

- [ ] 1.1 验证 `useListQuery` 接口定义,确认 `initialParams` 为必填参数
- [ ] 1.2 检查现有正确范例 (`dev-team/config-manage/center/index.ts`)
- [ ] 1.3 确认迁移指南规范 (`migrate-static-data-to-nitro-query/specs/migration-guide.md` Step 4)
- [ ] 1.4 运行初始类型检查,记录当前报错数量: `pnpm -F @01s-11comm/admin typecheck`

## 2. settingManage.organizeManage 模块 (7 个文件)

- [ ] 2.1 修复 `setting-manage/organize-manage/staff-info/index.ts`
- [ ] 2.2 修复 `setting-manage/organize-manage/org-info/index.ts`
- [ ] 2.3 修复 `setting-manage/organize-manage/working-schedule/index.ts`
- [ ] 2.4 修复 `setting-manage/organize-manage/scheduling-setting/index.ts`
- [ ] 2.5 修复 `setting-manage/organize-manage/shift-setting/index.ts`
- [ ] 2.6 修复 `setting-manage/organize-manage/role-permission/index.ts`
- [ ] 2.7 修复 `setting-manage/organize-manage/data-permission/index.ts`

## 3. settingManage.systemManage 模块 (5 个文件)

- [ ] 3.1 修复 `setting-manage/system-manage/change-password/index.ts`
- [ ] 3.2 修复 `setting-manage/system-manage/system-config/index.ts`
- [ ] 3.3 修复 `setting-manage/system-manage/register-protocol/index.ts`
- [ ] 3.4 修复 `setting-manage/system-manage/initialize-cell/index.ts`
- [ ] 3.5 修复 `setting-manage/system-manage/community-configuration/index.ts`

## 4. devTeam.menuManage 模块 (3 个文件)

- [ ] 4.1 修复 `dev-team/menu-manage/catalog/index.ts`
- [ ] 4.2 修复 `dev-team/menu-manage/group/index.ts`
- [ ] 4.3 修复 `dev-team/menu-manage/item/index.ts`

## 5. devTeam.cacheManage 模块 (1 个文件)

- [ ] 5.1 修复 `dev-team/cache-manage/refresh-cache/index.ts`

## 6. devTeam.configManage 模块 (4 个文件)

- [ ] 6.1 修复 `dev-team/config-manage/type/index.ts`
- [ ] 6.2 修复 `dev-team/config-manage/item/index.ts`
- [ ] 6.3 修复 `dev-team/config-manage/dictionary/index.ts`
- [ ] 6.4 验证 `dev-team/config-manage/center/index.ts` (已符合规范,作为参考)

## 7. operationTeam.systemManage 模块 (5 个文件)

- [ ] 7.1 修复 `operation-team/system-manage/change-password/index.ts`
- [ ] 7.2 修复 `operation-team/system-manage/system-config/index.ts`
- [ ] 7.3 修复 `operation-team/system-manage/register-protocol/index.ts`
- [ ] 7.4 修复 `operation-team/system-manage/initialize-cell/index.ts`
- [ ] 7.5 修复 `operation-team/system-manage/community-configuration/index.ts`

## 8. operationTeam.dataManage 模块 (2 个文件)

- [ ] 8.1 修复 `operation-team/data-manage/community-information/index.ts`
- [ ] 8.2 修复 `operation-team/data-manage/property-company/index.ts`

## 9. operationTeam.merchantManage 模块 (2 个文件)

- [ ] 9.1 修复 `operation-team/merchant-manage/merchant-info/index.ts`
- [ ] 9.2 修复 `operation-team/merchant-manage/merchant-admin/index.ts`

## 10. operationTeam.reportConfiguration 模块 (3 个文件)

- [ ] 10.1 修复 `operation-team/report-configuration/report-group/index.ts`
- [ ] 10.2 修复 `operation-team/report-configuration/report-info/index.ts`
- [ ] 10.3 修复 `operation-team/report-configuration/report-component/index.ts`

## 11. propertyManage.communityManage 模块 (7 个文件)

- [ ] 11.1 修复 `property-manage/community-manage/house-decoration/index.ts`
- [ ] 11.2 修复 `property-manage/community-manage/building-space-structure-diagram/index.ts`
- [ ] 11.3 修复 `property-manage/community-manage/notice/index.ts`
- [ ] 11.4 修复 `property-manage/community-manage/property-register/index.ts`
- [ ] 11.5 修复 `property-manage/community-manage/handing-business/index.ts`
- [ ] 11.6 修复 `property-manage/community-manage/my/index.ts`
- [ ] 11.7 修复 `property-manage/community-manage/parking-space-structure-diagram/index.ts`

## 12. propertyManage.contractManage 模块 (5 个文件)

- [ ] 12.1 修复 `property-manage/contract-manage/change/index.ts`
- [ ] 12.2 修复 `property-manage/contract-manage/draft-contract/index.ts`
- [ ] 12.3 修复 `property-manage/contract-manage/expire/index.ts`
- [ ] 12.4 修复 `property-manage/contract-manage/first-party/index.ts`
- [ ] 12.5 修复 `property-manage/contract-manage/type/index.ts`

## 13. propertyManage.expenseManage 模块 (16 个文件)

- [ ] 13.1 修复 `property-manage/expense-manage/water-and-electricity-meter-reading/index.ts`
- [ ] 13.2 修复 `property-manage/expense-manage/vehicle-charge/index.ts`
- [ ] 13.3 修复 `property-manage/expense-manage/reminder-for-overdue-payments/index.ts`
- [ ] 13.4 修复 `property-manage/expense-manage/reprint-voucher/index.ts`
- [ ] 13.5 修复 `property-manage/expense-manage/overdue-payment-information/index.ts`
- [ ] 13.6 修复 `property-manage/expense-manage/payment-review/index.ts`
- [ ] 13.7 修复 `property-manage/expense-manage/refund-review/index.ts`
- [ ] 13.8 修复 `property-manage/expense-manage/house-charge/index.ts`
- [ ] 13.9 修复 `property-manage/expense-manage/meter-reading-type/index.ts`
- [ ] 13.10 修复 `property-manage/expense-manage/discount-type/index.ts`
- [ ] 13.11 修复 `property-manage/expense-manage/expense-summary-table/index.ts`
- [ ] 13.12 修复 `property-manage/expense-manage/discount-apply/index.ts`
- [ ] 13.13 修复 `property-manage/expense-manage/discount-setting/index.ts`
- [ ] 13.14 修复 `property-manage/expense-manage/contracte-charge/index.ts`
- [ ] 13.15 修复 `property-manage/expense-manage/expense-item-setting/index.ts`
- [ ] 13.16 修复 `property-manage/expense-manage/cancel-fee/index.ts`

## 14. propertyManage.housePropertyManage 模块 (10 个文件)

- [ ] 14.1 修复 `property-manage/house-property-manage/house/index.ts`
- [ ] 14.2 修复 `property-manage/house-property-manage/invoice/index.ts`
- [ ] 14.3 修复 `property-manage/house-property-manage/invoice-title/index.ts`
- [ ] 14.4 修复 `property-manage/house-property-manage/owner-account/index.ts`
- [ ] 14.5 修复 `property-manage/house-property-manage/owner-information/index.ts`
- [ ] 14.6 修复 `property-manage/house-property-manage/owner-member/index.ts`
- [ ] 14.7 修复 `property-manage/house-property-manage/owners-committee/index.ts`
- [ ] 14.8 修复 `property-manage/house-property-manage/reserve-venue/index.ts`
- [ ] 14.9 修复 `property-manage/house-property-manage/reserve-venue-order/index.ts`
- [ ] 14.10 修复 `property-manage/house-property-manage/site-management/index.ts`

## 15. propertyManage.parkingManage 模块 (4 个文件)

- [ ] 15.1 修复 `property-manage/parking-manage/carport-apply/index.ts`
- [ ] 15.2 修复 `property-manage/parking-manage/carport-info/index.ts`
- [ ] 15.3 修复 `property-manage/parking-manage/owner-vehicle/index.ts`
- [ ] 15.4 修复 `property-manage/parking-manage/parking-lot/index.ts`

## 16. propertyManage.patrolManage 模块 (6 个文件)

- [ ] 16.1 修复 `property-manage/patrol-manage/detail/index.ts`
- [ ] 16.2 修复 `property-manage/patrol-manage/item/index.ts`
- [ ] 16.3 修复 `property-manage/patrol-manage/path/index.ts`
- [ ] 16.4 修复 `property-manage/patrol-manage/plan/index.ts`
- [ ] 16.5 修复 `property-manage/patrol-manage/point/index.ts`
- [ ] 16.6 修复 `property-manage/patrol-manage/task/index.ts`

## 17. propertyManage.repairsManage 模块 (7 个文件)

- [ ] 17.1 修复 `property-manage/repairs-manage/issues/index.ts`
- [ ] 17.2 修复 `property-manage/repairs-manage/mandatory-return-issue/index.ts`
- [ ] 17.3 修复 `property-manage/repairs-manage/phone-report-repairs/index.ts`
- [ ] 17.4 修复 `property-manage/repairs-manage/repairs-have-done/index.ts`
- [ ] 17.5 修复 `property-manage/repairs-manage/repairs-setting/index.ts`
- [ ] 17.6 修复 `property-manage/repairs-manage/repairs-todo/index.ts`
- [ ] 17.7 修复 `property-manage/repairs-manage/return-visit/index.ts`

## 18. propertyManage.reportManage 模块 (13 个文件)

- [ ] 18.1 修复 `property-manage/report-manage/arrears-details-list/index.ts`
- [ ] 18.2 修复 `property-manage/report-manage/data-statistics/index.ts`
- [ ] 18.3 修复 `property-manage/report-manage/deposit-report/index.ts`
- [ ] 18.4 修复 `property-manage/report-manage/expense-summary-table/index.ts`
- [ ] 18.5 修复 `property-manage/report-manage/fee-reminder/index.ts`
- [ ] 18.6 修复 `property-manage/report-manage/no-charge-house/index.ts`
- [ ] 18.7 修复 `property-manage/report-manage/outstanding-fees-analysis/index.ts`
- [ ] 18.8 修复 `property-manage/report-manage/owner-payment-details/index.ts`
- [ ] 18.9 修复 `property-manage/report-manage/patrol-report/index.ts`
- [ ] 18.10 修复 `property-manage/report-manage/payment-details-form/index.ts`
- [ ] 18.11 修复 `property-manage/report-manage/repair-report-form/index.ts`
- [ ] 18.12 修复 `property-manage/report-manage/repair-reports-summary-table/index.ts`
- [ ] 18.13 修复 `property-manage/report-manage/statement-expenses/index.ts`

## 19. 验证阶段

- [ ] 19.1 运行类型检查: `pnpm -F @01s-11comm/admin typecheck`
- [ ] 19.2 确认所有类型报错已解决
- [ ] 19.3 验证代码格式符合规范: `pnpm -F @01s-11comm/admin lint`
- [ ] 19.4 抽查 5-10 个修改后的文件,确认符合标准模板格式
- [ ] 19.5 运行整个项目类型检查: `pnpm typecheck`

## 20. 文档更新

- [ ] 20.1 更新相关技术文档,记录此次修复的范围和方法
- [ ] 20.2 在 `apps/admin/src/docs/reports` 创建修复报告 (如需要)
- [ ] 20.3 确认所有变更符合 OpenSpec 规范

## 总计

**预估总计**: 约 99 个 API Hook 文件需要修复

**关键验收标准**:

1. 所有 API Hook 函数签名包含 `initialParams` 参数
2. 所有 `useListQuery` 调用传递 `initialParams` 配置项
3. 类型检查通过: `pnpm typecheck` 无报错
4. 代码格式符合迁移指南 Step 4 规范
5. 文件注释完整(JSDoc 中英文双语)
