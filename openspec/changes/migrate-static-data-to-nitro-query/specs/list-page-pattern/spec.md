# 列表页改造规范

## 快速导航

**完整迁移指南**: 请查看 [migration-guide.md](../migration-guide.md#step-5-改写列表页-30分钟)

**代码范例**:

- ✅ **正确范例**: [配置中心列表页](../../../../apps/admin/src/pages/dev-team/config-manage/center/index.vue)
- ❌ **错误反面例子**: [缴费审核列表页](../../../../apps/admin/src/pages/property-manage/expense-manage/payment-review/index.vue)

---

## MODIFIED Requirements

### Requirement: 列表页数据获取模式

**FROM**: 本地假数据 + loadTableData 函数
**TO**: Nitro 接口 + TanStack Query Hooks

列表页 MUST 遵循新的数据获取模式:

1. 导入类型和查询 Hook
2. 定义响应式 plusSearchModelRef 和 plusSearchDefaultValues
3. 调用 use{Page}ListQuery Hook 并传递 plusSearchDefaultValues
4. 使用 Hook 返回的所有变量和函数
5. 搜索/分页通过 updateParams 实现
6. 使用 isFetching 控制 loading 状态

#### Scenario: 完整列表页结构

- **GIVEN** 新建或迁移列表页
- **WHEN** 编写 setup 函数
- **THEN** 代码结构为:

```vue
<script setup lang="ts">
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";
import {
	type ConfigCenterListItem,
	type ConfigCenterQueryParams,
	configTypeOptions,
	configStatusOptions,
} from "@01s-11comm/type";

// 1. 表格搜索栏
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

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "配置项名称",
		prop: "configName",
		valueType: "input",
	},
	// ... 更多搜索字段
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

// 2. 使用 TanStack Query hooks
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

// 3. 搜索函数(固定写法)
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
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
						<!-- 操作按钮 -->
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>
```

#### Scenario: 删除的旧代码

迁移完成后,必须删除以下所有代码:

```typescript
// ❌ 删除1: test-data.ts 导入
import { tableData as allTableData } from "./test-data";

// ❌ 删除2: loadTableData 函数
async function loadTableData() {
	let filteredData = [...allTableData];
	// 筛选逻辑...
	tableData.value = filteredData.slice(startIndex, endIndex);
	pagination.value.total = filteredData.length;
}

// ❌ 删除3: 手动 pagination 定义
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

// ❌ 删除4: 手动 pureTableProps 定义
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
});

// ❌ 删除5: 手动分页函数
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

// ❌ 删除6: onMounted 中调用 loadTableData
onMounted(async () => {
	await loadTableData();
});
```

---

### Requirement: 搜索表单集成

**FROM**: handleSearch 调用 loadTableData
**TO**: 使用业务 api hooks 暴露出来的 `handleReSearch` 和 `handleSearch` 函数

搜索功能 MUST 使用以下**固定写法**:

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

这是**固定的**代码写法,凡是在列表页遇到 `handleReSearch` 和 `handleSearch` 函数时,就直接重写成上面的固定代码写法格式。不允许更改代码写法。

#### Scenario: PlusSearch 组件配置

```vue
<template>
	<PlusSearch
		v-model="plusSearchModel"
		:="plusSearchProps"
		:columns="plusSearchColumns"
		@search="handleSearch"
		@reset="handleReSearch"
	/>
</template>
```

---

### Requirement: 分页组件集成

**FROM**: handleCurrentPageChange 调用 loadTableData
**TO**: 使用业务 api hooks 暴露出来的 `handlePageSizeChange` 和 `handleCurrentPageChange` 函数

分页 MUST 通过使用固定的 `handlePageSizeChange` 和 `handleCurrentPageChange` 实现:

#### Scenario: 分页事件处理

```vue
<script setup lang="ts">
const { isFetching, handlePageSizeChange, handleCurrentPageChange } = useConfigCenterListQuery(plusSearchDefaultValues);
</script>

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

---

### Requirement: 表格 Loading 状态

**FROM**: 手动控制 loading.value
**TO**: 直接使用 `isFetching`

表格 MUST 使用 TanStack Query 的 `isFetching` 状态:

#### Scenario: 正确绑定 isFetching

- **GIVEN** PureTable 组件
- **WHEN** 绑定 loading 属性
- **THEN** 使用 `isFetching`:

```vue
<PureTable :loading="isFetching" />
```

- **AND** 不使用 `isLoading` 或手动 loading.value

---

### Requirement: Options 常量使用

搜索表单 MUST 使用从类型库导出的 Options 常量:

#### Scenario: 使用类型库的 Options

- **GIVEN** 搜索表单需要下拉选择
- **WHEN** 配置 select 类型字段
- **THEN** 从类型库导入 Options:

```typescript
import { expenseTypeOptions, statusOptions } from "@01s-11comm/type";

const plusSearchColumns: PlusColumn[] = [
	{
		label: "费用类型",
		prop: "expenseType",
		valueType: "select",
		options: expenseTypeOptions, // ✅ 使用导入的 Options
	},
];
```

- **AND** 不手动定义 options 数组

---

## REMOVED Requirements

### Requirement: test-data.ts 文件存在

**Reason**: 假数据迁移到 `server/api/*/mock-data.ts`

**Migration**: 删除所有 `src/pages/*/test-data.ts` 文件

### Requirement: loadTableData 函数

**Reason**: 数据获取迁移到 Nitro 接口和 TanStack Query

**Migration**: 使用 TanStack Query Hook 替代

### Requirement: 手动 loading 状态管理

**Reason**: TanStack Query 自动提供 isFetching

**Migration**: 使用 isFetching 替代手动 loading.value

---

## 总结

### 必须遵守的核心规则

1. **使用 Hook 传递初始参数**: 传递 `plusSearchDefaultValues`
2. **使用固定写法的搜索函数**: `handleReSearch` 和 `handleSearch`
3. **使用 Hook 返回的分页函数**: `handlePageSizeChange` 和 `handleCurrentPageChange`
4. **使用 isFetching**: 不是 isLoading
5. **直接使用 pureTableProps**: 不手动定义
6. **删除所有旧代码**: test-data.ts、loadTableData、手动 pagination 等

### 快速检查清单

- [ ] 使用 `plusSearchDefaultValues` 作为初始值传给 Hook
- [ ] 使用 `handleReSearch` 和 `handleSearch` 固定写法
- [ ] 使用 `handlePageSizeChange` 和 `handleCurrentPageChange` 固定写法
- [ ] 直接使用 `pureTableProps` 从 Hook 导出
- [ ] 使用 `isFetching` 绑定 loading
- [ ] 删除所有手动定义的 pagination、pureTableProps、分页函数
- [ ] 删除 test-data.ts 导入和 loadTableData 函数
- [ ] 删除 onMounted 中的 loadTableData 调用

### 完整示例代码

完整的标准模板和详细说明,请参考 [migration-guide.md](../migration-guide.md#step-5-改写列表页-30分钟)。
