# Design: 为全部 index.vue 列表页补全 `:loading="isFetching"` Props

## Context

根据 proposal 分析，当前后台项目存在以下情况：

1. **当前状态**：已有 73 个 index.vue 文件使用了 `:loading="isFetching"`
2. **缺失情况**：仍存在大量 index.vue 文件未配置该属性
3. **规范要求**：根据 `frontend-development` 技能中的 `api-data-fetching.md` 文档，列表页的 `PureTable` 组件必须配置 `:loading="isFetching"` 以提供加载状态反馈

## Goals / Non-Goals

**Goals:**

- 识别并补全所有缺失 `:loading="isFetching"` 配置的 index.vue 文件
- 确保所有列表页在数据加载时提供 loading 状态的视觉反馈
- 保持代码风格一致性

**Non-Goals:**

- 不修改已经正确配置 loading 的文件
- 不修改非列表页的组件文件
- 不修改 index.vue 以外的其他文件

## Decisions

### 1. 识别目标文件

**决策**：以 `apps/admin/src/pages/` 目录下所有 index.vue 文件为目标，筛选出使用 `PureTable` 但缺少 `:loading="isFetching"` 的文件。

**理由**：根据 rank-route-keys.ts 中的业务路由结构，pages 目录下的 index.vue 即为列表页组件。

### 2. 实现方案

**决策**：逐个检查并修改目标文件，添加 `:loading="isFetching"` 属性。

**修改模式**：

```vue
<PureTable
  v-bind="pureTableProps"
  :loading="isFetching"  <!-- 新增此行 -->
  @page-size-change="handlePageSizeChange"
  @page-current-change="handleCurrentPageChange"
/>
```

### 3. 任务拆分策略

**决策**：按照 rank-route-keys.ts 中的二级路由结构进行任务拆分，每个子代理负责 2-3 个三级路由对应的文件。

**理由**：

1. 二级路由数量适中，便于分配任务
2. 三级路由对应具体的业务模块，职责清晰
3. 避免单个子代理任务过重导致失败

## Risks / Trade-offs

**风险 1**：文件遗漏

- **缓解措施**：严格按照 rank-route-keys.ts 中的所有三级路由逐一排查，确保不遗漏任何文件

**风险 2**：部分文件可能使用了不同的数据获取模式

- **缓解措施**：对于不使用 useListQuery 的文件，暂不修改；仅修改使用 `isFetching` 但未配置 loading 的文件
