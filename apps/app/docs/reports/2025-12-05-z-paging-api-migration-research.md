# z-paging 与 api-migration 子代理适配调研报告

## 1. 调研背景

本项目使用 `<z-paging>` 组件实现分页列表功能，同时项目接口请求需要遵循 `api-migration` 子代理的规范。本报告旨在研究如何在满足 `api-migration` 规范的前提下，正确适配 `z-paging` 的使用方式。

## 2. z-paging 核心用法（基于官方文档）

### 2.1 基本架构

z-paging 的核心设计理念是"仅需两步"：

1. 绑定网络请求方法（`@query` 事件）
2. 绑定分页结果数组（`v-model`）

### 2.2 @query 事件

`@query` 是 z-paging 的核心事件，组件会自动计算并传递分页参数：

```typescript
// @query 回调函数签名
function queryList(pageNo: number, pageSize: number): void;
```

|    参数    |  类型  |                 说明                  |
| :--------: | :----: | :-----------------------------------: |
|  `pageNo`  | number |         当前页码（从 1 开始）         |
| `pageSize` | number | 每页条数（由 default-page-size 设置） |

### 2.3 complete 方法

请求完成后，必须调用 `complete` 方法通知 z-paging：

|             调用方式             |                          说明                           |
| :------------------------------: | :-----------------------------------------------------: |
|         `complete(list)`         | 传入数组，z-paging 根据数组长度自动判断是否还有更多数据 |
|        `complete(false)`         |                     加载失败时调用                      |
|  `completeByTotal(list, total)`  |           传入数组和总数，更精确控制分页状态            |
| `completeByNoMore(list, noMore)` |             传入数组和是否没有更多的布尔值              |

### 2.4 Vue3 Composition API 官方示例

```vue
<template>
	<z-paging ref="pagingRef" v-model="dataList" @query="queryList">
		<view v-for="item in dataList" :key="item.id">
			{{ item.name }}
		</view>
	</z-paging>
</template>

<script setup>
import { ref } from "vue";
import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";

const pagingRef = ref(null);
const dataList = ref([]);

// 使用 useZPaging Hook 自动处理页面滚动和下拉刷新
useZPaging(pagingRef);

// 查询数据
const queryList = async (pageNo, pageSize) => {
	try {
		const res = await uni.$http.get("/api/data", { pageNo, pageSize });
		pagingRef.value.complete(res.data.list);
	} catch (error) {
		pagingRef.value.complete(false);
	}
};
</script>
```

## 3. api-migration 子代理核心规范

### 3.1 强制要求

1. **必须使用 useRequest**：所有接口调用都必须通过 Alova 的 `useRequest` 管理状态
2. **必须设置 immediate: false**：禁止自动执行请求，必须手动触发
3. **必须使用回调钩子**：使用 `onSuccess`、`onError`、`onComplete` 处理请求结果
4. **禁止使用 try/catch**：不允许使用 try/catch 包装 send 函数调用

### 3.2 标准用法示例

```typescript
const {
	loading,
	send: loadList,
	onSuccess,
	onError,
} = useRequest((params) => getRepairOrderList(params), { immediate: false });

onSuccess((event) => {
	console.log("成功:", event.data);
});

onError((error) => {
	console.error("失败:", error);
	// 错误提示已由全局拦截器自动处理
});
```

## 4. 冲突点分析

|       方面       |          z-paging 原生模式           |        api-migration 要求         |
| :--------------: | :----------------------------------: | :-------------------------------: |
| **请求触发方式** |     在 @query 回调中直接发起请求     | 使用 useRequest 的 send 方法触发  |
| **结果处理方式** | 使用 try/catch 或 Promise.then/catch |  使用 onSuccess/onError 回调钩子  |
|   **完成通知**   |      在请求完成后调用 complete       |     在回调钩子中处理业务逻辑      |
|   **错误处理**   |       手动调用 complete(false)       | 全局拦截器自动处理 + 回调记录日志 |

## 5. 适配方案

### 5.1 推荐方案：回调钩子模式

**核心思路**：在 `@query` 回调中调用 `useRequest` 的 `send` 方法，在 `onSuccess` 和 `onError` 回调中调用 z-paging 的 `complete` 方法。

```vue
<template>
	<z-paging ref="pagingRef" v-model="dataList" :default-page-size="pageSize" @query="handleQuery">
		<view v-for="item in dataList" :key="item.id">
			{{ item.name }}
		</view>

		<template #empty>
			<wd-status-tip image="search" tip="暂无数据" />
		</template>
	</z-paging>
</template>

<script setup lang="ts">
import type { RepairOrder, RepairListParams } from "@/types/repair";
import { useRequest } from "alova/client";
import { ref } from "vue";
import { getRepairOrderList } from "@/api/repair";

/** z-paging 组件引用 */
const pagingRef = ref();

/** 列表数据 */
const dataList = ref<RepairOrder[]>([]);

/** 分页配置 */
const pageSize = ref(15);

/** 当前查询参数（用于保存 @query 传入的分页参数） */
const currentQueryParams = ref<{ page: number; row: number }>({
	page: 1,
	row: 15,
});

/**
 * 使用 useRequest 管理请求状态
 * 强制规范：必须设置 immediate: false
 */
const {
	loading,
	send: loadList,
	onSuccess,
	onError,
} = useRequest((params: RepairListParams) => getRepairOrderList(params), { immediate: false });

/**
 * 成功回调 - 通知 z-paging 数据加载完成
 * @description 在这里调用 complete 方法
 */
onSuccess((event) => {
	const result = event.data;
	// 方式一：直接传入列表，z-paging 自动判断是否还有更多
	pagingRef.value?.complete(result.list || []);

	// 方式二：使用 completeByTotal 精确控制（如果后端返回 total）
	// pagingRef.value?.completeByTotal(result.list || [], result.total)
});

/**
 * 失败回调 - 通知 z-paging 加载失败
 * @description 错误提示已由全局拦截器自动处理，这里只需通知 z-paging
 */
onError((error) => {
	console.error("加载列表失败:", error);
	pagingRef.value?.complete(false);
});

/**
 * z-paging 的 @query 回调
 * @description 接收 z-paging 计算的分页参数，触发数据请求
 */
function handleQuery(pageNo: number, pageSizeValue: number) {
	// 保存当前查询参数
	currentQueryParams.value = {
		page: pageNo,
		row: pageSizeValue,
	};

	// 触发请求（不使用 await，通过回调处理结果）
	loadList({
		page: pageNo,
		row: pageSizeValue,
		// 其他业务参数...
	});
}

/** 手动刷新列表 */
function handleRefresh() {
	pagingRef.value?.reload();
}
</script>
```

### 5.2 关键适配点说明

#### 5.2.1 不使用 await/try-catch

```typescript
// 错误：使用 try-catch（违反 api-migration 规范）
async function handleQuery(pageNo: number, pageSize: number) {
	try {
		const result = await loadList({ page: pageNo, row: pageSize });
		pagingRef.value?.complete(result.list);
	} catch {
		pagingRef.value?.complete(false);
	}
}

// 正确：使用回调钩子
function handleQuery(pageNo: number, pageSize: number) {
	loadList({ page: pageNo, row: pageSize });
	// complete 在 onSuccess/onError 回调中调用
}
```

#### 5.2.2 在回调中调用 complete

```typescript
// onSuccess 中处理成功
onSuccess((event) => {
	pagingRef.value?.complete(event.data.list || []);
});

// onError 中处理失败
onError((error) => {
	console.error("加载失败:", error);
	pagingRef.value?.complete(false);
});
```

#### 5.2.3 保持 pagingRef 的可用性

由于回调是异步执行的，需要确保 `pagingRef` 在回调执行时仍然有效：

```typescript
onSuccess((event) => {
	// 使用可选链确保安全调用
	pagingRef.value?.complete(event.data.list || []);
});
```

### 5.3 带筛选条件的完整示例

```vue
<template>
	<view class="page-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<wd-search v-model="searchName" placeholder="搜索..." @search="handleSearch" />
			<wd-button type="primary" size="small" @click="handleSearch"> 搜索 </wd-button>
		</view>

		<!-- 列表 -->
		<z-paging ref="pagingRef" v-model="dataList" :default-page-size="15" @query="handleQuery">
			<view v-for="item in dataList" :key="item.id" class="list-item">
				{{ item.title }}
			</view>

			<template #empty>
				<wd-status-tip image="search" tip="暂无数据" />
			</template>
		</z-paging>
	</view>
</template>

<script setup lang="ts">
import type { RepairOrder, RepairListParams } from "@/types/repair";
import { useRequest } from "alova/client";
import { ref } from "vue";
import { getRepairOrderList } from "@/api/repair";

/** z-paging 组件引用 */
const pagingRef = ref();

/** 列表数据 */
const dataList = ref<RepairOrder[]>([]);

/** 搜索条件 */
const searchName = ref("");
const selectedStatus = ref("");

/**
 * 使用 useRequest 管理请求状态
 */
const {
	loading,
	send: loadList,
	onSuccess,
	onError,
} = useRequest((params: RepairListParams) => getRepairOrderList(params), { immediate: false });

/** 成功回调 */
onSuccess((event) => {
	const result = event.data;
	pagingRef.value?.complete(result.ownerRepairs || []);
});

/** 失败回调 */
onError((error) => {
	console.error("加载列表失败:", error);
	pagingRef.value?.complete(false);
});

/**
 * z-paging 的 @query 回调
 */
function handleQuery(pageNo: number, pageSize: number) {
	loadList({
		page: pageNo,
		row: pageSize,
		repairName: searchName.value || undefined,
		state: selectedStatus.value || undefined,
	});
}

/**
 * 搜索处理
 * @description 重置到第一页并刷新
 */
function handleSearch() {
	pagingRef.value?.reload();
}

/**
 * 筛选条件变化
 */
function handleFilterChange() {
	pagingRef.value?.reload();
}
</script>
```

## 6. 注意事项

### 6.1 避免的错误模式

|             错误模式             |                  原因                  |              正确做法               |
| :------------------------------: | :------------------------------------: | :---------------------------------: |
|    在 @query 中使用 try/catch    | 违反 api-migration 禁止 try/catch 规范 |     使用 onSuccess/onError 回调     |
| 在 @query 中直接调用 uni.request |       未使用 useRequest 管理状态       |    使用 useRequest 的 send 方法     |
|      手动管理 loading 状态       |         useRequest 已自动管理          | 直接使用 useRequest 的 loading 状态 |
|  在 onError 中重复显示错误提示   |          全局拦截器已自动处理          |  仅记录日志和调用 complete(false)   |

### 6.2 useRequest 的 immediate: false 必要性

由于 z-paging 会在组件挂载时自动触发 `@query` 事件，因此 `useRequest` 必须设置 `immediate: false`，避免重复请求：

```typescript
const { send: loadList } = useRequest(
	(params) => getRepairOrderList(params),
	{ immediate: false }, // 必须设置，由 z-paging 控制请求时机
);
```

### 6.3 z-paging 的 auto 属性

如果设置 `:auto="false"`，z-paging 不会在挂载时自动触发 `@query`，需要手动调用 `reload()`：

```typescript
onMounted(() => {
	// 手动触发首次加载
	setTimeout(() => {
		pagingRef.value?.reload();
	}, 100);
});
```

## 7. 总结

### 7.1 适配核心原则

1. **使用 useRequest 管理请求**：符合 api-migration 规范
2. **在回调钩子中调用 complete**：将 z-paging 的完成通知放在 onSuccess/onError 中
3. **不使用 try/catch**：遵循回调钩子模式
4. **保持职责分离**：错误提示由全局拦截器处理，组件层仅负责日志和 UI 状态

### 7.2 最佳实践模板

```typescript
// 1. 定义 useRequest
const { send: loadList, onSuccess, onError } = useRequest((params) => getXxxList(params), { immediate: false });

// 2. 在 onSuccess 中调用 complete
onSuccess((event) => {
	pagingRef.value?.complete(event.data.list || []);
});

// 3. 在 onError 中调用 complete(false)
onError((error) => {
	console.error("加载失败:", error);
	pagingRef.value?.complete(false);
});

// 4. @query 回调中触发请求
function handleQuery(pageNo: number, pageSize: number) {
	loadList({ page: pageNo, row: pageSize });
}
```

这种适配方案既满足了 `api-migration` 子代理对 useRequest 和回调钩子的要求，又正确实现了 z-paging 的分页加载功能。
