---
name: use-uniapp-dynamic-page-title
description: |
  uni-app 动态页面标题设置专家 - 根据路由参数或业务状态动态设置页面标题，使用 uni.setNavigationBarTitle API。

  触发条件（满足任意一项即触发）：
  - 任务包含"动态标题"、"页面标题"、"navigationBarTitleText"、"setNavigationBarTitle"等关键词
  - 需要根据路由参数动态设置页面标题（如显示工单编号、房屋地址）
  - 需要根据业务状态动态更新标题（如派单/转单显示不同标题）
  - 从 Vue2 迁移需要动态标题的页面
  - 实现详情页、编辑页、审核页等需要显示动态信息的标题
  - 页面标题需要根据数据加载后的内容变化
  - 需要在不同操作模式下显示不同标题（查看/编辑/审核）

  必须协同的技能：
  - route-migration（路由迁移时）- 确保路由参数正确传递
  - code-migration（Vue2 迁移时）- Options API → Composition API
  - api-migration（需要从接口获取标题数据时）- API 调用规范

  禁止事项：
  - 禁止在 pages.json 中硬编码动态标题
  - 禁止使用 uni.setNavigationBarTitle 的回调形式（应使用 Promise 或直接调用）
  - 禁止在 onLoad 之外的生命周期钩子中设置初始标题
  - 禁止不处理标题设置失败的情况
  - 禁止标题过长不做截断处理

  覆盖场景：几乎所有需要根据数据动态显示标题的页面，包括详情页（显示编号/名称）、编辑页（显示操作类型）、审核页（显示审核状态）、表单页（显示创建/修改模式）等。
---

# uni-app 动态页面标题设置

## 1. 核心实现方法

使用 `uni.setNavigationBarTitle` API 在 `onReady` 生命周期中设置动态标题。

### 1.1 基本模式（推荐）

```typescript
import { onReady } from "@dcloudio/uni-app";
import { computed, reactive } from "vue";

// 页面参数
const model = reactive({
	action: "DISPATCH", // 从 URL 参数获取
});

// 计算属性生成动态标题
const pageTitle = computed(() => {
	switch (model.action) {
		case "DISPATCH":
			return "派单";
		case "TRANSFER":
			return "转单";
		case "RETURN":
			return "退单";
		case "FINISH":
			return "办结";
		default:
			return "处理工单";
	}
});

// 在 onReady 中设置标题
onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

**优点**：代码简洁、改动最小、符合官方最佳实践

### 1.2 响应式监听模式（适用于标题可能动态变化的场景）

```typescript
import { watch } from "vue";

// 监听标题变化并自动更新
watch(
	() => model.action,
	() => {
		uni.setNavigationBarTitle({ title: pageTitle.value });
	},
	{ immediate: true },
);
```

**使用场景**：标题可能在页面生命周期内变化时使用

## 2. 实施步骤

### 2.1 步骤 1：创建标题计算逻辑

在 `<script setup>` 中定义 `computed` 计算属性：

```typescript
/** 页面标题 */
const pageTitle = computed(() => {
	// 根据业务逻辑返回不同标题
	// 示例：根据订单状态返回标题
	return `订单详情 - ${orderStatus.value}`;
});
```

### 2.2 步骤 2：在 onReady 中设置标题

```typescript
import { onReady } from "@dcloudio/uni-app";

/**
 * 页面渲染完成，设置动态标题
 */
onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

### 2.3 步骤 3：保持静态标题作为后备

在 `definePage` 中保留默认标题：

```typescript
/** 定义页面配置 */
definePage({
	style: {
		navigationBarTitleText: "处理工单", // 后备标题
		enablePullDownRefresh: false,
	},
});
```

## 3. 完整示例

参考 `src/pages-sub/repair/handle.vue:122-136,728-730` 的实现：

```typescript
// ==================== 计算属性 ====================

/** 页面标题 */
const pageTitle = computed(() => {
	switch (model.action) {
		case "DISPATCH":
			return "派单";
		case "TRANSFER":
			return "转单";
		case "RETURN":
		case "BACK":
			return "退单";
		case "FINISH":
			return "办结";
		default:
			return "处理工单";
	}
});

// ==================== 生命周期钩子 ====================

/**
 * 页面加载
 */
onLoad((options) => {
	model.action = (options?.action as DispatchAction) || "DISPATCH";
	// ... 其他初始化逻辑
});

/**
 * 页面渲染完成，设置动态标题
 */
onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

## 4. 最佳实践

### 4.1 生命周期选择

| 生命周期  |  是否推荐   |            说明            |
| :-------: | :---------: | :------------------------: |
| `onReady` |   ✅ 推荐   | 页面渲染完成，最佳设置时机 |
| `onLoad`  | ⚠️ 可能失效 |       可能被框架覆盖       |
| `onShow`  |  ❌ 不推荐  |    会被框架内部逻辑覆盖    |

### 4.2 错误处理（可选）

```typescript
onReady(() => {
	uni.setNavigationBarTitle({
		title: pageTitle.value,
		fail: (err) => {
			console.error("设置标题失败:", err);
		},
	});
});
```

### 4.3 TypeScript 类型安全（可选）

```typescript
import type { SetNavigationBarTitleOptions } from "@dcloudio/types";

const options: SetNavigationBarTitleOptions = {
	title: pageTitle.value,
};

uni.setNavigationBarTitle(options);
```

## 5. 跨平台兼容性

`uni.setNavigationBarTitle` 支持所有平台：

|        平台        | 支持情况 |       实现方式        |
| :----------------: | :------: | :-------------------: |
|         H5         |    ✅    | 修改 `document.title` |
|     微信小程序     |    ✅    |   调用微信原生 API    |
|    支付宝小程序    |    ✅    |  调用支付宝原生 API   |
| APP（iOS/Android） |    ✅    |    修改原生导航栏     |

## 6. 常见场景

### 6.1 根据 URL 参数设置标题

```typescript
onLoad((options) => {
	const action = options?.action;
	// 根据参数计算标题
});

const pageTitle = computed(() => {
	return actionToTitleMap[model.action] || "默认标题";
});

onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

### 6.2 根据业务状态设置标题

```typescript
const pageTitle = computed(() => {
	return `订单${orderId.value} - ${statusText.value}`;
});

onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

### 6.3 多语言标题

```typescript
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const pageTitle = computed(() => {
	return t(`page.title.${model.action}`);
});

onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

## 7. 注意事项

1. **必须在 onReady 中调用**：避免在 `onLoad` 或 `onShow` 中直接设置，可能被框架覆盖
2. **保留静态标题作为后备**：在 `definePage` 中设置默认标题，防止动态设置失败
3. **避免过于频繁更新**：除非业务必需，否则不要在页面生命周期内频繁修改标题
4. **标题长度限制**：不同平台对标题长度有限制，建议控制在 10 个汉字以内

## 8. 相关参考

- **官方文档**：[uni.setNavigationBarTitle API](https://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbartitle)
- **研究报告**：`docs/reports/2025-12-28-uniapp-dynamic-page-title-research.md`
- **实现示例**：`src/pages-sub/repair/handle.vue:122-136,728-730`
