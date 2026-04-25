# uni-app 前后端集成

> 补充说明：本文件下面的大段 `/api/**`、`alovaBackend`、`VITE_USE_MOCK` 示例，更适合“未来独立真实后端”场景。
>
> 对于**当前仓库**，请优先参考仓库根 `README.md`、`.claude/skills/api-migration/SKILL.md` 与 `src/http/runtime-base.ts`：
>
> 1. 当前仓库通过 `VITE_API_RUNTIME` 在 `mock` / `nitro-vite` / `nitro-standalone` 间切换。
> 2. 当前前端仍然继续使用 `/app/**`、`/callComponent/**` 旧业务路径，而不是统一改成 `/api/**`。
> 3. 当前本地 mock 的权威实现入口已迁移到 `server/modules/*/{repository,endpoints}.ts`，`src/api/mock/*.mock.ts` 只是 H5 Vite mock 薄包装层。

> 本文档介绍如何将 uni-app 前端与 Nitro 后端进行集成。

---

## 1. 架构概述

```plain
┌─────────────────────────────────────────────────────────────┐
│                      开发环境                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  uni-app (前端)              Nitro (后端)                   │
│  http://localhost:3000       http://localhost:3000          │
│       │                            │                        │
│       │     HTTP API 请求          │                        │
│       ├───────────────────────────▶│                        │
│       │                            │                        │
│       │◀───────────────────────────┤                        │
│       │     JSON 响应              │                        │
│                                    │                        │
│                                    ▼                        │
│                            ┌─────────────┐                  │
│                            │ Neon Postgres│                  │
│                            └─────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 环境变量配置

### 2.1. uni-app 前端环境变量

```env
# env/.env.development (开发环境)
VITE_API_BASE_URL=http://localhost:3000

# env/.env.test (测试环境)
VITE_API_BASE_URL=https://api-test.your-domain.com

# env/.env.production (生产环境)
VITE_API_BASE_URL=https://api.your-domain.com
```

### 2.2. 类型定义

```typescript
// src/types/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
```

---

## 3. Alova 请求配置

### 3.1. 创建 Alova 实例

```typescript
// src/http/alova-backend.ts
import { createAlova } from "alova";
import AdapterUniapp from "@alova/adapter-uniapp";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

/**
 * 连接后端 API 的 Alova 实例
 * 用于替代 Mock 接口，连接真实的 Nitro 后端
 */
export const alovaBackend = createAlova({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	...AdapterUniapp(),

	// 请求超时
	timeout: 10000,

	// 请求前拦截
	beforeRequest: (method) => {
		// 可以在这里添加 token 等
		// const token = uni.getStorageSync('token');
		// if (token) {
		//   method.config.headers['Authorization'] = `Bearer ${token}`;
		// }
	},

	// 响应拦截
	responded: {
		// 成功响应
		onSuccess: async (response) => {
			const data = response.data as {
				success: boolean;
				message: string;
				data: unknown;
			};

			// 检查业务状态
			if (!data.success) {
				// 显示错误提示
				toast.error(data.message || "请求失败");
				throw new Error(data.message || "请求失败");
			}

			return data.data;
		},

		// 错误响应
		onError: (error) => {
			console.error("API 请求错误:", error);

			// 显示错误提示
			toast.error(error.message || "网络错误");

			throw error;
		},
	},
});
```

### 3.2. 保留原 Mock 实例

```typescript
// src/http/alova-instance.ts
// 这段仅是“独立后端方案”的过渡示意
// 当前仓库实际请优先复用现有 src/http/alova.ts + runtime-base.ts
```

---

## 4. API 定义

### 4.1. 类型定义

```typescript
// src/api/types/repair.ts

/** 维修工单状态 */
export type RepairStatus = "pending" | "assigned" | "processing" | "completed" | "cancelled";

/** 维修工单类别 */
export type RepairCategory = "水电" | "门窗" | "电梯" | "公共设施" | "其他";

/** 维修工单 */
export interface RepairOrder {
	id: string;
	title: string;
	description?: string;
	category?: RepairCategory;
	status: RepairStatus;
	priority?: number;
	address?: string;
	contact?: string;
	phone?: string;
	assigneeId?: string;
	assigneeName?: string;
	createdAt: string;
	updatedAt: string;
	completedAt?: string;
}

/** 创建维修工单参数 */
export interface CreateRepairParams {
	title: string;
	description?: string;
	category?: RepairCategory;
	address?: string;
	contact?: string;
	phone?: string;
	priority?: number;
}

/** 更新维修工单参数 */
export interface UpdateRepairParams {
	title?: string;
	description?: string;
	status?: RepairStatus;
	priority?: number;
	assigneeId?: string;
	assigneeName?: string;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
}
```

### 4.2. API 函数

```typescript
// src/api/repair-backend.ts
import { alovaBackend } from "@/http/alova-backend";
import type { RepairOrder, CreateRepairParams, UpdateRepairParams, PaginatedResponse } from "./types/repair";

/**
 * 获取维修工单列表
 * @param params - 查询参数
 */
export const getRepairListApi = (params?: { status?: string; search?: string; page?: number; pageSize?: number }) => {
	return alovaBackend.Get<PaginatedResponse<RepairOrder>>("/api/repair/list", {
		params,
	});
};

/**
 * 获取维修工单详情
 * @param id - 工单 ID
 */
export const getRepairDetailApi = (id: string) => {
	return alovaBackend.Get<RepairOrder>(`/api/repair/${id}`);
};

/**
 * 创建维修工单
 * @param data - 工单数据
 */
export const createRepairApi = (data: CreateRepairParams) => {
	return alovaBackend.Post<RepairOrder>("/api/repair/create", data);
};

/**
 * 更新维修工单
 * @param id - 工单 ID
 * @param data - 更新数据
 */
export const updateRepairApi = (id: string, data: UpdateRepairParams) => {
	return alovaBackend.Put<RepairOrder>(`/api/repair/${id}`, data);
};

/**
 * 删除维修工单
 * @param id - 工单 ID
 */
export const deleteRepairApi = (id: string) => {
	return alovaBackend.Delete<null>(`/api/repair/${id}`);
};
```

---

## 5. 页面使用示例

### 5.1. 列表页面

```vue
<script setup lang="ts">
<!--
  维修工单列表页 (连接后端版本)
  访问地址: http://localhost:3000/#/pages-sub/repair/list
-->
import { ref, onMounted } from "vue";
import { useRequest } from "alova/client";
import { getRepairListApi } from "@/api/repair-backend";
import type { RepairOrder } from "@/api/types/repair";

// 筛选条件
const status = ref<string>("");
const search = ref<string>("");

// 获取列表
const {
  data: listData,
  loading,
  send: loadList,
  onError,
} = useRequest(
  () =>
    getRepairListApi({
      status: status.value || undefined,
      search: search.value || undefined,
      page: 1,
      pageSize: 20,
    }),
  {
    immediate: false,
  }
);

// 错误处理
onError((error) => {
  console.error("获取列表失败:", error);
});

// 刷新列表
function handleRefresh() {
  loadList();
}

// 筛选变更
function handleFilterChange() {
  loadList();
}

onMounted(() => {
  loadList();
});
</script>

<template>
	<view class="repair-list">
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<wd-search v-model="search" placeholder="搜索工单" @search="handleFilterChange" />
			<wd-picker v-model="status" :columns="['全部', '待处理', '处理中', '已完成']" @confirm="handleFilterChange" />
		</view>

		<!-- 列表 -->
		<view v-if="loading" class="loading">
			<wd-loading />
		</view>

		<view v-else-if="listData?.data?.length" class="list">
			<view
				v-for="item in listData.data"
				:key="item.id"
				class="list-item"
				@click="navigateTo(`/pages-sub/repair/detail?id=${item.id}`)"
			>
				<text class="title">{{ item.title }}</text>
				<wd-tag :type="getStatusType(item.status)">
					{{ getStatusText(item.status) }}
				</wd-tag>
			</view>
		</view>

		<view v-else class="empty">
			<wd-status-tip type="content" tip="暂无数据" />
		</view>
	</view>
</template>
```

### 5.2. 详情页面

```vue
<script setup lang="ts">
<!--
  维修工单详情页 (连接后端版本)
  访问地址: http://localhost:3000/#/pages-sub/repair/detail?id=xxx
-->
import { ref, onMounted } from "vue";
import { useRequest } from "alova/client";
import { getRepairDetailApi, updateRepairApi } from "@/api/repair-backend";
import type { RepairOrder } from "@/api/types/repair";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

// 获取页面参数
const props = defineProps<{
  id: string;
}>();

// 获取详情
const {
  data: detail,
  loading,
  send: loadDetail,
} = useRequest(() => getRepairDetailApi(props.id), {
  immediate: false,
});

// 更新状态
const { loading: updating, send: updateStatus } = useRequest(
  (status: string) => updateRepairApi(props.id, { status }),
  {
    immediate: false,
    onSuccess: () => {
      toast.success("更新成功");
      loadDetail(); // 刷新详情
    },
  }
);

// 处理状态变更
async function handleStatusChange(newStatus: string) {
  await updateStatus(newStatus);
}

onMounted(() => {
  loadDetail();
});
</script>

<template>
	<view class="repair-detail">
		<wd-loading v-if="loading" />

		<template v-else-if="detail">
			<wd-cell-group title="工单信息">
				<wd-cell title="标题" :value="detail.title" />
				<wd-cell title="状态">
					<template #value>
						<wd-tag :type="getStatusType(detail.status)">
							{{ getStatusText(detail.status) }}
						</wd-tag>
					</template>
				</wd-cell>
				<wd-cell title="描述" :value="detail.description || '无'" />
				<wd-cell title="地址" :value="detail.address || '无'" />
				<wd-cell title="联系人" :value="detail.contact || '无'" />
			</wd-cell-group>

			<!-- 操作按钮 -->
			<view class="actions">
				<wd-button
					v-if="detail.status === 'pending'"
					type="primary"
					:loading="updating"
					@click="handleStatusChange('processing')"
				>
					开始处理
				</wd-button>
				<wd-button
					v-if="detail.status === 'processing'"
					type="success"
					:loading="updating"
					@click="handleStatusChange('completed')"
				>
					完成工单
				</wd-button>
			</view>
		</template>
	</view>
</template>
```

### 5.3. 创建页面

```vue
<script setup lang="ts">
<!--
  创建维修工单页 (连接后端版本)
  访问地址: http://localhost:3000/#/pages-sub/repair/create
-->
import { ref, reactive } from "vue";
import { useRequest } from "alova/client";
import { createRepairApi } from "@/api/repair-backend";
import type { CreateRepairParams } from "@/api/types/repair";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

// 表单数据
const formData = reactive<CreateRepairParams>({
  title: "",
  description: "",
  category: "其他",
  address: "",
  contact: "",
  phone: "",
  priority: 3,
});

// 创建工单
const { loading, send: submitForm } = useRequest(
  () => createRepairApi(formData),
  {
    immediate: false,
    onSuccess: () => {
      toast.success("创建成功");
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    },
  }
);

// 表单提交
async function handleSubmit() {
  // 表单验证
  if (!formData.title.trim()) {
    toast.error("请输入标题");
    return;
  }

  await submitForm();
}
</script>

<template>
	<view class="repair-create">
		<wd-form>
			<wd-cell-group title="工单信息">
				<wd-input v-model="formData.title" label="标题" placeholder="请输入工单标题" required />
				<wd-textarea v-model="formData.description" label="描述" placeholder="请描述问题详情" />
				<wd-picker v-model="formData.category" label="类别" :columns="['水电', '门窗', '电梯', '公共设施', '其他']" />
			</wd-cell-group>

			<wd-cell-group title="联系信息">
				<wd-input v-model="formData.address" label="地址" placeholder="请输入维修地址" />
				<wd-input v-model="formData.contact" label="联系人" placeholder="请输入联系人" />
				<wd-input v-model="formData.phone" label="电话" placeholder="请输入联系电话" />
			</wd-cell-group>

			<view class="submit-btn">
				<wd-button type="primary" block :loading="loading" @click="handleSubmit"> 提交工单 </wd-button>
			</view>
		</wd-form>
	</view>
</template>
```

---

## 6. 迁移策略

### 6.1. 渐进式迁移

建议采用渐进式迁移，逐个模块替换 Mock 接口：

```typescript
// src/api/repair.ts (原 Mock 接口)
import { alovaInstance } from "@/http/alova-instance"; // Mock

// src/api/repair-backend.ts (新后端接口)
import { alovaBackend } from "@/http/alova-backend"; // 真实后端

// 页面中可以根据需要选择使用哪个
// import { getRepairListApi } from "@/api/repair";        // 使用 Mock
// import { getRepairListApi } from "@/api/repair-backend"; // 使用后端
```

### 6.2. 使用环境变量切换

```typescript
// src/api/repair.ts
import { alovaInstance } from "@/http/alova-instance";
import { alovaBackend } from "@/http/alova-backend";

// 根据环境变量决定使用哪个实例
const alova = import.meta.env.VITE_USE_MOCK === "true" ? alovaInstance : alovaBackend;

export const getRepairListApi = () => {
	return alova.Get("/api/repair/list");
};
```

```env
# env/.env.development
VITE_USE_MOCK=false  # 使用真实后端
# VITE_USE_MOCK=true  # 使用 Mock
```

---

## 7. 跨域配置

### 7.1. 后端 CORS 配置

已在 `nitro.config.ts` 中配置：

```typescript
routeRules: {
  "/api/**": {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  },
},
```

### 7.2. 前端代理配置 (可选)

如果需要在 Vite 中配置代理：

```typescript
// vite.config.ts
export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
});
```

---

## 8. 下一步

前后端集成完成后，继续阅读：

1. [07-deployment.md](./07-deployment.md) - 部署指南
