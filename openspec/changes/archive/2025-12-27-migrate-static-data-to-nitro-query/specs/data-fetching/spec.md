# 数据获取规范 (TanStack Query)

## 优先级说明

本规范中使用以下优先级标记：

- **[CRITICAL]**: 核心功能必需，违反会导致系统完全无法工作
- **[IMPORTANT]**: 重要功能，违反会导致功能异常或性能问题

各 Requirement 的优先级：

|                  Requirement                  |   优先级    |                说明                |
| :-------------------------------------------: | :---------: | :--------------------------------: |
| 业务专用查询 Hook 必须提供 initialParams 参数 | [CRITICAL]  | 无法传递初始参数会破坏 Hook 封装性 |
|         API Hook 返回固定的变量和函数         | [CRITICAL]  |    违反会导致列表页无法正常工作    |
|   列表页使用 TanStack Query Hook 的标准模式   | [CRITICAL]  |    标准模式是数据获取的核心架构    |
|               搜索功能固定写法                | [CRITICAL]  |       搜索是列表页的核心功能       |
|               分页功能固定写法                | [IMPORTANT] |       影响用户体验和数据加载       |
|        Loading 状态必须使用 isFetching        | [IMPORTANT] |        影响加载状态的准确性        |
|  表格配置必须使用 Hook 返回的 pureTableProps  | [IMPORTANT] |       简化配置，减少重复代码       |

---

## 快速导航

**完整迁移指南**: 请查看 [migration-guide.md](../migration-guide.md#step-4-创建前端-api-hook-10分钟)

**代码范例**:

- ✅ **正确范例**: [配置中心 API Hook](../../../../apps/admin/src/api/dev-team/config-manage/center/index.ts)
- ❌ **错误反面例子**: [缴费审核 API Hook](../../../../apps/admin/src/api/property-manage/expense-manage/payment-review/index.ts)

## ⚠️ 重要警告：严格禁止向后兼容的中文类型

**在实施数据获取相关任务时，严格禁止创建任何向后兼容的中文类型或中文变量别名**：

❌ **错误示例（严格禁止）**：

```typescript
// 不允许创建中文类型别名
export type 巡检方式 = PatrolMethodType;
export type 任务状态 = TaskStatusType;

// 不允许创建中文变量别名
export const 费用类型 = contractTypeOptions;
export const 状态选项 = statusOptions;
```

✅ **正确做法**：

- 直接使用纯英文的业务类型：`PatrolMethodType`、`TaskStatusType` 等
- 直接使用纯英文的变量名：`contractTypeOptions`、`statusOptions` 等
- 不需要任何中文类型的兼容层
- 如果其他文件使用了中文类型，应该直接修改那些文件使用英文类型

---

## ADDED Requirements

### Requirement: 业务专用查询 Hook 必须提供 initialParams 参数 [CRITICAL]

每个列表页 MUST 提供专用的 TanStack Query Hook，并且 MUST 提供 `initialParams` 必填参数:

- 文件位置: `src/api/{module}/{page}/index.ts`
- 导出命名: `use{Page}ListQuery`
- 调用 useListQuery 通用模板
- 配置正确的 apiUrl 和 queryKeyPrefix
- **CRITICAL**: 必须提供 `initialParams` 参数

#### Scenario: 正确的 Hook 实现

- **GIVEN** 页面路径 `src/pages/dev-team/config-manage/center/index.vue`
- **WHEN** 创建查询 Hook
- **THEN** 文件路径为 `src/api/dev-team/config-manage/center/index.ts`
- **AND** 代码必须包含 `initialParams` 参数

#### Scenario: 错误的 Hook 实现 - 缺少 initialParams

- **GIVEN** 业务专用查询 Hook
- **WHEN** 函数签名缺少 `initialParams` 参数
- **THEN** 无法从列表页传递初始查询参数
- **AND** 破坏了 Hook 的封装性

---

### Requirement: API Hook 返回固定的变量和函数 [CRITICAL]

业务专用的 API Hook **MUST** 返回以下固定的变量和函数,不允许返回其他内容:

- `tableData` - 表格数据
- `pureTableProps` - 表格配置对象(包含 data、pagination 等)
- `isFetching` - loading 状态
- `updateParams` - 更新查询参数并触发查询
- `resetParams` - 重置查询参数为初始值
- `doFetch` - 手动触发刷新
- `handlePageSizeChange` - 每页大小变化处理函数
- `handleCurrentPageChange` - 页码变化处理函数

#### Scenario: 列表页使用 Hook

- **GIVEN** 列表页 setup 函数
- **WHEN** 调用业务 API Hook
- **THEN** 代码为:

```typescript
/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useConfigCenterListQuery(plusSearchDefaultValues);
```

- **AND** 只允许导出这 8 个变量/函数
- **AND** 不允许导出 `pageIndex`、`pageSize`、`total` 等手动管理的变量

---

### Requirement: 列表页使用 TanStack Query Hook 的标准模式 [CRITICAL]

列表页 MUST 使用以下标准模式调用 API Hook:

1. 定义 `plusSearchModelRef` 并初始化所有搜索字段
2. 使用 `structuredClone` 创建 `plusSearchDefaultValues`
3. 将 `plusSearchDefaultValues` 传递给 API Hook
4. 使用 Hook 返回的所有变量和函数

#### Scenario: 列表页标准集成模式

- **GIVEN** 列表页 setup 函数
- **WHEN** 集成 TanStack Query
- **THEN** 代码结构为:

```typescript
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";
import type { ConfigCenterQueryParams } from "@01s-11comm/type";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
	status: "",
	configKey: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useConfigCenterListQuery(plusSearchDefaultValues);
```

- **AND** 必须使用 `structuredClone` 而不是 `cloneDeep`
- **AND** 必须传递 `plusSearchDefaultValues` 给 Hook

---

### Requirement: 搜索功能固定写法 [CRITICAL]

列表页的搜索功能 MUST 使用以下固定写法:

- `handleReSearch`: 重置搜索条件并重新加载数据
- `handleSearch`: 执行搜索

#### Scenario: 搜索函数标准实现

- **GIVEN** 列表页需要实现搜索功能
- **WHEN** 编写搜索函数
- **THEN** 代码为:

```typescript
/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
```

- **AND** 这是固定的代码写法,不允许更改
- **AND** 必须使用 `structuredClone` 而不是 `cloneDeep`
- **AND** 必须调用 `resetParams()` 和 `updateParams()`

---

### Requirement: 分页功能固定写法 [IMPORTANT]

列表页的分页功能 MUST 使用 Hook 返回的固定函数:

- `handlePageSizeChange`: 每页大小变化处理
- `handleCurrentPageChange`: 页码变化处理

#### Scenario: 分页事件绑定

- **GIVEN** PureTable 组件
- **WHEN** 绑定分页事件
- **THEN** 代码为:

```vue
<template>
	<PureTable
		:="pureTableProps"
		:columns="dynamicColumns"
		:size="size"
		:loading="isFetching"
		@page-size-change="handlePageSizeChange"
		@page-current-change="handleCurrentPageChange"
	>
	</PureTable>
</template>
```

- **AND** 必须使用 Hook 返回的函数
- **AND** 不允许手动实现分页逻辑

---

### Requirement: Loading 状态必须使用 isFetching [IMPORTANT]

列表页 MUST 使用 `isFetching` 显示加载状态:

- 表格 loading 属性绑定 `isFetching`
- 不允许使用 `isLoading`
- 不允许手动管理 loading.value

#### Scenario: 正确的 loading 绑定

- **GIVEN** PureTable 组件
- **WHEN** 绑定 loading 属性
- **THEN** 代码为:

```vue
<template>
	<PureTable :loading="isFetching" />
</template>
```

- **AND** 使用 `isFetching` 而不是 `isLoading`

---

### Requirement: 表格配置必须使用 Hook 返回的 pureTableProps [IMPORTANT]

列表页 MUST 直接使用 Hook 返回的 `pureTableProps`,不允许手动定义:

- 直接使用 `pureTableProps` 绑定到 PureTable
- 不允许手动定义 pureTableProps ref
- 不允许手动定义 pagination 计算属性

#### Scenario: 正确的表格配置

- **GIVEN** PureTable 组件
- **WHEN** 配置表格属性
- **THEN** 代码为:

```vue
<script setup lang="ts">
const { pureTableProps, isFetching } = useConfigCenterListQuery(plusSearchDefaultValues);
</script>

<template>
	<PureTable :="pureTableProps" :columns="dynamicColumns" :size="size" :loading="isFetching"> </PureTable>
</template>
```

- **AND** 直接使用 `:="pureTableProps"` 展开所有属性

---

## 总结

### 必须遵守的 5 个核心规则

1. **必须提供 initialParams 参数**: API Hook 必须接收初始参数
2. **使用 Hook 返回的全部内容**: 不允许手动管理分页、loading 等
3. **固定写法的搜索函数**: handleReSearch 和 handleSearch 必须使用标准模式
4. **使用 isFetching**: 不是 isLoading
5. **直接使用 pureTableProps**: 不手动定义

### 快速检查清单

创建 API Hook 后,验证以下要点:

- [ ] API Hook 提供 `initialParams` 必填参数
- [ ] 参数类型为 `Partial<{Page}QueryParams>`
- [ ] **严格禁止：未创建任何中文类型别名**（如 `export type 巡检方式 = PatrolMethodType;`）
- [ ] **严格禁止：未创建任何中文变量别名**（如 `export const 费用类型 = contractTypeOptions;`）
- [ ] 列表页传递 `plusSearchDefaultValues` 给 Hook
- [ ] 使用 `handleReSearch` 和 `handleSearch` 固定写法
- [ ] 使用 `handlePageSizeChange` 和 `handleCurrentPageChange`
- [ ] 使用 `isFetching` 绑定 loading
- [ ] 直接使用 `pureTableProps` 不手动定义
- [ ] 删除所有 test-data.ts 导入和 loadTableData 函数

### 完整示例代码

完整的标准模板和详细说明,请参考 [migration-guide.md](../migration-guide.md#step-4-创建前端-api-hook-10分钟)。
