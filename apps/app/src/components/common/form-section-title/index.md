# form-section-title 组件使用文档

## 1. 文件存储结构

```plain
src/components/common/form-section-title/
├── index.vue      # 组件主文件
├── types.ts       # TypeScript 类型定义
└── index.md       # 组件文档
```

### 1.1 文件说明

|  文件名   |                 说明                  |
| :-------: | :-----------------------------------: |
| index.vue |     组件主文件，实现标题 UI 逻辑      |
| types.ts  | TypeScript 类型定义文件，对外导出类型 |
| index.md  |           组件使用文档说明            |

## 2. 组件简介

`form-section-title` 是一个专用于表单页面的分区标题组件，提供统一美观的标题样式，用于替代表单中不统一的标题显示。

### 2.1 设计特点

- **淡灰色渐变背景**：与白色表单项形成视觉对比
- **呼吸动效**：柔和的背景呼吸动画，提升视觉美感
- **左侧装饰条**：蓝色渐变装饰条，增强视觉识别
- **图标支持**：支持 wot-design-uni 内置图标和 UnoCSS Iconify 图标
- **必填标记**：支持显示必填红色星号

## 3. 基础用法

### 3.1 手动导入方式

```vue
<script setup lang="ts">
import FormSectionTitle from "@/components/common/form-section-title/index.vue";
</script>

<template>
	<wd-cell-group>
		<FormSectionTitle title="商品类型" />
		<wd-input label="类型名称" placeholder="请输入类型名称" />
	</wd-cell-group>
</template>
```

### 3.2 自动导入方式（推荐）

```vue
<template>
	<wd-cell-group>
		<form-section-title title="商品类型" />
		<wd-input label="类型名称" placeholder="请输入类型名称" />
	</wd-cell-group>
</template>
```

## 4. Props 参数

|  参数名   |  类型   | 默认值 |                                                      说明                                                       |
| :-------: | :-----: | :----: | :-------------------------------------------------------------------------------------------------------------: |
|   title   | string  |   -    |                                                标题文本（必填）                                                 |
| required  | boolean | false  |                                                是否显示必填标记                                                 |
| animated  | boolean |  true  |                                                是否启用呼吸动效                                                 |
|   icon    | string  |   ''   | 图标名称，支持两种格式：wot-design-uni 内置图标（如 `star`）或 UnoCSS Iconify 图标（如 `i-carbon-star-filled`） |
| iconClass | string  |   ''   |                                     图标的自定义类名（用于设置颜色等样式）                                      |
| subtitle  | string  |   ''   |                                                 副标题/描述文本                                                 |

## 5. 使用场景

### 5.1 基础标题

```vue
<template>
	<form-section-title title="房屋信息" />
</template>
```

### 5.2 必填标题

```vue
<template>
	<form-section-title title="报修信息" required />
</template>
```

### 5.3 带 wot-design-uni 内置图标的标题

```vue
<template>
	<form-section-title title="商品选择" icon="shopping-cart" icon-class="text-blue-500" />
</template>
```

### 5.4 带 UnoCSS Iconify 图标的标题（推荐）

```vue
<template>
	<!-- 使用 Carbon 图标 -->
	<form-section-title title="常用功能" icon="i-carbon-star-filled" icon-class="text-colorui-orange" />

	<!-- 使用其他 Iconify 图标集 -->
	<form-section-title title="维修报修" icon="i-carbon-tools" icon-class="text-colorui-blue" />
</template>
```

### 5.5 带副标题的标题

```vue
<template>
	<form-section-title title="相关图片" subtitle="最多上传9张" />
</template>
```

### 5.6 禁用动效

```vue
<template>
	<form-section-title title="基础信息" :animated="false" />
</template>
```

## 6. 图标使用说明

### 6.1 图标类型自动识别

组件会根据 `icon` 属性值自动识别图标类型：

- **以 `i-` 开头**：识别为 UnoCSS Iconify 图标，使用 `<view>` 元素渲染
- **其他值**：识别为 wot-design-uni 内置图标，使用 `<wd-icon>` 组件渲染

### 6.2 推荐使用 Iconify 图标

项目统一使用 Carbon 图标库（`i-carbon-*`），推荐使用 Iconify 图标以保持视觉统一：

```vue
<template>
	<!-- 推荐：使用 Iconify 图标 -->
	<form-section-title title="常用功能" icon="i-carbon-star-filled" icon-class="text-colorui-orange" />
	<form-section-title title="维修报修" icon="i-carbon-tools" icon-class="text-colorui-blue" />
	<form-section-title title="工单业务" icon="i-carbon-document" icon-class="text-colorui-cyan" />
	<form-section-title title="资源管理" icon="i-carbon-cube" icon-class="text-colorui-green" />
</template>
```

### 6.3 图标颜色设置

通过 `iconClass` 属性设置图标颜色，推荐使用项目主题色：

|      颜色类名       | 颜色 |   适用场景    |
| :-----------------: | :--: | :-----------: |
|  text-colorui-blue  | 蓝色 | 主要功能入口  |
| text-colorui-green  | 绿色 | 成功/完成状态 |
|  text-colorui-red   | 红色 | 警告/投诉相关 |
| text-colorui-orange | 橙色 | 常用/推荐功能 |
|  text-colorui-cyan  | 青色 | 辅助功能入口  |
| text-colorui-purple | 紫色 | 特殊功能入口  |

## 7. 完整示例

详细的使用示例和各种配置效果，请查看：

- **测试页面**：`src/pages/test-use/form-section-title.vue`
- **工作台页面**：`src/pages/work-dashboard/index.vue`
- **维修工单页面**：
  - `src/pages-sub/repair/select-resource.vue`
  - `src/pages-sub/repair/handle.vue`
  - `src/pages-sub/repair/add-order.vue`

## 8. 与 wd-cell 的区别

|   特性   |    form-section-title     |  wd-cell   |
| :------: | :-----------------------: | :--------: |
| 主要用途 |       表单分区标题        | 单元格内容 |
| 背景样式 |      淡灰色渐变背景       |  白色背景  |
| 装饰元素 | 左侧蓝色装饰条 + 呼吸动效 |     无     |
| 视觉层次 |      标题层次，醒目       |  内容层次  |

## 9. 注意事项

1. **使用位置**：该组件应在 `wd-cell-group` 内使用，作为表单分区的标题
2. **图标选择**：推荐使用 Carbon 图标库的图标（`i-carbon-*`）保持视觉统一
3. **图标格式**：Iconify 图标必须以 `i-` 开头，否则会被识别为 wot-design-uni 内置图标
4. **动画性能**：默认启用呼吸动效，如需优化性能可设置 `animated="false"`
5. **背景对比**：组件设计为淡灰色背景，与白色的表单输入项形成对比，请勿修改背景色
6. **间距控制**：组件已设置 `margin-bottom: 2px`，与下方表单项形成合适间距

## 10. TypeScript 类型

如需导入类型定义：

```typescript
import type { FormSectionTitleProps } from "@/components/common/form-section-title/types";
```

## 11. 样式自定义

组件提供了 `custom-class` 支持，如需自定义样式：

```vue
<template>
	<form-section-title title="自定义样式" custom-class="my-custom-title" />
</template>

<style>
.my-custom-title {
	/* 自定义样式 */
}
</style>
```

## 12. 常见问题

### 12.1 为什么标题组件没有点击事件？

`form-section-title` 是纯展示组件，不支持点击交互。如需可点击的标题，请使用 `wd-cell` 并设置 `clickable` 属性。

### 12.2 如何调整标题文字大小？

标题文字大小默认为 `text-base`（16px），如需调整可通过 `custom-class` 自定义。

### 12.3 可以在标题右侧添加按钮吗？

当前版本不支持右侧插槽。如有此需求，建议直接使用 `wd-cell` 组件的插槽功能。

### 12.4 为什么 Iconify 图标不显示？

请确保：

1. 图标名称以 `i-` 开头（如 `i-carbon-star-filled`）
2. 项目已正确配置 UnoCSS 和 Iconify 预设
3. 图标名称拼写正确（可在 [Iconify](https://icon-sets.iconify.design/) 查询）
