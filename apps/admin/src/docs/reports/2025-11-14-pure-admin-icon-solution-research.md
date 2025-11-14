# Pure-Admin Icon 方案调研报告

## 1. 概述

本报告详细调研了 `pure-admin` 后台模板框架中 iconify 图标集的识别与渲染方案，包括依赖配置、组件封装、使用方式等核心实现细节。

## 2. 核心依赖

### 2.1 必需的 npm 包

| 包名              | 版本     | 类型            | 作用说明                                   |
| :---------------- | :------- | :-------------- | :----------------------------------------- |
| `@iconify/json`   | ^2.2.406 | devDependencies | 完整的 iconify 图标集数据（200,000+ 图标） |
| `@iconify/vue`    | 5.0.0    | devDependencies | Vue 3 的 iconify 组件库                    |
| `unplugin-icons`  | ^22.5.0  | devDependencies | Vite 插件，实现图标自动按需引入            |
| `vite-svg-loader` | ^5.1.0   | devDependencies | SVG 文件作为 Vue 组件导入的支持            |

### 2.2 辅助依赖

| 包名               | 版本   | 作用说明                     |
| :----------------- | :----- | :--------------------------- |
| `@pureadmin/utils` | ^2.6.2 | 提供 `getSvgInfo` 等工具函数 |

## 3. Vite 配置

### 3.1 插件配置

在 `build/plugins/index.ts` 中配置 `unplugin-icons` 插件：

```typescript
import Icons from "unplugin-icons/vite";

// 在插件列表中添加
Icons({
	compiler: "vue3",
	scale: 1,
});
```

### 3.2 配置说明

- `compiler: "vue3"` - 指定编译目标为 Vue 3
- `scale: 1` - 图标缩放比例，1 表示原始大小

## 4. 组件封装

### 4.1 核心组件结构

pure-admin 在 `src/components/ReIcon` 目录下封装了完整的图标解决方案：

```plain
src/components/ReIcon/
├── index.ts                      # 导出入口
├── data.ts                       # 图标选择器数据
├── src/
│   ├── iconifyIconOffline.ts    # 离线图标组件
│   ├── iconifyIconOnline.ts     # 在线图标组件
│   ├── iconfont.ts              # iconfont 图标组件
│   ├── offlineIcon.ts           # 本地图标预加载
│   ├── hooks.ts                 # useRenderIcon hook
│   ├── types.ts                 # 类型定义
│   └── Select.vue               # 图标选择器组件
```

### 4.2 IconifyIconOffline（离线图标组件）

**文件位置：** `src/components/ReIcon/src/iconifyIconOffline.ts`

**核心实现：**

```typescript
import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";

export default defineComponent({
	name: "IconifyIconOffline",
	components: { IconifyIcon },
	props: {
		icon: {
			default: null,
		},
	},
	render() {
		if (typeof this.icon === "object") addIcon(this.icon, this.icon);
		const attrs = this.$attrs;
		if (typeof this.icon === "string") {
			return h(IconifyIcon, {
				icon: this.icon,
				"aria-hidden": false,
				style: attrs?.style ? Object.assign(attrs.style, { outline: "none" }) : { outline: "none" },
				...attrs,
			});
		}
		// ... 处理对象类型的图标
	},
});
```

**特点：**

- 使用 `@iconify/vue/dist/offline` 的离线模式
- 适用于内网环境
- 支持字符串和对象两种图标格式

### 4.3 IconifyIconOnline（在线图标组件）

**文件位置：** `src/components/ReIcon/src/iconifyIconOnline.ts`

**核心实现：**

```typescript
import { h, defineComponent } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";

export default defineComponent({
	name: "IconifyIconOnline",
	components: { IconifyIcon },
	props: {
		icon: {
			type: String,
			default: "",
		},
	},
	render() {
		const attrs = this.$attrs;
		return h(IconifyIcon, {
			icon: `${this.icon}`,
			"aria-hidden": false,
			style: attrs?.style ? Object.assign(attrs.style, { outline: "none" }) : { outline: "none" },
			...attrs,
		});
	},
});
```

**特点：**

- 使用 `@iconify/vue` 的在线模式
- 适用于外网环境
- 仅支持字符串格式的图标名称

### 4.4 useRenderIcon（统一渲染 Hook）

**文件位置：** `src/components/ReIcon/src/hooks.ts`

**核心实现：**

```typescript
/**
 * 支持 `iconfont`、自定义 `svg` 以及 `iconify` 中所有的图标
 * @param icon 必传 图标
 * @param attrs 可选 iconType 属性
 * @returns Component
 */
export function useRenderIcon(icon: any, attrs?: iconType): Component {
	const ifReg = /^IF-/;

	if (ifReg.test(icon)) {
		// 处理 iconfont 图标
		return defineComponent({
			render() {
				return h(FontIcon, { icon: iconName, iconType, ...attrs });
			},
		});
	} else if (typeof icon === "function" || typeof icon?.render === "function") {
		// 处理 SVG 组件
		return attrs ? h(icon, { ...attrs }) : icon;
	} else if (typeof icon === "object") {
		// 处理离线图标对象
		return defineComponent({
			render() {
				return h(IconifyIconOffline, { icon: icon, ...attrs });
			},
		});
	} else {
		// 通过是否存在 : 符号来判断是在线还是本地图标
		return defineComponent({
			render() {
				const IconifyIcon = icon.includes(":") ? IconifyIconOnline : IconifyIconOffline;
				return h(IconifyIcon, { icon, ...attrs });
			},
		});
	}
}
```

**智能识别规则：**

| 图标类型           | 识别规则                     | 使用组件             |
| :----------------- | :--------------------------- | :------------------- |
| Iconfont           | 以 `IF-` 开头                | `FontIcon`           |
| SVG 组件           | `typeof icon === "function"` | 直接渲染             |
| 离线图标对象       | `typeof icon === "object"`   | `IconifyIconOffline` |
| 在线图标（字符串） | 包含 `:` 符号                | `IconifyIconOnline`  |
| 本地图标（字符串） | 不包含 `:` 符号              | `IconifyIconOffline` |

### 4.5 本地图标预加载

**文件位置：** `src/components/ReIcon/src/offlineIcon.ts`

**核心实现：**

```typescript
import { getSvgInfo } from "@pureadmin/utils";
import { addIcon } from "@iconify/vue/dist/offline";

// 从 unplugin-icons 引入图标（自动按需加载）
import EpMenu from "~icons/ep/menu?raw";
import EpEdit from "~icons/ep/edit?raw";
// ... 更多图标

const icons = [
	["ep/menu", EpMenu],
	["ep/edit", EpEdit],
	// ... 更多图标映射
];

// 本地菜单图标预加载
icons.forEach(([name, icon]) => {
	addIcon(name as string, getSvgInfo(icon as string));
});
```

**作用：**

- 预加载常用的菜单图标
- 避免首次启动时加载过多图标
- 使用 `addIcon` 将图标添加到离线缓存

## 5. 全局注册

### 5.1 在 main.ts 中注册

**文件位置：** `src/main.ts`

```typescript
import { IconifyIconOffline, IconifyIconOnline, FontIcon } from "./components/ReIcon";

app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);
```

**优点：**

- 全局可用，无需在每个组件中导入
- 统一的组件命名规范
- 便于维护和升级

## 6. 使用方式

### 6.1 方式一：直接引入图标组件

使用 `unplugin-icons` 的虚拟模块导入：

```typescript
import Lock from "~icons/ri/lock-fill";
import Check from "~icons/ep/check";
import User from "~icons/ri/user-3-fill";
```

**在模板中使用：**

```vue
<template>
	<IconifyIconOffline :icon="Lock" />
	<IconifyIconOffline :icon="Check" />
</template>
```

**特点：**

- 类型安全，有 TypeScript 支持
- 自动按需引入，不会打包未使用的图标
- 适合需要在脚本中操作图标的场景

### 6.2 方式二：使用离线组件（字符串方式）

```vue
<template>
	<IconifyIconOffline icon="ep/menu" width="18" height="18" />
	<IconifyIconOffline icon="ri/lock-fill" color="#409eff" />
</template>
```

**特点：**

- 直接使用图标名称字符串
- 需要确保图标已经预加载（在 offlineIcon.ts 中）
- 适合内网环境

### 6.3 方式三：使用在线图标

```vue
<template>
	<IconifyIconOnline icon="ep:home" width="60px" height="60px" />
	<IconifyIconOnline icon="openmoji:beaming-face-with-smiling-eyes" width="40" />
</template>
```

**特点：**

- 图标名称格式：`图标集:图标名`（包含冒号）
- 实时从 iconify CDN 加载
- 适合外网环境
- 支持超过 200,000 个图标

### 6.4 方式四：使用 useRenderIcon Hook

```typescript
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "~icons/ri/lock-fill";

const lockIcon = useRenderIcon(Lock, { width: "16px", height: "16px" });
```

**在 TSX 或渲染函数中使用：**

```typescript
render() {
  return h("div", [lockIcon]);
}
```

**特点：**

- 统一的图标渲染接口
- 支持所有类型的图标（iconify、SVG、iconfont）
- 适合在路由配置、表格列等需要动态渲染的场景

### 6.5 常用属性

| 属性名   | 类型             | 说明                                 | 示例值           |
| :------- | :--------------- | :----------------------------------- | :--------------- |
| `icon`   | String \| Object | 图标名称或图标对象                   | `"ep:home"`      |
| `width`  | String \| Number | 图标宽度                             | `"24px"` 或 `24` |
| `height` | String \| Number | 图标高度                             | `"24px"` 或 `24` |
| `color`  | String           | 图标颜色                             | `"#409eff"`      |
| `rotate` | Number           | 旋转角度（0-360）                    | `90`             |
| `flip`   | String           | 翻转方向（horizontal/vertical/both） | `"horizontal"`   |

## 7. 图标命名规范

### 7.1 在线图标命名

格式：`图标集前缀:图标名称`

示例：

- `ep:home` - Element Plus 的 home 图标
- `ri:lock-fill` - Remix Icon 的 lock-fill 图标
- `openmoji:beaming-face-with-smiling-eyes` - OpenMoji 的笑脸图标

### 7.2 本地图标命名

格式：`图标集前缀/图标名称`（不含冒号）

示例：

- `ep/menu`
- `ri/lock-fill`
- `ep/edit`

### 7.3 Iconfont 命名

格式：`IF-图标名称 [图标类型]`

示例：

- `IF-icon-home`
- `IF-icon-user unicode`

## 8. 图标查找

### 8.1 官方图标库

访问 [icon-sets.iconify.design](https://icon-sets.iconify.design/) 可以：

- 搜索所有可用图标集
- 预览图标效果
- 复制图标名称直接使用
- 查看图标的使用统计

### 8.2 常用图标集

| 图标集名称            | 前缀       | 图标数量 | 说明                        |
| :-------------------- | :--------- | :------- | :-------------------------- |
| Element Plus          | `ep`       | 293      | Element Plus 官方图标       |
| Remix Icon            | `ri`       | 2,860+   | 开源图标库，设计简洁        |
| Material Design Icons | `mdi`      | 7,400+   | Google Material Design 图标 |
| Font Awesome          | `fa`       | 2,000+   | 最流行的图标库之一          |
| OpenMoji              | `openmoji` | 4,100+   | 开源 emoji 图标             |

## 9. 实现原理

### 9.1 unplugin-icons 工作原理

1. **虚拟模块**：将 `~icons/` 识别为虚拟模块前缀
2. **按需加载**：仅打包实际引用的图标
3. **SVG 转换**：将 iconify JSON 数据转换为 SVG 字符串
4. **组件生成**：动态生成 Vue 组件

### 9.2 离线与在线的区别

| 对比项       | 离线模式（Offline）           | 在线模式（Online）           |
| :----------- | :---------------------------- | :--------------------------- |
| 依赖包       | `@iconify/vue/dist/offline`   | `@iconify/vue`               |
| 图标来源     | 本地 `@iconify/json` 包       | Iconify CDN                  |
| 网络要求     | 无需网络                      | 需要网络连接                 |
| 打包体积     | 仅打包使用的图标              | 不打包，运行时加载           |
| 首次加载速度 | 快（已打包）                  | 慢（需下载）                 |
| 适用场景     | 内网环境、对性能要求高的场景  | 外网环境、需要大量图标的场景 |
| 图标预加载   | 需要通过 `addIcon` 手动预加载 | 自动从 CDN 加载              |

## 10. 最佳实践

### 10.1 推荐的使用场景

| 场景                   | 推荐方式             | 理由                       |
| :--------------------- | :------------------- | :------------------------- |
| 菜单图标               | 离线模式 + 预加载    | 提升首屏加载速度           |
| 页面内常用图标         | 直接引入（方式一）   | 类型安全，按需打包         |
| 动态图标（路由、表格） | `useRenderIcon` Hook | 灵活性高，支持多种图标类型 |
| 图标选择器             | 在线模式             | 可访问完整图标库           |
| 内网项目               | 离线模式             | 不依赖外网                 |

### 10.2 性能优化建议

1. **预加载常用图标**：将菜单等常用图标添加到 `offlineIcon.ts`
2. **按需引入**：优先使用方式一（直接引入），避免打包未使用的图标
3. **避免重复打包**：同一个图标在项目中应使用相同的引入方式
4. **图标懒加载**：对于不常用的大图标，可以使用在线模式或异步组件

### 10.3 注意事项

1. **命名区分**：在线图标使用冒号（`:`），本地图标使用斜杠（`/`）
2. **预加载限制**：不要预加载过多图标，会增加首屏加载时间
3. **CDN 稳定性**：在线模式依赖 iconify CDN，需考虑网络稳定性
4. **类型支持**：使用方式一（直接引入）可获得更好的 TypeScript 支持

## 11. 迁移步骤总结

基于以上调研，将 iconify 方案迁移到新项目需要以下步骤：

1. **安装依赖包**：安装 `@iconify/json`、`@iconify/vue`、`unplugin-icons`、`vite-svg-loader`
2. **配置 Vite 插件**：在 `vite.config.ts` 中配置 `unplugin-icons`
3. **复制组件代码**：复制 `src/components/ReIcon` 目录
4. **全局注册组件**：在 `main.ts` 中注册三个图标组件
5. **配置图标预加载**：根据项目需求配置 `offlineIcon.ts`
6. **更新使用方式**：按照四种方式使用图标

## 12. 参考资源

- [Iconify 官方文档](https://iconify.design/)
- [iconify/vue GitHub](https://github.com/iconify/iconify/tree/main/components/vue)
- [unplugin-icons GitHub](https://github.com/unplugin/unplugin-icons)
- [icon-sets.iconify.design](https://icon-sets.iconify.design/) - 图标搜索
- [Pure Admin 文档 - 图标篇](https://pure-admin.cn/pages/icon/)
