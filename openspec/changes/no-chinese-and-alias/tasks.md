## 1. 类型项目清理（已完成 ✅）

### 1.1 清理类型项目 business 模块 index.ts 的选择性导出

**说明：** 此部分已由 `no-form-ts-redundant-export` 任务完成，无需重复执行。

- [x] 1.1.1 清理 `apps/type/src/business/property-manage/contract-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.2 清理 `apps/type/src/business/property-manage/expense-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.3 清理 `apps/type/src/business/property-manage/patrol-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.4 清理 `apps/type/src/business/property-manage/community-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.5 清理 `apps/type/src/business/property-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.6 清理 `apps/type/src/business/index.ts` - 将选择性导出改为全量导出（已是全量导出）

### 1.2 清理类型项目中的中文类型别名

- [x] 1.2.1 搜索类型项目中所有中文类型别名（如 `巡查明细表单_VO`、`报修回访_列表数据` 等）
- [x] 1.2.2 删除或重命名这些中文类型别名为英文
- [x] 1.2.3 确保英文类型定义已存在且正确

**结论：** 类型项目中不存在中文类型别名，该任务已由前置任务完成。

### 1.3 重命名类型项目中的中文选项变量

- [x] 1.3.1 搜索 `apps/type/src/common/business-options.ts` 中的中文选项变量（如 `报修类型Options`、`维修类型Options`、`回访状态Options` 等）
- [x] 1.3.2 将这些中文选项变量重命名为英文（如 `repairTypeOptions`、`maintenanceTypeOptions`、`returnVisitStatusOptions` 等）
- [x] 1.3.3 确保重命名后的变量名符合项目命名规范

**结论：** 类型项目中不存在中文选项变量名，所有选项变量已使用英文命名。

### 1.4 验证类型项目类型检查

- [x] 1.4.1 运行 `pnpm -F @01s-11comm/type typecheck` 验证类型正确性

---

## 2. 后台项目清理（进行中 🔄）

**重要约束：** 本任务**不修改** form.ts 文件的导出结构。form.ts 的导出清理已由 `no-form-ts-redundant-export` 任务完成。

**当前进度：** 已修复 6 个模块，剩余约 119 个类型错误

---

### 🔴 高优先级任务（P0）- 核心业务模块

#### 2.1 repairs-manage 模块 - issues 子模块（最高优先级）

**问题描述：** 该模块存在大量中文属性名引用错误（约 40+ 个错误）

- [x] 2.1.1 修复 `apps/admin/src/pages/property-manage/repairs-manage/issues/index.vue`
  - ✅ 已修复类型导入
  - ✅ 已修复表格列配置（中文 prop → 英文 prop）
  - ✅ 已修复搜索参数类型
  - ✅ 已修复 loadTableData 函数中的属性访问
  - ✅ 已修复 openDialog 函数中的属性访问
  - _Requirements: 2.1.3_

- [x] 2.1.2 修复 `apps/admin/src/pages/property-manage/repairs-manage/issues/components/form.vue`
  - ✅ 已修复 `issuesStatusOptions` → `repairsIssuesStatusOptions`
  - _Requirements: 2.1.3_

#### 2.2 repairs-manage 模块 - 其他子模块

- [x] 2.2.1 修复 return-visit 模块
  - ✅ 已完成：`apps/admin/src/pages/property-manage/repairs-manage/return-visit/index.vue`
  - _Requirements: 2.1.1_

- [x] 2.2.2 修复 repairs-todo 模块
  - ✅ 已完成：`apps/admin/src/pages/property-manage/repairs-manage/repairs-todo/index.vue`
  - ✅ 已完成：`apps/admin/src/pages/property-manage/repairs-manage/repairs-todo/components/form.vue`
  - ✅ 已更新类型定义：`apps/type/src/business/property-manage/repairs-manage/repairs-todo.ts`
  - ✅ 已更新 mock 数据：`apps/admin/server/api/property-manage/repairs-manage/repairs-todo/mock-data.ts`
  - _Requirements: 2.1.2_

- [x] 2.2.3 修复 mandatory-return-issue 模块
  - ✅ 已完成：`apps/admin/src/pages/property-manage/repairs-manage/mandatory-return-issue/index.vue`
  - ✅ 已完成：`apps/admin/src/pages/property-manage/repairs-manage/mandatory-return-issue/components/form.vue`
  - ✅ 已更新类型定义：`apps/type/src/business/property-manage/repairs-manage/mandatory-return-issue.ts`
  - ✅ 已更新 mock 数据：`apps/admin/server/api/property-manage/repairs-manage/mandatory-return-issue/mock-data.ts`
  - _Requirements: 2.1.4_

- [ ] 2.2.4 修复 phone-report-repairs 模块
  - 文件：`apps/admin/src/pages/property-manage/repairs-manage/phone-report-repairs/index.vue`
  - _Requirements: 2.1.5_

- [ ] 2.2.5 修复 repairs-setting 模块
  - 文件：`apps/admin/src/pages/property-manage/repairs-manage/repairs-setting/index.vue`
  - _Requirements: 2.1.6_

#### 2.3 patrol-manage 模块

- [x] 2.3.1 修复 detail 模块
  - ✅ 已完成：`apps/admin/src/pages/property-manage/patrol-manage/detail/index.vue`
  - _Requirements: 2.1.7_

- [ ] 2.3.2 修复 point 模块
  - 文件：`apps/admin/src/pages/property-manage/patrol-manage/point/index.vue`
  - 文件：`apps/admin/src/pages/property-manage/patrol-manage/point/components/form.vue`
  - 问题：缺少选项变量导出
  - _Requirements: 2.1.26_

---

### 🟡 中优先级任务（P1）- 报表和社区管理模块

#### 2.4 report-manage 模块 - 中文类型替换

- [ ] 2.4.1 修复 repair-report-form 模块
  - 文件：`apps/admin/src/pages/property-manage/report-manage/repair-report-form/index.vue`
  - 中文类型：`报修报表_搜索_VO`
  - _Requirements: 2.1.18_

- [ ] 2.4.2 修复 owner-payment-details 模块
  - 文件：`apps/admin/src/pages/property-manage/report-manage/owner-payment-details/index.vue`
  - 中文类型：`业主缴费明细_搜索_VO`
  - _Requirements: 2.1.15_

- [ ] 2.4.3 修复 outstanding-fees-analysis 模块
  - 文件：`apps/admin/src/pages/property-manage/report-manage/outstanding-fees-analysis/index.vue`
  - 中文类型：`欠费分析_搜索_VO`
  - _Requirements: 2.1.14_

- [ ] 2.4.4 修复 no-charge-house 模块
  - 文件：`apps/admin/src/pages/property-manage/report-manage/no-charge-house/index.vue`
  - 中文类型：`未收费房屋_搜索_VO`
  - _Requirements: 2.1.13_

- [ ] 2.4.5 修复 data-statistics 模块的表格组件
  - 文件：`apps/admin/src/pages/property-manage/report-manage/data-statistics/components/table/qianfeimingxi.vue`
  - 中文类型：`报表管理_欠费明细_VO`
  - _Requirements: 2.1.11_

- [ ] 2.4.6 修复 data-statistics 模块的其他表格组件
  - 文件：`apps/admin/src/pages/property-manage/report-manage/data-statistics/components/table/yueqianfeimingxi.vue`
  - 中文类型：`报表管理_月实收明细_VO`
  - _Requirements: 2.1.11_

- [ ] 2.4.7 修复 data-statistics 模块的其他表格组件
  - 文件：`apps/admin/src/pages/property-manage/report-manage/data-statistics/components/table/yueshishoumingxi.vue`
  - 中文类型：`报表管理_月欠费明细_VO`
  - _Requirements: 2.1.11_

- [ ] 2.4.8 修复 data-statistics 模块的其他表格组件
  - 文件：`apps/admin/src/pages/property-manage/report-manage/data-statistics/components/table/shishoumingxi.vue`
  - 中文类型：`报表管理_实收明细_VO`
  - _Requirements: 2.1.11_

#### 2.5 community-manage 模块

- [ ] 2.5.1 修复 parking-space-structure-diagram 模块
  - 文件：`apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram/index.vue`
  - 文件：`apps/admin/src/pages/property-manage/community-manage/parking-space-structure-diagram/components/form.vue`
  - 中文类型：`车位结构图表单_VO`
  - _Requirements: 2.1.23_

- [ ] 2.5.2 修复 house-decoration 模块
  - 文件：`apps/admin/src/pages/property-manage/community-manage/house-decoration/index.vue`
  - 中文类型：`房屋装修表单_VO`
  - _Requirements: 2.1.23_

- [ ] 2.5.3 修复 my 模块
  - 文件：`apps/admin/src/pages/property-manage/community-manage/my/index.vue`
  - 问题：`CommunityManageMyFormVO` 类型使用错误
  - _Requirements: 2.1.23_

#### 2.6 expense-manage 模块

- [ ] 2.6.1 修复 discount-setting 模块
  - 文件：`apps/admin/src/pages/property-manage/expense-manage/discount-setting/index.vue`
  - 中文类型：`折扣设置表单_VO`
  - _Requirements: 2.1.28_

- [ ] 2.6.2 修复 discount-type 模块
  - 文件：`apps/admin/src/pages/property-manage/expense-manage/discount-type/components/form.vue`
  - 问题：`discountTypeOptions` 未导出
  - _Requirements: 2.1.28_

#### 2.7 house-property-manage 模块

- [ ] 2.7.1 修复 house 模块
  - 文件：`apps/admin/src/pages/property-manage/house-property-manage/house/index.vue`
  - 问题：空字符串不能赋值给 `HouseStatus` 和 `HouseType`
  - _Requirements: 2.1.25_

#### 2.8 parking-manage 模块

- [ ] 2.8.1 修复 parking-lot 模块
  - 文件：`apps/admin/src/pages/property-manage/parking-manage/parking-lot/index.vue`
  - 问题：中文值不能赋值给英文类型
  - _Requirements: 2.1.24_

---

### 🟢 低优先级任务（P2）- 运营和开发团队模块

#### 2.9 operation-team 模块

- [ ] 2.9.1 修复 initialize-cell 模块
  - 文件：`apps/admin/src/pages/operation-team/system-manage/initialize-cell/index.vue`
  - 文件：`apps/admin/src/pages/operation-team/system-manage/initialize-cell/components/form.vue`
  - 中文类型：`初始化单元格表单_VO`
  - _Requirements: 2.1.22_

- [ ] 2.9.2 修复 manage-community 模块
  - 文件：`apps/admin/src/pages/operation-team/data-manage/-detail-page/manage-community-[id].vue`
  - 文件：`apps/admin/src/pages/operation-team/data-manage/-detail-page/components/community-anagement-form.vue`
  - 中文类型：`管理小区表单_VO`、`管理小区_列表数据`、`管理小区_列表查询_VO`
  - _Requirements: 2.1.22_

#### 2.10 dev-team 模块

- [ ] 2.10.1 修复 config-manage/type 模块
  - 文件：`apps/admin/src/pages/dev-team/config-manage/type/components/form.vue`
  - 问题：类型转换错误
  - _Requirements: 2.1.21_

#### 2.11 contract-manage 模块

- [ ] 2.11.1 修复 draft-contract 模块
  - 文件：`apps/admin/src/pages/property-manage/contract-manage/draft-contract/index.vue`
  - 问题：找不到 `contractTypeOptionsData`
  - _Requirements: 2.1.27_

---

### 2.12 验证修复结果

- [ ] 2.12.1 运行 `pnpm -F @01s-11comm/admin typecheck` 验证类型正确性
- [ ] 2.12.2 确认所有中文类型和选项变量引用已替换
- [ ] 2.12.3 确认类型错误数量降至 0

---

## 3. 最终验证阶段

- [ ] 3.1 运行完整的类型检查 `pnpm typecheck`
- [ ] 3.2 确保没有新的类型错误产生
- [ ] 3.3 生成修复报告

---

## 进度统计

- **类型项目清理**: ✅ 100% 完成
- **后台项目清理**: 🔄 约 18% 完成（6/40+ 文件）
- **当前类型错误数**: 119 个（已从 172 减少 53 个，减少率 30.8%）
- **已修复文件**: 6 个
  - ✅ return-visit/index.vue
  - ✅ patrol-manage/detail/index.vue
  - ✅ issues/index.vue + form.vue
  - ✅ mandatory-return-issue/index.vue + form.vue
  - ✅ repairs-todo/index.vue + form.vue
- **待修复文件**: 约 34+ 个

### 优先级分布

- 🔴 **P0 高优先级**: 8 个任务（issues 模块 + repairs-manage 核心模块）
- 🟡 **P1 中优先级**: 15 个任务（report-manage + community-manage 模块）
- 🟢 **P2 低优先级**: 5 个任务（operation-team + dev-team 模块）

### 预计工作量

- **P0 任务**: 约 4-6 小时（需要处理大量中文属性名映射）
- **P1 任务**: 约 3-4 小时
- **P2 任务**: 约 1-2 小时
- **总计**: 约 8-12 小时
