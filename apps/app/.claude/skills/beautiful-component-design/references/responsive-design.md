# 响应式设计规范

## 1. rpx 单位使用

项目配置了 UnoCSS rpx 规则，可直接使用：

```vue
<template>
	<view class="p-3">padding: 24rpx</view>
	<view class="mb-3">margin-bottom: 24rpx</view>
	<view class="w-36rpx h-36rpx">36rpx 尺寸</view>
</template>
```

### UnoCSS rpx 规则

```typescript
rules: [
	[/^text-(\d+)rpx$/, ([, d]) => ({ "font-size": `${d}rpx` })],
	[/^leading-(\d+)rpx$/, ([, d]) => ({ "line-height": `${d}rpx` })],
	[/^w-(\d+)rpx$/, ([, d]) => ({ width: `${d}rpx` })],
	[/^h-(\d+)rpx$/, ([, d]) => ({ height: `${d}rpx` })],
];
```

## 2. 图片网格布局

### 2.1 三列图片布局

```vue
<template>
	<view class="photo-grid">
		<view v-for="(photo, index) in photos" :key="index" class="photo-grid__item">
			<wd-img
				:src="photo.url || photo.photo"
				:image-urls="getImageUrls(photos)"
				:current-index="index"
				mode="aspectFill"
				class="aspect-square w-full rounded"
				:enable-preview="true"
			/>
		</view>
	</view>
</template>

<style scoped>
.photo-grid {
	display: flex;
	flex-wrap: wrap;
	margin: -8rpx;
}

.photo-grid__item {
	box-sizing: border-box;
	width: 33.3333%;
	padding: 8rpx;
}
</style>
```

### 2.2 图片样式说明

| 类名               | 说明                   |
| :----------------- | :--------------------- |
| `photo-grid`       | `flex + wrap` 三列布局 |
| `photo-grid__item` | 子项统一留白 16rpx     |
| `aspect-square`    | 正方形宽高比           |
| `w-full`           | 宽度 100%              |
| `rounded`          | 圆角                   |

## 3. 页面间距规范

```vue
<template>
	<view class="p-3">
		<!-- 页面内边距 24rpx -->
	</view>
</template>
```

### 间距层级

| 层级 | 类名          | 实际值 | 使用场景       |
| :--- | :------------ | :----- | :------------- |
| 页面 | `p-3`         | 24rpx  | 页面容器内边距 |
| 卡片 | `mb-3`        | 24rpx  | 卡片间距       |
| 区块 | `mb-2`        | 16rpx  | 区块间距       |
| 元素 | 显式 `margin` | 16rpx  | 元素间距       |
| 紧凑 | 显式 `margin` | 8rpx   | 紧密元素       |

## 4. 圆角规范

```vue
<template>
	<!-- 图片圆角 -->
	<wd-img class="rounded" />

	<!-- 卡片圆角 -->
	<view class="bg-white rounded">
		<!-- 内容 -->
	</view>
</template>
```

## 5. 背景与卡片

```vue
<template>
	<view class="repair-detail-page">
		<view class="p-3">
			<view class="mb-3 bg-white">
				<!-- 白色卡片 -->
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.repair-detail-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}
</style>
```

## 6. 时间轴响应式

### 6.1 基础结构

```vue
<template>
	<view class="relative">
		<view v-for="(record, index) in records" :key="index" class="relative mb-4 flex">
			<!-- 时间轴节点 -->
			<view class="timeline-node">
				<view class="node-dot" :class="getStatusColor(record.statusCd)" />
				<view v-if="index !== records.length - 1" class="node-line" />
			</view>

			<!-- 时间轴内容 -->
			<view class="timeline-content flex-1 pb-2">
				<view class="timeline-record-title mb-1 font-medium"> {{ record.startTime }} - {{ record.statusName }} </view>
			</view>
		</view>
	</view>
</template>
```

### 6.2 时间轴节点样式

```scss
.timeline-node {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 2px;

	.node-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: rgb(66, 153, 225);
		z-index: 1;
	}

	.node-line {
		flex: 1;
		width: 2px;
		background-color: rgb(226, 232, 240);
		margin-top: 4px;
		min-height: 40px;
	}
}

.timeline-content {
	margin-left: 12rpx;
}
```

## 7. 深度选择器 :deep()

### 7.1 覆盖 wd-cell 样式

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

### 7.2 样式覆盖优先级

```scss
/* 1. 尝试普通覆盖 */
.custom-class {
	font-size: 28rpx;
}

/* 2. 使用 :deep() 穿透 */
:deep(.component__inner) {
	font-size: 28rpx;
}

/* 3. 添加 !important（最后手段） */
:deep(.component__inner) {
	font-size: 28rpx !important;
}
```

## 8. 常见问题

### 8.1 图标被文本挤压变形

```scss
.icon {
	width: 36rpx;
	height: 36rpx;
	flex-shrink: 0; // 关键：防止被压缩
}
```

### 8.2 组件库默认样式无法覆盖

确保使用正确的选择器和优先级。

## 9. 完整页面示例

```vue
<template>
	<view class="repair-detail-page">
		<!-- 基本信息 -->
		<view class="mb-3 bg-white">
			<wd-cell-group border>
				<wd-cell title="报修ID" :value="repairDetail.repairId">
					<template #icon>
						<wd-icon
							name=""
							custom-class="i-carbon-edit text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center"
						/>
					</template>
				</wd-cell>
			</wd-cell-group>
		</view>

		<!-- 图片区域 -->
		<view v-if="hasImages" class="mb-3 bg-white p-3">
			<view class="image-section-title mb-2 flex items-center text-gray-700 font-bold">
				<wd-icon
					name=""
					custom-class="i-carbon-image text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center"
				/>
				<text>业主报修图片</text>
			</view>
			<view class="photo-grid">
				<view v-for="(photo, index) in repairDetail.repairPhotos" :key="index" class="photo-grid__item">
					<wd-img
						:src="photo.url || photo.photo"
						mode="aspectFill"
						class="aspect-square w-full rounded"
						:enable-preview="true"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.repair-detail-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

:deep(.wd-cell__title),
:deep(.wd-cell__value) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}

:deep(.wd-cell__icon) {
	display: flex !important;
	align-items: center !important;
}

.image-section-title {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}
</style>
```
