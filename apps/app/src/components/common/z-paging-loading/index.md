# z-paging-loading 组件使用文档

## 1. 文件存储结构

```plain
src/components/common/z-paging-loading/
├── index.vue      # 组件主文件
├── types.ts       # TypeScript 类型定义
└── index.md       # 组件文档
```

### 1.1 文件说明

|  文件名   |                 说明                  |
| :-------: | :-----------------------------------: |
| index.vue |     组件主文件，实现加载 UI 逻辑      |
| types.ts  | TypeScript 类型定义文件，对外导出类型 |
| index.md  |           组件使用文档说明            |

## 2. 组件简介

`z-paging-loading` 是一个专用于 `z-paging` 组件的加载等待组件，用于在 `<template #loading>` 插槽中展示统一的加载样式。

## 3. 使用规范

**重要规范:**

- 在项目中使用 `z-paging` 组件时，必须使用 `<template #loading>` 插槽。
- 在 `#loading` 插槽内，必须使用 `z-paging-loading` 组件，不允许使用其他加载组件。

## 4. 基础用法

### 4.1 手动导入方式

```vue
<script setup lang="ts">
import ZPagingLoading from "@/components/common/z-paging-loading/index.vue";
</script>

<template>
	<z-paging ref="pagingRef" @query="handleQuery">
		<!-- 加载状态 -->
		<template #loading>
			<ZPagingLoading primary-text="正在加载数据..." />
		</template>

		<!-- 列表内容 -->
		<view>...</view>
	</z-paging>
</template>
```

### 4.2 自动导入方式（如果配置了自动导入）

```vue
<template>
	<z-paging ref="pagingRef" @query="handleQuery">
		<!-- 加载状态 -->
		<template #loading>
			<z-paging-loading primary-text="正在加载数据..." />
		</template>

		<!-- 列表内容 -->
		<view>...</view>
	</z-paging>
</template>
```

## 5. Props 参数

|    参数名     |        类型         |                 默认值                  |                    说明                    |
| :-----------: | :-----------------: | :-------------------------------------: | :----------------------------------------: |
|     icon      |       string        |                'loading'                |                  图标名称                  |
|   iconClass   |       string        | 'i-carbon-circle-dash text-blue-400...' |               图标自定义类名               |
|   iconSize    |       string        |                 '20px'                  |                  图标大小                  |
|  loadingSize  |       string        |                 '32px'                  |                 加载器大小                 |
|  loadingType  | 'outline' \| 'ring' |                 'ring'                  | 加载器类型（仅支持 wd-loading 的两种类型） |
|  primaryText  |       string        |            '正在加载数据...'            |                  主要文案                  |
| secondaryText |       string        |              '请稍候片刻'               |                  次要文案                  |

## 6. 完整示例

详细的使用示例和各种配置效果，请查看:

- **测试页面:** `src/pages/test-use/z-paging-loading.vue`
- **选择器页面:** `src/pages-sub/selector/*.vue`
- **维修工单页面:** `src/pages-sub/repair/order-list.vue`

## 7. 常用配置示例

### 7.1 楼栋加载

```vue
<template>
	<ZPagingLoading
		icon="building"
		icon-class="i-carbon-building text-blue-400 animate-pulse"
		primary-text="正在加载楼栋列表..."
	/>
</template>
```

### 7.2 单元加载

```vue
<template>
	<ZPagingLoading
		icon="grid"
		icon-class="i-carbon-grid text-green-400 animate-pulse"
		primary-text="正在加载单元列表..."
	/>
</template>
```

### 7.3 房屋加载

```vue
<template>
	<ZPagingLoading
		icon="home"
		icon-class="i-carbon-home text-purple-400 animate-pulse"
		primary-text="正在加载房屋列表..."
	/>
</template>
```

### 7.4 动态文案

```vue
<template>
	<ZPagingLoading :primary-text="searchValue ? '正在搜索数据...' : '正在加载数据...'" />
</template>
```

## 8. 注意事项

1. **加载器类型限制**: `loadingType` 只支持 `'outline'` 和 `'ring'` 两种类型，这是 `wd-loading` 组件支持的类型。
2. **图标选择**: 建议使用 Carbon 图标库的图标（`i-carbon-*`）保持视觉统一。
3. **动画效果**: 组件已内置 `animate-pulse` 动画，无需额外配置。
4. **自定义类名**: `iconClass` 支持 UnoCSS 原子类，可以自定义图标和颜色。
5. **导入方式**: 组件支持手动导入和自动导入两种方式，推荐使用手动导入确保类型安全。

## 9. TypeScript 类型

如需导入类型定义:

```typescript
import type { ZPagingLoadingProps, WdLoadingType } from "@/components/common/z-paging-loading/types";
```
