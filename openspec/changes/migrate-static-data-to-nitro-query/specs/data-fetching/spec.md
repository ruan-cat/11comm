## ADDED Requirements

## 实施顺序说明

**CRITICAL**: 在实施数据获取相关任务时，必须严格按照以下顺序执行，不允许跳步。

### 执行顺序

1. **Step 1**: TanStack Query 安装和配置（前置条件）
2. **Step 2**: 通用列表查询 Hook (useListQuery)（基础设施）
3. **Step 3**: 业务专用查询 Hook（业务封装）
4. **Step 4**: 查询结果返回类型（类型定义）
5. **Step 5**: 查询自动触发条件（查询行为）
6. **Step 6**: 缓存策略（性能优化）
7. **Step 7**: 错误处理（异常处理）
8. **Step 8**: 列表页数据获取方式（页面集成）
9. **Step 9**: 搜索功能实现（搜索功能）
10. **Step 10**: 分页功能实现（分页功能）
11. **Step 11**: Loading 状态显示（用户体验）
12. **Step 12**: 本地假数据过滤逻辑移除（清理工作）

### 步骤依赖关系

- Step 1 是所有步骤的前置条件，必须最先完成
- Step 2-3 是 Hook 层的基础设施，必须在使用前完成
- Step 4-7 是 Hook 的配置和优化，在创建业务 Hook 时必须遵守
- Step 8-11 是列表页的改造步骤，依赖 Hook 层完成
- Step 12 是最终清理步骤，确保无旧代码残留

### 验收标准

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: 业务专用查询 Hook (Step 3)

每个列表页 MUST 提供专用的 TanStack Query Hook：

- 文件位置：`src/api/{module}/{page}/index.ts`
- 导出命名：`use{Page}ListQuery`
- 调用 useListQuery 通用模板
- 配置正确的 apiUrl 和 queryKeyPrefix

#### Scenario: Hook 文件位置

- **GIVEN** 页面路径 `src/pages/dev-team/config-manage/center/index.vue`
- **WHEN** 创建查询 Hook
- **THEN** 文件路径为 `src/api/dev-team/config-manage/center/index.ts`

#### Scenario: Hook 命名规范

- **GIVEN** 页面名称 配置中心 config-center
- **WHEN** 定义 Hook 函数
- **THEN** 函数名为 `useConfigCenterListQuery`
- **AND** 使用 PascalCase + List + Query 后缀

#### Scenario: Hook 实现

- **GIVEN** src/api/dev-team/config-manage/center/index.ts
- **WHEN** 编写 Hook 代码
- **THEN** 代码为：

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
		initialParams,
	});
}

export default useConfigCenterListQuery;
```

- **必须**从 `@01s-11comm/type` 类型库内导入业务类型。
- 封装的接口**必须**提供必填项 `initialParams` 参数。如果没有提供这个必填项参数，那就是错误的写法。
- `initialParams` 参数的类型约束必须是 `Partial<业务类型>` 。
- 在你检查业务专用的查询 hooks 时，必须确保 hooks 的编写格式，满足上述要求。不满足要求的写法就主动更改。

#### Scenario: apiUrl 路径正确

- **GIVEN** Nitro 接口 `server/api/dev-team/config-manage/center/list.post.ts`
- **WHEN** 配置 apiUrl
- **THEN** apiUrl = "/api/dev-team/config-manage/center/list"
- **AND** 路径与接口文件对应

---

## MODIFIED Requirements

### Requirement: 列表页使用 `TanStack Query Hook` 的数据获取方式 (Step 8)

**FROM**: 本地 import test-data.ts，使用 loadTableData 函数过滤
**TO**: 调用 TanStack Query Hook 获取服务端数据

列表页 MUST 使用 TanStack Query 获取数据：

- 删除 `import { tableData as allTableData } from "./test-data"`
- 删除 loadTableData 函数
- 使用 `const { data, isLoading, refetch } = use{Page}ListQuery(queryParams)`

#### Scenario: 删除旧代码

- **GIVEN** 原列表页代码 import { tableData as allTableData } from "./test-data"
- **WHEN** 迁移完成
- **THEN** 该导入语句已删除
- **AND** allTableData 变量不再存在

#### Scenario: 删除 loadTableData

- **GIVEN** 原代码包含：

```typescript
async function loadTableData() {
	let filteredData = [...allTableData];
	// 筛选逻辑
	tableData.value = filteredData.slice(startIndex, endIndex);
	pagination.value.total = filteredData.length;
}
```

- **WHEN** 迁移完成
- **THEN** loadTableData 函数已删除
- **AND** 筛选逻辑移至 Nitro 接口

#### Scenario: 使用 TanStack Query Hook

- **GIVEN** 列表页 setup 函数
- **WHEN** 编写数据获取代码
- **THEN** 示例代码为：

```typescript
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<查询字段业务类型> = {
	//... 列举出全部的字段 并赋初值
};
/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);
/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// ...具体的代码写法配置
]);
/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	// ...具体的代码写法配置
});

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

必须满足以下规范：

1. **必须**从对应的 api 目录内，导入封装好的 api hooks。
2. 封装好的 api hooks，其使用位置必须严格按照上面例子所示的位置所示。
3. 使用封装好的 api hooks 时，必须导入有效的初始值，值**必须**是 `plusSearchDefaultValues` 变量。
4. 不允许在 api hooks 内导出多余的内容，只允许导出以下变量和函数：
   - tableData
   - pureTableProps
   - isFetching
   - updateParams
   - resetParams
   - doFetch
   - handlePageSizeChange
   - handleCurrentPageChange
5. 如果发现现有 index.vue 列表页使用了错误的写法，请纠正写法。

---

### Requirement: 搜索功能实现 (Step 9)

**FROM**: 调用 loadTableData() 本地过滤
**TO**: 使用业务 api hooks 暴露出来的 `handleReSearch` 和 `handleSearch` 函数完成内置的搜索功能。

搜索功能 MUST 使用以下**固定写法**的 `handleReSearch` 和 `handleSearch` 函数：

具体代码写法为：

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

这是**固定的**代码写法，凡是在列表页遇到 `handleReSearch` 和 `handleSearch` 函数时，就直接重写成上面的固定代码写法格式。不允许更改代码写法。

---

### Requirement: 分页功能实现 (Step 10)

**FROM**: 手动切片 allTableData
**TO**: 使用业务 api hooks 暴露出来的 `handlePageSizeChange` 和 `handleCurrentPageChange` 函数完成内置的搜索功能。

分页 MUST 通过使用固定的 `handlePageSizeChange` 和 `handleCurrentPageChange` 实现：

- `handleCurrentPageChange` 更新 pageIndex
- `handlePageSizeChange` 更新 pageSize
- 自动触发查询

在 vue 组件内的代码用法如下：

```vue
<template>
	<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
	<PureTable
		:="pureTableProps"
		:columns="dynamicColumns"
		:size="size"
		:loading="isFetching"
		@page-size-change="handlePageSizeChange"
		@page-current-change="handleCurrentPageChange"
	>
		<template #operation="{ row }">
			<!-- ...操作栏按钮写法 -->
		</template>
	</PureTable>
</template>
```

- 必须在 `@page-size-change` 内使用 `handlePageSizeChange` 函数。
- 必须在 `@page-current-change` 内使用 `handleCurrentPageChange` 函数。
- 上述代码写法就是 `<PureTable>` 组件在 index.vue 列表页内固定的代码写法。当你遇到的列表页不满足该要求时，就强制更改更换成上面的写法。

#### Scenario: 页码切换

- **GIVEN** 当前 pageIndex = 1
- **WHEN** 用户点击第 2 页
- **THEN** handleCurrentPageChange(2) 执行：
- **AND** 自动发起请求（pageIndex = 2）

#### Scenario: 每页大小切换

- **GIVEN** 当前 pageSize = 10, pageIndex = 3
- **WHEN** 用户切换为 pageSize = 20
- **THEN** handlePageSizeChange(20) 执行：
- **AND** 自动发起请求

---

### Requirement: Loading 状态显示 (Step 11)

列表页 MUST 使用 `isFetching` 显示加载状态：

- 表格 loading 属性绑定 `isFetching`
- 防止重复请求

#### Scenario: 表格 loading

- **GIVEN** PureTable 组件
- **WHEN** 绑定 loading 属性
- **THEN** 代码为：

```vue
<template>
	<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
	<PureTable :loading="isFetching"> </PureTable>
</template>
```

- **WHEN** isLoading = true
- **THEN** 表格显示骨架屏或 loading 遮罩

---

## REMOVED Requirements

### Requirement: 本地假数据过滤逻辑 (Step 12)

**Reason**: 数据获取迁移到 Nitro 服务端，不再需要前端本地过滤

**Migration**: 使用 Nitro 接口的筛选功能替代

#### Scenario: 删除本地过滤

- **GIVEN** 原代码包含：

```typescript
let filteredData = [...allTableData];
if (searchForm.expenseType) {
	filteredData = filteredData.filter((item) => item.费用类型 === searchForm.expenseType);
}
```

- **WHEN** 迁移完成
- **THEN** 该代码已删除
- **AND** 筛选逻辑移至 server/api/.../list.post.ts
