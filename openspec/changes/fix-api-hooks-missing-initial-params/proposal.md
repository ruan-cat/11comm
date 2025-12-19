# Change: 修复 API Hooks 缺少必填参数 initialParams

## Why

当前项目中约 99 个 API Hook 函数未按照规范传递必填的 `initialParams` 参数,违反了 `migrate-static-data-to-nitro-query/specs/migration-guide.md` 中 Step 4 的要求。这导致:

1. **类型安全问题** - useListQuery 的配置对象缺少必填字段,可能在运行时引发错误
2. **功能缺陷** - 列表页无法正确初始化查询参数,影响搜索和分页功能
3. **代码不一致** - 部分 API Hook 遵循规范(如 useConfigCenterListQuery),部分违反规范,造成维护困难

## What Changes

- **BREAKING**: 所有 API Hook 函数必须添加 `initialParams: Partial<{Page}QueryParams>` 参数
- 更新约 99 个 `apps/admin/src/api/**/index.ts` 文件中的 API Hook 函数签名
- 确保所有 Hook 调用时传递 `initialParams` 配置项到 `useListQuery`
- 统一代码风格,符合迁移指南 Step 4 的规范要求

## Impact

- 影响的规范: `api-hooks`
- 影响的代码:
  - 约 99 个 API Hook 文件: `apps/admin/src/api/**/index.ts`
  - 对应的列表页文件: `apps/admin/src/pages/**/index.vue`
  - 核心依赖: `apps/admin/src/composables/use-list-query/index.ts`
- 影响范围:
  - `settingManage.organizeManage.*` (7 个三级路由)
  - `settingManage.systemManage.*` (5 个三级路由)
  - `devTeam.menuManage.*` (3 个三级路由)
  - `devTeam.cacheManage.*` (1 个三级路由)
  - `devTeam.configManage.*` (4 个三级路由)
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
