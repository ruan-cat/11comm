<!-- Anthropic 模型生成的报告 不要删除 -->

# 2025-12-28 uni-app 动态页面标题调研报告

## 1. 调研背景

在维修工单处理页面（`src/pages-sub/repair/handle.vue`）中，需要根据 URL 参数 `action` 的值动态显示不同的页面标题，如：

| action 参数 | 期望显示的标题 |
| :---------: | :------------: |
| `DISPATCH`  |    工单派单    |
| `TRANSFER`  |    工单转单    |
|  `RETURN`   |    工单退单    |
|  `FINISH`   |    工单办结    |

**当前问题**：页面配置中的 `navigationBarTitleText` 是静态的"处理工单"，无法根据业务场景动态变化。

![需求示意图](https://s2.loli.net/2025/12/28/SumUQ5AxefJtbpq.png)

---

## 2. 本项目现状分析

### 2.1 已有的计算逻辑

在 `src/pages-sub/repair/handle.vue:111-124` 中，**已经实现了标题计算逻辑**：

```typescript
/** 页面标题 */
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
```

### 2.2 当前配置

页面配置使用的是静态标题（`src/pages-sub/repair/handle.vue:31-36`）：

```typescript
definePage({
	style: {
		navigationBarTitleText: "处理工单", // ❌ 固定不变
		enablePullDownRefresh: false,
	},
});
```

### 2.3 问题诊断

- ✅ **已有计算逻辑**：`pageTitle` 计算属性存在但未被使用
- ❌ **未应用到导航栏**：缺少将计算结果同步到原生导航栏的调用
- ❌ **缺少动态更新机制**：没有在参数变化时触发标题更新

---

## 3. uni-app 官方原生方案

### 3.1 核心 API：`uni.setNavigationBarTitle`

uni-app 提供了原生 API 来动态修改页面标题。

#### 3.1.1 API 签名

|   参数   |   类型   | 必填 |     说明     |
| :------: | :------: | :--: | :----------: |
|  title   |  String  |  是  | 页面标题文本 |
| success  | Function |  否  |   成功回调   |
|   fail   | Function |  否  |   失败回调   |
| complete | Function |  否  |   完成回调   |

#### 3.1.2 使用示例

```typescript
uni.setNavigationBarTitle({
	title: "新的标题",
	success: () => {
		console.log("标题设置成功");
	},
});
```

#### 3.1.3 生命周期调用建议

根据官方文档，推荐在以下时机调用：

```typescript
// ✅ 推荐：在 onReady 中调用
onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});

// ⚠️ 如果必须在 onShow 中调用，需要延迟执行
onShow(() => {
	setTimeout(() => {
		uni.setNavigationBarTitle({ title: pageTitle.value });
	}, 50);
});
```

### 3.2 官方方案的优势

|       特点        |              说明              |
| :---------------: | :----------------------------: |
|  ✅ **原生支持**  | uni-app 框架内置，无需额外依赖 |
| ✅ **跨平台兼容** | 支持 H5、小程序、APP 等全平台  |
|  ✅ **简单易用**  | API 简洁，仅需一行代码即可实现 |
|  ✅ **实时生效**  |    调用后立即更新导航栏标题    |

---

## 4. uni-helper 生态调研

### 4.1 uni-helper 项目概述

[uni-helper](https://github.com/uni-helper) 是一个旨在增强 uni-app 系列产品开发体验的工具链集合，包含 45 个仓库。

### 4.2 核心工具包

|                  工具包                  |            功能             |
| :--------------------------------------: | :-------------------------: |
|   `@uni-helper/vite-plugin-uni-pages`    |     自动化页面路由配置      |
| `@uni-helper/vite-plugin-uni-components` |        自动注册组件         |
|        `@uni-helper/uni-network`         | 基于 Promise 的 HTTP 客户端 |

### 4.3 关于动态标题的支持

**调研结论**：

- ❌ **无专用解决方案**：uni-helper 系列工具链中**没有针对动态标题变化的独立工具包**
- ℹ️ **设计理念**：uni-helper 主要聚焦于开发工具链增强（路由、组件、网络等），而非运行时 UI 行为控制
- ✅ **推荐方案**：使用 uni-app 原生的 `uni.setNavigationBarTitle` API

---

## 5. 实施方案建议

### 5.1 方案一：简单直接式（推荐）

直接在 `onLoad` 或 `onReady` 生命周期中调用：

```typescript
import { onReady } from "@dcloudio/uni-app";
import { computed, reactive } from "vue";

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

onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

**优点**：

- 代码简洁，改动最小
- 符合官方推荐的最佳实践
- 性能开销极小

### 5.2 方案二：响应式监听（适用于标题可能动态变化的场景）

如果 `action` 参数在页面生命周期内可能变化，可以使用 `watch`：

```typescript
import { watch } from "vue";

watch(
	() => model.action,
	() => {
		uni.setNavigationBarTitle({ title: pageTitle.value });
	},
	{ immediate: true },
);
```

**优点**：

- 支持运行时动态更新
- 适合参数可能通过其他方式变更的场景

**缺点**：

- 相对方案一略复杂
- 本项目中 `action` 参数通常不会在页面内变化，存在过度设计的风险

### 5.3 方案三：封装可复用 Hook（推荐用于多页面场景）

如果多个页面都有类似需求，可以创建 `useDynamicTitle` Hook：

```typescript
// src/hooks/useDynamicTitle.ts
import type { Ref } from "vue";
import { onReady, watch } from "@dcloudio/uni-app";

/**
 * 动态设置页面标题
 * @param title 标题（支持响应式引用）
 * @param immediate 是否立即执行（默认 true）
 * @example useDynamicTitle(computed(() => `订单详情 - ${orderId.value}`))
 */
export function useDynamicTitle(title: Ref<string> | string, immediate = true) {
	const setTitle = () => {
		const titleValue = typeof title === "string" ? title : title.value;
		uni.setNavigationBarTitle({ title: titleValue });
	};

	if (immediate) {
		onReady(() => setTitle());
	}

	// 如果是响应式，监听变化
	if (typeof title !== "string") {
		watch(title, setTitle);
	}

	return { setTitle };
}
```

**使用示例**：

```typescript
// 在页面中使用
import { useDynamicTitle } from "@/hooks/useDynamicTitle";

const pageTitle = computed(() => {
	// 标题计算逻辑
});

useDynamicTitle(pageTitle);
```

---

## 6. 最佳实践建议

### 6.1 代码规范

```typescript
// ✅ 推荐：在 onReady 中设置
onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});

// ⚠️ 避免：在 onLoad 中设置（可能被框架覆盖）
onLoad(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value }); // 可能不生效
});

// ❌ 禁止：在 onShow 中直接设置（会被框架内部逻辑覆盖）
onShow(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value }); // 不推荐
});
```

### 6.2 错误处理

```typescript
uni.setNavigationBarTitle({
	title: pageTitle.value,
	fail: (err) => {
		console.error("设置标题失败:", err);
	},
});
```

### 6.3 类型安全（TypeScript）

```typescript
import type { SetNavigationBarTitleOptions } from "@dcloudio/types";

const options: SetNavigationBarTitleOptions = {
	title: pageTitle.value,
};

uni.setNavigationBarTitle(options);
```

---

## 7. 跨平台兼容性

|      平台      | 支持情况 |         备注          |
| :------------: | :------: | :-------------------: |
|       H5       |    ✅    | 修改 `document.title` |
|   微信小程序   |    ✅    |   调用微信原生 API    |
|  支付宝小程序  |    ✅    |  调用支付宝原生 API   |
|   百度小程序   |    ✅    |   调用百度原生 API    |
| 字节跳动小程序 |    ✅    | 调用字节跳动原生 API  |
|   APP（iOS）   |    ✅    |    修改原生导航栏     |
| APP（Android） |    ✅    |    修改原生导航栏     |
|   HarmonyOS    |    ✅    | HBuilderX 4.23+ 支持  |

---

## 8. 性能影响评估

|      维度      | 评估结果  |             说明              |
| :------------: | :-------: | :---------------------------: |
| **运行时开销** |  ⚡ 极小  | 原生 API 调用，几乎无性能损耗 |
| **包体积影响** | 📦 无影响 |        不引入额外依赖         |
|  **渲染性能**  | 🎯 无影响 |        不触发页面重绘         |
|  **内存占用**  | 💾 可忽略 |       仅一次性函数调用        |

---

## 9. 总结与推荐

### 9.1 调研结论

|         维度         |                       结论                       |
| :------------------: | :----------------------------------------------: |
|    **本项目现状**    |        已有标题计算逻辑，但未应用到导航栏        |
| **uni-helper 方案**  |           无专用工具包，需使用原生 API           |
| **uni-app 原生方案** | `uni.setNavigationBarTitle` 是官方推荐的最佳实践 |

### 9.2 推荐方案

#### 针对单页面场景（当前需求）

使用 **方案一：简单直接式**，直接在 `onReady` 中调用 `uni.setNavigationBarTitle`。

**理由**：

- ✅ 代码简洁，改动最小
- ✅ 符合官方最佳实践
- ✅ 无需引入额外依赖

#### 针对多页面场景（未来扩展）

考虑封装 **方案三：useDynamicTitle Hook**，便于复用。

**理由**：

- ✅ 统一管理标题逻辑
- ✅ 提高代码可维护性
- ✅ 符合 Vue3 Composition API 最佳实践

### 9.3 实施步骤

**针对 `src/pages-sub/repair/handle.vue` 的修改**：

1. 在 `onReady` 生命周期钩子中添加以下代码：

```typescript
import { onReady } from "@dcloudio/uni-app";

onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});
```

2. **完整修改示例**（在文件的生命周期钩子区域）：

```typescript
// ==================== 生命周期钩子 ====================

/**
 * 页面加载
 */
onLoad((options) => {
	// ... 现有代码 ...
});

/**
 * 页面渲染完成，设置动态标题
 */
onReady(() => {
	uni.setNavigationBarTitle({ title: pageTitle.value });
});

/**
 * 页面卸载，移除事件监听
 */
onUnload(() => {
	uni.$off("getResourceInfo");
});
```

---

## 10. 参考资料

### 10.1 官方文档

- [uni.setNavigationBarTitle API 文档](https://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbartitle)
- [uni-app 导航栏开发指南](https://ask.dcloud.net.cn/article/34921)
- [pages.json 页面路由配置](https://en.uniapp.dcloud.io/collocation/pages.html)

### 10.2 社区资源

- [uniapp 动态修改标题技巧 - CSDN](https://blog.csdn.net/zhwangchao/article/details/102457732)
- [uni-app 动态设置页面标题 - CSDN](https://blog.csdn.net/weixin_34306593/article/details/93655355)
- [uni-app 动态修改顶部导航栏标题 - 博客园](https://www.cnblogs.com/ts119/p/13116462.html)

### 10.3 开源项目

- [uni-helper 官方网站](https://github.com/uni-helper/website)
- [uni-helper GitHub 组织](https://github.com/uni-helper)
- [uni-helper 优秀资源汇总](https://github.com/uni-helper/awesome-uni-app)

---

## 附录：其他相关 API

uni-app 还提供了其他导航栏相关 API，可按需使用：

|              API               |                 功能                 |
| :----------------------------: | :----------------------------------: |
|  `uni.setNavigationBarColor`   | 动态设置导航栏颜色（背景色、文字色） |
| `uni.showNavigationBarLoading` |          显示导航栏加载动画          |
| `uni.hideNavigationBarLoading` |          隐藏导航栏加载动画          |

**使用示例**：

```typescript
// 设置导航栏颜色
uni.setNavigationBarColor({
	frontColor: "#ffffff",
	backgroundColor: "#007aff",
});

// 显示加载动画
uni.showNavigationBarLoading();

// 隐藏加载动画
uni.hideNavigationBarLoading();
```
