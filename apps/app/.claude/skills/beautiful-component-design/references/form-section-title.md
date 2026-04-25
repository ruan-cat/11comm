# 表单分区标题组件 (form-section-title)

## 1. 组件概述

`form-section-title` 是专为表单页面设计的分区标题组件，提供统一美观的标题样式，用于替代传统的样式类和 view 标签实现。

## 2. 设计理念

### 2.1 视觉层次

- **淡灰色渐变背景**：与白色表单项形成清晰的视觉对比，增强内容分区
- **左侧装饰条**：蓝色渐变装饰条提供视觉焦点
- **呼吸动效**：柔和的背景动画提升视觉美感，避免呆板

### 2.2 信息传达

- **图标支持**：可选图标增强语义表达，提升用户理解
- **必填标记**：红色星号清晰标识必填内容
- **副标题**：支持额外描述文本，提供补充信息

## 3. 使用场景

### 3.1 基础分区标题

适用于表单中的区域划分，如"房屋信息"、"报修信息"等。

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle title="房屋信息" />
		<wd-input label="楼栋" />
		<wd-input label="单元" />
	</wd-cell-group>
</template>
```

### 3.2 必填内容标识

使用 `required` 属性标识必填内容区域。

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle title="报修信息" required />
		<wd-input label="报修人" required />
	</wd-cell-group>
</template>
```

### 3.3 带语义图标

使用图标增强内容语义，提升可读性。

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle title="商品选择" icon="shopping-cart" icon-class="i-carbon-shopping-cart text-blue-500" />
	</wd-cell-group>
</template>
```

### 3.4 带补充说明

使用副标题提供额外信息。

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle
			title="相关图片"
			subtitle="最多上传9张"
			icon="image"
			icon-class="i-carbon-image text-orange-500"
		/>
	</wd-cell-group>
</template>
```

## 4. 美观度优化要点

### 4.1 图标选择

- **语义匹配**：选择与内容相关的图标（如房屋用 home，图片用 image）
- **颜色协调**：使用 Carbon 图标配合 UnoCSS 颜色类
- **大小适中**：默认 18px，保持视觉平衡

### 4.2 颜色搭配

推荐的图标颜色搭配：

| 内容类型 |           图标           |      颜色类       |
| :------: | :----------------------: | :---------------: |
| 房屋信息 |     `i-carbon-home`      |  `text-blue-500`  |
| 报修信息 |  `i-carbon-information`  | `text-green-500`  |
| 商品选择 | `i-carbon-shopping-cart` |  `text-blue-500`  |
| 用户信息 |     `i-carbon-user`      | `text-purple-500` |
| 图片上传 |     `i-carbon-image`     | `text-orange-500` |
| 文档内容 |   `i-carbon-document`    | `text-purple-500` |

### 4.3 间距控制

- **上下分区**：使用 `class="mt-3"` 在 `wd-cell-group` 上设置分区间距
- **内部间距**：组件已设置 `margin-bottom: 2px`，无需额外调整

```vue
<template>
	<!-- 第一个分区 -->
	<wd-cell-group border>
		<FormSectionTitle title="第一部分" />
	</wd-cell-group>

	<!-- 第二个分区，添加上边距 -->
	<wd-cell-group border class="mt-3">
		<FormSectionTitle title="第二部分" />
	</wd-cell-group>
</template>
```

## 5. 常见问题

### 5.1 标题组件的位置

**✅ 正确**：标题组件应在 `wd-cell-group` 内部作为第一个元素

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle title="标题" />
		<wd-input label="字段" />
	</wd-cell-group>
</template>
```

**❌ 错误**：不要将标题放在 `wd-cell-group` 外部

```vue
<template>
	<!-- ❌ 错误用法 -->
	<FormSectionTitle title="标题" />
	<wd-cell-group border>
		<wd-input label="字段" />
	</wd-cell-group>
</template>
```

### 5.2 是否需要禁用动效

- **默认保留动效**：呼吸动效柔和自然，不影响性能
- **特殊场景禁用**：如页面元素过多需优化性能，可设置 `:animated="false"`

### 5.3 背景色能否修改

- **不推荐修改**：淡灰色背景是设计标准，与白色表单项形成对比
- **特殊需求**：如需修改可通过 `custom-class` 自定义，但需保持视觉对比度

## 6. 完整示例

### 6.1 维修工单表单

```vue
<template>
	<view class="min-h-screen bg-gray-100">
		<wd-form ref="formRef" :model="model">
			<!-- 房屋信息 -->
			<wd-cell-group border>
				<FormSectionTitle title="房屋信息" icon="home" icon-class="i-carbon-home text-blue-500" required />
				<wd-input v-model="model.building" label="楼栋" />
				<wd-input v-model="model.unit" label="单元" />
			</wd-cell-group>

			<!-- 报修信息 -->
			<wd-cell-group border class="mt-3">
				<FormSectionTitle
					title="报修信息"
					icon="information"
					icon-class="i-carbon-information text-green-500"
					required
				/>
				<wd-input v-model="model.title" label="维修标题" />
				<wd-textarea v-model="model.content" label="报修内容" />
			</wd-cell-group>

			<!-- 相关图片 -->
			<view class="mt-3">
				<wd-cell-group border>
					<FormSectionTitle
						title="相关图片"
						icon="image"
						icon-class="i-carbon-image text-orange-500"
						subtitle="最多上传9张"
					/>
				</wd-cell-group>
				<view class="bg-white p-3 mt-2">
					<wd-upload v-model:file-list="model.photos" :limit="9" />
				</view>
			</view>
		</wd-form>
	</view>
</template>
```

### 6.2 商品选择表单

```vue
<template>
	<view class="min-h-screen bg-gray-100">
		<wd-form ref="formRef" :model="model">
			<!-- 商品类型 -->
			<wd-cell-group border>
				<FormSectionTitle title="商品类型" icon="grid" icon-class="i-carbon-grid text-blue-500" />
				<wd-picker v-model="model.category" :columns="categories" />
			</wd-cell-group>

			<!-- 商品选择 -->
			<wd-cell-group border class="mt-3">
				<FormSectionTitle
					title="商品选择"
					icon="shopping-cart"
					icon-class="i-carbon-shopping-cart text-blue-500"
					required
				/>
				<wd-picker v-model="model.product" :columns="products" />
			</wd-cell-group>

			<!-- 购买数量 -->
			<wd-cell-group border class="mt-3">
				<FormSectionTitle title="购买数量" icon="number" icon-class="i-carbon-number text-orange-500" required />
				<wd-cell title="数量">
					<wd-input-number v-model="model.quantity" :min="1" />
				</wd-cell>
			</wd-cell-group>
		</wd-form>
	</view>
</template>
```

## 7. 参考资料

- **组件文档**：`src/components/common/form-section-title/index.md`
- **演示页面**：`src/pages/test-use/form-section-title.vue`
- **实际应用**：
  - `src/pages-sub/repair/select-resource.vue`
  - `src/pages-sub/repair/handle.vue`
  - `src/pages-sub/repair/add-order.vue`
