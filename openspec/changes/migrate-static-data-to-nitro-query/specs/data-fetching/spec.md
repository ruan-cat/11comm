# 数据获取规范 (TanStack Query)

## 快速导航

**完整迁移指南**: 请查看 [migration-guide.md](../migration-guide.md#step-4-创建前端-api-hook-10分钟)

**代码范例**:

- ✅ **正确范例**: [配置中心 API Hook](../../../../apps/admin/src/api/dev-team/config-manage/center/index.ts)
- ❌ **错误反面例子**: [缴费审核 API Hook](../../../../apps/admin/src/api/property-manage/expense-manage/payment-review/index.ts)

---

## ADDED Requirements

### Requirement: 业务专用查询 Hook 必须提供 initialParams 参数

每个列表页 MUST 提供专用的 TanStack Query Hook,并且 **MUST** 提供 `initialParams` 必填参数:

- 文件位置: `src/api/{module}/{page}/index.ts`
- 导出命名: `use{Page}ListQuery`
- 调用 useListQuery 通用模板
- 配置正确的 apiUrl 和 queryKeyPrefix
- **CRITICAL**: 必须提供 `initialParams` 参数

#### Scenario: 正确的 Hook 实现

- **GIVEN** 页面路径 `src/pages/dev-team/config-manage/center/index.vue`
- **WHEN** 创建查询 Hook
- **THEN** 文件路径为 `src/api/dev-team/config-manage/center/index.ts`
- **AND** 代码为:

```typescript
/**
 * @file 配置中心 API Hook
 * @description Configuration center API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/dev-team/config-manage/center/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "configCenter";

/**
 * 配置中心列表查询 Hook
 * Configuration center list query hook
 */
export function useConfigCenterListQuery(initialParams: Partial<ConfigCenterQueryParams>) {
	return useListQuery<ConfigCenterListItem, ConfigCenterQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams, // ✅ 必须传递
	});
}

export default useConfigCenterListQuery;
```

- **AND** 函数名使用 PascalCase + List + Query 后缀
- **AND** 必须提供 `initialParams` 参数
- **AND** 参数类型为 `Partial<{Page}QueryParams>`

#### Scenario: 错误的 Hook 实现 - 缺少 initialParams

**❌ 错误示例 - 缴费审核 API Hook**:

```typescript
// ❌ 错误: 缺少 initialParams 必填参数
export function usePaymentReviewListQuery() {
	return useListQuery<PaymentReviewListItem, PaymentReviewQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		// ❌ 缺少 initialParams
	});
}
```

**问题分析**:

1. 无法从列表页传递初始查询参数
2. 导致列表页需要手动管理查询参数
3. 破坏了 Hook 的封装性

---

### Requirement: API Hook 返回固定的变量和函数

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

#### Scenario: 禁止手动管理分页变量

**❌ 错误示例 - 手动管理分页**:

```typescript
// ❌ 错误: 导出手动管理的变量
const { tableData, total, pageIndex, pageSize, isLoading, queryParams } = usePaymentReviewListQuery();

// ❌ 错误: 手动定义 pagination
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));
```

**问题分析**:

1. 破坏了 Hook 的封装性
2. 需要手动定义 pagination 和 pureTableProps
3. 增加维护成本

---

### Requirement: 列表页使用 TanStack Query Hook 的标准模式

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

### Requirement: 搜索功能固定写法

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

#### Scenario: 禁止手动调用 loadTableData

**❌ 错误示例 - 手动加载数据**:

```typescript
// ❌ 错误: 调用手动定义的 loadTableData
function handleSearch() {
	await loadTableData();
}
```

**问题分析**:

1. 违反了 TanStack Query 的自动查询机制
2. 需要手动管理 loading 状态
3. 无法利用缓存和自动重试

---

### Requirement: 分页功能固定写法

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

#### Scenario: 禁止手动实现分页函数

**❌ 错误示例 - 手动分页**:

```typescript
// ❌ 错误: 手动实现分页函数
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}
```

**问题分析**:

1. 破坏了 Hook 的封装性
2. 需要手动管理 pageIndex 和 pageSize
3. 无法自动触发查询

---

### Requirement: Loading 状态必须使用 isFetching

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

#### Scenario: 禁止手动管理 loading

**❌ 错误示例 - 手动 loading**:

```typescript
// ❌ 错误: 手动管理 loading
const loading = ref(false);

async function loadTableData() {
	loading.value = true;
	try {
		// 加载数据
	} finally {
		loading.value = false;
	}
}
```

```vue
<!-- ❌ 错误: 使用手动 loading -->
<template>
	<PureTable :loading="loading" />
</template>
```

---

### Requirement: 表格配置必须使用 Hook 返回的 pureTableProps

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

#### Scenario: 禁止手动定义 pureTableProps

**❌ 错误示例 - 手动定义**:

```typescript
// ❌ 错误: 手动定义 pagination
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

// ❌ 错误: 手动定义 pureTableProps
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
});
```

---

## REMOVED Requirements

### Requirement: 本地假数据导入和 loadTableData 函数

**Reason**: 数据获取迁移到 Nitro 接口和 TanStack Query

**Migration**: 使用 TanStack Query Hook 替代

完成迁移后必须删除以下代码:

```typescript
// ❌ 删除1: test-data.ts 导入
import { tableData as allTableData } from "./test-data";

// ❌ 删除2: loadTableData 函数
async function loadTableData() {
	let filteredData = [...allTableData];
	// 筛选逻辑
	tableData.value = filteredData.slice(startIndex, endIndex);
	pagination.value.total = filteredData.length;
}

// ❌ 删除3: onMounted 中调用 loadTableData
onMounted(async () => {
	await loadTableData();
});
```

### Requirement: 手动定义 pagination 和 pureTableProps

**Reason**: Hook 已自动提供这些配置

**Migration**: 直接使用 Hook 返回的 `pureTableProps`

### Requirement: 手动实现分页函数

**Reason**: Hook 已提供 handlePageSizeChange 和 handleCurrentPageChange

**Migration**: 使用 Hook 返回的函数

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
- [ ] 列表页传递 `plusSearchDefaultValues` 给 Hook
- [ ] 使用 `handleReSearch` 和 `handleSearch` 固定写法
- [ ] 使用 `handlePageSizeChange` 和 `handleCurrentPageChange`
- [ ] 使用 `isFetching` 绑定 loading
- [ ] 直接使用 `pureTableProps` 不手动定义
- [ ] 删除所有 test-data.ts 导入和 loadTableData 函数

### 完整示例代码

完整的标准模板和详细说明,请参考 [migration-guide.md](../migration-guide.md#step-4-创建前端-api-hook-10分钟)。
