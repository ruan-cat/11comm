# 📁 pages 目录结构清单

**最后更新**: 2025-11-09

---

## 📊 总览统计

| 统计项 | 数量 | 说明 |
|--------|------|------|
| **页面总数** | 129 | Vue 页面文件 |
| **标准格式页面** | 50+ | 已符合标准（index.vue + test-data.ts + components） |
| **需要添加 test-data.ts** | 21 | 缺少假数据文件 |
| **需要完整改造** | 24 | 缺少 test-data.ts 和 components 目录 |
| **特殊页面** | 13 | 详情页或复杂报表页面 |

---

## 🟢 标准格式页面（已符合要求）

这些页面已经拥有完整的 `index.vue` + `test-data.ts` + `components/form.ts` + `components/form.vue` 结构，**无需改造**。

### property-manage/expense-manage 模块（15个）
```
property-manage/expense-manage/cancel-fee/
property-manage/expense-manage/contracte-charge/
property-manage/expense-manage/discount-apply/
property-manage/expense-manage/discount-setting/
property-manage/expense-manage/discount-type/
property-manage/expense-manage/expense-item-setting/
property-manage/expense-manage/expense-summary-table/
property-manage/expense-manage/house-charge/
property-manage/expense-manage/meter-reading-type/
property-manage/expense-manage/overdue-payment-information/
property-manage/expense-manage/payment-review/
property-manage/expense-manage/refund-review/
property-manage/expense-manage/reminder-for-overdue-payments/
property-manage/expense-manage/reprint-voucher/
property-manage/expense-manage/vehicle-charge/
property-manage/expense-manage/water-and-electricity-meter-reading/
```

### property-manage/contract-manage 模块（5个）
```
property-manage/contract-manage/change/
property-manage/contract-manage/draft-contract/
property-manage/contract-manage/expire/
property-manage/contract-manage/first-party/
property-manage/contract-manage/type/
```

### property-manage/community-manage 模块（3个）
```
property-manage/community-manage/my/
property-manage/community-manage/notice/
property-manage/community-manage/property-register/
```

### operation-team/data-manage 模块（2个）
```
operation-team/data-manage/community-information/
operation-team/data-manage/property-management-company/
```

### operation-team/merchant-manage 模块（2个）
```
operation-team/merchant-manage/merchant-admin/
operation-team/merchant-manage/merchant-info/
```

### operation-team/report-configuration 模块（3个）
```
operation-team/report-configuration/report-component/
operation-team/report-configuration/report-group/
operation-team/report-configuration/report-info/
```

### property-manage/house-property-manage 模块（10个）
```
property-manage/house-property-manage/house/
property-manage/house-property-manage/invoice/
property-manage/house-property-manage/invoice-title/
property-manage/house-property-manage/owner-account/
property-manage/house-property-manage/owner-information/
property-manage/house-property-manage/owner-member/
property-manage/house-property-manage/owners-committee/
property-manage/house-property-manage/reserve-venue/
property-manage/house-property-manage/reserve-venue-order/
property-manage/house-property-manage/site-management/
```

### property-manage/parking-manage 模块（4个）
```
property-manage/parking-manage/carport-apply/
property-manage/parking-manage/carport-info/
property-manage/parking-manage/owner-vehicle/
property-manage/parking-manage/parking-lot/
```

### property-manage/patrol-manage 模块（6个）
```
property-manage/patrol-manage/detail/
property-manage/patrol-manage/item/
property-manage/patrol-manage/path/
property-manage/patrol-manage/plan/
property-manage/patrol-manage/point/
property-manage/patrol-manage/task/
```

### property-manage/repairs-manage 模块（2个）
```
property-manage/repairs-manage/issues/
property-manage/repairs-manage/mandatory-return-issue/
```

### dev-team 模块（1个）
```
dev-team/cache-manage/refresh-cache/
```

### setting-manage/organize-manage 模块（1个）
```
setting-manage/organize-manage/staff-info/
```

---

## 🔶 需要添加 test-data.ts 的页面

这些页面已经拥有 `index.vue` 和 `components/` 目录，但**缺少 `test-data.ts` 文件**。

### dev-team 模块（2个）
```
✅ dev-team/cache-manage/ (有 index.vue, components/)
   └─ ❌ 需要创建：test-data.ts

✅ dev-team/config-manage/cache-manage/ (有 index.vue, components/)
   └─ ❌ 需要创建：test-data.ts
```

### setting-manage 模块（19个）
```
✅ setting-manage/organize-manage/org-info/ (有 index.vue)
   └─ ❌ 需要创建：test-data.ts, components/form.ts, components/form.vue

✅ setting-manage/organize-manage/scheduling-setting/ (有 index.vue)
   └─ ❌ 需要创建：test-data.ts, components/form.ts, components/form.vue

✅ setting-manage/organize-manage/shift-setting/ (有 index.vue)
   └─ ❌ 需要创建：test-data.ts, components/form.ts, components/form.vue

✅ setting-manage/system-manage/change-password/ (有 index.vue)
   └─ ❌ 需要创建：test-data.ts, components/form.ts, components/form.vue

✅ setting-manage/system-manage/community-configuration/ (有 index.vue)
   └─ ❌ 需要创建：test-data.ts, components/form.ts, components/form.vue

✅ setting-manage/system-manage/register-protocol/ (有 index.vue)
   └─ ❌ 需要创建：test-data.ts, components/form.ts, components/form.vue
```

---

## 🔴 需要完整改造的页面

这些页面**只有** `index.vue`，需要**添加** `test-data.ts` 和 `components/` 目录。

### dev-team 模块（4个）
```
dev-team/index.vue
dev-team/cache-manage/index.vue
dev-team/config-manage/index.vue
dev-team/menu-manage/index.vue
```

### operation-team 模块（2个）
```
operation-team/index.vue
operation-team/data-manage/index.vue
```

### property-manage 模块（7个）
```
property-manage/index.vue
property-manage/community-manage/index.vue
property-manage/contract-manage/index.vue
property-manage/expense-manage/index.vue
property-manage/house-property-manage/index.vue
property-manage/parking-manage/index.vue
property-manage/patrol-manage/index.vue
property-manage/report-manage/index.vue
property-manage/repairs-manage/index.vue
```

### setting-manage 模块（9个）
```
setting-manage/index.vue
setting-manage/organize-manage/index.vue
setting-manage/organize-manage/data-permission/index.vue
setting-manage/organize-manage/role-permission/index.vue
setting-manage/organize-manage/working-schedule/index.vue
setting-manage/system-manage/index.vue
```

---

## 🔵 特殊页面（详情页和报表页）

这些页面结构特殊，按需处理。

### 详情页（6个）
```
operation-team/data-manage/-detail-page/index.vue
operation-team/data-manage/-detail-page/manage-community-[id].vue
property-manage/community-manage/-detail-page/index.vue
property-manage/house-property-manage/-detail-page/index.vue
property-manage/house-property-manage/-detail-page/owner-account-[id].vue
property-manage/parking-manage/-detail-page/index.vue
property-manage/parking-manage/-detail-page/check-out.vue
```

### 报表页（7个）
```
property-manage/report-manage/arrears-details-list/index.vue
property-manage/report-manage/data-statistics/index.vue
property-manage/report-manage/deposit-report/index.vue
property-manage/report-manage/expense-summary-table/index.vue
property-manage/report-manage/fee-reminder/index.vue
property-manage/report-manage/no-charge-house/index.vue
property-manage/report-manage/outstanding-fees-analysis/index.vue
property-manage/report-manage/owner-payment-details/index.vue
property-manage/report-manage/patrol-report/index.vue
property-manage/report-manage/payment-details-form/index.vue
property-manage/report-manage/repair-report-form/index.vue
property-manage/report-manage/repair-reports-summary-table/index.vue
property-manage/report-manage/statement-expenses/index.vue
property-manage/repairs-manage/repairs-have-done/index.vue
property-manage/repairs-manage/repairs-todo/index.vue
property-manage/repairs-manage/return-visit/index.vue
```

---

## 📋 改造优先级建议

### 优先级 1（立即处理）
- **数量**: 45 个页面
- **理由**: 这些是基础列表页，改造后可以快速提升代码质量
- **模块**:
  - setting-manage/organize-manage/（3个）
  - setting-manage/system-manage/（3个）
  - dev-team/cache-manage/（1个）
  - dev-team/config-manage/cache-manage/（1个）
  - dev-team/index.vue, dev-team/cache-manage/index.vue, dev-team/config-manage/index.vue, dev-team/menu-manage/index.vue
  - operation-team/index.vue, operation-team/data-manage/index.vue

### 优先级 2（次周处理）
- **数量**: 59 个页面
- **理由**: property-manage 模块页面较多，可分批处理
- **模块**:
  - property-manage/ 下的所有 index.vue 页面
  - property-manage 各子模块的 index.vue 页面

### 优先级 3（低优先级）
- **数量**: 13 个特殊页面
- **理由**: 详情页和报表页结构特殊，需要单独分析
- **模块**: 所有 `-detail-page/` 和 报表页

### 优先级 4（不处理）
- **数量**: 50+ 个页面
- **理由**: 已符合标准格式，无需改造
- **模块**: 所有标准格式页面

---

## 🎯 改造目标

### 每个页面必须拥有
```
页面目录/
├── index.vue              # 列表页组件
├── test-data.ts           # 假数据和类型定义
└── components/
    ├── form.ts           # 表单类型定义
    └── form.vue          # 表单组件
```

### 改造要求
每个页面必须满足 `.claude\commands\make-std-list-page-and-formlike-dialog.md` 文档中的所有要求。

主要改造点：
1. 添加 `test-data.ts` 文件，包含 35 条假数据
2. 按照 `make-list-page.md` 子代理的要求重构 `index.vue`
3. 创建 `components/form.ts` 和 `components/form.vue`
4. 实现标准的 `loadTableData()` 假分页请求函数
5. 实现标准的搜索、分页、重置功能
6. 使用正确的类型约束和代码风格

---

## 📌 注意事项

1. **不要改造标准格式页面**：已符合要求的 50+ 个页面无需改动
2. **类型检查**: 每次改造后运行 `pnpm -F @01s-11comm/admin typecheck`
3. **提交规范**: 每个任务完成后，提交消息应包含任务编号和简短描述
4. **进度追踪**: 使用 taskmaster-ai 的 TODO 功能跟踪进度
