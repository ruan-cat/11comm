# Loading Props Completion Specification

## ADDED Requirements

### Requirement: PureTable 组件必须配置 Loading 状态

所有 index.vue 列表页中的 `PureTable` 组件必须配置 `:loading="isFetching"` 属性，以便在数据加载时提供视觉反馈。

#### Scenario: 已使用 isFetching 但未配置 loading

- **WHEN** index.vue 文件使用了 `useListQuery` hook 并解构出 `isFetching` 变量
- **THEN** 必须在 `PureTable` 组件上添加 `:loading="isFetching"` 属性

#### Scenario: 未使用 isFetching

- **WHEN** index.vue 文件未使用 `useListQuery` hook 或未解构 `isFetching` 变量
- **THEN** 该文件不在本次修改范围内

#### Scenario: 已正确配置 loading

- **WHEN** index.vue 文件已配置 `:loading="isFetching"` 属性
- **THEN** 该文件无需修改
