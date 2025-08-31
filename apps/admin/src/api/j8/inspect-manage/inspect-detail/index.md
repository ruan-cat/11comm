# J8 巡检明细模块接口使用文档

## 模块概述

巡检明细模块提供了查看巡检执行详细记录和结果的功能，支持按条件查询和分页获取巡检明细列表。

## 接口列表

### 1. 获取巡检明细列表（条件+分页）

**接口名称**: `queryInspectDetailList`  
**功能描述**: 获取巡检明细列表，支持按计划巡检人和时间范围进行条件查询，提供分页功能  
**接口类型**: Query 参数传递  
**请求方法**: GET

## 类型定义

### 巡检明细数据模型

```typescript
export interface InspectDetailData {
	/** 实际巡检时间 */
	actPatrolTime?: string;
	/** 实际巡检人名称 */
	actUserName?: string;
	/** 创建时间 */
	createTime?: string;
	/** 巡检方式 */
	inspectionMethod?: string;
	/** 巡检点名称 */
	inspectionName?: string;
	/** 巡检人结束时间 */
	inspectionPersonEndTime?: string;
	/** 巡检人开始时间 */
	inspectionPersonStartTime?: string;
	/** 巡检照片 */
	inspectionPhoto?: string;
	/** 巡检计划名称 */
	inspectionPlanName?: string;
	/** 计划巡检人名称 */
	inspectionPlanPersonName?: string;
	/** 巡检路线名称 */
	inspectionRouteName?: string;
	/** 实际巡检签到状态 */
	inspectionState?: string;
	/** 巡检任务状态 */
	inspectionTaskStatus?: string;
	/** 位置信息 */
	locationInformation?: string;
	/** 巡检情况 */
	patrolType?: string;
	/** 巡检点结束时间 */
	pointEndTime?: string;
	/** 巡检点开始时间 */
	pointStartTime?: string;
	/** 巡检点状态 */
	state?: string;
	/** 任务明细ID */
	taskDetailId?: string;
}
```

### 查询参数定义

```typescript
export interface QueryInspectDetailListParams {
	/** 查询页码（必填） */
	pageIndex: number;
	/** 查询条数（必填） */
	pageSize: number;
	/** 计划巡检人名称（可选） */
	planUserName?: string;
	/** 巡检点结束时间（可选） */
	pointEndTime?: string;
	/** 巡检点开始时间（可选） */
	pointStartTime?: string;
}
```

## 基础用法

### 导入接口

```typescript
import { queryInspectDetailList } from "@/api/j8/inspect-manage/inspect-detail";
```

### 简单查询

```typescript
const { execute, data, isLoading, error } = queryInspectDetailList({
	onSuccess(response) {
		console.log("查询成功", response);
	},
	onError(error) {
		console.error("查询失败", error);
	},
});

// 执行查询
await execute({
	params: {
		pageIndex: 1,
		pageSize: 10,
	},
});
```

## 高级用法

### 按巡检人查询

```typescript
const { execute, data } = queryInspectDetailList({
	onSuccess(response) {
		console.log(`找到 ${response.total} 条 ${planUserName} 的巡检记录`);
	},
});

await execute({
	params: {
		pageIndex: 1,
		pageSize: 20,
		planUserName: "张三", // 按计划巡检人筛选
	},
});
```

### 按时间范围查询

```typescript
const { execute, data } = queryInspectDetailList({
	onSuccess(response) {
		console.log("时间范围内的巡检记录", response.rows);
	},
});

await execute({
	params: {
		pageIndex: 1,
		pageSize: 50,
		pointStartTime: "2024-01-01 00:00:00", // 开始时间
		pointEndTime: "2024-01-31 23:59:59", // 结束时间
	},
});
```

### 综合条件查询

```typescript
const { execute, data } = queryInspectDetailList({
	onSuccess(response) {
		console.log("综合查询结果", response);
	},
	onError(error) {
		console.error("查询出错", error);
	},
});

await execute({
	params: {
		pageIndex: 1,
		pageSize: 10,
		planUserName: "李四", // 巡检人筛选
		pointStartTime: "2024-01-11 00:00:00", // 时间范围开始
		pointEndTime: "2024-01-11 23:59:59", // 时间范围结束
	},
});
```

## 响应式数据使用

### 在 Vue 组件中使用

```vue
<template>
	<div>
		<!-- 加载状态 -->
		<div v-if="isLoading">正在加载巡检明细...</div>

		<!-- 错误提示 -->
		<div v-else-if="error" class="error">查询失败: {{ error.message }}</div>

		<!-- 数据展示 -->
		<div v-else-if="data">
			<h3>巡检明细列表 (共 {{ data.total }} 条)</h3>
			<div v-for="item in data.rows" :key="item.taskDetailId">
				<h4>{{ item.inspectionPlanName }}</h4>
				<p>巡检点: {{ item.inspectionName }}</p>
				<p>巡检人: {{ item.inspectionPlanPersonName }}</p>
				<p>巡检时间: {{ item.actPatrolTime }}</p>
				<p>状态: {{ item.inspectionTaskStatus }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { queryInspectDetailList } from "@/api/j8/inspect-manage/inspect-detail";

const searchParams = ref({
	pageIndex: 1,
	pageSize: 10,
	planUserName: "",
	pointStartTime: "",
	pointEndTime: "",
});

const { execute, data, isLoading, error } = queryInspectDetailList({
	onSuccess(response) {
		console.log("查询成功，共", response.total, "条记录");
	},
});

// 搜索函数
const handleSearch = async () => {
	await execute({
		params: searchParams.value,
	});
};

// 初始化加载
handleSearch();
</script>
```

## 分页处理

### 分页组件集成

```typescript
import { ref, computed } from "vue";
import { queryInspectDetailList } from "@/api/j8/inspect-manage/inspect-detail";

const currentPage = ref(1);
const pageSize = ref(10);
const searchForm = ref({
	planUserName: "",
	pointStartTime: "",
	pointEndTime: "",
});

const { execute, data, isLoading } = queryInspectDetailList({
	onSuccess(response) {
		console.log(`第 ${currentPage.value} 页数据加载完成`);
	},
});

// 计算属性
const totalPages = computed(() => {
	return data.value ? data.value.pages : 0;
});

const totalCount = computed(() => {
	return data.value ? data.value.total : 0;
});

// 分页改变处理
const handlePageChange = async (page: number) => {
	currentPage.value = page;
	await loadData();
};

// 页大小改变处理
const handleSizeChange = async (size: number) => {
	pageSize.value = size;
	currentPage.value = 1; // 重置到第一页
	await loadData();
};

// 加载数据
const loadData = async () => {
	await execute({
		params: {
			pageIndex: currentPage.value,
			pageSize: pageSize.value,
			...searchForm.value,
		},
	});
};
```

## 错误处理

### 网络错误处理

```typescript
const { execute, data, error } = queryInspectDetailList({
	onError(err) {
		// 根据错误类型进行不同处理
		if (err.code === "NETWORK_ERROR") {
			console.error("网络连接失败，请检查网络");
		} else if (err.code === "TIMEOUT") {
			console.error("请求超时，请稍后重试");
		} else if (err.code === "UNAUTHORIZED") {
			console.error("未授权访问，请重新登录");
		} else {
			console.error("查询失败:", err.message);
		}
	},
});
```

### 重试机制

```typescript
const maxRetries = 3;
let retryCount = 0;

const executeWithRetry = async (params: any) => {
	try {
		await execute(params);
		retryCount = 0; // 成功后重置重试次数
	} catch (error) {
		if (retryCount < maxRetries) {
			retryCount++;
			console.warn(`请求失败，正在进行第 ${retryCount} 次重试...`);
			setTimeout(() => executeWithRetry(params), 1000 * retryCount);
		} else {
			console.error("重试次数已达上限，请求失败");
		}
	}
};
```

## 数据格式说明

### 时间格式

所有时间字段都使用 `YYYY-MM-DD HH:mm:ss` 格式，例如：

```typescript
pointStartTime: "2024-01-11 00:00:00";
pointEndTime: "2024-01-11 23:59:59";
```

### 状态字段

- `inspectionState`: 实际巡检签到状态 ("1" 表示已签到)
- `inspectionTaskStatus`: 巡检任务状态 ("未开始"、"进行中"、"已完成")
- `state`: 巡检点状态 ("未开始"、"进行中"、"已完成")
- `patrolType`: 巡检情况 ("正常"、"异常"、"未开始")

### 照片字段

`inspectionPhoto` 字段包含巡检现场照片的 URL 地址，可直接用于图片显示。

## 性能优化建议

### 1. 分页大小控制

建议根据实际场景设置合适的分页大小：

```typescript
// 移动端
pageSize: 10;

// 桌面端
pageSize: 20;

// 数据导出
pageSize: 100;
```

### 2. 缓存策略

```typescript
import { ref } from "vue";

const cache = new Map();

const getCacheKey = (params: QueryInspectDetailListParams) => {
	return JSON.stringify(params);
};

const { execute: originalExecute, data } = queryInspectDetailList({
	onSuccess(response) {
		// 缓存结果
		const key = getCacheKey(lastParams.value);
		cache.set(key, response);
	},
});

const lastParams = ref<QueryInspectDetailListParams>();

const executeWithCache = async (params: any) => {
	const key = getCacheKey(params.params);

	// 检查缓存
	if (cache.has(key)) {
		data.value = cache.get(key);
		return;
	}

	lastParams.value = params.params;
	await originalExecute(params);
};
```

### 3. 防抖处理

对于搜索功能，建议使用防抖来优化性能：

```typescript
import { debounce } from "lodash-es";

const debouncedSearch = debounce(async () => {
	await execute({
		params: searchForm.value,
	});
}, 300);
```

## 常见问题

### Q: 时间查询没有返回数据？

A: 请检查时间格式是否正确，确保使用 `YYYY-MM-DD HH:mm:ss` 格式，并且开始时间小于结束时间。

### Q: 分页数据不正确？

A: 确保 `pageIndex` 从 1 开始，而不是从 0 开始。检查 `pageSize` 是否在合理范围内（建议 1-100）。

### Q: 接口返回 401 错误？

A: 检查用户登录状态和权限，确保有访问巡检明细的权限。

### Q: 数据量大时查询慢？

A: 建议使用时间范围查询来缩小数据范围，或者增加更多筛选条件来减少结果集。

## 更多示例

更多使用示例请参考测试文件：`index.test.ts`

---

**相关文档**:

- [J8 巡检管理模块总览](../index.md)
- [useAxios-for-01s 使用文档](https://utils.ruan-cat.com/vueuse/useAxios-for-01s/use.html)
