# 微信小程序样式兼容改写清单

## 1. 适用范围

本清单用于 `uni-app` / `unibest` 项目中，所有需要落地到 **微信小程序** 的页面与组件样式改写。

当出现以下任一情况时，必须优先参考本清单：

- H5 效果正常，微信小程序样式错乱或丢失
- 页面使用了 `display: grid`
- 页面依赖 `backdrop-filter`、`filter: blur()`
- 页面使用 `env(safe-area-inset-*)`
- 页面依赖 `:not()`、复杂 `:nth-child()`
- 页面大量使用 `gap`、`space-y-*`、`divide-y-*`

## 2. 基础原则

- 微信小程序把 WXSS 当作 CSS 子集处理，不要把 H5 可用写法直接视为跨端可用写法。
- 优先选择朴素、稳定、可读的布局：`flex`、`flex-wrap`、显式 `margin`、简单选择器。
- 业务页面默认按“微信小程序优先”写样式，再去验证 H5，而不是反过来。
- 只要某个写法存在明显平台风险，就直接降级为更保守的实现，不要赌基础库版本。

## 3. 高风险写法与替代方案

|               高风险写法               |                           推荐改写                            |                 说明                 |
| :------------------------------------: | :-----------------------------------------------------------: | :----------------------------------: |
|            `display: grid`             |                 `display: flex` + `flex-wrap`                 |    小程序端复杂网格更容易出现错位    |
|  `backdrop-filter` / `filter: blur()`  |         纯色/渐变背景 + `box-shadow` / `border` 降级          |  模糊滤镜在小程序端兼容性和性能都差  |
|        `env(safe-area-inset-*)`        | `var(--window-bottom, 0px)` / `var(--status-bar-height, 0px)` |     统一收敛到 uni-app 窗口变量      |
|                `:not()`                |          简单 class + 相邻兄弟选择器 `.item + .item`          |     `:not([hidden])` 是高频雷区      |
|          复杂 `:nth-child()`           |         负 margin 容器 + 子项统一 margin / 手动 class         |     `n+2`、`3n+1` 这类写法要避免     |
|             raw CSS `gap`              |               显式 `margin-top` / `margin-left`               |     小程序页面默认不要依赖 `gap`     |
| `space-y-*` / `space-x-*` / `divide-*` |                   手写 margin / border 规则                   | UnoCSS 生成结果常含 `:not([hidden])` |

## 4. 标准改写模板

### 4.1. 宫格布局

```vue
<template>
	<view class="quick-grid">
		<view v-for="item in items" :key="item.id" class="quick-grid__item">
			<view class="quick-card">
				<text>{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<style scoped>
.quick-grid {
	display: flex;
	flex-wrap: wrap;
	margin: -8rpx;
}

.quick-grid__item {
	box-sizing: border-box;
	width: 33.3333%;
	padding: 8rpx;
}

.quick-card {
	border-radius: 16rpx;
	background: #fff;
}
</style>
```

### 4.2. 纵向间距

```vue
<template>
	<view>
		<view class="info-item">内容 1</view>
		<view class="info-item">内容 2</view>
		<view class="info-item">内容 3</view>
	</view>
</template>

<style scoped>
.info-item + .info-item {
	margin-top: 12rpx;
}
</style>
```

### 4.3. 横向图文间距

```vue
<template>
	<view class="row-item">
		<view class="row-item__icon" />
		<view class="row-item__content">标题</view>
	</view>
</template>

<style scoped>
.row-item {
	display: flex;
	align-items: center;
}

.row-item__content {
	margin-left: 12rpx;
}
</style>
```

### 4.4. 安全区

```css
.page-container {
	padding-top: calc(24rpx + var(--status-bar-height, 0px));
	padding-bottom: calc(24rpx + var(--window-bottom, 0px));
}
```

### 4.5. 毛玻璃降级

```css
.toolbar-card {
	background: rgba(255, 255, 255, 0.96);
	border: 1px solid rgba(255, 255, 255, 0.7);
	box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.08);
}
```

## 5. 页面自检清单

- [ ] 没有使用 `display: grid` 作为主要业务布局
- [ ] 没有使用 `backdrop-filter` 或 `filter: blur()`
- [ ] 没有使用 `env(safe-area-inset-*)`
- [ ] 没有使用 `:not()` 和复杂 `:nth-child()`
- [ ] 没有使用 `space-y-*`、`space-x-*`、`divide-y-*`、`divide-x-*`
- [ ] 没有把 raw CSS `gap` 当成默认间距方案
- [ ] 宫格、卡片组、快捷入口已改成 `flex + wrap`
- [ ] 顶部/底部安全区已改成 `var(--status-bar-height, 0px)` / `var(--window-bottom, 0px)`

## 6. 说明

- 这份清单是当前仓库在真实微信小程序样式事故后的收敛规则。
- 如果后续基础库升级验证了某些写法已稳定可用，也必须先补充技能文档，再放开使用。
