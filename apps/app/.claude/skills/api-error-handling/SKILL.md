---
name: api-error-handling
description: |
  接口错误提示能力 - 提供统一的接口错误提示标准和实施方案，基于 wot-design-uni 和 Alova useRequest 回调模式。

  触发条件（满足任意一项即触发）：
  - 编写任何 API 接口调用代码（使用 useRequest）
  - 处理 useRequest 的 onError 回调
  - 实现全局错误拦截逻辑
  - 用户提及"接口错误提示"、"错误处理"、"Toast 提示"等关键词
  - 从 Vue2 迁移 API 调用（需要添加错误处理）
  - 实现表单提交、列表加载等涉及 API 的功能

  必须协同的技能：
  - api-migration（API 接口迁移时）
  - z-paging-integration（分页列表时）
  - use-wd-form（表单提交时）

  禁止项：
  - 禁止使用 try/catch 包装 send() 函数
  - 禁止在组件内手动显示错误 Toast（全局拦截器已处理）
  - 禁止使用 immediate: true（必须手动触发请求）
  - 禁止在 onError 中重复显示错误提示

  覆盖场景：几乎所有 API 调用都需要此技能，包括列表查询、详情查询、表单提交、数据删除、状态更新等。
---

# 接口错误提示能力

## ⚠️ 多技能协同

常见组合场景：

- API 调用：与 `api-migration` 协同
- 分页列表：与 `z-paging-integration` + `api-migration` 协同
- 表单提交：与 `use-wd-form` + `api-migration` 协同

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

---

## ⚠️ 实施前必读（Critical）

**🚨 禁止直接编写代码！必须先完成：**

1. ✅ **第一步：阅读参考文件**
   - 必读：`src/http/alova.ts`（全局错误拦截实现）
   - 推荐：`src/pages-sub/repair/pool-list.vue`（错误处理示例）
   - 必读：本技能文件的完整内容

2. ✅ **第二步：理解核心规范**
   - **必须**使用 `useRequest` Hook
   - **必须**设置 `immediate: false`
   - **必须**使用 `onSuccess`/`onError` 回调
   - **禁止**使用 `try/catch` 包装 `send()`

3. ✅ **第三步：明确错误处理层次**
   - 全局层：自动错误提示（已在 alova.ts 实现）
   - 组件层：业务逻辑处理（onError 回调）

### 🚫 常见错误（严禁犯）

|      ❌ 错误写法       |     ✅ 正确写法      |      说明      |
| :--------------------: | :------------------: | :------------: |
| `try { await send() }` | `send() + onError()` | 禁止 try/catch |
|   `immediate: true`    |  `immediate: false`  |  禁止自动执行  |
|     不写 `onError`     | `onError(() => {})`  |  必须处理错误  |
|    组件内手动 Toast    |     依赖全局拦截     | 全局已自动提示 |

## 1. 核心架构约束

本项目接口请求遵循以下强制规范：

1. **必须使用 useRequest**：所有接口调用都必须通过 Alova 的 `useRequest` 管理状态
2. **必须设置 immediate: false**：禁止自动执行请求，必须手动触发
3. **必须使用回调钩子**：使用 `onSuccess`、`onError`、`onComplete` 处理请求结果
4. **禁止使用 try/catch**：不允许使用 try/catch 包装 send 函数调用

## 2. 双层错误处理机制

|      层级      |         职责         |            实现位置            |
| :------------: | :------------------: | :----------------------------: |
| **全局拦截层** | 自动错误提示（默认） | `src/http/alova.ts` responded  |
| **组件回调层** |  日志记录、状态恢复  | useRequest 的 onError 回调钩子 |

### 2.1 设计原则

1. **一致性**: 全部使用 wot-design-uni Toast（通过 useGlobalToast）
2. **用户友好**: 错误信息通俗易懂，避免技术术语
3. **分级处理**: 根据错误严重程度选择合适的提示方式
4. **职责分离**: 全局层自动提示，组件层专注业务逻辑
5. **可配置性**: 支持静默处理和自定义处理

## 3. 错误级别定义

|   级别    |        错误类型        |         处理方式          |          示例          |
| :-------: | :--------------------: | :-----------------------: | :--------------------: |
| L1 - 致命 |  认证过期、服务器宕机  |  Message 弹框 + 跳转处理  | 登录已过期，请重新登录 |
| L2 - 严重 |  权限不足、数据不存在  | Toast 错误提示 + 交互指导 |  您没有权限执行此操作  |
| L3 - 一般 | 业务逻辑错误、参数错误 |      Toast 错误提示       |    手机号格式不正确    |
| L4 - 轻微 |     网络波动、超时     |  Toast 警告提示（短暂）   |  网络异常，请稍后重试  |

## 4. 核心工具类

### 4.1 ApiErrorHandler 工具类

```typescript
// src/utils/api-error-handler.ts
import { useGlobalToast } from "@/hooks/useGlobalToast";

/** 错误级别枚举 */
export enum ErrorLevel {
	FATAL = "fatal",
	SEVERE = "severe",
	NORMAL = "normal",
	LIGHT = "light",
}

/** API 错误信息接口 */
export interface ApiErrorInfo {
	level: ErrorLevel;
	message: string;
	code?: number | string;
}

/** 错误处理选项 */
export interface ErrorHandlerOptions {
	shouldShowError?: boolean;
}

/**
 * API 错误处理器
 * @description 统一的接口错误提示处理工具，供全局拦截器和组件层使用
 */
export class ApiErrorHandler {
	/**
	 * 统一错误处理入口
	 * @example ApiErrorHandler.handle({ level: ErrorLevel.NORMAL, message: '操作失败' })
	 */
	static handle(error: ApiErrorInfo, options: ErrorHandlerOptions = {}): void {
		const { shouldShowError = true } = options;
		if (!shouldShowError) return;

		const toast = useGlobalToast();

		switch (error.level) {
			case ErrorLevel.FATAL:
				this.handleFatalError(error.message, error.code);
				break;
			case ErrorLevel.SEVERE:
				toast.error({ msg: error.message, duration: 3000 });
				break;
			case ErrorLevel.NORMAL:
				toast.error({ msg: error.message, duration: 2000 });
				break;
			case ErrorLevel.LIGHT:
				toast.warning({ msg: error.message, duration: 1500 });
				break;
		}
	}

	/**
	 * 处理致命错误
	 * @description 使用 Message 弹框，并提供跳转处理
	 */
	private static handleFatalError(message: string, code?: number | string): void {
		uni.showModal({
			title: "系统错误",
			content: message,
			showCancel: false,
			success: () => {
				uni.reLaunch({ url: "/pages/index/index" });
			},
		});
	}

	/**
	 * 映射 HTTP 状态码到错误信息
	 * @example const error = ApiErrorHandler.mapStatusCode(404, '用户不存在')
	 */
	static mapStatusCode(statusCode: number, originalMessage?: string): ApiErrorInfo {
		const errorMap: Record<number, { level: ErrorLevel; message: string }> = {
			400: { level: ErrorLevel.NORMAL, message: "请求参数错误" },
			401: { level: ErrorLevel.FATAL, message: "登录已过期，请重新登录" },
			403: { level: ErrorLevel.SEVERE, message: "权限不足，无法访问" },
			404: { level: ErrorLevel.NORMAL, message: "请求的资源不存在" },
			500: { level: ErrorLevel.SEVERE, message: "服务器内部错误" },
			502: { level: ErrorLevel.LIGHT, message: "网关错误，请稍后重试" },
			503: { level: ErrorLevel.SEVERE, message: "服务暂时不可用" },
		};

		const defaultError = { level: ErrorLevel.NORMAL, message: "请求失败，请稍后重试" };
		const error = errorMap[statusCode] || defaultError;

		return { ...error, code: statusCode, message: originalMessage || error.message };
	}

	/**
	 * 映射业务错误码到错误信息
	 * @example const error = ApiErrorHandler.mapBusinessCode('1001', '余额不足')
	 */
	static mapBusinessCode(code: string | number, message: string): ApiErrorInfo {
		return { level: ErrorLevel.NORMAL, message, code };
	}
}
```

## 5. Alova 响应拦截器配置

```typescript
// src/http/alova.ts 关键部分
import { ApiErrorHandler, ErrorLevel } from "@/utils/api-error-handler";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const alovaInstance = createAlova({
	baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
	// ... 其他配置 ...

	responded: onResponseRefreshToken((response, method) => {
		const { config } = method;
		const { requestType } = config;
		const { statusCode, data: rawData, errMsg } = response as UniNamespace.RequestSuccessCallbackResult;

		// 处理特殊请求类型（上传/下载）
		if (requestType === "upload" || requestType === "download") {
			return response;
		}

		const toast = useGlobalToast();
		const shouldShowToast = config.meta?.toast !== false;

		// 处理 HTTP 状态码错误
		if (statusCode !== 200) {
			const errorInfo = ApiErrorHandler.mapStatusCode(statusCode);

			if (shouldShowToast) {
				ApiErrorHandler.handle(errorInfo);
			}

			throw new Error(`${errorInfo.message}：${errMsg}`);
		}

		// 处理业务逻辑错误
		const { code, message, data } = rawData as IResponse;

		if (code !== ResultEnum.Success && code !== String(ResultEnum.Success)) {
			const errorInfo = ApiErrorHandler.mapBusinessCode(code, message);

			if (shouldShowToast) {
				ApiErrorHandler.handle(errorInfo);
			}

			throw new Error(`请求错误[${code}]：${message}`);
		}

		// 处理成功响应，返回业务数据
		return data;
	}),
});
```

## 6. 组件层使用规范

### 6.1 标准列表请求场景

```vue
<template>
	<view class="page-container">
		<wd-button :loading="loading" @click="handleRefresh">刷新数据</wd-button>

		<view v-if="repairData?.list?.length">
			<view v-for="item in repairData.list" :key="item.repairId" class="list-item">
				{{ item.title }}
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { useRequest } from "alova/client";
import { getRepairOrderList } from "@/api/repair";
import { ref, onMounted } from "vue";
import type { RepairListParams } from "@/types/repair";

/** 查询参数 */
const queryParams = ref<RepairListParams>({
	page: 1,
	row: 10,
	status: undefined,
});

/**
 * 请求管理 - 使用 useRequest + 链式回调钩子
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
	loading,
	data: repairData,
	send: loadRepairList,
} = useRequest(() => getRepairOrderList(queryParams.value), { immediate: false })
	.onSuccess((result) => {
		console.log("维修工单列表加载成功:", result);
	})
	.onError((error) => {
		console.error("维修工单列表加载失败:", error);
		// 不需要重复显示错误提示
	})
	.onComplete(() => {
		uni.stopPullDownRefresh();
	});

/** 刷新数据 */
function handleRefresh() {
	loadRepairList();
}

/** 页面加载时手动触发 */
onMounted(() => {
	loadRepairList();
});
</script>
```

### 6.2 表单提交场景

```vue
<template>
	<view class="form-container">
		<wd-input v-model="formData.title" label="标题" placeholder="请输入标题" />
		<wd-input v-model="formData.description" label="描述" placeholder="请输入描述" />
		<wd-button :loading="submitting" @click="handleSubmit">提交</wd-button>
	</view>
</template>

<script setup lang="ts">
import { useRequest } from "alova/client";
import { createRepairOrder } from "@/api/repair";
import { reactive } from "vue";
import { useGlobalToast } from "@/hooks/useGlobalToast";
import type { CreateRepairReq } from "@/types/repair";

const toast = useGlobalToast();

/** 表单数据 */
const formData = reactive<CreateRepairReq>({
	title: "",
	description: "",
	repairType: "其他维修",
});

/**
 * 表单提交请求管理 - 链式回调写法
 * 🔴 强制规范：必须设置 immediate: false
 */
const { loading: submitting, send: submitRepair } = useRequest((data: CreateRepairReq) => createRepairOrder(data), {
	immediate: false,
})
	.onSuccess((result) => {
		console.log("创建成功:", result);
		toast.success("维修工单创建成功");

		// 重置表单
		Object.assign(formData, {
			title: "",
			description: "",
			repairType: "其他维修",
		});
	})
	.onError((error) => {
		console.error("创建失败:", error);
	});

/** 表单提交处理 */
function handleSubmit() {
	// 表单验证
	if (!formData.title) {
		toast.warning("请输入标题");
		return;
	}

	// 手动触发请求
	submitRepair(formData);
}
</script>
```

### 6.3 静默请求场景

当需要禁用自动错误提示时，使用 `meta.toast: false`：

```vue
<template>
	<view class="page-container">
		<wd-button @click="handleSilentRequest">静默请求</wd-button>
	</view>
</template>

<script setup lang="ts">
import { useRequest } from "alova/client";
import { getRepairDetail } from "@/api/repair";
import { ApiErrorHandler, ErrorLevel } from "@/utils/api-error-handler";

/**
 * 静默请求 - 禁用全局错误提示 - 链式回调写法
 * @description 使用 meta.toast: false 禁用自动错误提示，在 onError 中自定义处理
 */
const { send: loadDetail } = useRequest((repairId: string) => getRepairDetail({ repairId }).setMeta({ toast: false }), {
	immediate: false,
})
	.onSuccess((result) => {
		console.log("详情加载成功:", result);
	})
	.onError((error) => {
		console.error("详情加载失败:", error);

		// 自定义错误处理逻辑
		ApiErrorHandler.handle({
			level: ErrorLevel.LIGHT,
			message: "加载失败，将使用缓存数据",
		});

		// 或者使用静默处理，不显示任何提示
		// 直接使用缓存数据等兜底逻辑
	});

/** 触发静默请求 */
function handleSilentRequest() {
	loadDetail("REP_001");
}
</script>
```

### 6.4 分页加载更多场景

```vue
<template>
	<view class="list-container">
		<view v-for="item in activityList" :key="item.activitiesId" class="list-item">
			{{ item.title }}
		</view>

		<view v-if="hasMore" class="load-more" @click="handleLoadMore">
			{{ loadingMore ? "加载中..." : "加载更多" }}
		</view>
	</view>
</template>

<script setup lang="ts">
import { useRequest } from "alova/client";
import { getActivityList } from "@/api/activity";
import { ref, onMounted } from "vue";
import type { Activity } from "@/types/activity";

const currentPage = ref(1);
const hasMore = ref(true);
const activityList = ref<Activity[]>([]);

/**
 * 首次加载请求 - 链式回调写法
 * 🔴 强制规范：必须设置 immediate: false
 */
const { loading, send: loadList } = useRequest((page: number) => getActivityList({ page, row: 10 }), {
	immediate: false,
})
	.onSuccess((result) => {
		activityList.value = result.activitiess || [];
		currentPage.value = 1;
		hasMore.value = result.activitiess?.length >= 10;
	})
	.onError((error) => {
		console.error("加载失败:", error);
		// 错误提示已自动处理
	});

/**
 * 加载更多请求 - 链式回调写法
 * 🔴 强制规范：必须设置 immediate: false
 */
const { loading: loadingMore, send: loadMore } = useRequest((page: number) => getActivityList({ page, row: 10 }), {
	immediate: false,
})
	.onSuccess((result) => {
		if (result?.activitiess?.length) {
			activityList.value.push(...result.activitiess);
			currentPage.value++;
			hasMore.value = result.activitiess.length >= 10;
		} else {
			hasMore.value = false;
		}
	})
	.onError((error) => {
		console.error("加载更多失败:", error);
		// 错误提示已自动处理
	});

/** 下拉刷新 */
function handleRefresh() {
	loadList(1);
}

/** 上拉加载更多 */
function handleLoadMore() {
	if (!loadingMore.value && hasMore.value) {
		loadMore(currentPage.value + 1);
	}
}

/** 页面加载时手动触发 */
onMounted(() => {
	loadList(1);
});
</script>
```

## 7. 错误处理职责划分

### 7.1 职责分离原则

|      层级      |                       职责                       |           代码位置            |
| :------------: | :----------------------------------------------: | :---------------------------: |
| **全局拦截层** | 自动错误提示（默认行为，可通过 meta.toast 禁用） | `src/http/alova.ts` responded |
| **组件回调层** |         日志记录、状态恢复、业务逻辑处理         |  useRequest 的 onError 回调   |

### 7.2 onError 回调处理指南

|     场景     |     在 onError 中的处理     |                说明                 |
| :----------: | :-------------------------: | :---------------------------------: |
| **默认情况** |         仅记录日志          |   错误提示已由全局拦截器自动处理    |
| **静默请求** |       自定义错误处理        | 使用 meta.toast: false 后需手动处理 |
| **状态恢复** | 重置 loading 状态、恢复数据 |          用于 UI 状态管理           |
| **兜底逻辑** | 使用缓存数据、显示占位内容  |            保证用户体验             |

## 8. Toast 工具使用

```typescript
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

// 1. 成功提示 - 操作成功时使用
toast.success("操作成功");

// 2. 错误提示 - 业务错误时使用
toast.error("操作失败：用户名已存在");

// 3. 警告提示 - 轻微问题或提醒时使用
toast.warning("请先选择楼栋");

// 4. 信息提示 - 普通信息时使用
toast.info("正在处理中...");

// 5. 带配置的提示
toast.error({ msg: "网络连接异常，请检查网络设置", duration: 3000 });
```

## 9. 关键注意事项

1. **向后兼容**: 保持现有 API 接口不变，新增可选参数
2. **渐进式改造**: 先新功能使用新方案，逐步改造旧功能
3. **多端适配**: 确保在不同平台下（H5、小程序、APP）的一致性表现
4. **禁止 try/catch**: 严格遵循 api-migration 规范，使用回调钩子处理
5. **性能考虑**: 避免频繁的错误提示影响性能
6. **不要重复提示**: 全局拦截器已自动处理错误提示，onError 回调中不要重复显示
