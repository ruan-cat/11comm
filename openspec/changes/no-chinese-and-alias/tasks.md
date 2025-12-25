## 1. 类型项目清理

### 1.1 清理类型项目 business 模块 index.ts 的选择性导出

**说明：** 此部分已由 `no-form-ts-redundant-export` 任务完成，无需重复执行。

- [x] 1.1.1 清理 `apps/type/src/business/property-manage/contract-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.2 清理 `apps/type/src/business/property-manage/expense-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.3 清理 `apps/type/src/business/property-manage/patrol-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.4 清理 `apps/type/src/business/property-manage/community-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.5 清理 `apps/type/src/business/property-manage/index.ts` - 将选择性导出改为全量导出（已是全量导出）
- [x] 1.1.6 清理 `apps/type/src/business/index.ts` - 将选择性导出改为全量导出（已是全量导出）

### 1.2 清理类型项目中的中文类型别名

- [ ] 1.2.1 搜索类型项目中所有中文类型别名（如 `巡查明细表单_VO`、`报修回访_列表数据` 等）
- [ ] 1.2.2 删除或重命名这些中文类型别名为英文
- [ ] 1.2.3 确保英文类型定义已存在且正确

### 1.3 重命名类型项目中的中文选项变量

- [ ] 1.3.1 搜索 `apps/type/src/common/business-options.ts` 中的中文选项变量（如 `报修类型Options`、`维修类型Options`、`回访状态Options` 等）
- [ ] 1.3.2 将这些中文选项变量重命名为英文（如 `repairTypeOptions`、`maintenanceTypeOptions`、`returnVisitStatusOptions` 等）
- [ ] 1.3.3 确保重命名后的变量名符合项目命名规范

### 1.4 验证类型项目类型检查

- [ ] 1.4.1 运行 `pnpm -F @01s-11comm/type typecheck` 验证类型正确性

## 2. 后台项目清理

**重要约束：** 本任务**不修改** form.ts 文件的导出结构。form.ts 的导出清理已由 `no-form-ts-redundant-export` 任务完成。

### 2.1 修复后台项目中的中文类型引用

#### 批次 1：repairs-manage 模块 - 中文类型替换（10+ 个文件）

- [ ] 2.1.1 替换 return-visit 模块中的中文类型（`报修回访_列表数据` → `ReturnVisitListItem` 等）
- [ ] 2.1.2 替换 repairs-todo 模块中的中文类型（`RepairsTodoQueryParams` 等）
- [ ] 2.1.3 替换 issues 模块中的中文属性引用
- [ ] 2.1.4 替换 mandatory-return-issue 模块中的中文属性引用
- [ ] 2.1.5 替换 phone-report-repairs 模块中的中文属性引用
- [ ] 2.1.6 替换 repairs-setting 模块中的中文属性引用

#### 批次 2：repairs-manage 模块 - 中文选项变量替换（5+ 个文件）

- [ ] 2.1.7 替换 repairs-todo 模块的中文选项变量（`报修类型Options` → `repairTypeOptions`、`维修类型Options` → `maintenanceTypeOptions`、`报修状态Options` → `repairStatusOptions`）
- [ ] 2.1.8 替换 return-visit 模块的中文选项变量（`报修类型Options` → `repairTypeOptions`、`回访状态Options` → `returnVisitStatusOptions`）
- [ ] 2.1.9 替换 repairs-setting 模块的中文选项变量
- [ ] 2.1.10 验证所有 repairs-manage 模块的选项变量正确导入

#### 批次 3：report-manage 模块 - 中文类型和选项变量替换（10+ 个文件）

- [ ] 2.1.11 修复 deposit-report 模块的中文类型和选项变量
- [ ] 2.1.12 修复 fee-reminder 模块的中文类型和选项变量
- [ ] 2.1.13 修复 no-charge-house 模块的中文类型和选项变量
- [ ] 2.1.14 修复 outstanding-fees-analysis 模块的中文类型和选项变量
- [ ] 2.1.15 修复 owner-payment-details 模块的中文类型和选项变量
- [ ] 2.1.16 修复 patrol-report 模块的中文类型和选项变量
- [ ] 2.1.17 修复 payment-details-form 模块的中文类型和选项变量
- [ ] 2.1.18 修复 repair-report-form 模块的中文类型和选项变量
- [ ] 2.1.19 修复 repair-reports-summary-table 模块的中文类型和选项变量
- [ ] 2.1.20 修复 statement-expenses 模块的中文类型和选项变量

#### 批次 4：其他模块 - 中文类型和选项变量替换（10+ 个文件）

- [ ] 2.1.21 修复 dev-team 模块的中文类型和选项变量
- [ ] 2.1.22 修复 operation-team 模块的中文类型和选项变量
- [ ] 2.1.23 修复 community-manage 模块的中文类型和选项变量
- [ ] 2.1.24 修复 parking-manage 模块的中文类型和选项变量
- [ ] 2.1.25 修复 house-property-manage 模块的中文类型和选项变量
- [ ] 2.1.26 修复 patrol-manage 模块的中文类型和选项变量
- [ ] 2.1.27 修复 contract-manage 模块的中文类型和选项变量
- [ ] 2.1.28 修复 expense-manage 模块的中文类型和选项变量
- [ ] 2.1.29 修复 setting-manage 模块的中文类型和选项变量
- [ ] 2.1.30 修复 views/tabs 模块的中文类型和选项变量

### 2.2 验证修复结果

- [ ] 2.2.1 运行 `pnpm -F @01s-11comm/admin typecheck` 验证类型正确性
- [ ] 2.2.2 确认所有中文类型和选项变量引用已替换

## 3. 最终验证阶段

- [ ] 3.1 运行完整的类型检查 `pnpm typecheck`
- [ ] 3.2 确保没有新的类型错误产生
- [ ] 3.3 生成修复报告
