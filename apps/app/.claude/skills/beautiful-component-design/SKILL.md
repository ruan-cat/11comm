---
name: beautiful-component-design
description: |
  移动端 uni-app + wot-design-uni 组件美化规范 - 提供图标、文本对齐、响应式设计、表单分区标题、选择器美化、弹框交互的完整规范。

  触发条件（满足任意一项即触发）：
  - 需要添加 FormSectionTitle 组件（表单分区标题）
  - 需要使用 Carbon Icons 图标
  - 需要实现响应式设计（rpx 单位、图片网格）
  - 需要美化选择器组件（wd-picker）
  - 需要实现弹框交互（wd-message-box、wd-popup）
  - 需要美化详情页卡片（通栏标题 + 色彩编码）
  - 用户提及"美化"、"图标"、"对齐"、"响应式"、"FormSectionTitle"等关键词
  - 修复组件嵌套顺序错误（wd-picker 和 wd-cell）
  - 修复插槽使用错误（#value 插槽不存在）

  必须协同的技能：
  - use-wd-form（表单页面必须协同）
  - api-migration（如果有接口调用）
  - api-error-handling（如果有接口调用）
  - z-paging-integration（列表页面美化）

  禁止项：
  - 禁止使用 <view class="section-title"> 代替 FormSectionTitle
  - 禁止 wd-cell 包裹 wd-picker（正确：wd-picker 包裹 wd-cell）
  - 禁止使用不存在的 #value 插槽（wd-cell 没有此插槽）
  - 禁止使用 wd-popup 实现标准交互（应使用 wd-message-box）
  - 禁止在详情页卡片容器保留 padding（应移除以实现通栏标题）

  覆盖场景：表单页面、详情页面、列表页面、选择器页面、弹框交互、图标使用、响应式布局等所有需要美化的场景。
---

name: beautiful-component-design
color: pink

---

# 组件美化设计规范

用于指导编写视觉美观、文本与图标对齐良好、响应式友好的 Vue 组件的最佳实践。

## ⚠️ 多技能协同

表单页面通常需要同时使用：

- `use-wd-form` - 表单结构、wd-picker、校验规则
- `api-migration` - 如果有接口调用
- `api-error-handling` - 如果有接口调用

列表页面通常需要：

- `z-paging-integration` + `api-migration` - 分页列表

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

---

## 核心文档

使用本技能前必须阅读：

- [references/icon-usage.md](references/icon-usage.md) - 图标使用规范
- [references/text-alignment.md](references/text-alignment.md) - 文本样式规范
- [references/responsive-design.md](references/responsive-design.md) - 响应式设计规范
- [references/form-section-title.md](references/form-section-title.md) - 表单分区标题组件（表单页面必读）

参考示例：

- `src/pages-sub/repair/staff-todo-detail.vue` - 完整美化示例
- `src/pages-sub/repair/select-resource.vue` - 表单页面示例
- `src/pages-sub/repair/add-order.vue` - FormSectionTitle 使用示例

## 1. 专业能力

- **图标规范设计**: 精通 Carbon Icons 图标集使用，熟悉图标与文本对齐的视觉设计原则
- **文本样式控制**: 掌握 wot-design-uni 组件文本样式覆盖技巧，实现统一的字号和行高
- **响应式布局**: 熟悉 uni-app rpx 单位系统和 UnoCSS 原子化 CSS，实现响应式友好设计
- **时间轴组件**: 能设计美观的流程记录时间轴，支持状态颜色区分和动态数据展示
- **图片网格**: 掌握响应式图片网格布局，支持多图展示和预览功能

## 2. 快速开始

### 2.1 图标使用模式

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

图标规范详见 [references/icon-usage.md](references/icon-usage.md)

### 2.2 文本样式统一

```vue
<template>
	<view class="text-36rpx">主内容</view>
	<view class="text-gray-600">次要内容</view>
</template>
```

文本规范详见 [references/text-alignment.md](references/text-alignment.md)

### 2.3 响应式图片网格

```vue
<template>
	<view class="photo-grid">
		<view v-for="(photo, index) in photos" :key="index" class="photo-grid__item">
			<wd-img
				:src="photo.url || photo.photo"
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

响应式规范详见 [references/responsive-design.md](references/responsive-design.md)

## 3. 设计原则

| 原则     | 说明                                    |
| :------- | :-------------------------------------- |
| 大小协调 | 文本 = 图标尺寸 - (4~8)rpx              |
| 高度一致 | 行高 = 图标高度                         |
| 对齐方式 | `display: flex` + `align-items: center` |
| 样式穿透 | `:deep()` + `!important`                |

## 4. 本项目标准配置

```scss
/** 标准图标文本组合 */
.icon {
	width: 36rpx;
	height: 36rpx;
	flex-shrink: 0;
}

.text {
	font-size: 28rpx;
	line-height: 36rpx;
}

.container {
	display: flex;
	align-items: center;
}

.container__text {
	margin-left: 8rpx;
}
```

## 5. 目录

| 文件                                                               | 内容                                      |
| :----------------------------------------------------------------- | :---------------------------------------- |
| [references/icon-usage.md](references/icon-usage.md)               | 图标使用规范、UnoCSS 图标类名、尺寸、间距 |
| [references/text-alignment.md](references/text-alignment.md)       | 文本字号、行高、颜色、加粗、对齐方式      |
| [references/responsive-design.md](references/responsive-design.md) | rpx 单位、图片网格、圆角、深度选择器      |

## 6. 选择器组件美观规范（⚠️ 重要）

在表单中使用 `wd-picker` 选择器组件时，需要特别注意**组件嵌套顺序**和标签宽度的一致性。

### 6.1. ⚠️ 严重错误：禁止的嵌套方式和插槽使用

**❌ 绝对禁止使用不存在的 `#value` 插槽，会导致选择器无法显示和点击！**

```vue
<!-- ❌ 严重错误！使用了不存在的 #value 插槽，导致选择器无法显示和点击 -->
<template>
	<wd-cell-group border>
		<wd-cell :title-width="LABEL_WIDTH" center>
			<template #title>
				<text>商品类型</text>
			</template>
			<template #value>
				<!-- ❌ 错误1: wd-cell 组件没有 #value 插槽！#value 是 CellGroup 的插槽 -->
				<!-- ❌ 错误2: wd-picker 被 wd-cell 包裹，点击事件被阻挡 -->
				<wd-picker v-model="selectedIndex" :columns="options" label-key="name" value-key="id">
					<text class="text-blue-500">
						{{ options[selectedIndex]?.name || "请选择" }}
					</text>
				</wd-picker>
			</template>
		</wd-cell>
	</wd-cell-group>
</template>
```

**问题原因**:

1. **`wd-cell` 组件没有 `#value` 插槽**！根据官方文档，`wd-cell` 组件支持的插槽只有：`title`、`default`（右侧内容）、`icon`、`label`。`#value` 插槽是 `wd-cell-group` 组件的插槽，不是 `wd-cell` 的插槽。
2. 即使改用正确的插槽，`wd-cell` 包裹 `wd-picker` 也会导致点击事件被阻挡，选择器弹窗无法正常打开。

---

### 6.2. ✅ 正确做法 1: 标准模式（推荐）

**使用场景**: 绝大多数情况下使用此方式，简洁高效。

```vue
<template>
	<wd-cell-group border>
		<!-- ✅ 正确：直接使用 wd-picker，通过 label 属性设置标题 -->
		<wd-picker
			v-model="model.category"
			label="分类"
			:label-width="LABEL_WIDTH"
			:columns="categoryOptions"
			label-key="name"
			value-key="id"
		/>
	</wd-cell-group>
</template>
```

---

### 6.3. ✅ 正确做法 2: 自定义插槽模式

**使用场景**: 仅在需要动态标题或复杂自定义显示时使用。

**关键要点**: `wd-picker` **包裹** `wd-cell`，而不是反过来！

```vue
<template>
	<wd-cell-group border>
		<!-- ✅ 正确：wd-picker 包裹 wd-cell，用于自定义显示 -->
		<wd-picker
			v-model="model.staffId"
			:columns="staffOptions"
			label-key="staffName"
			value-key="staffId"
			@confirm="handleStaffChange"
		>
			<wd-cell title="维修师傅" :title-width="LABEL_WIDTH" is-link center custom-value-class="cell-value-left">
				<text :class="model.staffId ? 'text-gray-900' : 'text-gray-400'">
					{{ selectedStaff?.staffName || "请选择员工" }}
				</text>
			</wd-cell>
		</wd-picker>
	</wd-cell-group>
</template>

<style lang="scss" scoped>
/** wd-cell 值靠左对齐 - 确保选择器选中值与其他表单项对齐 */
:deep(.cell-value-left) {
	flex: 1;
	text-align: left !important;
}
</style>
```

---

### 6.4. 关键属性说明（自定义插槽模式）

|         属性          |                 作用                 |    必要性    |
| :-------------------: | :----------------------------------: | :----------: |
| `:title-width="80px"` |      统一标签宽度，与其他项对齐      | **必须设置** |
|       `center`        |           内容垂直居中对齐           | **必须设置** |
| `custom-value-class`  | 自定义选中值样式类，配合样式穿透使用 | **必须设置** |
|       `is-link`       |           显示右侧箭头图标           |   推荐设置   |

### 6.5. 样式穿透要点

```scss
/** wd-cell 值靠左对齐 - wot-design-uni 组件必需样式 */
:deep(.cell-value-left) {
	flex: 1; /* 占据剩余空间 */
	text-align: left !important; /* 左对齐，覆盖默认右对齐 */
}
```

### 6.6. 📝 选择器使用检查清单

使用 `wd-picker` 组件时，请务必检查：

- ✅ **组件嵌套顺序**: `wd-picker` 在外层，`wd-cell` 在内层（仅自定义插槽模式）
- ✅ **优先使用标准模式**: 直接使用 `label` 属性，除非确实需要自定义显示
- ✅ **label-width/title-width**: 与其他表单项保持一致的标签宽度
- ✅ **点击测试**: 实现后务必测试选择器能否正常点击弹出
- ❌ **禁止使用 `#value` 插槽**: **`wd-cell` 组件没有 `#value` 插槽**！不要将 `wd-picker` 或任何内容放在 `wd-cell` 的 `#value` 插槽内
- ❌ **禁止错误嵌套**: 将 `wd-picker` 放在 `wd-cell` 内部会导致点击事件被阻挡

## 7. 弹框交互组件选型（⚠️ 重要）

在实现弹框交互时，**必须优先使用 `wd-message-box`** 而非 `wd-popup`，以确保视觉美观和用户体验。

### 7.1. ⚠️ 错误做法：使用 `wd-popup` 实现用户输入

```vue
<!-- ❌ 严重的视觉和代码问题 -->
<template>
	<wd-popup v-model="showStopModal" position="center" closable>
		<view class="p-6" style="width: 80vw;">
			<view class="mb-4 text-center text-lg font-bold">暂停原因</view>
			<!-- 问题1: 输入框没有边界，用户不知道哪里可以点击 -->
			<!-- 问题2: 布局留白过大，视觉重心不稳 -->
			<wd-textarea v-model="stopReason" placeholder="请填写暂停原因" :maxlength="200" show-word-limit :rows="4" />
			<!-- 问题3: 按钮主次不分明，取消按钮颜色过于突出 -->
			<view class="mt-4 flex">
				<wd-button block @click="showStopModal = false">取消</wd-button>
				<wd-button block type="primary" custom-class="ml-12rpx" @click="handleConfirm">确定</wd-button>
			</view>
		</view>
	</wd-popup>
</template>
```

**视觉问题总结**（参考用户反馈截图）：

| 问题分类 |                     具体表现                      |            用户体验影响            |
| :------: | :-----------------------------------------------: | :--------------------------------: |
| 输入区域 |   输入框无边框/背景色，占位符悬空，字数统计孤立   | 用户不知道哪里可以输入，认知负荷高 |
| 布局留白 |        垂直高度过高，中间空白区域占比过大         |    视觉流线断裂，廉价感、不专业    |
| 按钮样式 | 取消/确定按钮视觉权重接近，主次不分（颜色对比低） |    容易误操作，无障碍设计不达标    |
| 标题层级 |         标题与内容区分度不够，缺少分割线          |          内容层次感不清晰          |

### 7.2. ✅ 正确做法：使用 `wd-message-box.prompt()`

```vue
<!-- ✅ 系统原生风格，开箱即用，视觉美观 -->
<template>
	<wd-button @click="handleStop(item)">暂停</wd-button>
</template>

<script setup lang="ts">
import { useGlobalMessage } from "@/hooks/useGlobalMessage";

const message = useGlobalMessage();

function handleStop(item: RepairOrder) {
	message.prompt({
		title: "暂停维修",
		msg: "请填写暂停原因",
		inputPlaceholder: "请输入暂停原因（必填）",
		inputValue: "",
		maxlength: 200,
		inputValidate: (value: string) => {
			if (!value || !value.trim()) {
				return "暂停原因不能为空";
			}
			return true;
		},
		success: async (res) => {
			if (res.action === "confirm" && res.value) {
				// 直接使用输入值
				await stopRepair({ repairId: item.repairId, remark: res.value.trim() });
			}
		},
	});
}
</script>
```

### 7.3. 视觉效果对比

|      对比项      |               `wd-popup`                |          `wd-message-box`           |
| :--------------: | :-------------------------------------: | :---------------------------------: |
|  **输入框边界**  | ❌ 无边框，占位符悬空，无法识别输入区域 | ✅ 清晰的边框和背景色，输入区域明确 |
|   **布局留白**   |      ❌ 垂直留白过大，视觉重心不稳      |      ✅ 紧凑合理，内容密度适中      |
| **按钮主次关系** |    ❌ 取消/确定颜色对比低，易误操作     |  ✅ 主次分明，确定按钮视觉权重更高  |
|  **代码复杂度**  |      ❌ 需维护状态、模板、样式代码      |    ✅ 零状态管理，一次性配置对象    |
|  **无障碍设计**  |       ❌ 颜色对比度不足，可读性差       |        ✅ 符合无障碍设计标准        |

### 7.4. 组件选型决策

```plain
需要弹框交互？
  ├─ 是标准场景（确认、提示、输入）？
  │   └─ 是 → ✅ 使用 `wd-message-box`（confirm/alert/prompt）
  └─ 需要复杂自定义内容（如多步骤表单、富文本编辑器）？
      ├─ 是 → 使用 `wd-popup`
      └─ 否 → ⚠️ 优先使用 `wd-message-box`，避免自己实现视觉细节
```

### 7.5. 迁移检查清单

发现代码中使用 `wd-popup` 实现用户输入时，检查是否应该迁移：

- [ ] 弹框是否仅用于确认、提示或输入？
- [ ] 是否手动实现了输入框边框、按钮样式等视觉细节？
- [ ] 是否存在视觉问题（输入框无边界、留白过大、按钮主次不分明）？
- [ ] 是否维护了多个状态变量（`showModal`、`inputValue`）？

如果以上任意一项为 **是**，**强烈建议迁移到 `wd-message-box`**。

> **📚 详细文档**: 参阅 `.claude/skills/component-migration/SKILL.md` 第 8 节
> **📚 实际案例**: `src/pages-sub/repair/dispatch.vue:208-233`

## 8. 详情页卡片设计规范（⚠️ 重要）

详情页通常包含多个信息卡片，需要统一的视觉风格和清晰的信息层次。本节介绍如何在详情页中使用 `FormSectionTitle` 组件和色彩编码系统。

### 8.1. 设计理念：通栏标题 + 色彩编码

#### 核心策略

采用 **"通栏标题 + 色彩编码"** 的设计策略：

- **结构融合**：`FormSectionTitle` 不仅是分隔符，而是作为每个信息卡片的 **"页眉 (Header)"**。通过消除卡片容器的内边距，让淡灰色的标题栏撑满卡片顶部，形成 _"灰色标题区 + 白色内容区"_ 的经典文档结构。
- **色彩编码系统**：为不同类型的信息区域分配特定颜色，提升视觉识别度和导航效率。
- **圆角一致性**：严格遵循小圆角 (`rounded-sm`) 规范，使用 `overflow-hidden` 确保标题栏与卡片完美融合。

#### 色彩编码体系

| 颜色类型 | HEX 色值  | 使用场景           | Carbon 图标示例         | 色彩心理学                 |
| :------: | :-------- | :----------------- | :---------------------- | :------------------------- |
| 🟦 蓝色  | `#3b82f6` | 报修内容、核心信息 | `document`, `file-doc`  | 理性、客观、文档数据       |
| 💠 青色  | `#06b6d4` | 流转记录、时间轴   | `time`, `history`       | 时间流逝、状态变更、流动感 |
| 🟧 橙色  | `#ff9900` | 工单附件、图片墙   | `image`, `folder-media` | 视觉媒体、活力、吸引注意力 |
| 🟩 绿色  | `#52c41a` | 完成状态、成功提示 | `checkmark`, `success`  | 成功、完成、正向反馈       |
| 🟥 红色  | `#ef4444` | 警告信息、必填项   | `warning`, `error`      | 警告、危险、需要关注       |

### 8.2. ✅ 正确做法：卡片结构调整

#### 标准卡片模板

```vue
<template>
	<!-- ✅ 正确：移除 padding，添加 overflow-hidden -->
	<view class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
		<!-- 标题栏：FormSectionTitle 作为卡片头部 -->
		<FormSectionTitle title="报修内容" icon="document" icon-class="i-carbon-document text-blue-500" :animated="false" />

		<!-- 内容区：重新包裹并补回 padding -->
		<view class="p-4">
			<!-- 卡片内容 -->
			<view class="text-sm text-gray-600 leading-relaxed">
				{{ content }}
			</view>
		</view>
	</view>
</template>
```

#### 结构调整技巧

|    步骤    | 操作                                     | 目的                                 |
| :--------: | :--------------------------------------- | :----------------------------------- |
| **步骤 1** | 移除卡片容器的 `p-4`                     | 让 FormSectionTitle 撑满卡片宽度     |
| **步骤 2** | 添加 `overflow-hidden`                   | 配合小圆角，让直角的标题栏被自动裁剪 |
| **步骤 3** | `FormSectionTitle` 直接放在卡片顶部      | 形成通栏标题效果                     |
| **步骤 4** | 内容区域用 `<view class="p-4">` 重新包裹 | 补回内边距，确保内容不贴边           |

#### ⚠️ 常见错误

```vue
<!-- ❌ 错误1：卡片容器保留了 padding -->
<view class="mb-3 rounded-sm bg-white p-4 shadow-sm">
  <FormSectionTitle title="报修内容" />
  <!-- 问题：FormSectionTitle 两侧有留白，无法形成通栏效果 -->
</view>

<!-- ❌ 错误2：缺少 overflow-hidden -->
<view class="mb-3 rounded-sm bg-white shadow-sm">
  <FormSectionTitle title="报修内容" />
  <!-- 问题：FormSectionTitle 默认直角，与卡片圆角不匹配 -->
</view>

<!-- ❌ 错误3：内容区域没有 padding -->
<view class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
  <FormSectionTitle title="报修内容" />
  <view class="text-sm">内容贴边显示</view>
  <!-- 问题：内容直接贴边，缺少呼吸感 -->
</view>
```

### 8.3. 色彩编码应用矩阵

#### 维修工单详情页示例

| 卡片区域     | 标题文本 | 图标 (`icon`)      | 图标样式 (`icon-class`)           | 动效 (`animated`) | 理由                                 |
| :----------- | :------- | :----------------- | :-------------------------------- | :---------------- | :----------------------------------- |
| **报修内容** | 报修内容 | `document`         | `i-carbon-document text-blue-500` | `false`           | 静态核心信息，蓝色代表理性/文档      |
| **工单附件** | 工单附件 | `image`            | `i-carbon-image text-orange-500`  | `false`           | 图片区域，橙色代表视觉媒体           |
| **流转记录** | 流转记录 | `time` / `history` | `i-carbon-time text-cyan-500`     | `true`            | 动态区域，青色呼应状态流转，启用动效 |

#### 动效使用原则

- ✅ **启用动效**：流转记录、处理中状态、动态更新区域
- ❌ **禁用动效**：静态内容、已完成状态、图片附件

### 8.4. 实际案例代码

#### 完整示例：维修工单详情页

```vue
<script setup lang="ts">
import FormSectionTitle from "@/components/common/form-section-title/index.vue";
import RepairStatusTag from "@/components/common/repair-status-tag/index.vue";
</script>

<template>
	<view class="repair-detail-page">
		<!-- 1. 头部状态卡片（不使用 FormSectionTitle，保持独立设计） -->
		<view class="relative mb-3 overflow-hidden rounded-sm bg-white p-4 shadow-sm">
			<view class="flex items-start justify-between">
				<view>
					<text class="mb-1 block text-xs text-gray-500">工单编号</text>
					<view class="mb-2 text-xl text-gray-900 font-bold leading-none">
						{{ repairDetail.repairId }}
					</view>
				</view>
				<RepairStatusTag :status-cd="repairDetail.statusCd" :status-name="repairDetail.statusName" :animated="true" />
			</view>
		</view>

		<!-- 2. 报修内容卡片（蓝色系，静态） -->
		<view class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
			<FormSectionTitle
				title="报修内容"
				icon="document"
				icon-class="i-carbon-document text-blue-500"
				:animated="false"
			/>
			<view class="p-4">
				<view class="mb-4 text-sm text-gray-600 leading-relaxed">
					{{ repairDetail.context }}
				</view>
				<!-- 基础信息列表 -->
				<view class="border-t border-gray-100 pt-4">
					<view class="flex items-center justify-between">
						<text class="text-sm text-gray-500">报修人</text>
						<text class="text-sm text-gray-800 font-medium">{{ repairDetail.repairName }}</text>
					</view>
					<view class="mt-12rpx flex items-center justify-between">
						<text class="text-sm text-gray-500">联系电话</text>
						<text class="text-sm text-gray-800 font-medium">{{ repairDetail.tel }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 3. 工单附件卡片（橙色系，静态） -->
		<view v-if="hasImages" class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
			<FormSectionTitle title="工单附件" icon="image" icon-class="i-carbon-image text-orange-500" :animated="false" />
			<view class="p-4">
				<view class="photo-grid">
					<view v-for="(photo, index) in photos" :key="index" class="photo-grid__item">
						<wd-img
							:src="photo.url"
							mode="aspectFill"
							class="aspect-square w-full rounded-sm bg-gray-100"
							:enable-preview="true"
						/>
					</view>
				</view>
			</view>
		</view>

		<!-- 4. 流转记录卡片（青色系，启用动效） -->
		<view v-if="staffRecords.length > 0" class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
			<FormSectionTitle title="流转记录" icon="time" icon-class="i-carbon-time text-cyan-500" :animated="true" />
			<view class="p-4">
				<!-- 时间轴内容 -->
				<view class="relative pl-2">
					<view v-for="(record, index) in staffRecords" :key="index">
						<!-- 时间轴节点和内容 -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.repair-detail-page {
	min-height: 100vh;
	background-color: #f5f5f7;
}

.pb-safe {
	padding-bottom: calc(24rpx + var(--window-bottom, 0px));
}

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

### 8.5. 设计检查清单

#### 详情页卡片专项检查

- [ ] **卡片容器是否移除了 `padding`？**（确保 FormSectionTitle 通栏效果）
- [ ] **卡片是否添加了 `overflow-hidden`？**（配合小圆角 `rounded-sm`）
- [ ] **内容区域是否重新包裹并补回了 `padding`？**（确保内容不贴边）
- [ ] **FormSectionTitle 是否直接放在卡片顶部？**（作为卡片头部）
- [ ] **图标颜色是否符合色彩编码体系？**（蓝/青/橙/绿/红）
- [ ] **动效使用是否合理？**（仅在动态区域启用）
- [ ] **头部状态卡片是否保持独立设计？**（不使用 FormSectionTitle）

#### 色彩一致性检查

- [ ] **蓝色用于核心信息/文档**（`text-blue-500`, `#3b82f6`）
- [ ] **青色用于时间轴/流转记录**（`text-cyan-500`, `#06b6d4`）
- [ ] **橙色用于附件/图片**（`text-orange-500`, `#ff9900`）
- [ ] **绿色用于成功/完成状态**（`text-green-500`, `#52c41a`）
- [ ] **红色用于警告/必填项**（`text-red-500`, `#ef4444`）

### 8.6. 视觉效果预期

实施该方案后，用户将看到：

1. **极具秩序感**：每个板块由淡灰色标题条开启，清晰界定信息区域
2. **色彩导航**：潜意识建立色彩关联 — 蓝色看内容，橙色看图片，青色看进度
3. **精致细节**：
   - 卡片圆角处理得当，标题栏与卡片完美融合
   - 呼吸动效在流转记录处轻微律动，暗示工单正在处理中
   - 2px 微妙分割线（FormSectionTitle 的 `margin-bottom: 2px`）

### 8.7. FormSectionTitle 在表单页 vs 详情页

|    对比项    |        表单页 (`use-wd-form`)        |               详情页（本节内容）               |
| :----------: | :----------------------------------: | :--------------------------------------------: |
| **使用频率** |          每个表单分区都使用          |         仅在重要信息区域使用（3-4 个）         |
| **背景处理** |   直接放在页面中，背景自然融入表单   |   作为卡片头部，通过 `overflow-hidden` 融合    |
| **动效使用** |     通常启用（强调表单区域划分）     |         仅在动态区域启用（如流转记录）         |
| **色彩编码** |      通常使用单一颜色（如蓝色）      |     多色彩编码（蓝/青/橙），提升信息识别度     |
| **卡片结构** |        无需调整，直接使用即可        | 需要移除卡片 `padding`，添加 `overflow-hidden` |
| **配合组件** | `wd-form`, `wd-picker`, 表单校验规则 |      `RepairStatusTag`, 时间轴, 图片网格       |

### 8.8. 参考案例

**详情页最佳实践**：

- ✅ `src/pages-sub/repair/order-detail.vue` - 维修工单详情页（完整色彩编码示例）
- ✅ `src/pages-sub/repair/staff-todo-detail.vue` - 待办详情页
- ✅ `src/pages-sub/property/apply-room-detail.vue` - 房屋申请详情页

**表单页最佳实践**：

- ✅ `src/pages-sub/repair/add-order.vue` - FormSectionTitle 在表单中的使用
- ✅ `src/pages-sub/repair/select-resource.vue` - 表单分区标题示例

---

## 9. 典型应用场景

- 维修工单详情页的信息展示
- 报修记录的列表项设计
- 状态展示的标签和图标组合
- 图片墙和画廊展示
- 时间轴和流程记录
- **表单中选择器组件的统一对齐**
- **标准弹框交互（确认、提示、输入）**
- **详情页卡片的通栏标题和色彩编码**

## 9. 设计检查清单

### 9.1. 通用美化检查

- [ ] 图标和文本是否垂直居中对齐？
- [ ] 文本大小是否在 24-32rpx 之间？
- [ ] 行高是否与图标高度一致？
- [ ] 是否使用 `flex-shrink: 0` 防止图标变形？
- [ ] 是否正确使用 `:deep()` 穿透组件样式？
- [ ] 间距是否使用 8 的倍数？

### 9.2. 选择器组件专项检查（⚠️ 必须检查）

- [ ] **组件嵌套顺序是否正确？**（`wd-picker` 在外层，`wd-cell` 在内层）
- [ ] **是否优先使用标准模式？**（通过 `label` 属性设置标题）
- [ ] **标签宽度是否统一？**（设置了统一的 `:title-width` 或 `:label-width`）
- [ ] **自定义插槽模式是否添加了必需样式？**（`cell-value-left` 样式类和样式穿透）
- [ ] **选择器能否正常点击弹出？**（实际测试点击功能）
- [ ] **是否避免了使用不存在的 `#value` 插槽？**（**`wd-cell` 组件没有 `#value` 插槽**，不要使用）
- [ ] **是否避免了禁止的嵌套方式？**（`wd-picker` 绝不能在 `wd-cell` 内部）

### 9.3. 弹框交互组件专项检查（⚠️ 必须检查）

- [ ] **是否使用了 `wd-popup` 实现标准交互？**（确认、提示、输入）
- [ ] **弹框是否存在视觉问题？**（输入框无边界、留白过大、按钮主次不分明）
- [ ] **是否优先使用了 `wd-message-box`？**（confirm/alert/prompt）
- [ ] **是否不必要地维护了状态变量？**（`showModal`、`inputValue`）
- [ ] **自定义弹框是否真的需要？**（能用 `wd-message-box` 就不要用 `wd-popup`）
