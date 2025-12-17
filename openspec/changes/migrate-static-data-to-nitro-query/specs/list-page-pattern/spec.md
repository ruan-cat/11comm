## MODIFIED Requirements

## 实施顺序说明

**CRITICAL**: 在实施列表页改造相关任务时，必须严格按照以下顺序执行，不允许跳步。

### 执行顺序

1. **Step 1**: 列表页数据获取模式（导入类型和Hook）
2. **Step 2**: 搜索表单集成（搜索功能改造）
3. **Step 3**: 分页组件集成（分页功能改造）
4. **Step 4**: 表格Loading状态（Loading状态集成）
5. **Step 5**: 错误状态处理（错误处理集成）
6. **Step 6**: 初始化加载（初始化逻辑）
7. **Step 7**: 响应式参数管理（参数管理优化）
8. **Step 8**: 代码组织和注释（代码规范）
9. **Step 9**: 类型安全的查询参数（类型安全保障）
10. **Step 10**: Options常量使用（使用类型库Options）
11. **Step 11**: 删除test-data.ts文件（清理旧文件）
12. **Step 12**: 删除loadTableData函数（清理旧代码）
13. **Step 13**: 删除手动loading状态管理（清理旧逻辑）
14. **Step 14**: 删除列表页本地数据源（最终清理）

### 步骤依赖关系

- Step 1 是核心改造，必须最先完成
- Step 2-5 是功能集成步骤，依赖 Step 1 的Hook基础
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
import { useHouseChargeListQuery } from "@/api/property-manage/expense-manage/house-charge";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";

// 1. 分页配置
const pagination = ref({ currentPage: 1, pageSize: 10, total: 0 });

// 2. 查询参数
const queryParams = ref<HouseChargeQueryParams>({
	pageIndex: pagination.value.currentPage,
	pageSize: pagination.value.pageSize,
});

// 3. TanStack Query Hook
const { data, isLoading, refetch } = useHouseChargeListQuery(queryParams);

// 4. 表格数据
const tableData = ref<HouseChargeListItem[]>([]);

// 5. 监听数据变化
watch(data, (newData) => {
	if (newData?.data) {
		tableData.value = newData.data.list;
		pagination.value.total = newData.data.total;
		pureTableProps.value.data = tableData.value;
	}
});

// 6. 搜索函数
async function handleSearch() {
	queryParams.value = {
		...plusSearchModel.value,
		pageIndex: 1,
		pageSize: pagination.value.pageSize,
	};
}

// 7. 分页函数
async function handleCurrentPageChange(currentPage: number) {
	queryParams.value.pageIndex = currentPage;
}

async function handlePageSizeChange(pageSize: number) {
	queryParams.value.pageSize = pageSize;
	queryParams.value.pageIndex = 1;
}

// 8. 初始化
onMounted(() => {
	refetch();
});
</script>

<template>
	<PlusSearch v-model="plusSearchModel" @search="handleSearch" @reset="handleReset" />
	<PureTable :loading="isLoading" :data="tableData" :pagination="pagination" />
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

// ❌ 删除（onMounted 中调用 loadTableData）
onMounted(async () => {
	await loadTableData();
});
```

---

### Requirement: 搜索表单集成 (Step 2)

**FROM**: handleSearch 调用 loadTableData
**TO**: handleSearch 更新 queryParams

搜索表单 MUST 通过修改 queryParams 触发查询：

- plusSearchModel 绑定搜索表单
- handleSearch 合并搜索条件到 queryParams
- 重置 pageIndex 为 1
- 自动触发 TanStack Query

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
- **THEN** handleSearch 执行：

```typescript
async function handleSearch() {
	queryParams.value = {
		...plusSearchModel.value, // 合并搜索条件
		pageIndex: 1, // 重置到第一页
		pageSize: pagination.value.pageSize,
	};
	// TanStack Query 自动触发请求
}
```

#### Scenario: handleReset 实现

- **GIVEN** 用户点击重置按钮
- **WHEN** handleReset 执行
- **THEN** 代码为：

```typescript
async function handleReset() {
	plusSearchModel.value = {}; // 清空搜索条件
	queryParams.value = {
		pageIndex: 1,
		pageSize: pagination.value.pageSize,
	};
	// TanStack Query 自动触发请求
}
```

---

### Requirement: 分页组件集成 (Step 3)

**FROM**: handleCurrentPageChange 调用 loadTableData
**TO**: 修改 queryParams.pageIndex/pageSize

分页 MUST 通过修改 queryParams 实现：

- pagination 对象存储当前状态
- handleCurrentPageChange 更新 pageIndex
- handlePageSizeChange 更新 pageSize 并重置 pageIndex
- 监听器自动同步 total

#### Scenario: PureTable 分页配置

- **GIVEN** 列表页使用 PureTable
- **WHEN** 配置分页属性
- **THEN** 代码为：

```vue
<template>
	<PureTable
		:loading="isLoading"
		:data="tableData"
		:columns="columns"
		:pagination="pagination"
		@current-change="handleCurrentPageChange"
		@size-change="handlePageSizeChange"
	/>
</template>

<script setup lang="ts">
const pagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0,
	pageSizes: [10, 20, 30, 50],
	background: true,
});
</script>
```

#### Scenario: 分页事件处理

- **GIVEN** 用户切换页码或每页大小
- **WHEN** 事件触发
- **THEN** 代码为：

```typescript
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	queryParams.value.pageIndex = currentPage;
}

async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	pagination.value.currentPage = 1; // 重置页码
	queryParams.value.pageSize = pageSize;
	queryParams.value.pageIndex = 1;
}
```

#### Scenario: total 自动同步

- **GIVEN** watch 监听器
- **WHEN** data 变化
- **THEN** 自动更新 pagination.value.total：

```typescript
watch(data, (newData) => {
	if (newData?.data) {
		tableData.value = newData.data.list;
		pagination.value.total = newData.data.total; // 自动同步总数
		pureTableProps.value.data = tableData.value;
	}
});
```

---

### Requirement: 表格 Loading 状态 (Step 4)

**FROM**: 手动控制 loading.value
**TO**: 直接使用 isLoading

表格 MUST 使用 TanStack Query 的 isLoading 状态：

- PureTable 的 loading 属性绑定 isLoading
- 不需要手动设置 loading = true/false
- 自动跟踪请求生命周期

#### Scenario: loading 绑定

- **GIVEN** PureTable 组件
- **WHEN** 配置 loading 属性
- **THEN** 代码为：

```vue
<PureTable :loading="isLoading" :data="tableData" />
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

### Requirement: 错误状态处理 (Step 5)

列表页 MUST 提供错误状态提示：

- 使用 isError 和 error 显示错误信息
- 提供重试按钮（调用 refetch）
- 不阻塞页面渲染

#### Scenario: 错误提示 UI

- **GIVEN** 查询失败（isError = true）
- **WHEN** 渲染页面
- **THEN** 可选显示错误提示：

```vue
<template>
	<div v-if="isError" class="error-message">
		<p>数据加载失败：{{ error?.message }}</p>
		<button @click="refetch">重试</button>
	</div>

	<PureTable v-else :loading="isLoading" :data="tableData" />
</template>
```

#### Scenario: 全局错误处理

- **GIVEN** TanStack Query 全局配置
- **WHEN** 查询失败
- **THEN** 可通过 Vue 全局错误处理器统一处理
- **AND** 显示 ElMessage 提示

---

### Requirement: 初始化加载 (Step 6)

列表页 MUST 在 onMounted 时触发初始查询：

- 调用 refetch() 立即加载数据
- 或确保 queryParams 有效（pageIndex > 0）
- 避免重复触发

#### Scenario: onMounted 触发查询

- **GIVEN** 列表页组件挂载
- **WHEN** onMounted 钩子执行
- **THEN** 代码为：

```typescript
onMounted(() => {
	refetch(); // 手动触发首次查询
});
```

- **OR** 依赖自动触发：

```typescript
// queryParams 初始化时 pageIndex > 0，自动触发
const queryParams = ref<HouseChargeQueryParams>({
	pageIndex: 1, // 自动触发查询
	pageSize: 10,
});
```

#### Scenario: 避免重复请求

- **GIVEN** onMounted 调用 refetch()
- **WHEN** queryParams 已经触发自动查询
- **THEN** TanStack Query 缓存机制避免重复请求
- **AND** 相同 queryKey 不会发起多次请求

---

### Requirement: 响应式参数管理 (Step 7)

queryParams MUST 作为响应式对象管理：

- 使用 ref 包裹
- 修改通过 .value 访问
- 包含所有搜索条件和分页参数
- 类型为业务专用的 QueryParams 接口

#### Scenario: queryParams 定义

- **GIVEN** 列表页 setup
- **WHEN** 定义 queryParams
- **THEN** 代码为：

```typescript
import type { HouseChargeQueryParams } from "@01s-11comm/type";

const queryParams = ref<HouseChargeQueryParams>({
	pageIndex: 1,
	pageSize: 10,
	// 搜索条件初始为空
	expenseType: undefined,
	status: undefined,
});
```

#### Scenario: queryParams 更新

- **GIVEN** 用户执行搜索
- **WHEN** handleSearch 更新参数
- **THEN** 代码为：

```typescript
async function handleSearch() {
	queryParams.value = {
		...queryParams.value, // 保留 pageSize
		...plusSearchModel.value, // 合并搜索条件
		pageIndex: 1, // 重置页码
	};
}
```

---

### Requirement: 代码组织和注释 (Step 8)

列表页代码 MUST 遵循统一的组织结构：

1. 类型导入
2. 搜索表单配置
3. 分页配置
4. 查询参数
5. TanStack Query Hook
6. 表格数据
7. 监听器
8. 事件处理函数
9. 生命周期钩子

#### Scenario: 代码结构模板

- **GIVEN** 新建或迁移列表页
- **WHEN** 组织代码
- **THEN** 按以下顺序编写：

```typescript
// ==================== 1. 类型导入 ====================
import { useHouseChargeListQuery } from "@/api/property-manage/expense-manage/house-charge";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";

// ==================== 2. 搜索表单配置 ====================
const plusSearchModel = ref({});
const plusSearchColumns: PlusColumn[] = [...];

// ==================== 3. 分页配置 ====================
const pagination = ref({ currentPage: 1, pageSize: 10, total: 0 });

// ==================== 4. 查询参数 ====================
const queryParams = ref<HouseChargeQueryParams>({
  pageIndex: pagination.value.currentPage,
  pageSize: pagination.value.pageSize,
});

// ==================== 5. TanStack Query Hook ====================
const { data, isLoading, refetch } = useHouseChargeListQuery(queryParams);

// ==================== 6. 表格数据 ====================
const tableData = ref<HouseChargeListItem[]>([]);

// ==================== 7. 监听器 ====================
watch(data, (newData) => {
  if (newData?.data) {
    tableData.value = newData.data.list;
    pagination.value.total = newData.data.total;
  }
});

// ==================== 8. 事件处理函数 ====================
async function handleSearch() { ... }
async function handleReset() { ... }
async function handleCurrentPageChange(currentPage: number) { ... }
async function handlePageSizeChange(pageSize: number) { ... }

// ==================== 9. 生命周期钩子 ====================
onMounted(() => {
  refetch();
});
```

#### Scenario: JSDoc 注释规范

- **GIVEN** 关键函数和变量
- **WHEN** 添加注释
- **THEN** 使用 JSDoc 格式：

```typescript
/** 查询参数 Query parameters */
const queryParams = ref<HouseChargeQueryParams>({
	pageIndex: 1,
	pageSize: 10,
});

/** 搜索函数 Search function */
async function handleSearch() {
	// ...
}
```

---

## ADDED Requirements

### Requirement: 类型安全的查询参数 (Step 9)

列表页 MUST 使用业务专用的 QueryParams 类型：

- 从 @01s-11comm/type 导入
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
