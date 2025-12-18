## MODIFIED Requirements

## 实施顺序说明

**CRITICAL**: 在实施列表页改造相关任务时，必须严格按照以下顺序执行，不允许跳步。

### 执行顺序

1. **Step 1**: 列表页数据获取模式（导入类型和 Hook）
2. **Step 2**: 搜索表单集成（搜索功能改造）
3. **Step 3**: 分页组件集成（分页功能改造）
4. **Step 4**: 表格 Loading 状态（Loading 状态集成）
5. **Step 5**: 错误状态处理（错误处理集成）
6. **Step 6**: 初始化加载（初始化逻辑）
7. **Step 7**: 响应式参数管理（参数管理优化）
8. **Step 8**: 代码组织和注释（代码规范）
9. **Step 9**: 类型安全的查询参数（类型安全保障）
10. **Step 10**: Options 常量使用（使用类型库 Options）
11. **Step 11**: 删除 test-data.ts 文件（清理旧文件）
12. **Step 12**: 删除 loadTableData 函数（清理旧代码）
13. **Step 13**: 删除手动 loading 状态管理（清理旧逻辑）
14. **Step 14**: 删除列表页本地数据源（最终清理）

### 步骤依赖关系

- Step 1 是核心改造，必须最先完成
- Step 2-5 是功能集成步骤，依赖 Step 1 的 Hook 基础
- Step 6-7 是优化步骤，确保功能完整
- Step 8-10 是代码质量步骤，规范代码和类型
- Step 11-14 是清理步骤，删除所有旧代码，必须在前面步骤完成后执行

### 验收标准

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: 列表页数据获取模式 (Step 1)

**FROM**: 本地假数据 + loadTableData 函数
**TO**: Nitro 接口 + TanStack Query Hooks

列表页 MUST 遵循新的数据获取模式：

1. 导入类型和查询 Hook
2. 定义响应式 queryParams
3. 调用 use{Page}ListQuery Hook
4. 监听 data 变化更新 tableData
5. 搜索/分页通过修改 queryParams 实现
6. 使用 isLoading 控制 loading 状态

#### Scenario: 完整列表页结构

- **GIVEN** 新建或迁移列表页
- **WHEN** 编写 setup 函数
- **THEN** 代码结构为：

```vue
<script setup lang="ts">
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";
import { type ConfigCenterListItem, type ConfigCenterQueryParams } from "@01s-11comm/type";

// 1. 表格搜索栏 其类型约束为 `@01s-11comm/type` 导入的业务类型
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

// 2. 固定的表格搜索栏配置
/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);
/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 表格搜索栏具体的配置
]);
/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

// 3. 使用 TanStack Query hooks
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

// 5. 搜索函数
/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}
/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
</script>

<template>
	<PlusSearch v-model="plusSearchModel" @search="handleSearch" @reset="handleReset" />
	<PureTableBar @refresh="doFetch">
		<template #default="{ size, dynamicColumns }">
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
					<!-- 表格搜索栏按钮 -->
				</template>
			</PureTable>
		</template>
	</PureTableBar>
</template>
```

#### Scenario: 删除的旧代码

- **GIVEN** 原列表页包含以下代码
- **WHEN** 迁移完成
- **THEN** 以下代码均已删除：

```typescript
// ❌ 删除
import { tableData as allTableData } from "./test-data";

// ❌ 删除
async function loadTableData() {
	let filteredData = [...allTableData];
	// 筛选逻辑...
	tableData.value = filteredData.slice(startIndex, endIndex);
	pagination.value.total = filteredData.length;
}

// ❌ 删除掉具体的 `分页配置`
/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

// ❌ 删除掉具体的 `表格配置对象` 因为该配置现在从 hooks 内导出
/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
});

// ❌ 删除掉具体的 handlePageSizeChange 函数
/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

// ❌ 删除掉具体的 handleCurrentPageChange 函数
/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

// ❌ 删除（onMounted 中调用 loadTableData）
onMounted(async () => {
	await loadTableData();
});
```

---

### Requirement: 搜索表单集成 (Step 2)

**FROM**: handleSearch 调用 loadTableData
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

#### Scenario: PlusSearch 组件配置

- **GIVEN** 列表页包含搜索表单
- **WHEN** 配置 PlusSearch 组件
- **THEN** 代码为：

```vue
<template>
	<PlusSearch v-model="plusSearchModel" :columns="plusSearchColumns" @search="handleSearch" @reset="handleReset" />
</template>

<script setup lang="ts">
import type { PlusColumn } from "plus-pro-components";
import { expenseTypeOptions, statusOptions } from "@01s-11comm/type";

const plusSearchModel = ref({});

const plusSearchColumns: PlusColumn[] = [
	{
		label: "费用类型",
		prop: "expenseType",
		valueType: "select",
		options: expenseTypeOptions,
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: statusOptions,
	},
];
</script>
```

#### Scenario: handleSearch 实现

- **GIVEN** 用户填写搜索条件
- **WHEN** 点击搜索按钮
- **THEN** 执行 `handleSearch` 函数。使用固定写法的 `handleSearch`。

如果遇到不满足固定写法的 `handleSearch` 函数，请无条件的改写替换。

#### Scenario: handleReset 实现

- **GIVEN** 用户点击重置按钮
- **WHEN** handleReset 执行
- **THEN** 执行 `handleReset` 函数。使用固定写法的 `handleReset`。

如果遇到不满足固定写法的 `handleReset` 函数，请无条件的改写替换。

---

### Requirement: 分页组件集成 (Step 3)

**FROM**: handleCurrentPageChange 调用 loadTableData
**TO**: 使用业务 api hooks 暴露出来的 `handlePageSizeChange` 和 `handleCurrentPageChange` 函数完成内置的搜索功能。

分页 MUST 通过使用固定的 `handlePageSizeChange` 和 `handleCurrentPageChange` 实现：

- `handleCurrentPageChange` 更新 pageIndex
- `handlePageSizeChange` 更新 pageSize
- 自动触发查询

#### Scenario: 分页事件处理

- **GIVEN** 用户切换页码或每页大小
- **WHEN** 事件触发
- **THEN** 使用 api hooks 固定返回的函数。

```vue
<script lang="ts" setup>
/** 使用 TanStack Query 获取数据 */
const { isFetching, handlePageSizeChange, handleCurrentPageChange } = useConfigCenterListQuery(plusSearchDefaultValues);
</script>

<template>
	<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
	<PureTable
		:columns="dynamicColumns"
		:size="size"
		:loading="isFetching"
		@page-size-change="handlePageSizeChange"
		@page-current-change="handleCurrentPageChange"
	>
		<template #operation="{ row }">
			<!-- 操作栏按钮 -->
		</template>
	</PureTable>
</template>
```

---

### Requirement: 表格 Loading 状态 (Step 4)

**FROM**: 手动控制 loading.value
**TO**: 直接使用 `isFetching`

表格 MUST 使用 TanStack Query 的 `isFetching` 状态：

- PureTable 的 loading 属性绑定 isLoading
- 不需要手动设置 loading = true/false
- 自动跟踪请求生命周期

#### Scenario: loading 绑定

- **GIVEN** PureTable 组件
- **WHEN** 配置 loading 属性
- **THEN** 代码为：

```vue
<PureTable :loading="isFetching" />
```

- **WHEN** 查询进行中
- **THEN** isLoading = true，表格显示 loading 遮罩
- **WHEN** 查询完成
- **THEN** isLoading = false，loading 遮罩消失

#### Scenario: 删除手动 loading 控制

- **GIVEN** 原代码包含：

```typescript
// ❌ 删除
const loading = ref(false);

async function loadTableData() {
	loading.value = true; // ❌ 删除
	try {
		// 数据加载逻辑
	} finally {
		loading.value = false; // ❌ 删除
	}
}
```

- **WHEN** 迁移完成
- **THEN** 删除 loading ref 和手动控制代码

---

### Requirement: 响应式参数管理 (Step 7)

queryParams MUST 作为响应式对象管理：

- 使用 ref 包裹
- 修改通过 .value 访问
- 包含所有搜索条件和分页参数
- 类型为业务专用的 QueryParams 接口

#### Scenario: updateParams 使用

- **GIVEN** 列表页 setup
- **WHEN** 定义 plusSearchDefaultValues 并传递给 api hooks 即可
- **THEN** 代码为：

```typescript
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
/** 使用 TanStack Query 获取数据 */
const { updateParams } = useConfigCenterListQuery(plusSearchDefaultValues);
```

---

### Requirement: 代码组织和注释 (Step 8)

列表页代码 MUST 遵循统一的组织结构：

1. 类型导入
2. 搜索表单配置
3. 查询参数
4. TanStack Query Hook
5. 表格数据
6. 事件处理函数

#### Scenario: 代码结构模板

- **GIVEN** 新建或迁移列表页
- **WHEN** 组织代码
- **THEN** 按以下顺序编写：

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

#### Scenario: JSDoc 注释规范

- **GIVEN** 关键函数和变量
- **WHEN** 添加注释
- **THEN** 使用 JSDoc 格式：

```typescript
/** 搜索函数 Search function */
async function handleSearch() {
	// ...
}
```

---

## ADDED Requirements

### Requirement: 类型安全的查询参数 (Step 9)

列表页 MUST 使用业务专用的 QueryParams 类型：

- 从 `@01s-11comm/type` 导入
- ref 泛型参数指定类型
- TypeScript 编译时检查参数有效性

#### Scenario: 类型导入

- **GIVEN** 列表页需要定义查询参数
- **WHEN** 导入类型
- **THEN** 代码为：

```typescript
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";
```

#### Scenario: 类型约束

- **GIVEN** queryParams 使用 HouseChargeQueryParams 类型
- **WHEN** 赋值错误的字段名
- **THEN** TypeScript 编译器报错
- **AND** IDE 提供类型提示和自动补全

#### Scenario: 类型推导

- **GIVEN** const { data } = useHouseChargeListQuery(queryParams)
- **WHEN** 访问 data.value?.data.list
- **THEN** TypeScript 推导 list 类型为 HouseChargeListItem[]
- **AND** 访问 list[0].expenseItem 有类型提示

---

### Requirement: Options 常量使用 (Step 10)

搜索表单 MUST 使用从类型库导出的 Options 常量：

- 从 @01s-11comm/type 导入 Options
- 配置到 PlusSearch columns
- 保持与 Nitro 接口筛选逻辑一致

#### Scenario: Options 导入

- **GIVEN** 搜索表单需要下拉选择
- **WHEN** 导入 Options 常量
- **THEN** 代码为：

```typescript
import { expenseTypeOptions, statusOptions } from "@01s-11comm/type";
```

#### Scenario: PlusSearch 配置

- **GIVEN** plusSearchColumns 定义
- **WHEN** 配置 select 类型字段
- **THEN** 代码为：

```typescript
const plusSearchColumns: PlusColumn[] = [
	{
		label: "费用类型",
		prop: "expenseType",
		valueType: "select",
		options: expenseTypeOptions, // 使用导入的 Options
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: statusOptions,
	},
];
```

---

## REMOVED Requirements

### Requirement: test-data.ts 文件存在 (Step 11)

**Reason**: 假数据迁移到 `server/api/*/mock-data.ts`

**Migration**: 删除所有 `src/pages/*/test-data.ts` 文件

#### Scenario: 文件删除

- **GIVEN** 原文件 `src/pages/property-manage/expense-manage/house-charge/test-data.ts`
- **WHEN** 迁移完成
- **THEN** 文件已删除
- **AND** 无任何导入引用该文件

---

### Requirement: loadTableData 函数 (Step 12)

**Reason**: 数据获取迁移到 Nitro 接口和 TanStack Query

**Migration**: 使用 TanStack Query Hook 替代

#### Scenario: 函数删除

- **GIVEN** 原代码包含 loadTableData 函数
- **WHEN** 迁移完成
- **THEN** loadTableData 函数已删除
- **AND** 所有调用处（handleSearch, handleCurrentPageChange 等）已更新

---

### Requirement: 手动 loading 状态管理 (Step 13)

**Reason**: TanStack Query 自动提供 isLoading

**Migration**: 使用 isLoading 替代手动 loading.value

#### Scenario: loading ref 删除

- **GIVEN** 原代码 const loading = ref(false)
- **WHEN** 迁移完成
- **THEN** loading ref 已删除
- **AND** PureTable :loading 绑定到 isLoading

---

## RENAMED Requirements

### Requirement: 列表页数据源 (Step 14)

- **FROM**: `### Requirement: 本地假数据导入`
- **TO**: `### Requirement: Nitro 接口数据获取`

**Reason**: 数据源从本地文件切换为服务端接口
