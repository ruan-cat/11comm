## MODIFIED Requirements

### Requirement: 列表页必须正确调用 API Hook 并传递初始参数

所有列表页组件 MUST 正确调用对应的 API Hook 函数,并传递 `plusSearchDefaultValues` 作为初始参数。

#### Scenario: 列表页正确调用 API Hook

- **WHEN** 列表页组件使用 API Hook 获取数据
- **THEN** 必须传递 `plusSearchDefaultValues` 参数
- **AND** 必须解构出标准的返回值: `tableData`、`pureTableProps`、`isFetching`、`updateParams`、`resetParams`、`doFetch`、`handlePageSizeChange`、`handleCurrentPageChange`

#### Scenario: 列表页不手动定义分页相关代码

- **WHEN** 列表页组件需要分页功能
- **THEN** 必须直接使用 Hook 返回的 `pureTableProps`
- **AND** 不能手动定义 `pagination` 计算属性
- **AND** 不能手动定义 `pureTableProps` ref
- **AND** 不能手动实现 `handlePageSizeChange` 和 `handleCurrentPageChange` 函数

#### Scenario: 列表页使用正确的 loading 状态

- **WHEN** 列表页绑定 PureTable 的 loading 属性
- **THEN** 必须使用 `isFetching` 变量
- **AND** 不能使用 `isLoading` 变量

## ADDED Requirements

### Requirement: 列表页搜索函数必须使用标准写法

所有列表页的搜索和重置函数 MUST 遵循固定的代码模板,确保行为一致性。

#### Scenario: 重置搜索条件的标准写法

- **WHEN** 用户点击重置按钮
- **THEN** `handleReSearch` 函数必须使用 `structuredClone(plusSearchDefaultValues)` 重置搜索表单
- **AND** 必须调用 `resetParams()` 重置查询参数
- **AND** 不能使用 `cloneDeep` 或其他克隆函数

#### Scenario: 执行搜索的标准写法

- **WHEN** 用户点击搜索按钮
- **THEN** `handleSearch` 函数必须调用 `updateParams({ ...plusSearchModel.value, pageIndex: 1 })`
- **AND** 必须将 `pageIndex` 重置为 1

#### Scenario: 搜索表单初始化的标准写法

- **WHEN** 列表页组件初始化搜索表单
- **THEN** 必须定义 `plusSearchModelRef` 对象,类型为 `FieldValues & Partial<{Page}QueryParams>`
- **AND** 必须使用 `structuredClone(plusSearchModelRef)` 创建 `plusSearchDefaultValues`
- **AND** 必须使用 `ref(plusSearchModelRef)` 创建 `plusSearchModel`

### Requirement: 列表页必须删除旧的本地数据相关代码

列表页迁移到 Nitro + TanStack Query 后,MUST 删除所有与旧本地数据方案相关的代码。

#### Scenario: 删除 test-data.ts 导入

- **WHEN** 列表页完成迁移
- **THEN** 必须删除 `import { tableData as allTableData } from "./test-data"` 导入语句
- **AND** 必须删除对应的 `test-data.ts` 文件

#### Scenario: 删除手动数据加载函数

- **WHEN** 列表页完成迁移
- **THEN** 必须删除 `loadTableData` 函数及其所有调用
- **AND** 必须删除 `onMounted` 中的 `loadTableData()` 调用
- **AND** 必须删除手动的数据筛选和分页逻辑

#### Scenario: 删除手动定义的分页和表格配置

- **WHEN** 列表页完成迁移
- **THEN** 必须删除手动定义的 `pagination` 计算属性
- **AND** 必须删除手动定义的 `pureTableProps` ref
- **AND** 必须删除手动实现的 `handlePageSizeChange` 函数
- **AND** 必须删除手动实现的 `handleCurrentPageChange` 函数

### Requirement: 列表页模板必须正确绑定 PureTable 属性和事件

列表页的 `<template>` 部分 MUST 正确绑定 PureTable 组件的属性和事件。

#### Scenario: PureTable 绑定标准属性

- **WHEN** 列表页渲染 PureTable 组件
- **THEN** 必须使用 `:="pureTableProps"` 绑定表格属性
- **AND** 必须绑定 `:loading="isFetching"`
- **AND** 必须绑定 `@page-size-change="handlePageSizeChange"`
- **AND** 必须绑定 `@page-current-change="handleCurrentPageChange"`

#### Scenario: PureTable 不手动绑定分页属性

- **WHEN** 列表页渲染 PureTable 组件
- **THEN** 不能手动绑定 `:data`、`:pagination` 等属性(已包含在 pureTableProps 中)
- **AND** 不能使用内联函数处理分页事件

### Requirement: 列表页代码格式必须统一

所有列表页代码 MUST 遵循统一的格式和注释规范。

#### Scenario: 代码注释完整

- **WHEN** 编写列表页代码
- **THEN** 关键变量和函数必须有 JSDoc 注释
- **AND** 注释必须清晰说明变量或函数的用途
- **AND** 重要的代码段必须有行内注释

#### Scenario: 导入语句顺序正确

- **WHEN** 列表页导入依赖
- **THEN** 必须先导入 Vue 相关
- **AND** 然后导入项目工具函数
- **AND** 最后导入业务类型和 API Hook
- **AND** 类型导入使用 `type` 关键字
