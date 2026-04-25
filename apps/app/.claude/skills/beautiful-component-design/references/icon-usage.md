# 图标使用规范

## 1. 基础使用模式

在 wot-design-uni 组件中使用 iconify 图标：

```vue
<template>
	<wd-cell title="报修ID" :value="repairDetail.repairId">
		<template #icon>
			<wd-icon
				name=""
				custom-class="i-carbon-edit text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center"
			/>
		</template>
	</wd-cell>
</template>
```

## 2. 图标类名解析

| 类名                               | 说明                    |
| :--------------------------------- | :---------------------- |
| `i-carbon-xxx`                     | Carbon Icons 图标集前缀 |
| `text-colorui-green`               | 项目自定义绿色主题色    |
| `mr-8rpx`                          | 图标右侧间距 8rpx       |
| `w-36rpx h-36rpx`                  | 图标尺寸 36rpx          |
| `flex items-center justify-center` | 居中对齐                |

## 3. 常用图标映射

```typescript
const iconMap = {
	编辑: "i-carbon-edit",
	票据: "i-carbon-ticket",
	用户: "i-carbon-user-avatar",
	电话: "i-carbon-phone",
	位置: "i-carbon-location",
	时间: "i-carbon-time",
	完成: "i-carbon-checkmark-outline",
	文档: "i-carbon-document",
	图片: "i-carbon-image",
};
```

## 4. 响应式尺寸选择

| 元素类型 | 推荐尺寸 | 说明       |
| :------- | :------- | :--------- |
| 小图标   | 24-28rpx | 辅助性图标 |
| 标准图标 | 32-36rpx | 最常用     |
| 大图标   | 40-48rpx | 强调性图标 |

## 5. 防止图标变形

```scss
.icon {
	width: 36rpx;
	height: 36rpx;
	flex-shrink: 0; // 关键：防止被压缩
}
```

## 6. wd-cell 图标完整示例

```vue
<template>
	<wd-cell-group border>
		<wd-cell title="报修ID" :value="repairDetail.repairId">
			<template #icon>
				<wd-icon
					name=""
					custom-class="i-carbon-edit text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center"
				/>
			</template>
		</wd-cell>
		<wd-cell title="报修人" :value="repairDetail.repairName">
			<template #icon>
				<wd-icon
					name=""
					custom-class="i-carbon-user-avatar text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center"
				/>
			</template>
		</wd-cell>
	</wd-cell-group>
</template>
```

## 7. 图片区域标题图标

```vue
<template>
	<view class="image-section-title mb-2 flex items-center text-gray-700 font-bold">
		<wd-icon
			name=""
			custom-class="i-carbon-image text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center"
		/>
		<text>业主报修图片</text>
	</view>
</template>
```
