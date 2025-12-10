# Tasks: Sync taskmaster test-data backlog

## 1. 说明

- 来源：`.taskmaster/tasks/tasks.json` v1.1（2025-12-08），共 98 条 `test-data.ts` 重构任务。
- 约束：`tableData` 使用字面量数组（禁止函数生成），字段与列表/搜索配置一致；下拉选项集中在 `test-data.ts` 并使用 `OptionsType`。
- 状态：td-001~td-015 已完成，其余待办；需保持与 taskmaster 状态一致。
- 与 `refactor-test-data-literal-array` 变更内容合并，统一在本变更下追踪。

## 2. 转换与校验

- [x] 2.1 按域分组导入 98 条任务（ID、路径、状态保持一致）。
- [x] 2.2 校验任务总数=98、已完成=15，并与 `.taskmaster/tasks/tasks.json` 元数据一致。
- [x] 2.3 运行 `openspec validate sync-taskmaster-test-data-backlog --strict` 无错误。

## 3. 具体任务清单

### 3.1 dev-team

- [x] td-001 重构 test-data.ts `dev-team/cache-manage/refresh-cache`
- [x] td-002 重构 test-data.ts `dev-team/config-manage/center`
- [x] td-003 重构 test-data.ts `dev-team/config-manage/dictionary`
- [x] td-004 重构 test-data.ts `dev-team/config-manage/item`
- [x] td-005 重构 test-data.ts `dev-team/config-manage/type`
- [x] td-006 重构 test-data.ts `dev-team/menu-manage/catalog`
- [x] td-007 重构 test-data.ts `dev-team/menu-manage/group`
- [x] td-008 重构 test-data.ts `dev-team/menu-manage/item`

### 3.2 operation-team

- [x] td-009 重构 test-data.ts `operation-team/data-manage/community-information`
- [x] td-010 重构 test-data.ts `operation-team/data-manage/property-management-company`
- [x] td-011 重构 test-data.ts `operation-team/merchant-manage/merchant-admin`
- [x] td-012 重构 test-data.ts `operation-team/merchant-manage/merchant-info`
- [x] td-013 重构 test-data.ts `operation-team/report-configuration/report-component`
- [x] td-014 重构 test-data.ts `operation-team/report-configuration/report-group`
- [x] td-015 重构 test-data.ts `operation-team/report-configuration/report-info`
- [x] td-016 重构 test-data.ts `operation-team/system-manage/change-password`
- [x] td-017 重构 test-data.ts `operation-team/system-manage/community-configuration`
- [x] td-018 重构 test-data.ts `operation-team/system-manage/initialize-cell`
- [x] td-019 重构 test-data.ts `operation-team/system-manage/register-protocol`
- [x] td-020 重构 test-data.ts `operation-team/system-manage/system-config`

### 3.3 property-manage/community-manage

- [x] td-021 重构 test-data.ts `property-manage/community-manage/building-space-structure-diagram`
- [x] td-022 重构 test-data.ts `property-manage/community-manage/handing-business`
- [x] td-023 重构 test-data.ts `property-manage/community-manage/house-decoration`
- [x] td-024 重构 test-data.ts `property-manage/community-manage/my`
- [x] td-025 重构 test-data.ts `property-manage/community-manage/notice`
- [x] td-026 重构 test-data.ts `property-manage/community-manage/parking-space-structure-diagram`
- [x] td-027 重构 test-data.ts `property-manage/community-manage/property-register`

### 3.4 property-manage/contract-manage

- [x] td-028 重构 test-data.ts `property-manage/contract-manage/change`
- [x] td-029 重构 test-data.ts `property-manage/contract-manage/draft-contract`
- [x] td-030 重构 test-data.ts `property-manage/contract-manage/expire`
- [x] td-031 重构 test-data.ts `property-manage/contract-manage/first-party`
- [x] td-032 重构 test-data.ts `property-manage/contract-manage/type`

### 3.5 property-manage/expense-manage

- [x] td-033 重构 test-data.ts `property-manage/expense-manage/cancel-fee`
- [x] td-034 重构 test-data.ts `property-manage/expense-manage/contracte-charge`
- [x] td-035 重构 test-data.ts `property-manage/expense-manage/discount-apply`
- [x] td-036 重构 test-data.ts `property-manage/expense-manage/discount-setting`
- [x] td-037 重构 test-data.ts `property-manage/expense-manage/discount-type`
- [x] td-038 重构 test-data.ts `property-manage/expense-manage/expense-item-setting`
- [x] td-039 重构 test-data.ts `property-manage/expense-manage/expense-summary-table`
- [x] td-040 重构 test-data.ts `property-manage/expense-manage/house-charge`
- [x] td-041 重构 test-data.ts `property-manage/expense-manage/meter-reading-type`
- [x] td-042 重构 test-data.ts `property-manage/expense-manage/overdue-payment-information`
- [x] td-043 重构 test-data.ts `property-manage/expense-manage/payment-review`
- [x] td-044 重构 test-data.ts `property-manage/expense-manage/refund-review`
- [x] td-045 重构 test-data.ts `property-manage/expense-manage/reminder-for-overdue-payments`
- [x] td-046 重构 test-data.ts `property-manage/expense-manage/reprint-voucher`
- [x] td-047 重构 test-data.ts `property-manage/expense-manage/vehicle-charge`
- [ ] td-048 重构 test-data.ts `property-manage/expense-manage/water-and-electricity-meter-reading`

### 3.6 property-manage/house-property-manage

- [ ] td-049 重构 test-data.ts `property-manage/house-property-manage/house`
- [ ] td-050 重构 test-data.ts `property-manage/house-property-manage/invoice-title`
- [ ] td-051 重构 test-data.ts `property-manage/house-property-manage/invoice`
- [ ] td-052 重构 test-data.ts `property-manage/house-property-manage/owner-account`
- [ ] td-053 重构 test-data.ts `property-manage/house-property-manage/owner-information`
- [ ] td-054 重构 test-data.ts `property-manage/house-property-manage/owner-member`
- [ ] td-055 重构 test-data.ts `property-manage/house-property-manage/owners-committee`
- [ ] td-056 重构 test-data.ts `property-manage/house-property-manage/reserve-venue-order`
- [ ] td-057 重构 test-data.ts `property-manage/house-property-manage/reserve-venue`
- [ ] td-058 重构 test-data.ts `property-manage/house-property-manage/site-management`

### 3.7 property-manage/parking-manage

- [ ] td-059 重构 test-data.ts `property-manage/parking-manage/carport-apply`
- [ ] td-060 重构 test-data.ts `property-manage/parking-manage/carport-info`
- [ ] td-061 重构 test-data.ts `property-manage/parking-manage/owner-vehicle`
- [ ] td-062 重构 test-data.ts `property-manage/parking-manage/parking-lot`

### 3.8 property-manage/patrol-manage

- [ ] td-063 重构 test-data.ts `property-manage/patrol-manage/detail`
- [ ] td-064 重构 test-data.ts `property-manage/patrol-manage/item`
- [ ] td-065 重构 test-data.ts `property-manage/patrol-manage/path`
- [ ] td-066 重构 test-data.ts `property-manage/patrol-manage/plan`
- [ ] td-067 重构 test-data.ts `property-manage/patrol-manage/point`
- [ ] td-068 重构 test-data.ts `property-manage/patrol-manage/task`

### 3.9 property-manage/repairs-manage

- [ ] td-069 重构 test-data.ts `property-manage/repairs-manage/issues`
- [ ] td-070 重构 test-data.ts `property-manage/repairs-manage/mandatory-return-issue`
- [ ] td-071 重构 test-data.ts `property-manage/repairs-manage/phone-report-repairs`
- [ ] td-072 重构 test-data.ts `property-manage/repairs-manage/repairs-have-done`
- [ ] td-073 重构 test-data.ts `property-manage/repairs-manage/repairs-setting`
- [ ] td-074 重构 test-data.ts `property-manage/repairs-manage/repairs-todo`
- [ ] td-075 重构 test-data.ts `property-manage/repairs-manage/return-visit`

### 3.10 property-manage/report-manage

- [ ] td-076 重构 test-data.ts `property-manage/report-manage/arrears-details-list`
- [ ] td-077 重构 test-data.ts `property-manage/report-manage/data-statistics`
- [ ] td-078 重构 test-data.ts `property-manage/report-manage/deposit-report`
- [ ] td-079 重构 test-data.ts `property-manage/report-manage/expense-summary-table`
- [ ] td-080 重构 test-data.ts `property-manage/report-manage/fee-reminder`
- [ ] td-081 重构 test-data.ts `property-manage/report-manage/no-charge-house`
- [ ] td-082 重构 test-data.ts `property-manage/report-manage/outstanding-fees-analysis`
- [ ] td-083 重构 test-data.ts `property-manage/report-manage/owner-payment-details`
- [ ] td-084 重构 test-data.ts `property-manage/report-manage/patrol-report`
- [ ] td-085 重构 test-data.ts `property-manage/report-manage/payment-details-form`
- [ ] td-086 重构 test-data.ts `property-manage/report-manage/repair-report-form`
- [ ] td-087 重构 test-data.ts `property-manage/report-manage/repair-reports-summary-table`
- [ ] td-088 重构 test-data.ts `property-manage/report-manage/statement-expenses`

### 3.11 setting-manage/organize-manage

- [ ] td-089 重构 test-data.ts `setting-manage/organize-manage/data-permission`
- [ ] td-090 重构 test-data.ts `setting-manage/organize-manage/org-info`
- [ ] td-091 重构 test-data.ts `setting-manage/organize-manage/role-permission`
- [ ] td-092 重构 test-data.ts `setting-manage/organize-manage/scheduling-setting`
- [ ] td-093 重构 test-data.ts `setting-manage/organize-manage/shift-setting`
- [ ] td-094 重构 test-data.ts `setting-manage/organize-manage/staff-info`
- [ ] td-095 重构 test-data.ts `setting-manage/organize-manage/working-schedule`

### 3.12 setting-manage/system-manage

- [ ] td-096 重构 test-data.ts `setting-manage/system-manage/change-password`
- [ ] td-097 重构 test-data.ts `setting-manage/system-manage/community-configuration`
- [ ] td-098 重构 test-data.ts `setting-manage/system-manage/initialize-cell`