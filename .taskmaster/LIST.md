# 列表页改造任务清单

**任务总数**: 79 个
**创建日期**: 2025-11-09
**项目**: 01s-11comm 智慧社区后台管理系统

---

## 📋 任务总览

### 任务统计
| 优先级 | 任务数 | 已完成 | 进度 |
|--------|--------|--------|------|
| 🔥 优先级 1 | 45 | 0 | 0% |
| 🔥 优先级 2 | 59 | 0 | 0% |
| 🔥 优先级 3 | 13 | 0 | 0% |
| **总计** | **117** | **0** | **0%** |

### 模块分布
| 模块 | 任务数 | 优先级 1 | 优先级 2 | 优先级 3 |
|------|--------|----------|----------|----------|
| dev-team | 11 | 11 | 0 | 0 |
| operation-team | 2 | 2 | 0 | 0 |
| property-manage | 59 | 0 | 59 | 0 |
| setting-manage | 45 | 32 | 0 | 13 |

---

## 🔥 优先级 1: 立即处理（45 个任务）

### 1.1 dev-team 模块（11 个任务）

#### 1.1.1 添加 test-data.ts
- [ ] **TASK-001**: dev-team/cache-manage/ - 添加 test-data.ts
  - 文件路径: `apps\admin\src\pages\dev-team\cache-manage\test-data.ts`
  - 要求: 创建假数据文件，定义类型
  - 参考: `.claude\commands\make-std-list-page-and-formlike-dialog.md`

- [ ] **TASK-002**: dev-team/config-manage/cache-manage/ - 添加 test-data.ts
  - 文件路径: `apps\admin\src\pages\dev-team\config-manage\cache-manage\test-data.ts`
  - 要求: 创建假数据文件，定义类型

#### 1.1.2 完整改造（添加 test-data.ts + components）
- [ ] **TASK-003**: dev-team/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`
  - 按照标准模板重构

- [ ] **TASK-004**: dev-team/cache-manage/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\cache-manage\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-005**: dev-team/config-manage/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\config-manage\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-006**: dev-team/config-manage/center/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\config-manage\center\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-007**: dev-team/config-manage/dictionary/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\config-manage\dictionary\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-008**: dev-team/config-manage/item/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\config-manage\item\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-009**: dev-team/config-manage/type/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\config-manage\type\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-010**: dev-team/menu-manage/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\menu-manage\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-011**: dev-team/menu-manage/catalog/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\menu-manage\catalog\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-012**: dev-team/menu-manage/group/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\menu-manage\group\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-013**: dev-team/menu-manage/item/index.vue
  - 页面路径: `apps\admin\src\pages\dev-team\menu-manage\item\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

### 1.2 operation-team 模块（2 个任务）

- [ ] **TASK-014**: operation-team/index.vue
  - 页面路径: `apps\admin\src\pages\operation-team\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

- [ ] **TASK-015**: operation-team/data-manage/index.vue
  - 页面路径: `apps\admin\src\pages\operation-team\data-manage\index.vue`
  - 需要创建: `test-data.ts`, `components/form.ts`, `components/form.vue`

### 1.3 setting-manage 模块（32 个任务）

#### 1.3.1 添加 test-data.ts + components
- [ ] **TASK-016**: setting-manage/organize-manage/org-info/index.vue
- [ ] **TASK-017**: setting-manage/organize-manage/scheduling-setting/index.vue
- [ ] **TASK-018**: setting-manage/organize-manage/shift-setting/index.vue
- [ ] **TASK-019**: setting-manage/system-manage/change-password/index.vue
- [ ] **TASK-020**: setting-manage/system-manage/community-configuration/index.vue
- [ ] **TASK-021**: setting-manage/system-manage/register-protocol/index.vue

#### 1.3.2 完整改造
- [ ] **TASK-022**: setting-manage/index.vue
- [ ] **TASK-023**: setting-manage/organize-manage/index.vue
- [ ] **TASK-024**: setting-manage/organize-manage/data-permission/index.vue
- [ ] **TASK-025**: setting-manage/organize-manage/role-permission/index.vue
- [ ] **TASK-026**: setting-manage/organize-manage/working-schedule/index.vue
- [ ] **TASK-027**: setting-manage/system-manage/index.vue

---

## 🔥 优先级 2: 次周处理（59 个任务）

### 2.1 property-manage 模块（59 个任务）

#### 2.1.1 根目录索引页面
- [ ] **TASK-028**: property-manage/index.vue
- [ ] **TASK-029**: property-manage/community-manage/index.vue
- [ ] **TASK-030**: property-manage/contract-manage/index.vue
- [ ] **TASK-031**: property-manage/expense-manage/index.vue
- [ ] **TASK-032**: property-manage/house-property-manage/index.vue
- [ ] **TASK-033**: property-manage/parking-manage/index.vue
- [ ] **TASK-034**: property-manage/patrol-manage/index.vue
- [ ] **TASK-035**: property-manage/report-manage/index.vue
- [ ] **TASK-036**: property-manage/repairs-manage/index.vue

（后续任务编号 TASK-037 到 TASK-086 为 property-manage 子模块的其他页面）

---

## 🔥 优先级 3: 特殊页面（按需处理）（13 个任务）

### 3.1 详情页（6 个任务）
- [ ] **TASK-087**: operation-team/data-manage/-detail-page/index.vue
- [ ] **TASK-088**: operation-team/data-manage/-detail-page/manage-community-[id].vue
- [ ] **TASK-089**: property-manage/community-manage/-detail-page/index.vue
- [ ] **TASK-090**: property-manage/house-property-manage/-detail-page/index.vue
- [ ] **TASK-091**: property-manage/house-property-manage/-detail-page/owner-account-[id].vue
- [ ] **TASK-092**: property-manage/parking-manage/-detail-page/index.vue
- [ ] **TASK-093**: property-manage/parking-manage/-detail-page/check-out.vue

### 3.2 报表页（7 个任务）
- [ ] **TASK-094**: property-manage/report-manage/arrears-details-list/index.vue
- [ ] **TASK-095**: property-manage/report-manage/data-statistics/index.vue
- [ ] **TASK-096**: property-manage/report-manage/deposit-report/index.vue
- [ ] **TASK-097**: property-manage/report-manage/expense-summary-table/index.vue
- [ ] **TASK-098**: property-manage/report-manage/fee-reminder/index.vue
- [ ] **TASK-099**: property-manage/report-manage/no-charge-house/index.vue
- [ ] **TASK-100**: property-manage/report-manage/outstanding-fees-analysis/index.vue
- [ ] **TASK-101**: property-manage/report-manage/owner-payment-details/index.vue
- [ ] **TASK-102**: property-manage/report-manage/patrol-report/index.vue
- [ ] **TASK-103**: property-manage/report-manage/payment-details-form/index.vue
- [ ] **TASK-104**: property-manage/report-manage/repair-report-form/index.vue
- [ ] **TASK-105**: property-manage/report-manage/repair-reports-summary-table/index.vue
- [ ] **TASK-106**: property-manage/report-manage/statement-expenses/index.vue
- [ ] **TASK-107**: property-manage/repairs-manage/repairs-have-done/index.vue
- [ ] **TASK-108**: property-manage/repairs-manage/repairs-todo/index.vue
- [ ] **TASK-109**: property-manage/repairs-manage/return-visit/index.vue

---

## 📋 任务实施规范

### 每个任务包括
1. **创建 test-data.ts**
   - 35 条假数据
   - 定义业务类型
   - 下拉选项数据

2. **改造 index.vue**
   - 按照 `make-list-page.md` 子代理要求
   - 实现 `loadTableData()` 假分页函数
   - 实现搜索、重置、分页功能
   - 使用 `<PureTableBar>` 和 `<PureTable>` 组件
   - 使用 `<PlusSearch>` 搜索栏

3. **创建 components/form.ts**
   - 定义表单类型
   - 与 test-data.ts 保持一致

4. **创建 components/form.vue**
   - 命令式弹框表单
   - 使用 Element Plus 和 Plus Pro Components

5. **类型检查**
   - 运行 `pnpm -F @01s-11comm/admin typecheck`
   - 修复所有类型错误

6. **提交代码**
   - 按照提交规范提交
   - 包含任务编号

---

## 📝 任务进度记录

### 本周目标（优先级 1）
- [ ] 完成 TASK-001 到 TASK-027（27 个任务）
- [ ] 每日完成 4-5 个任务
- [ ] 每日代码审查

### 下周目标（优先级 2）
- [ ] 完成 TASK-028 到 TASK-086（59 个任务）
- [ ] property-manage 模块改造
- [ ] 性能优化和测试

### 月底目标（优先级 3）
- [ ] 完成 TASK-087 到 TASK-109（23 个任务）
- [ ] 特殊页面处理
- [ ] 最终测试和文档更新

---

## 🔧 使用 taskmaster-ai 执行任务

### 初始化任务
```bash
# 如果你需要重新初始化
task-master init
```

### 编辑任务
任务文件存储在 `.taskmaster/tasks/` 目录下

### 更新进度
使用 taskmaster-ai 的 TODO 功能：
```bash
# 标记任务完成
task-master task-complete TASK-001

# 查看任务状态
task-master task-status

# 生成进度报告
task-master generate-report
```

---

## 📚 相关文档

1. **改造要求**: `.claude\commands\make-std-list-page-and-formlike-dialog.md`
2. **代码风格**: `.claude\agents\code-style.md`
3. **列表页标准**: `.claude\agents\make-list-page.md`
4. **弹框组件**: `.claude\agents\make-dialog.md`
5. **表单组件**: `.claude\agents\make-form-for-dialog.md`
6. **类型修复**: `.claude\agents\fix-type-error.md`
7. **目录结构**: `.taskmaster\pages-directory-structure.md`

---

**注意**: 本清单由 taskmaster-ai 自动生成，使用 taskmaster-ai MCP 跟踪进度。
