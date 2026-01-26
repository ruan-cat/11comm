# Change: 批量修复列表页代码写法规范

## Why

当前项目中约 99 个列表页 (`index.vue`) 的代码写法不符合 `migrate-static-data-to-nitro-query/specs/migration-guide.md` 中 Step 5 的规范要求。这导致:

1. **类型安全问题** - API Hook 调用缺少必填的 `initialParams` 参数,导致 TypeScript 类型报错
2. **代码不一致** - 部分页面遵循规范(如 dev-team/config-manage/center),部分违反规范(如 property-manage/expense-manage/payment-review)
3. **维护困难** - 存在大量手动实现的 `pagination`、`pureTableProps`、分页函数等冗余代码
4. **功能缺陷** - 使用错误的变量名 (`isLoading` vs `isFetching`)、错误的工具函数 (`cloneDeep` vs `structuredClone`)
5. **技术债务** - 残留旧的 `test-data.ts` 导入和 `loadTableData` 函数

## What Changes

- **BREAKING**: 所有列表页必须传递 `plusSearchDefaultValues` 参数给 API Hook
- 更新约 99 个 `apps/admin/src/pages/**/index.vue` 文件的代码写法
- 删除手动定义的 `pagination`、`pureTableProps`、分页函数
- 使用 Hook 返回的标准变量和函数: `pureTableProps`、`isFetching`、`handlePageSizeChange`、`handleCurrentPageChange`
- 统一搜索函数写法: `handleSearch` 和 `handleReSearch`
- 删除旧的 `test-data.ts` 导入和 `loadTableData` 函数
- 使用 `structuredClone` 替代 `cloneDeep`

**修改范围限定**:

- ✅ **允许修改**: 变量名、类型名替换，特定代码删除（test-data、loadTableData、手动分页函数）
- ❌ **严格禁止**: 删改弹框逻辑、表单初始化逻辑、按钮配置逻辑、全局类型使用、definePage 宏位置

**重要规范**:

- 必须遵守来自 `migrate-static-data-to-nitro-query` 任务的严格执行规范
- 只做职责范围内的修改，不越界删改业务逻辑
- 详细规范参见 `specs/list-pages/spec.md` 的"列表页改造的严格执行规范"章节

## Impact

- 影响的规范: `list-pages`
- 影响的代码:
  - 约 99 个列表页文件: `apps/admin/src/pages/**/index.vue`
  - 依赖的 API Hook: `apps/admin/src/api/**/index.ts`
  - 核心 composable: `apps/admin/src/composables/use-list-query/index.ts`
- 影响范围:
  - `settingManage.organizeManage.*` (7 个三级路由)
  - `settingManage.systemManage.*` (5 个三级路由)
  - `devTeam.menuManage.*` (3 个三级路由)
  - `devTeam.cacheManage.*` (1 个三级路由)
  - `devTeam.configManage.*` (4 个三级路由,1 个已正确)
  - `operationTeam.systemManage.*` (5 个三级路由)
  - `operationTeam.dataManage.*` (2 个三级路由)
  - `operationTeam.merchantManage.*` (2 个三级路由)
  - `operationTeam.reportConfiguration.*` (3 个三级路由)
  - `propertyManage.communityManage.*` (7 个三级路由)
  - `propertyManage.contractManage.*` (5 个三级路由)
  - `propertyManage.expenseManage.*` (16 个三级路由)
  - `propertyManage.housePropertyManage.*` (10 个三级路由)
  - `propertyManage.parkingManage.*` (4 个三级路由)
  - `propertyManage.patrolManage.*` (6 个三级路由)
  - `propertyManage.repairsManage.*` (7 个三级路由)
  - `propertyManage.reportManage.*` (13 个三级路由)
