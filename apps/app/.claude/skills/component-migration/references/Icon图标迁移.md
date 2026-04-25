# Icon 图标迁移指南

## 核心方针

从 `cuIcon-*` ColorUI 图标迁移到基于 `<wd-icon>` 组件的 Carbon 图标系统。

## 技术实现要点

1. **Icon 实现方式**: 使用基于类名生成的 iconify 图标系统
2. **类名格式要求**: 编写格式满足 UnoCSS 的 icon 图标类格式
3. **Iconify 图标集**: 本项目使用 `@iconify-json/carbon` 库,即 `carbon` 图标集
4. **Icon 类名规范**: 按照 UnoCSS + Iconify 要求,本项目图标类名为 `i-carbon-*` 格式

## 迁移语法

### 基础迁移

```vue
<!-- 旧的 ColorUI 图标 -->
<text class="cuIcon-notification"></text>

<!-- 新的实现方式 -->
<wd-icon name="" custom-class="i-carbon-notification" />
```

### 带颜色类的迁移

```vue
<!-- 旧代码: ColorUI 图标 + 颜色类 -->
<text class="cuIcon-notification text-green" />

<!-- 新代码: wd-icon + Carbon 图标 + UnoCSS 颜色类 -->
<wd-icon name="" custom-class="i-carbon-notification text-colorui-green" />
```

### 带样式的迁移

```vue
<!-- 旧代码: ColorUI 图标 + 多个样式类 -->
<text class="cuIcon-time text-gray margin-right"></text>

<!-- 新代码: wd-icon + Carbon 图标 + UnoCSS 样式类 -->
<wd-icon name="" custom-class="i-carbon-time text-28rpx text-gray-400 mr-8rpx" />
```

## 使用 `<wd-icon>` 组件的必要条件

1. **使用 `<wd-icon>` 组件**: 必须使用 wot-design-uni 的 `<wd-icon>` 组件
2. **name 属性必填**: `<wd-icon>` 组件要求 name 属性必填,迁移时固定填写为空字符串 `""`
3. **custom-class 属性**: `i-carbon-*` 图标类必须在 `custom-class` 属性中才能生效
4. **样式调整**: 图标大小、颜色、间距等样式修改需求,使用 `custom-class` 配合 UnoCSS 原子式样式实现

## 完整实现示例

```vue
<!-- 基础图标 -->
<wd-icon name="" custom-class="i-carbon-notification" />

<!-- 带样式的图标 -->
<wd-icon name="" custom-class="i-carbon-time text-28rpx text-#368cfe mr-8rpx" />

<!-- 多种样式组合 -->
<wd-icon name="" custom-class="i-carbon-thumbs-up text-28rpx text-gray-400 mr-8rpx" />
```

## ColorUI 图标到 Carbon 图标映射表

### 常用图标映射

| ColorUI 图标          | Carbon 图标映射          | 使用场景 |
| :-------------------- | :----------------------- | :------- |
| `cuIcon-notification` | `i-carbon-notification`  | 通知图标 |
| `cuIcon-close`        | `i-carbon-close`         | 关闭图标 |
| `cuIcon-cameraadd`    | `i-carbon-camera`        | 相机添加 |
| `cuIcon-warnfill`     | `i-carbon-warning`       | 警告填充 |
| `cuIcon-add`          | `i-carbon-add`           | 添加图标 |
| `cuIcon-delete`       | `i-carbon-trash-can`     | 删除图标 |
| `cuIcon-search`       | `i-carbon-search`        | 搜索图标 |
| `cuIcon-edit`         | `i-carbon-edit`          | 编辑图标 |
| `cuIcon-dianhua`      | `i-carbon-phone`         | 电话图标 |
| `cuIcon-home`         | `i-carbon-home`          | 首页图标 |
| `cuIcon-user`         | `i-carbon-user-avatar`   | 用户图标 |
| `cuIcon-setting`      | `i-carbon-settings`      | 设置图标 |
| `cuIcon-time`         | `i-carbon-time`          | 时间图标 |
| `cuIcon-view`         | `i-carbon-view`          | 浏览图标 |
| `cuIcon-thumbs-up`    | `i-carbon-thumbs-up`     | 点赞图标 |
| `cuIcon-chat`         | `i-carbon-chat`          | 评论图标 |
| `cuIcon-right`        | `i-carbon-chevron-right` | 右箭头   |
| `cuIcon-ticket`       | `i-carbon-ticket`        | 票据图标 |
| `cuIcon-profile`      | `i-carbon-user-avatar`   | 用户头像 |
| `cuIcon-phone`        | `i-carbon-phone`         | 电话图标 |
| `cuIcon-footprint`    | `i-carbon-footprints`    | 足迹图标 |
| `cuIcon-deletefill`   | `i-carbon-trash-can`     | 删除填充 |

### 方向图标

| ColorUI 图标   | Carbon 图标映射          | 说明   |
| :------------- | :----------------------- | :----- |
| `cuIcon-right` | `i-carbon-chevron-right` | 右箭头 |
| `cuIcon-left`  | `i-carbon-chevron-left`  | 左箭头 |
| `cuIcon-up`    | `i-carbon-chevron-up`    | 上箭头 |
| `cuIcon-down`  | `i-carbon-chevron-down`  | 下箭头 |

### 状态图标

| ColorUI 图标        | Carbon 图标映射             | 说明     |
| :------------------ | :-------------------------- | :------- |
| `cuIcon-check`      | `i-carbon-checkmark`        | 勾选图标 |
| `cuIcon-roundcheck` | `i-carbon-checkmark-filled` | 圆形勾选 |
| `cuIcon-warn`       | `i-carbon-warning`          | 警告图标 |
| `cuIcon-warnfill`   | `i-carbon-warning-filled`   | 警告填充 |
| `cuIcon-info`       | `i-carbon-information`      | 信息图标 |
| `cuIcon-error`      | `i-carbon-error`            | 错误图标 |

### 操作图标

| ColorUI 图标      | Carbon 图标映射      | 说明 |
| :---------------- | :------------------- | :--- |
| `cuIcon-add`      | `i-carbon-add`       | 添加 |
| `cuIcon-reduce`   | `i-carbon-subtract`  | 减少 |
| `cuIcon-delete`   | `i-carbon-trash-can` | 删除 |
| `cuIcon-edit`     | `i-carbon-edit`      | 编辑 |
| `cuIcon-refresh`  | `i-carbon-renew`     | 刷新 |
| `cuIcon-upload`   | `i-carbon-upload`    | 上传 |
| `cuIcon-download` | `i-carbon-download`  | 下载 |

### 社交图标

| ColorUI 图标   | Carbon 图标映射      | 说明 |
| :------------- | :------------------- | :--- |
| `cuIcon-like`  | `i-carbon-thumbs-up` | 点赞 |
| `cuIcon-favor` | `i-carbon-favorite`  | 收藏 |
| `cuIcon-chat`  | `i-carbon-chat`      | 聊天 |
| `cuIcon-share` | `i-carbon-share`     | 分享 |

## 迁移实战示例

### 示例 1: 列表项图标

```vue
<!-- 旧代码 -->
<view class="cu-item">
  <text class="cuIcon-notification text-green margin-right-xs"></text>
  <text>通知标题</text>
</view>

<!-- 新代码 -->
<wd-cell>
  <template #icon>
    <wd-icon name="" custom-class="i-carbon-notification text-green-500 mr-2" />
  </template>
  <template #title>
    <text>通知标题</text>
  </template>
</wd-cell>
```

### 示例 2: 按钮图标

```vue
<!-- 旧代码 -->
<button class="cu-btn">
  <text class="cuIcon-add margin-right-xs"></text>
  <text>添加</text>
</button>

<!-- 新代码 -->
<wd-button>
  <wd-icon name="" custom-class="i-carbon-add mr-2" />
  <text>添加</text>
</wd-button>
```

### 示例 3: 状态图标

```vue
<!-- 旧代码 -->
<view class="status">
  <text class="cuIcon-roundcheck text-green"></text>
  <text>已完成</text>
</view>

<!-- 新代码 -->
<view class="flex items-center">
  <wd-icon name="" custom-class="i-carbon-checkmark-filled text-green-500 mr-2" />
  <text>已完成</text>
</view>
```

### 示例 4: 空状态图标

```vue
<!-- 旧代码 -->
<view class="empty-state">
  <text class="cuIcon-warnfill text-gray"></text>
  <text>暂无数据</text>
</view>

<!-- 新代码 -->
<wd-status-tip tip="暂无数据">
  <template #image>
    <wd-icon name="" custom-class="i-carbon-warning-alt text-60rpx text-gray-400" />
  </template>
</wd-status-tip>
```

## 查找 Carbon 图标

如果 ColorUI 图标没有直接的映射,可以通过以下方式查找合适的 Carbon 图标:

1. **Carbon 图标官网**: https://carbondesignsystem.com/guidelines/icons/library/
2. **Iconify 图标搜索**: https://icon-sets.iconify.design/carbon/
3. **UnoCSS 预设图标**: 在项目中使用 UnoCSS 的 icon 预设查找

## 迁移检查清单

- [ ] **组件使用**
  - [ ] 所有图标都使用 `<wd-icon>` 组件
  - [ ] name 属性设置为空字符串 `""`

- [ ] **类名格式**
  - [ ] 所有图标类名使用 `i-carbon-*` 格式
  - [ ] 图标类名在 `custom-class` 属性中设置

- [ ] **样式迁移**
  - [ ] 颜色类从 `text-green` 迁移到 `text-green-500`
  - [ ] 间距类从 `margin-right` 迁移到 `mr-2`
  - [ ] 大小类使用 UnoCSS 格式,如 `text-28rpx`

- [ ] **语义正确**
  - [ ] 图标语义与功能匹配
  - [ ] 使用合适的 Carbon 图标替代

- [ ] **视觉一致**
  - [ ] 迁移后视觉效果与原设计一致
  - [ ] 图标大小、颜色、间距保持统一

## 常见问题

### 1. 为什么 name 属性必须是空字符串?

**答**: `wd-icon` 组件默认使用内置的图标库,name 属性用于指定内置图标名称。当使用自定义 iconify 图标时,需要通过 `custom-class` 属性传入图标类名,此时 name 属性设置为空字符串即可。

### 2. 图标大小如何调整?

**答**: 使用 UnoCSS 的文本大小类,如:

```vue
<!-- 小图标 -->
<wd-icon name="" custom-class="i-carbon-add text-20rpx" />

<!-- 中等图标 -->
<wd-icon name="" custom-class="i-carbon-add text-28rpx" />

<!-- 大图标 -->
<wd-icon name="" custom-class="i-carbon-add text-40rpx" />
```

### 3. 如何设置图标颜色?

**答**: 使用 UnoCSS 的文本颜色类,如:

```vue
<!-- 主题色 -->
<wd-icon name="" custom-class="i-carbon-add text-primary" />

<!-- 自定义颜色 -->
<wd-icon name="" custom-class="i-carbon-add text-#368cfe" />

<!-- 语义化颜色 -->
<wd-icon name="" custom-class="i-carbon-warning text-orange-500" />
```

### 4. 找不到合适的 Carbon 图标怎么办?

**答**:

1. 查找功能相近的图标作为替代
2. 使用其他 iconify 图标集(需要额外配置)
3. 使用自定义 SVG 图标
4. 考虑使用 `wd-icon` 的内置图标

通过系统化的图标迁移,确保项目图标系统的统一性和可维护性！
