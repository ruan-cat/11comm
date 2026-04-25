# 小程序首页图片资源加载失败事故报告

## 1. 事故概述

|   项目   |                          内容                          |
| :------: | :----------------------------------------------------: |
| 事故时间 |                       2026-01-12                       |
| 影响范围 |           首页 `pages/index/index` 全部图片            |
| 严重程度 |               中（功能可用但图片不显示）               |
| 根本原因 | 使用 HTML `<img>` 标签和错误的静态资源路径导致加载失败 |
| 修复状态 |                         已修复                         |

## 2. 问题现象

在微信开发者工具内运行项目时，进入首页 `pages/index/index`，控制台报错：

```log
[渲染层网络层错误] Failed to load local image resource /static/image/index/i_complaint.png
the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)

[渲染层网络层错误] Failed to load local image resource /static/image/index/i_inspection.png
the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)

[渲染层网络层错误] Failed to load local image resource /static/image/index/i_repair.png
the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)

[渲染层网络层错误] Failed to load local image resource /static/image/index/i_machine.png
the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)

... 共 9 张图片加载失败
```

## 3. 根本原因分析

### 3.1 错误代码示例

```vue
<template>
	<view>
		<!-- ❌ 错误写法 1：使用 HTML img 标签 -->
		<img class="title-ico" src="/static/image/index/i_complaint.png" draggable="false" />

		<!-- ❌ 错误写法 2：使用绝对路径 /static/... -->
		<img class="work-ico" src="/static/image/index_apply_audit.png" draggable="false" />
	</view>
</template>
```

### 3.2 问题原因详解

|         错误点         | 说明                                                                     |
| :--------------------: | :----------------------------------------------------------------------- |
|   使用 `<img>` 标签    | 小程序不支持 HTML 原生 `<img>` 标签，应使用 uni-app 的 `<image>` 组件    |
| 路径以 `/static/` 开头 | 在 uni-app 项目中，静态资源位于 `src/static/` 目录，构建后路径映射不一致 |
|    `draggable` 属性    | 小程序不支持该 HTML 属性                                                 |

### 3.3 静态资源目录结构

```plain
src/
├── static/
│   ├── image/
│   │   ├── index/
│   │   │   ├── i_complaint.png    ✅ 文件存在
│   │   │   ├── i_inspection.png   ✅ 文件存在
│   │   │   ├── i_machine.png      ✅ 文件存在
│   │   │   └── i_repair.png       ✅ 文件存在
│   │   ├── index_allocation.png   ✅ 文件存在
│   │   ├── index_apply_audit.png  ✅ 文件存在
│   │   └── ...
```

图片文件实际存在，但路径引用方式错误导致无法加载。

### 3.4 Vite 配置中的路径别名

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': path.join(process.cwd(), './src'),
    '@img': path.join(process.cwd(), './src/static/images'),
  },
},
```

项目已配置 `@` 别名指向 `src` 目录，应使用 `@/static/...` 路径。

## 4. 修复方案

### 4.1 正确的图片引用方式

```vue
<template>
	<view>
		<!-- ✅ 正确写法：使用 image 组件 + @ 别名路径 -->
		<image class="title-ico" src="@/static/image/index/i_complaint.png" mode="aspectFit" />

		<!-- ✅ 正确写法 -->
		<image class="work-ico" src="@/static/image/index_apply_audit.png" mode="aspectFit" />
	</view>
</template>
```

### 4.2 关键修改点对照表

|     修改项     | 修改前              | 修改后               |
| :------------: | :------------------ | :------------------- |
|    标签类型    | `<img>`             | `<image>`            |
|    路径格式    | `/static/image/...` | `@/static/image/...` |
| draggable 属性 | `draggable="false"` | 移除                 |
|   mode 属性    | 无                  | `mode="aspectFit"`   |

### 4.3 完整修复代码

修改文件：`src/pages/index/index.vue`

**修改前：**

```vue
<img class="title-ico" src="/static/image/index/i_complaint.png" draggable="false" />
```

**修改后：**

```vue
<image class="title-ico" src="@/static/image/index/i_complaint.png" mode="aspectFit" />
```

## 5. 受影响文件清单

| 文件路径                    |      修改类型      |
| :-------------------------- | :----------------: |
| `src/pages/index/index.vue` | 图片标签和路径修复 |

## 6. 经验总结

### 6.1 uni-app 图片使用规范

1. **使用 `<image>` 组件**：uni-app/小程序中必须使用 `<image>` 组件，不能使用 HTML `<img>` 标签
2. **使用 `@` 别名路径**：静态资源路径应使用 `@/static/...` 格式，确保构建后路径正确
3. **添加 `mode` 属性**：建议为 `<image>` 组件添加 `mode` 属性控制图片裁剪/缩放模式
4. **移除不支持的属性**：小程序不支持 `draggable` 等 HTML 特有属性

### 6.2 常用 image mode 值

| mode 值       | 说明                 |
| :------------ | :------------------- |
| `scaleToFill` | 默认值，拉伸填充     |
| `aspectFit`   | 保持比例，完整显示   |
| `aspectFill`  | 保持比例，裁剪填充   |
| `widthFix`    | 宽度固定，高度自适应 |
| `heightFix`   | 高度固定，宽度自适应 |

### 6.3 代码审查检查点

在代码审查时，针对图片资源应检查：

- [ ] 是否使用了 `<img>` 标签？应改为 `<image>`
- [ ] 静态资源路径是否以 `/static/` 开头？应改为 `@/static/`
- [ ] 是否有 `draggable` 等不支持的 HTML 属性？
- [ ] 是否添加了合适的 `mode` 属性？

## 7. 参考资料

- [uni-app image 组件文档](https://uniapp.dcloud.net.cn/component/image.html)
- [Vite 路径别名配置](https://vitejs.dev/config/shared-options.html#resolve-alias)
