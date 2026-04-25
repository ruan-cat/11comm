# 2026-01-14 微信小程序 WXSS `:not()` 伪类选择器兼容性修复报告

## 1. 问题概述

|   项目   |                                       内容                                        |
| :------: | :-------------------------------------------------------------------------------: |
| 问题类型 |                                微信小程序编译错误                                 |
| 错误信息 |    `[ WXSS 文件编译错误] ./pages-sub/xxx/xxx.wxss(27:30): error at token ':'`     |
| 影响范围 |                                 8 个 Vue 组件文件                                 |
| 根本原因 | UnoCSS 的 `space-y-*` / `space-x-*` 类生成的 CSS 包含 `:not([hidden])` 伪类选择器 |
| 解决方案 |                      使用兼容微信小程序的相邻兄弟选择器替代                       |

## 2. 问题分析

### 2.1. 错误触发场景

在 uni-app 项目编译为微信小程序时，WXSS 编译器报错：

```log
[ WXSS 文件编译错误] ./pages-sub/maintenance/task-list.wxss(27:30): error at token `:`
(env: Windows,mp,1.06.2504060; lib: 3.13.0)
```

### 2.2. 根本原因

UnoCSS 的 `space-y-*` 和 `space-x-*` 工具类会生成如下 CSS：

```css
/* UnoCSS 生成的 space-y-2 样式 */
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
	margin-top: 8rpx;
}
```

微信小程序的 WXSS 不支持 `:not()` 伪类选择器中的属性选择器语法 `[hidden]`，导致编译失败。

### 2.3. 受影响文件

| 序号 |                   文件路径                   |  问题类名   |
| :--: | :------------------------------------------: | :---------: |
|  1   |  `src/pages-sub/maintenance/task-list.vue`   | `space-y-2` |
|  2   |       `src/pages-sub/work/do-work.vue`       | `space-y-2` |
|  3   |      `src/pages-sub/work/copy-work.vue`      | `space-y-2` |
|  4   |      `src/pages-sub/complaint/list.vue`      | `space-y-1` |
|  5   |     `src/pages-sub/complaint/finish.vue`     | `space-y-1` |
|  6   |     `src/pages-sub/complaint/detail.vue`     | `space-y-2` |
|  7   | `src/components/activity/activity-info.vue`  | `space-y-0` |
|  8   | `src/components/activity/activity-error.vue` | `space-y-3` |

## 3. 解决方案

### 3.1. 修复策略

使用微信小程序兼容的 CSS 选择器替代 UnoCSS 的 `space-y-*` 类：

|              不兼容写法（UnoCSS）              |          兼容写法（原生 CSS）           |
| :--------------------------------------------: | :-------------------------------------: |
| `.space-y-2 > :not([hidden]) ~ :not([hidden])` |  `.item + .item { margin-top: 8rpx; }`  |
|      `.space-y-1 > view:not(:last-child)`      | `.item + .item { margin-top: 0.5rem; }` |

### 3.2. 修复示例

**修复前（模板）：**

```vue
<template>
	<view class="mb-3 text-sm text-gray-600 space-y-2">
		<view class="flex items-center gap-2">...</view>
		<view class="flex items-center gap-2">...</view>
	</view>
</template>
```

**修复后（模板）：**

```vue
<template>
	<view class="mb-3 text-sm text-gray-600">
		<view class="info-item flex items-center gap-2">...</view>
		<view class="info-item flex items-center gap-2">...</view>
	</view>
</template>
```

**修复后（样式）：**

```scss
<style scoped lang="scss">
/* 信息行间距 - 兼容微信小程序 */
.info-item + .info-item {
  margin-top: 8rpx;
}
</style>
```

## 4. 预防措施

### 4.1. 禁用列表

在微信小程序项目中，应避免使用以下 UnoCSS 类：

|   类名模式   |             原因             |
| :----------: | :--------------------------: |
| `space-y-*`  | 生成 `:not([hidden])` 选择器 |
| `space-x-*`  | 生成 `:not([hidden])` 选择器 |
| `divide-y-*` | 生成 `:not([hidden])` 选择器 |
| `divide-x-*` | 生成 `:not([hidden])` 选择器 |

### 4.2. 推荐替代方案

|     场景      |               推荐写法                |
| :-----------: | :-----------------------------------: |
|   垂直间距    | `.item + .item { margin-top: Xpx; }`  |
|   水平间距    | `.item + .item { margin-left: Xpx; }` |
| Flex 布局间距 |   使用 `gap-*` 类（微信小程序支持）   |

### 4.3. 技能文档更新建议

建议在 `.claude/skills/style-migration/SKILL.md` 中添加微信小程序样式兼容性注意事项。

## 5. 验证结果

修复后重新编译微信小程序，所有 WXSS 编译错误已消除。

## 6. 经验总结

1. UnoCSS 的部分工具类在微信小程序环境下存在兼容性问题
2. 在进行样式迁移时，需要考虑目标平台的 CSS 选择器支持情况
3. 微信小程序的 WXSS 对 CSS 选择器有严格限制，特别是 `:not()` 伪类选择器
4. 建议在代码审查阶段增加对 `space-y-*` / `space-x-*` 类的检查
5. `:nth-child(n+2)` 等复杂伪类选择器同样不被微信小程序支持

## 7. 后续修复补充

### 7.1. 2026-01-14 追加修复

发现 `activity-error.vue` 文件中使用了 `:nth-child(n+2)` 选择器，同样导致编译错误：

```log
[ WXSS 文件编译错误] ./components/activity/activity-error.wxss(9:35): error at token `:`
```

**问题代码：**

```css
.action-buttons > :nth-child(n + 2) {
	margin-top: 12px;
}
```

**修复方案：** 给每个按钮添加 `.action-btn` 类，使用简单的类选择器：

```css
.action-btn {
	margin-top: 12px;
}
```

### 7.2. 完整的不兼容选择器列表

|       选择器        |          替代方案          |
| :-----------------: | :------------------------: |
|  `:not([hidden])`   |      `.item + .item`       |
| `:not(:last-child)` |      `.item + .item`       |
|  `:nth-child(n+2)`  | `.item` 或 `.item + .item` |
| `:nth-child(3n+1)`  |    手动添加 class 区分     |
|     `*` 通配符      |     列举具体组件选择器     |
