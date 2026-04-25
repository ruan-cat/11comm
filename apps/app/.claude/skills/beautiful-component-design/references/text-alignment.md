# 文本与对齐规范

## 1. wd-cell 文本样式

### 1.1 模板中使用 title-class 和 value-class

```vue
<template>
	<wd-cell title="报修ID" :value="repairDetail.repairId" title-class="text-36rpx" value-class="text-36rpx" />
</template>
```

### 1.2 覆盖组件库默认样式

```scss
/** 强制设置 wd-cell 的文本大小 */
:deep(.wd-cell__title) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}

:deep(.wd-cell__value) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}

/** 确保 wd-cell 的 icon 区域垂直居中 */
:deep(.wd-cell__icon) {
	display: flex !important;
	align-items: center !important;
}
```

## 2. 文本字号规范

本项目 UnoCSS 字体配置：

```typescript
fontSize: {
  'xs': ['24rpx', '32rpx'],    // 极小文本
  'sm': ['28rpx', '40rpx'],    // 小文本
  'base': ['32rpx', '44rpx'],  // 基准文本
  'lg': ['36rpx', '48rpx'],    // 大文本
}
```

**推荐组合**：

- 36rpx 图标 + `text-sm` (28rpx) ✅ 本项目标准
- 32rpx 图标 + `text-xs` (24rpx)
- 40rpx 图标 + `text-base` (32rpx)

## 3. 文本颜色规范

```vue
<template>
	<!-- 标题色 -->
	<text class="text-gray-700 font-bold">标题</text>

	<!-- 次要内容色 -->
	<text class="text-gray-600">内容</text>

	<!-- 强调色 -->
	<text class="text-blue-500">强调</text>
</template>
```

## 4. Flex 垂直居中对齐

### 4.1 基础结构

```vue
<template>
	<view class="icon-text-row">
		<wd-icon name="" custom-class="..." />
		<text>文本</text>
	</view>
</template>

<style lang="scss" scoped>
.icon-text-row {
	display: flex;
	align-items: center; // 垂直居中
	gap: 8rpx;
}
</style>
```

### 4.2 确保行高与图标一致

```scss
.text {
	font-size: 28rpx;
	line-height: 36rpx; // 与图标高度一致
}
```

## 5. 图片区域标题

```vue
<template>
	<view class="image-section-title mb-2 flex items-center text-gray-700 font-bold">
		<wd-icon name="" custom-class="..." />
		<text>业主报修图片</text>
	</view>
</template>

<style lang="scss" scoped>
.image-section-title {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	margin-bottom: 16rpx;
}
</style>
```

## 6. 时间轴文本

```vue
<template>
	<view class="timeline-title mb-3 text-gray-700 font-bold"> 工单流转记录 </view>
</template>

<style lang="scss" scoped>
.timeline-title {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}
</style>
```

## 7. 时间轴记录内容

```vue
<template>
	<view class="timeline-record-title mb-1 font-medium"> {{ record.startTime }} 到达 {{ record.staffName }} 工位 </view>

	<view class="timeline-record-content mb-1 text-gray-600"> 处理意见：{{ record.context || "暂无" }} </view>
</template>

<style lang="scss" scoped>
.timeline-record-title {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	font-weight: 500;
}

.timeline-record-content {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}
</style>
```

## 8. 常见问题

### 8.1 文本和图标不对齐

```scss
// ❌ 错误
.container {
	display: flex;
}

// ✅ 正确
.container {
	display: flex;
	align-items: center;
}

.text {
	font-size: 28rpx;
	line-height: 36rpx; // 与图标高度一致
}
```

### 8.2 响应式场景下文本显示过小

```scss
// ✅ 推荐：使用 scoped 样式 + !important
.text {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}
```
