## 1. 类型项目清理

### 1.1 清理类型项目 business 模块 index.ts 的选择性导出

- [ ] 1.1.1 清理 `apps/type/src/business/property-manage/contract-manage/index.ts` - 将选择性导出改为全量导出
- [ ] 1.1.2 清理 `apps/type/src/business/property-manage/expense-manage/index.ts` - 将选择性导出改为全量导出
- [ ] 1.1.3 清理 `apps/type/src/business/property-manage/patrol-manage/index.ts` - 将选择性导出改为全量导出
- [ ] 1.1.4 清理 `apps/type/src/business/property-manage/community-manage/index.ts` - 将选择性导出改为全量导出
- [ ] 1.1.5 清理 `apps/type/src/business/property-manage/index.ts` - 将选择性导出改为全量导出
- [ ] 1.1.6 清理 `apps/type/src/business/index.ts` - 将选择性导出改为全量导出

### 1.2 清理类型项目中的中文类型别名

- [ ] 1.2.1 搜索并删除类型项目中所有 `export type \u4e00-\u9fa5+ =` 模式的中文别名

### 1.3 验证类型项目类型检查

- [ ] 1.3.1 运行 `pnpm -F @01s-11comm/type typecheck` 验证类型正确性

## 2. 后台项目清理

### 2.1 删除 form.ts 中的冗余 FormVO 导出

- [ ] 2.1.1 删除 `apps/admin/src/pages/property-manage/patrol-manage/task/components/form.ts` 中的 `export type { PatrolTaskFormVO }`
- [ ] 2.1.2 删除 `apps/admin/src/pages/property-manage/patrol-manage/point/components/form.ts` 中的 `export type { PatrolPointFormVO }`
- [ ] 2.1.3 删除 `apps/admin/src/pages/property-manage/patrol-manage/detail/components/form.ts` 中的 `export type { PatrolDetailFormVO }`
- [ ] 2.1.4 删除 `apps/admin/src/pages/property-manage/patrol-manage/item/components/form.ts` 中的 `export type { PatrolItemFormVO }`
- [ ] 2.1.5 删除 `apps/admin/src/pages/property-manage/patrol-manage/plan/components/form.ts` 中的 `export type { PatrolPlanFormVO }`
- [ ] 2.1.6 删除 `apps/admin/src/pages/property-manage/expense-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.7 删除 `apps/admin/src/pages/property-manage/parking-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.8 删除 `apps/admin/src/pages/property-manage/house-property-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.9 删除 `apps/admin/src/pages/property-manage/community-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.10 删除 `apps/admin/src/pages/property-manage/contract-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.11 删除 `apps/admin/src/pages/property-manage/repairs-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.12 删除 `apps/admin/src/pages/property-manage/report-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.13 删除 `apps/admin/src/pages/operation-team/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.14 删除 `apps/admin/src/pages/dev-team/*/components/form.ts` 中的所有 `export type { XXXFormVO }`
- [ ] 2.1.15 删除 `apps/admin/src/pages/setting-manage/*/components/form.ts` 中的所有 `export type { XXXFormVO }`

### 2.2 清理 form.vue 中引用的冗余导出

- [ ] 2.2.1 检查并清理所有 `form.vue` 文件中对已删除导出的引用

### 2.3 验证后台项目类型检查

- [ ] 2.3.1 运行 `pnpm -F @01s-11comm/admin typecheck` 验证类型正确性
- [ ] 2.3.2 修复因清理导致的任何类型错误

## 3. 验证阶段

- [ ] 3.1 运行完整的类型检查 `pnpm typecheck`
- [ ] 3.2 确保没有新的类型错误产生
