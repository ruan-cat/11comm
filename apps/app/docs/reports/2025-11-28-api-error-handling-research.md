<!--
  该文件现在不会被子代理直接引用 变成纯粹的技能文件
  .claude\skills\api-error-handling.md
-->

# 项目接口错误提示能力调研报告

## 1. 调研概述

### 1.1 调研目标

基于 `wot-design-uni` 组件库和 `unibest` 模板，全面调研本项目应如何实现优雅美观的接口请求错误提示能力，制定统一的错误提示标准和实施方案。

### 1.2 调研范围

- wot-design-uni 消息提示组件最佳实践
- unibest 模板错误处理机制
- 本项目现有 HTTP 请求封装和错误处理
- 本项目现有错误提示实现方式
- 统一接口错误提示方案设计

### 1.3 核心架构约束

**🔴 重要说明**：本项目接口请求遵循 `api-migration` 子代理规范，必须满足以下要求：

1. **必须使用 useRequest**：所有接口调用都必须通过 Alova 的 `useRequest` 管理状态
2. **必须设置 immediate: false**：禁止自动执行请求，必须手动触发
3. **必须使用回调钩子**：使用 `onSuccess`、`onError`、`onComplete` 处理请求结果
4. **禁止使用 try/catch**：不允许使用 try/catch 包装 send 函数调用

## 2. 技术栈分析

### 2.1 wot-design-uni 消息提示组件

#### 核心组件对比

|       组件        |        适用场景        |          特点          |   推荐度   |
| :---------------: | :--------------------: | :--------------------: | :--------: |
|   Toast 轻提示    | 简单信息提示、操作反馈 |    轻量级、自动消失    | ⭐⭐⭐⭐⭐ |
|   Message 弹框    | 重要信息确认、用户输入 |      需要用户交互      |   ⭐⭐⭐   |
| Notification 通知 | 非阻塞式通知、重要提醒 | 可自定义位置、持续显示 |  ⭐⭐⭐⭐  |

#### 推荐的错误提示策略

```typescript
// 使用 useGlobalToast（基于 Pinia 的全局 Toast 状态管理）
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

// 1. 网络错误 - 错误提示
toast.error("网络连接异常，请检查网络设置");

// 2. 业务错误 - 错误提示
toast.error("操作失败：用户名已存在");

// 3. 成功操作 - 成功提示
toast.success("操作成功");

// 4. 警告信息 - 警告提示
toast.warning("系统将于 10 分钟后进行维护");

// 5. 普通信息 - 信息提示
toast.info("正在处理中...");
```

### 2.2 Alova 请求架构与错误处理

#### 双层错误处理机制

本项目采用**双层错误处理机制**，确保错误提示的一致性和灵活性：

|      层级      |         职责         |            实现位置            |
| :------------: | :------------------: | :----------------------------: |
| **全局拦截层** | 自动错误提示（默认） | `src/http/alova.ts` responded  |
| **组件回调层** |  日志记录、状态恢复  | useRequest 的 onError 回调钩子 |

#### 现有错误处理流程

1. **请求拦截器**: 自动添加认证信息、处理 URL 拼接
2. **响应拦截器**: 统一状态码处理、自动错误提示
3. **错误分类**: 网络错误、认证错误、业务逻辑错误

## 3. 项目现状分析

### 3.1 HTTP 请求封装现状

#### 优点

- ✅ 完整的请求/响应拦截器机制
- ✅ 支持双 Token 无感刷新
- ✅ 统一的错误状态码处理
- ✅ TypeScript 类型定义完善
- ✅ 支持 `meta.toast: false` 静默模式

#### 问题与不足

- ❌ 错误提示使用 `uni.showToast` 而非 wot-design-uni Toast
- ❌ 缺乏错误级别的区分
- ❌ 错误信息映射不够完善

### 3.2 错误提示实现现状

#### 现有实现方式

```typescript
// 方式1：uni.showToast - 基础提示（Alova 响应拦截器内）
uni.showToast({
	icon: "none",
	title: "网络错误，换个网络试试",
});

// 方式2：useGlobalToast - 封装的 wot-design-uni Toast（组件内）
const toast = useGlobalToast();
toast.error("请先选择楼栋");
```

#### 问题分析

1. **不一致性**: Alova 拦截器使用 uni.showToast，组件使用 useGlobalToast
2. **缺乏统一标准**: 错误提示风格不统一
3. **职责不清晰**: 组件层容易重复处理已经全局处理过的错误

## 4. 统一接口错误提示方案设计

### 4.1 设计原则

1. **一致性**: 全部使用 wot-design-uni Toast（通过 useGlobalToast）
2. **用户友好**: 错误信息通俗易懂，避免技术术语
3. **分级处理**: 根据错误严重程度选择合适的提示方式
4. **职责分离**: 全局层自动提示，组件层专注业务逻辑
5. **可配置性**: 支持静默处理和自定义处理

### 4.2 错误分类与处理策略

#### 错误级别定义

|   级别    |        错误类型        |         处理方式          |          示例          |
| :-------: | :--------------------: | :-----------------------: | :--------------------: |
| L1 - 致命 |  认证过期、服务器宕机  |  Message 弹框 + 跳转处理  | 登录已过期，请重新登录 |
| L2 - 严重 |  权限不足、数据不存在  | Toast 错误提示 + 交互指导 |  您没有权限执行此操作  |
| L3 - 一般 | 业务逻辑错误、参数错误 |      Toast 错误提示       |    手机号格式不正确    |
| L4 - 轻微 |     网络波动、超时     |  Toast 警告提示（短暂）   |  网络异常，请稍后重试  |

### 4.3 技术实现方案

#### 4.3.1 核心工具类设计

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

		const defaultError = {
			level: ErrorLevel.NORMAL,
			message: "请求失败，请稍后重试",
		};

		const error = errorMap[statusCode] || defaultError;

		return {
			...error,
			code: statusCode,
			message: originalMessage || error.message,
		};
	}

	/**
	 * 映射业务错误码到错误信息
	 * @example const error = ApiErrorHandler.mapBusinessCode('1001', '余额不足')
	 */
	static mapBusinessCode(code: string | number, message: string): ApiErrorInfo {
		return {
			level: ErrorLevel.NORMAL,
			message,
			code,
		};
	}
}
```

#### 4.3.2 Alova 响应拦截器改造

```typescript
// src/http/alova.ts 修改部分
import { ApiErrorHandler, ErrorLevel } from "@/utils/api-error-handler";
import { useGlobalToast } from "@/hooks/useGlobalToast";

// ... 其他导入和配置 ...

/**
 * alova 请求实例
 */
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

#### 4.3.3 组件层使用示例（符合 api-migration 规范）

**1. 标准列表请求场景**

```vue
<template>
	<!-- 页面中需要包含全局 toast 组件（通常在 App.vue 中已配置） -->
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
 * 请求管理 - 使用 useRequest + 回调钩子
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
	loading,
	data: repairData,
	send: loadRepairList,
	onSuccess,
	onError,
	onComplete,
} = useRequest(() => getRepairOrderList(queryParams.value), {
	immediate: false,
});

/**
 * 成功回调 - 处理业务逻辑
 * @description 错误提示已在 Alova 响应拦截器中自动处理，这里只需处理成功逻辑
 */
onSuccess((result) => {
	console.log("维修工单列表加载成功:", result);
	// result.list: RepairOrder[]
	// result.total: number
});

/**
 * 失败回调 - 日志记录和状态恢复
 * @description 错误提示已在 Alova 响应拦截器中自动处理，这里用于日志和状态恢复
 */
onError((error) => {
	console.error("维修工单列表加载失败:", error);
	// 可以在这里做一些状态恢复操作，但不需要重复显示错误提示
});

/**
 * 完成回调 - 无论成功失败都执行
 * @description 用于停止下拉刷新等通用操作
 */
onComplete(() => {
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

**2. 表单提交场景**

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
 * 表单提交请求管理
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
	loading: submitting,
	send: submitRepair,
	onSuccess: onSubmitSuccess,
	onError: onSubmitError,
} = useRequest((data: CreateRepairReq) => createRepairOrder(data), {
	immediate: false,
});

/**
 * 提交成功回调
 * @description 显示成功提示并重置表单
 */
onSubmitSuccess((result) => {
	console.log("创建成功:", result);
	toast.success("维修工单创建成功");

	// 重置表单
	Object.assign(formData, {
		title: "",
		description: "",
		repairType: "其他维修",
	});

	// 可选：返回上一页
	// uni.navigateBack()
});

/**
 * 提交失败回调
 * @description 错误提示已自动处理，这里只需记录日志
 */
onSubmitError((error) => {
	console.error("创建失败:", error);
	// 错误提示已在 Alova 响应拦截器中自动显示，无需重复处理
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

**3. 静默请求场景（禁用自动错误提示）**

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
 * 静默请求 - 禁用全局错误提示
 * @description 使用 meta.toast: false 禁用自动错误提示，在 onError 中自定义处理
 */
const {
	send: loadDetail,
	onSuccess,
	onError,
} = useRequest((repairId: string) => getRepairDetail({ repairId }).setMeta({ toast: false }), {
	immediate: false,
});

/**
 * 成功回调
 */
onSuccess((result) => {
	console.log("详情加载成功:", result);
});

/**
 * 失败回调 - 自定义错误处理
 * @description 由于禁用了自动提示，需要在这里手动处理错误
 */
onError((error) => {
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

**4. 分页加载更多场景**

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
 * 首次加载请求
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
	loading,
	send: loadList,
	onSuccess: onListSuccess,
	onError: onListError,
} = useRequest((page: number) => getActivityList({ page, row: 10 }), {
	immediate: false,
});

/**
 * 加载更多请求
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
	loading: loadingMore,
	send: loadMore,
	onSuccess: onLoadMoreSuccess,
	onError: onLoadMoreError,
} = useRequest((page: number) => getActivityList({ page, row: 10 }), {
	immediate: false,
});

/** 列表加载成功 */
onListSuccess((result) => {
	activityList.value = result.activitiess || [];
	currentPage.value = 1;
	hasMore.value = result.activitiess?.length >= 10;
});

/** 列表加载失败 */
onListError((error) => {
	console.error("加载失败:", error);
	// 错误提示已自动处理
});

/** 加载更多成功 */
onLoadMoreSuccess((result) => {
	if (result?.activitiess?.length) {
		activityList.value.push(...result.activitiess);
		currentPage.value++;
		hasMore.value = result.activitiess.length >= 10;
	} else {
		hasMore.value = false;
	}
});

/** 加载更多失败 */
onLoadMoreError((error) => {
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

### 4.4 错误处理职责划分

#### 职责分离原则

|      层级      |                       职责                       |           代码位置            |
| :------------: | :----------------------------------------------: | :---------------------------: |
| **全局拦截层** | 自动错误提示（默认行为，可通过 meta.toast 禁用） | `src/http/alova.ts` responded |
| **组件回调层** |         日志记录、状态恢复、业务逻辑处理         |  useRequest 的 onError 回调   |

#### 什么时候在 onError 中处理错误？

|     场景     |     在 onError 中的处理     |                说明                 |
| :----------: | :-------------------------: | :---------------------------------: |
| **默认情况** |         仅记录日志          |   错误提示已由全局拦截器自动处理    |
| **静默请求** |       自定义错误处理        | 使用 meta.toast: false 后需手动处理 |
| **状态恢复** | 重置 loading 状态、恢复数据 |          用于 UI 状态管理           |
| **兜底逻辑** | 使用缓存数据、显示占位内容  |            保证用户体验             |

## 5. 实施建议

### 5.1 分阶段实施计划

#### 阶段一：基础设施建设

1. 创建 `src/utils/api-error-handler.ts` 错误处理工具类
2. 创建 `src/types/error.ts` 错误类型定义
3. 确保 `src/hooks/useGlobalToast.ts` 正常可用

#### 阶段二：Alova 响应拦截器改造

1. 修改 `src/http/alova.ts` 集成新的错误处理
2. 将 `uni.showToast` 替换为 `useGlobalToast`
3. 更新错误状态码映射规则
4. 测试各种错误场景

#### 阶段三：组件层规范化

1. 确保所有接口调用使用 useRequest + 回调钩子
2. 移除组件中重复的错误提示代码
3. 统一使用 onError 进行日志记录
4. 对需要静默处理的接口添加 meta.toast: false

#### 阶段四：优化和测试

1. 用户界面和交互优化
2. 多端兼容性测试（H5、小程序、APP）
3. 性能优化
4. 文档完善

### 5.2 关键注意事项

1. **向后兼容**: 保持现有 API 接口不变，新增可选参数
2. **渐进式改造**: 先新功能使用新方案，逐步改造旧功能
3. **多端适配**: 确保在不同平台下的一致性表现
4. **禁止 try/catch**: 严格遵循 api-migration 规范，使用回调钩子处理
5. **性能考虑**: 避免频繁的错误提示影响性能

### 5.3 质量保证

1. **代码规范**: 遵循项目现有的代码规范和 ESLint 配置
2. **类型安全**: 完善 TypeScript 类型定义
3. **单元测试**: 核心错误处理逻辑测试覆盖
4. **集成测试**: 端到端错误处理流程测试
5. **用户测试**: 用户体验和反馈收集

## 6. 预期收益

### 6.1 用户体验提升

- ✅ 错误提示更加友好和具体（使用 wot-design-uni Toast）
- ✅ 错误处理更加一致和规范
- ✅ 减少用户困惑和操作错误

### 6.2 开发效率提升

- ✅ 统一的错误处理标准，减少重复代码
- ✅ 职责分离明确，组件层代码更简洁
- ✅ 完善的类型定义，减少开发错误

### 6.3 系统稳定性提升

- ✅ 完善的错误分类和处理机制
- ✅ 更好的错误日志和监控
- ✅ 统一的异常处理流程

## 7. 结论与建议

基于本次调研，建议采用基于 `wot-design-uni` 组件库和 `useRequest` 回调模式的统一错误提示方案。该方案能够：

1. **保持技术栈一致性**: 充分利用 wot-design-uni 的组件能力和 Alova 的请求管理
2. **符合项目规范**: 完全遵循 api-migration 子代理的 useRequest + 回调钩子规范
3. **职责分离清晰**: 全局层自动处理，组件层专注业务逻辑
4. **提升用户体验**: 提供更友好的错误提示和交互指导
5. **降低维护成本**: 集中管理错误处理逻辑，便于统一调整
6. **支持未来扩展**: 灵活的配置和扩展机制，支持业务发展

建议按照分阶段实施计划逐步推进，确保在提升用户体验的同时，保持系统的稳定性和可靠性。
