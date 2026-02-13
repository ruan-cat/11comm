# Proposal: 为全部 index.vue 列表页补全 `:loading="isFetching"` Props

## Why

当前后台项目中有大量 index.vue 列表页文件缺少 `PureTable` 组件的 `:loading="isFetching"` 属性配置。这导致列表页在数据加载时没有 loading 状态的视觉反馈，影响用户体验，也不符合 `frontend-development` 技能中 `api-data-fetching.md` 文档规定的标准规范。

## What Changes

1. **全面排查**后台项目 `apps/admin/src/pages/` 目录下所有 index.vue 列表页文件
2. **识别缺失**的文件：检查每个文件是否使用了 `isFetching` 变量以及是否在 `PureTable` 组件上配置了 `:loading="isFetching"` 属性
3. **补全配置**：为缺失的文件按照 `api-data-fetching.md` 规范添加正确的 loading props 配置

## Capabilities

### New Capabilities

- `loading-props-completion`: 批量为所有缺失 `:loading="isFetching"` 配置的 index.vue 文件补全该属性

### Modified Capabilities

无

## Impact

- **影响范围**：`apps/admin/src/pages/` 目录下的所有 index.vue 列表页文件
- **涉及模块**：
  - settingManage.organizeManage（组织管理）
  - settingManage.systemManage（系统配置）
  - devTeam.menuManage（菜单管理）
  - devTeam.cacheManage（缓存管理）
  - devTeam.configManage（配置管理）
  - operationTeam.systemManage（运营系统配置）
  - operationTeam.dataManage（数据管理）
  - operationTeam.merchantManage（商户管理）
  - operationTeam.reportConfiguration（报表配置）
  - propertyManage.communityManage（社区管理）
  - propertyManage.contractManage（合同管理）
  - propertyManage.expenseManage（费用管理）
  - propertyManage.housePropertyManage（房产管理）
  - propertyManage.parkingManage（停车管理）
  - propertyManage.patrolManage（巡检管理）
  - propertyManage.repairsManage（报修管理）
  - propertyManage.reportManage（报表管理）
