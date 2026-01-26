# 静态数据迁移到 Nitro Query 完整指南

## 1. 概述

本指南提供完整的、一步一步的迁移流程,将现有的本地假数据(test-data.ts)迁移到 Nitro 接口 + TanStack Query 的架构。

**关键原则**:

- **严格遵循标准模板** - 所有代码必须按固定格式编写
- **避免自定义逻辑** - 使用通用工具函数和 Hooks
- **类型安全优先** - 所有返回值必须有显式类型约束
- **代码复用** - 最大化使用封装好的 composables 和 utils

## ⚠️ 重要警告：严格禁止向后兼容的中文类型

**在迁移过程中，严格禁止创建任何向后兼容的中文类型或中文变量别名**：

❌ **错误示例（严格禁止）**：

```typescript
// 不允许创建中文类型别名
export type 巡检方式 = PatrolMethodType;
export type 任务状态 = TaskStatusType;
export type 巡检点状态 = PatrolPointStatusType;
export type 巡查明细表单_VO = PatrolDetailFormVO;
export type 巡查明细表单Props = PatrolDetailFormProps;

// 不允许创建中文变量别名
export const 费用类型 = contractTypeOptions;
export const 状态选项 = statusOptions;
```

✅ **正确做法**：

- 直接使用纯英文的业务类型：`PatrolMethodType`、`TaskStatusType` 等
- 直接使用纯英文的变量名：`contractTypeOptions`、`statusOptions` 等
- 不需要任何中文类型的兼容层
- 如果其他文件使用了中文类型，应该直接修改那些文件使用英文类型

**原因**：

- 避免长期维护兼容层的技术债
- 强制统一代码规范
- 简化类型定义
- 减少代码体积

---

## 2. 迁移前准备

### 2.1 确认迁移目标页面

确定要迁移的列表页路径,例如:

```plain
页面: src/pages/property-manage/expense-manage/house-charge/index.vue
```

### 2.2 收集业务信息

从现有页面收集以下信息:

- 列表数据字段(中文字段名)
- 搜索条件字段
- 枚举类型和选项
- 表格列配置

---

## 3. 迁移步骤

### Step 1: 创建类型定义文件 (15 分钟)

#### 3.1.1 文件位置

```plain
apps/type/src/business/{module}/{sub-module}/{page}.ts
```

例如:

```plain
apps/type/src/business/property-manage/expense-manage/house-charge.ts
```

#### 3.1.2 类型定义模板

```typescript
/**
 * @file {页面名称}类型定义
 * @description {Page Name} types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * {页面名称}列表数据
 * {Page Name} list item
 */
export interface {Page}ListItem {
	/** {中文描述} {English description} */
	fieldName: string;
	// ... 所有字段
}

/**
 * {页面名称}查询参数
 * {Page Name} query parameters
 */
export interface {Page}QueryParams extends BaseListQueryParams {
	/** {中文描述} {English description} */
	fieldName?: string;
	// ... 所有搜索字段
}

/**
 * {枚举名称}选项
 * {Enum Name} options
 */
export const {enum}Options: OptionsType = [
	{ label: "选项1", value: "选项1" },
	{ label: "选项2", value: "选项2" },
];
```

#### ⚠️ 重要警告：禁止创建中文类型别名

**在创建类型定义文件时，严格禁止以下做法**：

❌ **错误示例（严格禁止）**：

```typescript
// ❌ 错误1: 创建中文类型别名
export type 巡检方式 = PatrolMethodType;
export type 任务状态 = TaskStatusType;

// ❌ 错误2: 创建中文变量别名
export const 费用类型 = expenseTypeOptions;
export const 状态选项 = statusOptions;
```

✅ **正确做法**：

```typescript
// ✅ 正确: 直接使用英文类型和变量名
export interface PatrolMethodType {
	// ...
}

export const expenseTypeOptions: OptionsType = [{ label: "费用类型", value: "费用类型" }];
```

#### 3.1.3 正确范例

**✅ 配置中心类型定义** ([center.ts](d:\code\github-desktop-store\01s-11comm\apps\type\src\business\dev-team\config-manage\center.ts:1-81)):

```typescript
/**
 * @file 配置中心类型定义
 * @description Configuration center types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 配置中心列表数据
 * Configuration center list item
 */
export interface ConfigCenterListItem {
	/** 配置项ID Config item ID */
	configId: string;
	/** 配置项名称 Config item name */
	configName: string;
	/** 配置类型 Config type */
	configType: string;
	// ... 更多字段
}

/**
 * 配置中心查询参数
 * Configuration center query parameters
 */
export interface ConfigCenterQueryParams extends BaseListQueryParams {
	/** 配置项名称 Config item name */
	configName?: string;
	/** 配置类型 Config type */
	configType?: string;
	/** 状态 Status */
	status?: string;
	/** 配置键名 Config key */
	configKey?: string;
}

/**
 * 配置类型选项
 * Config type options
 */
export const configTypeOptions: OptionsType = [
	{ label: "系统配置", value: "系统配置" },
	{ label: "业务配置", value: "业务配置" },
	// ... 更多选项
];
```

#### 3.1.4 验收标准

- ✅ 所有字段名为英文驼峰命名
- ✅ 每个字段有 JSDoc 注释(中文+英文)
- ✅ 枚举值保持中文
- ✅ QueryParams 继承 BaseListQueryParams
- ✅ Options 导出正确

---

### Step 2: 创建 Mock 数据文件 (10 分钟)

#### 3.2.1 文件位置

```plain
apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts
```

#### 3.2.2 Mock 数据模板

```typescript
/**
 * @file {页面名称}假数据
 * @description {Page Name} mock data
 */

import type { {Page}ListItem } from "@01s-11comm/type";

/**
 * {页面名称}假数据
 * {Page Name} mock data
 */
export const mock{Page}Data: {Page}ListItem[] = [
	{
		fieldName: "值1",
		// ... 所有字段
	},
	// ... 至少 20-50 条数据
];
```

#### 3.2.3 正确范例

**✅ 配置中心假数据** ([mock-data.ts](d:\code\github-desktop-store\01s-11comm\apps\admin\server\api\dev-team\config-manage\center\mock-data.ts:1-30)):

```typescript
/**
 * @file 配置中心假数据
 * @description Configuration center mock data
 */

import type { ConfigCenterListItem } from "@01s-11comm/type";

/**
 * 配置中心假数据
 * Configuration center mock data
 */
export const mockConfigCenterData: ConfigCenterListItem[] = [
	{
		configId: "CF001",
		configName: "系统名称",
		configType: "系统配置",
		// ... 完整字段
	},
	// ... 更多数据
];
```

#### 3.2.4 验收标准

- ✅ 类型约束为 `{Page}ListItem[]`
- ✅ 数据字段名为英文
- ✅ 数据量充足(20-50 条)
- ✅ 从 `@01s-11comm/type` 导入类型

---

### Step 3: 创建 Nitro 接口文件 (20 分钟)

#### 3.3.1 文件位置

```plain
apps/admin/server/api/{module}/{sub-module}/{page}/list.post.ts
```

#### 3.3.2 Nitro 接口模板(固定格式)

```typescript
/**
 * @file {页面名称}列表接口
 * @description {Page Name} list API
 * POST /api/{module}/{sub-module}/{page}/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, {Page}ListItem, {Page}QueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mock{Page}Data } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<{Page}ListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<{Page}QueryParams>(event);
	const defaultParams: {Page}QueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选 - 使用通用筛选工具函数
	const filteredData = filterDataByQuery(mock{Page}Data, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式 - 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<{Page}ListItem>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
```

#### 3.3.3 正确范例

**✅ 配置中心接口** ([list.post.ts](d:\code\github-desktop-store\01s-11comm\apps\admin\server\api\dev-team\config-manage\center\list.post.ts:1-46)):

```typescript
/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockConfigCenterData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	const body = await readBody<ConfigCenterQueryParams>(event);
	const defaultParams: ConfigCenterQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockConfigCenterData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
```

#### 3.3.4 ❌ 错误反面例子

**❌ 缴费审核接口(错误写法)** ([list.post.ts](d:\code\github-desktop-store\01s-11comm\apps\admin\server\api\property-manage\expense-manage\payment-review\list.post.ts:1-58)):

```typescript
// ❌ 错误1: 使用 defineEventHandler (Nitro v2 写法)
import { defineEventHandler, readBody } from "h3";

// ❌ 错误2: 从 h3 导入而不是 nitro/h3
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<PaymentReviewListItem>>> => {
	// ❌ 错误3: 手动解构参数并设置默认值
	const { pageIndex = 1, pageSize = 10, house, expenseItem } = body;

	// ❌ 错误4: 手动编写 filter 逻辑
	let filteredData = [...mockPaymentReviewData];
	if (house) {
		filteredData = filteredData.filter((item) => item.house.includes(house));
	}

	// ❌ 错误5: 直接返回对象字面量,没有类型约束变量
	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
		timestamp: Date.now(),
	};
});
```

#### 3.3.5 关键要求

**CRITICAL 必须遵守的要点**:

1. **导入方式**: 必须从 `nitro/h3` 导入,不能从 `h3` 导入

   ```typescript
   import { defineHandler, readBody } from "nitro/h3"; // ✅ 正确
   import { defineEventHandler, readBody } from "h3"; // ❌ 错误
   ```

2. **处理函数**: 必须使用 `defineHandler`,不能使用 `defineEventHandler`

   ```typescript
   export default defineHandler(async (event) => { ... }); // ✅ 正确
   export default defineEventHandler(async (event) => { ... }); // ❌ 错误
   ```

3. **参数处理**: 必须使用标准的参数合并模式

   ```typescript
   // ✅ 正确
   const body = await readBody<ConfigCenterQueryParams>(event);
   const defaultParams: ConfigCenterQueryParams = {
   	pageIndex: DEFAULT_PAGE_INDEX,
   	pageSize: DEFAULT_PAGE_SIZE,
   };
   const mergedParams = { ...defaultParams, ...body };
   const { pageIndex, pageSize, ...filters } = mergedParams;

   // ❌ 错误
   const { pageIndex = 1, pageSize = 10, ...filters } = body;
   ```

4. **筛选逻辑**: 必须使用 `filterDataByQuery` 工具函数

   ```typescript
   // ✅ 正确
   const filteredData = filterDataByQuery(mockConfigCenterData, filters);

   // ❌ 错误
   let filteredData = [...mockConfigCenterData];
   if (configName) {
   	filteredData = filteredData.filter((item) => item.configName.includes(configName));
   }
   ```

5. **返回值**: 必须创建带类型约束的 response 变量

   ```typescript
   // ✅ 正确
   const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
   	success: true,
   	code: 200,
   	message: "查询成功",
   	data: { ... },
   };
   return response;

   // ❌ 错误
   return {
   	success: true,
   	code: 200,
   	message: "查询成功",
   	data: { ... },
   };
   ```

#### 3.3.6 验收标准

- ✅ 使用 Nitro v3 写法 (`defineHandler` + `nitro/h3`)
- ✅ 使用 DEFAULT_PAGE_INDEX 和 DEFAULT_PAGE_SIZE 常量
- ✅ 使用 filterDataByQuery 工具函数
- ✅ 返回值有完整类型约束
- ✅ 有 JSDoc 注释(包含 POST 路径)

---

### Step 4: 创建前端 API Hook (10 分钟)

#### 3.4.1 文件位置

```plain
apps/admin/src/api/{module}/{sub-module}/{page}/index.ts
```

#### 3.4.2 API Hook 模板(固定格式)

```typescript
/**
 * @file {页面名称} API Hook
 * @description {Page Name} API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { {Page}ListItem, {Page}QueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/{module}/{sub-module}/{page}/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "{page}";

/**
 * {页面名称}列表查询 Hook
 * {Page Name} list query hook
 */
export function use{Page}ListQuery(initialParams: Partial<{Page}QueryParams>) {
	return useListQuery<{Page}ListItem, {Page}QueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default use{Page}ListQuery;
```

#### 3.4.3 正确范例

**✅ 配置中心 API Hook** ([index.ts](d:\code\github-desktop-store\01s-11comm\apps\admin\src\api\dev-team\config-manage\center\index.ts:1-28)):

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

#### 3.4.4 ❌ 错误反面例子

**❌ 缴费审核 API Hook(错误写法)** ([index.ts](d:\code\github-desktop-store\01s-11comm\apps\admin\src\api\property-manage\expense-manage\payment-review\index.ts:19-24)):

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

#### 3.4.5 关键要求

**CRITICAL 必须遵守的要点**:

1. **必须提供 initialParams 参数**:

   ```typescript
   // ✅ 正确
   export function useConfigCenterListQuery(initialParams: Partial<ConfigCenterQueryParams>) {
   	return useListQuery<ConfigCenterListItem, ConfigCenterQueryParams>({
   		queryKeyPrefix: QUERY_KEY_PREFIX,
   		apiUrl: API_URL,
   		initialParams, // ✅ 必须传递
   	});
   }

   // ❌ 错误
   export function usePaymentReviewListQuery() {
   	return useListQuery<PaymentReviewListItem, PaymentReviewQueryParams>({
   		queryKeyPrefix: QUERY_KEY_PREFIX,
   		apiUrl: API_URL,
   		// ❌ 缺少 initialParams
   	});
   }
   ```

2. **参数类型约束**:

   ```typescript
   // ✅ 正确
   (initialParams: Partial<ConfigCenterQueryParams>)

   // ❌ 错误
   () // 无参数
   ```

#### 3.4.6 验收标准

- ✅ 必须提供 `initialParams` 参数
- ✅ 参数类型为 `Partial<{Page}QueryParams>`
- ✅ queryKeyPrefix 格式正确
- ✅ apiUrl 路径正确
- ✅ 类型泛型参数正确

---

### Step 5: 改写列表页 (30 分钟)

#### ⚠️ 列表页改造严格规范

**在实施列表页改造任务时，必须严格遵守以下规范，避免出现删改多余内容的情况**：

1. **无条件按照 fix-type-error 处理类型错误**：必须严格按照 `.claude\agents\fix-type-error.md` 文档要求执行类型替换
2. **不要删改破坏现有的弹框函数逻辑**：`useMode()`、`useToggle()`、`testAsync()` 等函数不属于迁移范围
3. **不要删掉弹框实例代码，只做类型替换**：只替换中文变量名为英文，不删除表单实例结构
4. **不要胡乱删改打开弹框组件的处理逻辑**：只做变量名替换和函数替换（`cloneDeep` -> `structuredClone`）
5. **不要胡乱删改 openDialog 按钮配置逻辑**：只替换中文变量名
6. **不要更改 definePage 宏的排布顺序**：`definePage` 必须在最上面
7. **表格列配置使用全局类型 TableColumnList**：不要换成 `TableColumns`
8. **保留全局类型约束 PureTableBarProps**：不要删掉
9. **不要增加 getRouteRank 的导入**：这是全局函数

**详细规范请查看**：[list-page-pattern/spec.md](./list-page-pattern/spec.md#列表页改造严格规范)

#### 3.5.1 列表页模板(固定格式)

```vue
<script setup lang="ts">
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";
import {
	type ConfigCenterListItem,
	type ConfigCenterQueryParams,
	configTypeOptions,
	configStatusOptions,
} from "@01s-11comm/type";

// 1. 表格搜索栏配置
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
	{
		label: "配置类型",
		prop: "configType",
		valueType: "select",
		options: configTypeOptions,
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

// 4. 表格列配置
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "配置项名称",
		prop: "configName",
		width: 150,
		fixed: true,
	},
	// ... 更多列
]);
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

#### 3.5.2 正确范例

**✅ 配置中心列表页** ([index.vue](d:\code\github-desktop-store\01s-11comm\apps\admin\src\pages\dev-team\config-manage\center\index.vue:85-106)):

关键代码片段:

```vue
<script setup lang="ts">
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

#### 3.5.3 ❌ 错误反面例子

**❌ 缴费审核列表页(错误写法)** ([index.vue](d:\code\github-desktop-store\01s-11comm\apps\admin\src\pages\property-manage\expense-manage\payment-review\index.vue:37-138)):

```vue
<script setup lang="ts">
// ❌ 错误1: Hook 未传递 initialParams
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	usePaymentReviewListQuery(); // ❌ 缺少初始参数

// ❌ 错误2: 手动定义 pagination 计算属性
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

// ❌ 错误3: 手动定义 pureTableProps
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value, // ❌ 应该用 isFetching
});

// ❌ 错误4: 手动实现 handlePageSizeChange
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

// ❌ 错误5: 手动实现 handleCurrentPageChange
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}
</script>

<template>
	<!-- ❌ 错误6: 手动绑定 pureTableProps -->
	<PureTable
		:="pureTableProps"
		:columns="dynamicColumns"
		:size="size"
		@page-size-change="handlePageSizeChange"
		@page-current-change="handleCurrentPageChange"
	>
	</PureTable>
</template>
```

#### 3.5.4 关键要求

**CRITICAL 必须遵守的要点**:

1. **使用 Hook 传递初始参数**:

   ```typescript
   // ✅ 正确
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

   // ❌ 错误
   const { tableData, total, pageIndex, pageSize } = usePaymentReviewListQuery(); // 缺少参数
   ```

2. **使用 Hook 返回的 pureTableProps**:

   ```vue
   <!-- ✅ 正确 -->
   <PureTable :="pureTableProps" />

   <!-- ❌ 错误 -->
   <PureTable :="pureTableProps" />
   <!-- 其中 pureTableProps 是手动定义的 ref -->
   ```

3. **使用 Hook 返回的 isFetching**:

   ```vue
   <!-- ✅ 正确 -->
   <PureTable :loading="isFetching" />

   <!-- ❌ 错误 -->
   <PureTable :loading="isLoading.value" />
   ```

4. **使用 Hook 返回的分页函数**:

   ```vue
   <!-- ✅ 正确 -->
   <PureTable @page-size-change="handlePageSizeChange" @page-current-change="handleCurrentPageChange" />

   <!-- ❌ 错误 - 手动实现 -->
   <PureTable
   	@page-size-change="(val) => (pageSize.value = val)"
   	@page-current-change="(val) => (pageIndex.value = val)"
   />
   ```

5. **使用固定写法的搜索函数**:

   ```typescript
   // ✅ 正确
   function handleReSearch() {
   	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
   	resetParams();
   }

   function handleSearch() {
   	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
   }

   // ❌ 错误
   function handleReSearch() {
   	plusSearchModel.value = cloneDeep(plusSearchDefaultValues); // 使用 cloneDeep
   	resetParams();
   }
   ```

#### 3.5.5 需要删除的旧代码

迁移完成后,必须删除以下代码:

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

#### 3.5.6 验收标准

- ✅ 使用 `plusSearchDefaultValues` 作为初始值传给 Hook
- ✅ 使用 `handleReSearch` 和 `handleSearch` 固定写法
- ✅ 使用 `handlePageSizeChange` 和 `handleCurrentPageChange` 固定写法
- ✅ 直接使用 `pureTableProps` 从 Hook 导出
- ✅ 使用 `isFetching` 绑定 loading
- ✅ 删除所有手动定义的 pagination、pureTableProps、分页函数
- ✅ 删除 test-data.ts 导入和 loadTableData 函数

---

### Step 6: 删除旧的假数据文件 (5 分钟)

删除 `src/pages/{module}/{sub-module}/{page}/test-data.ts` 文件。

#### 验收标准

- ✅ test-data.ts 文件已删除
- ✅ 无任何文件引用该文件

---

### Step 7: 运行类型检查 (5 分钟)

```bash
pnpm typecheck
```

#### 验收标准

- ✅ typecheck 通过
- ✅ 无类型报错

---

### Step 8: 测试验证 (15 分钟)

1. 启动开发服务器
2. 测试列表加载
3. 测试搜索功能
4. 测试分页功能
5. 测试 loading 状态

#### 验收标准

- ✅ 所有功能正常
- ✅ 无 console 报错
- ✅ 数据加载正确

---

## 4. 常见错误和修复方法

### 4.1 Nitro 接口错误

| 错误                      | 修复方法                           |
| ------------------------- | ---------------------------------- |
| 使用 `defineEventHandler` | 改为 `defineHandler`               |
| 从 `h3` 导入              | 改为从 `nitro/h3` 导入             |
| 手动编写 filter 逻辑      | 使用 `filterDataByQuery` 工具函数  |
| 直接返回对象字面量        | 创建 `response` 变量并添加类型约束 |
| 缺少 JSDoc 注释           | 添加注释,包含接口路径              |

### 4.2 API Hook 错误

| 错误                 | 修复方法                          |
| -------------------- | --------------------------------- |
| 缺少 `initialParams` | 添加必填参数                      |
| 参数类型不正确       | 使用 `Partial<{Page}QueryParams>` |

### 4.3 列表页错误

| 错误                      | 修复方法                               |
| ------------------------- | -------------------------------------- |
| Hook 未传递初始参数       | 传递 `plusSearchDefaultValues`         |
| 手动定义 `pagination`     | 删除,使用 Hook 返回的 `pureTableProps` |
| 手动定义 `pureTableProps` | 删除,使用 Hook 返回的 `pureTableProps` |
| 手动实现分页函数          | 删除,使用 Hook 返回的函数              |
| 使用 `isLoading`          | 改为 `isFetching`                      |
| 使用 `cloneDeep`          | 改为 `structuredClone`                 |

---

## 5. 检查清单

迁移完成后,使用以下清单验证:

### 5.1 类型定义文件

- [ ] 文件位置正确
- [ ] 所有字段名为英文驼峰命名
- [ ] **严格禁止：未创建任何中文类型别名**（如 `export type 巡检方式 = PatrolMethodType;`）
- [ ] **严格禁止：未创建任何中文变量别名**（如 `export const 费用类型 = contractTypeOptions;`）
- [ ] 每个字段有 JSDoc 注释
- [ ] QueryParams 继承 BaseListQueryParams
- [ ] Options 导出正确

### 5.2 Mock 数据文件

- [ ] 文件位置正确
- [ ] 类型约束正确
- [ ] 数据字段名为英文
- [ ] 数据量充足

### 5.3 Nitro 接口文件

- [ ] 使用 `defineHandler` 和 `readBody` 从 `nitro/h3` 导入
- [ ] 使用 DEFAULT_PAGE_INDEX 和 DEFAULT_PAGE_SIZE
- [ ] 使用 filterDataByQuery 工具函数
- [ ] 返回值有完整类型约束
- [ ] 有 JSDoc 注释

### 5.4 API Hook 文件

- [ ] 提供 `initialParams` 必填参数
- [ ] 参数类型为 `Partial<{Page}QueryParams>`
- [ ] queryKeyPrefix 正确
- [ ] apiUrl 正确

### 5.5 列表页文件

- [ ] 使用 Hook 传递 `plusSearchDefaultValues`
- [ ] 使用固定写法的 `handleReSearch` 和 `handleSearch`
- [ ] 使用 Hook 返回的 `handlePageSizeChange` 和 `handleCurrentPageChange`
- [ ] 使用 Hook 返回的 `pureTableProps`
- [ ] 使用 `isFetching` 绑定 loading
- [ ] 删除所有手动定义的代码
- [ ] 删除 test-data.ts 导入

### 5.6 类型检查和测试

- [ ] `pnpm typecheck` 通过
- [ ] 列表加载正常
- [ ] 搜索功能正常
- [ ] 分页功能正常
- [ ] loading 状态正常

---

## 6. 总结

**迁移成功的关键要素**:

1. **严格遵循模板** - 不要自定义代码结构
2. **使用工具函数** - 如 `filterDataByQuery`、`structuredClone`
3. **完整的类型约束** - 所有返回值必须有显式类型
4. **固定的参数传递** - Hook 必须接收 `initialParams`
5. **删除旧代码** - 确保无残留的手动逻辑

**对比正确和错误范例**:

| 方面       | ✅ 正确范例(配置中心)          | ❌ 错误范例(缴费审核)         |
| ---------- | ------------------------------ | ----------------------------- |
| Nitro 接口 | `defineHandler` + `nitro/h3`   | `defineEventHandler` + `h3`   |
| 筛选逻辑   | `filterDataByQuery`            | 手动 filter                   |
| 返回值     | `const response: JsonVO<...>`  | 直接返回对象字面量            |
| API Hook   | 提供 `initialParams` 参数      | 缺少参数                      |
| 列表页     | 使用 Hook 返回的所有变量和函数 | 手动定义 pagination、分页函数 |
| Loading    | `isFetching`                   | `isLoading`                   |

遵循本指南,可以确保迁移的一致性和正确性。
