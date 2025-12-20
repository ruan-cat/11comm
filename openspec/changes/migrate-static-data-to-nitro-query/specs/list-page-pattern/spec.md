# 列表页改造规范

## 快速导航

**完整迁移指南**: 请查看 [migration-guide.md](../migration-guide.md#step-5-改写列表页-30分钟)

**代码范例**:

- ✅ **正确范例**: [配置中心列表页](../../../../apps/admin/src/pages/dev-team/config-manage/center/index.vue)
- ❌ **错误反面例子**: [缴费审核列表页](../../../../apps/admin/src/pages/property-manage/expense-manage/payment-review/index.vue)

## ⚠️ 重要警告：严格禁止向后兼容的中文类型

**在实施列表页改造相关任务时，严格禁止创建任何向后兼容的中文类型或中文变量别名**：

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

## ⚠️ 列表页改造严格规范

**在实施列表页改造任务时，必须严格遵守以下规范，避免出现删改多余内容的情况**：

### Requirement: 无条件按照 fix-type-error 处理类型错误

在处理列表页的类型替换和变量替换时，MUST 严格按照 `.claude\agents\fix-type-error.md` 文档所述的要求来执行。

- 不要自己胡乱发挥，乱写代码
- 不要胡乱改变原有的类型
- 不要导入不存在的、冗余的、多余的全局类型

### Requirement: 不要删改破坏现有的弹框函数逻辑

每一个列表页都有这样的代码段。这些逻辑是列表页弹框逻辑必备的函数。**不允许删改**。这不是迁移改造任务的处理范围。

```typescript
const { modeText, setMode, isAdd } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}
```

### Requirement: 不要删掉弹框实例代码，只负责做类型替换

不要随便删掉弹框实例新建逻辑，只需要实现中文变量名替换、导入来自类型项目的业务类型即可。

❌ **错误示例（严格禁止）**：

```typescript
// 错误：删掉了原来该有的表单实例
import type { ParkingLotListItem } from "@01s-11comm/type";
```

✅ **正确做法**：

1. 去类型项目导入 `ParkingLotFormVO`，替代来自 `form.ts` 的 `停车场表单_VO` 中文类型
2. 把导入的中文变量名换成英文名：`停车场表单` -> `ParkingLotForm`
3. 把本地的表单实例中文变量名换成英文名：`停车场表单Instance` -> `ParkingLotFormInstance`

```typescript
import type { ParkingLotFormVO } from "@01s-11comm/type";
import { type ParkingLotFormProps, defaultForm } from "./components/form";
import ParkingLotForm from "./components/form.vue";
const ParkingLotFormInstance = ref<InstanceType<typeof ParkingLotForm> | null>(null);
```

### Requirement: 不要胡乱删改打开弹框组件的处理逻辑

在处理弹框组件已有的逻辑时，**只负责变量名替换和函数替换**：

- 变量名替换：`停车场表单对象` -> `parkingLotFormVO`
- 类型替换：`停车场表单_VO` -> `ParkingLotFormVO`
- 函数替换：`cloneDeep` -> `structuredClone`

❌ **错误示例（严格禁止）**：

```typescript
// 错误1: 删除掉表单对象的业务类型约束
// 错误2: 把 structuredClone(defaultForm) 改成了 structuredClone({})
// 错误3: 删除了 props 和 defaultValues 变量
const parkingLotFormVO = isAdd.value
	? structuredClone({})
	: structuredClone({
			...row,
			parkingLotType: row?.parkingLotType || "地面停车场",
			parkingSpaceType: row?.parkingSpaceType || "标准车位",
		});
```

✅ **正确做法**：

```typescript
/** 业务对象 */
const parkingLotFormVO: ParkingLotFormVO = isAdd.value
	? structuredClone(defaultForm)
	: structuredClone({
			...defaultForm,
			...row,
			parkingLotType: row?.parkingLotType || defaultForm.parkingLotType,
			parkingSpaceType: row?.parkingSpaceType || defaultForm.parkingSpaceType,
		});

/** 表单组件需要的props */
const props: ParkingLotFormProps = {
	form: parkingLotFormVO,
	defaultValues: parkingLotFormVO,
};
```

### Requirement: 不要胡乱删改 openDialog 按钮配置逻辑

只负责完成中文变量名和中文类型名的替换，不要删改本来就写好的代码逻辑。

❌ **错误示例（严格禁止）**：

```typescript
// 错误1: 删掉了 const formComputed 变量
// 错误2: 删掉了 useDoBeforeClose 函数调用逻辑
// 错误3: 删掉了重置按钮这整个配置对象
footerButtons: [
	{
		label: transformI18n($t("common.buttons.cancel")),
		type: "info",
		btnClick: async ({ dialog: { options, index }, button }) => {
			closeDialog(options, index);
		},
	},
	{
		label: transformI18n($t("common.buttons.submit")),
		type: "success",
		btnClick: async ({ dialog: { options, index }, button }) => {
			button.btn.loading = true;
			await testAsync();
			button.btn.loading = false;
			closeDialog(options, index);
		},
	},
];
```

✅ **正确做法**：

```typescript
// 只把中文变量名 停车场表单Instance 换成 ParkingLotFormInstance
footerButtons: [
	{
		label: transformI18n($t("common.buttons.cancel")),
		type: "info",
		btnClick: async ({ dialog: { options, index }, button }) => {
			const formComputed = ParkingLotFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
	},
	{
		label: transformI18n($t("common.buttons.reset")),
		type: "warning",
		btnClick: ({ dialog: { options, index }, button }) => {
			ParkingLotFormInstance.value?.plusFormInstance?.handleReset();
		},
	},
	{
		label: transformI18n($t("common.buttons.submit")),
		type: "success",
		btnClick: async ({ dialog: { options, index }, button }) => {
			const res = await ParkingLotFormInstance.value?.plusFormInstance?.handleSubmit();
			if (res) {
				button.btn.loading = true;
				await testAsync();
				button.btn.loading = false;
				closeDialog(options, index);
			}
		},
	},
];
```

### Requirement: 不要更改 definePage 宏的排布顺序

在每个列表页内，`definePage` 宏 MUST 排在最上面，不允许被修改位置。

❌ **错误示例（严格禁止）**：

```typescript
// 错误：把 definePage 宏放到 import 导入函数的下面
import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
// ... 其他 import

definePage({
	meta: {
		title: "菜单组",
		// ...
	},
});
```

✅ **正确做法**：

```typescript
// definePage 宏永远在 import 导入函数之上
definePage({
	meta: {
		title: "菜单组",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
// ... 其他 import
```

### Requirement: 表格列配置使用全局类型 TableColumnList

表格列配置 `columns` 数组的类型约束 MUST 使用全局类型 `TableColumnList`，不要换掉。

❌ **错误示例（严格禁止）**：

```typescript
// 错误：手动导入 TableColumns 类型，替换掉原来的全局类型
import type { TableColumns } from "@pureadmin/table";
const columns = ref<TableColumns[]>([
	// ...
]);
```

✅ **正确做法**：

```typescript
// TableColumnList 是全局类型，不需要导入
const columns = ref<TableColumnList>([
	// ...
]);
```

### Requirement: 保留全局类型约束 PureTableBarProps

在列表页内，不要删掉本来就写好的全局类型约束 `PureTableBarProps`，保持原样即可。

❌ **错误示例（严格禁止）**：

```typescript
// 错误：删掉了本来就写好的类型约束
const pureTableBarProps = ref({
	title: "菜单组",
	columns: columns.value,
});
```

✅ **正确做法**：

```typescript
// 保留原样，PureTableBarProps 是全局类型
const pureTableBarProps = ref<PureTableBarProps>({
	title: "菜单组",
	columns: columns.value,
});
```

### Requirement: 不要增加 getRouteRank 的导入

不要添油加醋的增加多余的全局导入 `getRouteRank`。这个函数是全局函数，不应该主动导入。

❌ **错误示例（严格禁止）**：

```typescript
// 错误：不应该导入这个全局函数
import { getRouteRank } from "@/router/rank/getRouteRank";
```

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
 * @important
 * 【必须使用 Partial 类型约束】类型定义必须为: FieldValues & Partial<{Page}QueryParams>
 * 【必须在 API Hook 之前声明】此变量必须在调用 use{Page}ListQuery 之前定义
 */
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
	status: "",
	configKey: "",
};

/**
 * 表格搜索栏 重置功能用的默认数据
 * @important
 * 【必须在 API Hook 之前声明】此变量必须在调用 use{Page}ListQuery 之前定义
 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/**
 * 表格搜索栏变量 双向绑定的变量 响应式数据
 * @important
 * 【必须在 API Hook 之前声明】此变量必须在调用 use{Page}ListQuery 之前定义
 */
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

### Requirement: 搜索表单变量声明顺序

**FROM**: 变量声明位置随意,可能在 API Hook 之后
**TO**: 严格按顺序在 API Hook 之前声明

搜索表单相关的三个核心变量 MUST 按以下顺序声明,且 MUST 在调用 API Hook 之前:

#### Scenario: 变量声明顺序规则

- **GIVEN** 列表页需要搜索功能
- **WHEN** 声明搜索表单变量
- **THEN** 必须按以下顺序声明:
  1. `plusSearchModelRef` - 原始搜索对象(带 Partial 类型约束)
  2. `plusSearchDefaultValues` - 默认值(用于重置)
  3. `plusSearchModel` - 响应式搜索模型
- **AND** 这三个变量必须在调用 `use{Page}ListQuery()` 之前声明
- **AND** 这三个变量必须连续声明,中间不能插入其他代码

#### Scenario: plusSearchModelRef 类型约束规则

- **WHEN** 声明 `plusSearchModelRef` 变量
- **THEN** 类型必须为 `FieldValues & Partial<{Page}QueryParams>`
- **AND** 必须包含 `Partial` 包裹业务查询参数类型
- **AND** 不能省略 `Partial` 约束

**错误示例**:

```typescript
// ❌ 错误1: 缺少 Partial 约束
const plusSearchModelRef: FieldValues & ConfigCenterQueryParams = {
	configName: "",
};

// ❌ 错误2: 在 API Hook 之后声明
const { tableData } = useConfigCenterListQuery(plusSearchDefaultValues);
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {};

// ❌ 错误3: 重复声明
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const { tableData } = useConfigCenterListQuery(plusSearchDefaultValues);
const plusSearchModel = ref(plusSearchModelRef); // 晚了,应该在 Hook 之前
```

**正确示例**:

```typescript
// ✅ 正确: 严格按顺序在 API Hook 之前声明
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

// 然后才调用 API Hook
const { tableData, pureTableProps, isFetching, updateParams, resetParams } =
	useConfigCenterListQuery(plusSearchDefaultValues);
```

#### Scenario: 迁移现有代码时的处理方式

- **WHEN** 迁移现有列表页代码
- **THEN** 如果发现这三个变量在 API Hook 之后或顺序错误
- **THEN** 必须使用移动代码的方式,将变量移动到 API Hook 之前
- **AND** 不能新增代码,必须移动现有代码
- **AND** 确保移动后的代码顺序符合规范

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
- [ ] **严格禁止：未创建任何中文类型别名**（如 `export type 巡检方式 = PatrolMethodType;`）
- [ ] **严格禁止：未创建任何中文变量别名**（如 `export const 费用类型 = contractTypeOptions;`）
- [ ] 使用 `handleReSearch` 和 `handleSearch` 固定写法
- [ ] 使用 `handlePageSizeChange` 和 `handleCurrentPageChange` 固定写法
- [ ] 直接使用 `pureTableProps` 从 Hook 导出
- [ ] 使用 `isFetching` 绑定 loading
- [ ] 删除所有手动定义的 pagination、pureTableProps、分页函数
- [ ] 删除 test-data.ts 导入和 loadTableData 函数
- [ ] 删除 onMounted 中的 loadTableData 调用

### 完整示例代码

完整的标准模板和详细说明,请参考 [migration-guide.md](../migration-guide.md#step-5-改写列表页-30分钟)。
