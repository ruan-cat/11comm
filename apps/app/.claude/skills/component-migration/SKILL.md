---
name: component-migration
description: |
  专业的 uni-app 组件迁移专家，从 ColorUI + uni-app 内置组件到 wot-design-uni 组件库的迁移。

  触发条件（满足任意一项即触发）：
  - 任务包含"组件迁移"、"ColorUI"、"wot-design-uni"等关键词
  - 需要将 ColorUI 组件（cu-btn、cu-list、cu-card）迁移到 wot-design-uni
  - 需要修复 wot-design-uni 组件使用错误（类型错误、插槽错误、嵌套顺序错误）
  - 需要迁移 Icon 图标（cuIcon-* → i-carbon-*）
  - 需要迁移表单组件（cu-form → wd-form）
  - 需要迁移空状态组件（no-data-page → wd-status-tip）
  - 需要迁移图片组件（image → wd-img）
  - 从 Vue2 项目迁移页面组件

  必须协同的技能：
  - use-wd-form（表单页面迁移时，必须）- 表单结构、wd-picker、校验规则
  - beautiful-component-design（表单页面迁移时，必须）- FormSectionTitle、图标、美化
  - api-migration（如果有接口）- API 调用
  - api-error-handling（如果有接口）- 错误提示
  - style-migration（样式迁移）- ColorUI 类名 → UnoCSS 原子类
  - code-migration（Vue2 迁移）- Options API → Composition API

  禁止事项：
  - 禁止使用 wd-empty 组件（不存在，必须使用 wd-status-tip）
  - 禁止使用 wd-cell 的 #value 插槽（不存在）
  - 禁止使用 wd-radio-group 替代 wd-picker（除非动态场景）
  - 禁止在子组件内直接使用 <wd-toast />、<wd-message-box />（必须使用全局组合式函数）
  - 禁止跳过 beautiful-component-design 技能（表单页面必须使用）

  覆盖场景：几乎所有从 Vue2 迁移到 Vue3 的组件都需要此技能，包括按钮、列表、卡片、表单、图标、空状态等。
context: fork
---

# 组件迁移/修复专家

专业的 uni-app 组件迁移专家,专注于从传统 ColorUI + uni-app 内置组件架构迁移到现代化 wot-design-uni + UnoCSS 技术栈。

**同时也用于修复现有代码中的 wot-design-uni 组件使用错误，包括：**

- TypeScript 类型错误
- 组件属性使用错误
- 组件嵌套顺序错误
- 插槽使用错误

## 1.1 技能组合矩阵

根据任务特征快速识别需要使用的技能：

|        任务特征        |                                                         必须使用的技能                                                         |                              说明                              |
| :--------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------: |
|    包含 `<wd-form>`    |                                          `use-wd-form` + `beautiful-component-design`                                          |                  表单页面必须同时使用两个技能                  |
|      需要选择功能      |                                              `use-wd-form`（第 3.2 节 wd-picker）                                              |            必须使用 wd-picker，禁止 wd-radio-group             |
|    需要表单分区标题    |                                     `beautiful-component-design`（form-section-title.md）                                      | 必须使用 FormSectionTitle，禁止 `<view class="section-title">` |
|      需要美化组件      |                                                  `beautiful-component-design`                                                  |                 添加图标、调整样式、响应式设计                 |
|    ColorUI 组件迁移    |                                                     `component-migration`                                                      |            ColorUI / uni-app 组件 → wot-design-uni             |
|    ColorUI 样式迁移    |                                                       `style-migration`                                                        |                  ColorUI 类名 → UnoCSS 原子类                  |
|      API 接口迁移      |                                                        `api-migration`                                                         |       Java110Context + uni.request → Alova + TypeScript        |
| Vue2 到 Vue3 代码迁移  |                                                        `code-migration`                                                        |           Options API → Composition API + TypeScript           |
|        路由迁移        |                                                       `route-migration`                                                        |                    pages.json → 约定式路由                     |
|      需要分页功能      |                                `z-paging-integration` + `api-migration` + `api-error-handling`                                 |                 z-paging 几乎总是需要 3 个技能                 |
|    需要接口错误提示    |                                                      `api-error-handling`                                                      |                 所有 API 调用都应该有错误提示                  |
|    需要动态页面标题    |                                                `use-uniapp-dynamic-page-title`                                                 |      根据参数/状态动态设置标题（如派单/转单显示不同标题）      |
|      新建公共组件      |                                                      `add-new-component`                                                       |          src/components/common 目录下新建公共组件规范          |
| 从 Vue2 完整迁移表单页 | `code-migration` + `component-migration` + `style-migration` + `use-wd-form` + `api-migration` + `beautiful-component-design`  |                       需要 6 个技能协同                        |
| 从 Vue2 完整迁移列表页 | `code-migration` + `component-migration` + `style-migration` + `api-migration` + `z-paging-integration` + `api-error-handling` |                       需要 6 个技能协同                        |

## 1.2 多技能协同原则

**⚠️ 重要：大多数实际任务都需要多个技能协同，禁止单一技能思维！**

### 1.2.1 表单页面的技能组合

```plaintext
表单页面（创建/修改）：
  - use-wd-form（必须）- 表单结构、wd-picker、校验规则
  - beautiful-component-design（必须）- FormSectionTitle、图标、美化
  - api-migration（如果有接口）- API 调用
  - api-error-handling（如果有接口）- 错误提示
```

**检查清单**：

- [ ] 包含 `<wd-form>` → 必须使用 `use-wd-form`
- [ ] 需要分区标题 → 必须使用 `beautiful-component-design`（FormSectionTitle）
- [ ] 有选择功能 → 必须使用 `wd-picker`（禁止 wd-radio-group）
- [ ] 需要调用 API → 必须使用 `api-migration` + `api-error-handling`

### 1.2.2 列表页面的技能组合

```plaintext
列表页面（分页列表）：
  - z-paging-integration（必须）- 分页组件
  - api-migration（必须）- API 接口
  - api-error-handling（必须）- 错误提示
  - beautiful-component-design（可选）- 美化
```

### 1.2.3 从 Vue2 迁移的技能组合

```plaintext
从 Vue2 迁移单个页面：
  - code-migration（必须）- Vue2 → Vue3 代码写法
  - component-migration（必须）- ColorUI → wot-design-uni
  - style-migration（必须）- 样式类名迁移
  - route-migration（必须）- 路由配置迁移
  - 根据页面类型添加：
    - 表单页：+ use-wd-form + beautiful-component-design
    - 列表页：+ z-paging-integration + api-migration + api-error-handling
```

---

## 核心执行规范

在修改 wot-design-uni 组件前，必须阅读：

- **[references/EXECUTION-CHECKLIST.md](./references/EXECUTION-CHECKLIST.md)** - 完整执行检查清单

关键要求：

1. 使用 WebFetch 查阅官方文档（强制）
2. 查阅项目中的正确示例
3. 一次只改一个组件

---

## ⚠️ 迁移前必读 (Critical)

**🚨 禁止直接编写代码！必须先完成：**

1. ✅ **第一步：阅读参考文件**
   - 推荐：`src/pages-sub/repair/*.vue`（完整的 wot-design-uni 组件使用示例）
   - 推荐：`src/components/activity/*.vue`（组件封装示例）
   - 必读：`.claude/skills/component-migration/references/Icon图标迁移.md`
   - 必读：`.claude/skills/component-migration/references/全局反馈组件.md`

2. ✅ **第二步：查阅 wot-design-uni 文档**
   - 官方文档：https://wot-ui.cn/guide/quick-use.html
   - 重要：类型导入使用 `wot-design-uni/components/wd-xxx/types`
   - 禁止：使用 `@/uni_modules/...` 路径（本项目用 pnpm 安装）

3. ✅ **第三步：严格遵循规范**
   - 优先使用 wot-design-uni 组件，避免自己造轮子
   - 所有表单组件必须使用 `wd-form` 包裹
   - Icon 必须使用 `<wd-icon>` 组件，禁用字体图标类名
   - 空状态必须使用 `<wd-status-tip>` 组件

### 🚫 常见错误（严禁犯）

|         ❌ 错误写法          |           ✅ 正确写法           |             说明             |
| :--------------------------: | :-----------------------------: | :--------------------------: |
|   `<view class="cu-btn">`    |          `<wd-button>`          | 使用 wot-design-uni 按钮组件 |
| `<text class="cuIcon-xxx">`  |     `<wd-icon name="xxx">`      |  使用 Icon 组件替代字体图标  |
| `<wd-cell><template #value>` |     `<wd-cell value="xxx">`     |         错误使用插槽         |
|   导入 `@/uni_modules/...`   | `wot-design-uni/components/...` |      错误的类型导入路径      |

## 专业能力

- **组件映射分析**: 深度理解 ColorUI 和 wot-design-uni 组件库的设计理念和实现差异
- **API 转换策略**: 精通 Vue2 到 Vue3 的组件 API 升级和属性映射转换
- **样式迁移**: 熟练处理从 ColorUI 类名到 UnoCSS 原子化 CSS 的样式迁移
- **跨平台兼容**: 确保迁移后的组件在 H5、小程序、APP 多平台正常运行
- **性能优化**: 利用 Vue3 + TypeScript 提升组件性能和开发体验

## 获取 wot-design-uni 组件库文档

当需要了解 wot-design-uni 组件使用方法时,可通过以下方式查阅文档:

1. **官方文档**: https://wot-ui.cn/guide/quick-use.html
2. **GitHub 文档**: https://github.com/Moonofweisheng/wot-design-uni/tree/master/docs/component
3. 使用 WebFetch 或 MCP 工具获取在线文档

**类型导入规范**: 本项目使用 pnpm 安装 wot-design-uni,类型导入使用 `wot-design-uni/components/wd-xxx/types`,而非 `@/uni_modules/...`

## 核心职责

### 1. 组件识别与分析

- 识别项目中使用的 ColorUI 组件和样式类
- 分析组件的功能需求和交互逻辑
- 评估组件的复杂度和迁移优先级

### 2. 组件映射与转换

- 提供 ColorUI 到 wot-design-uni 的精确组件映射
- 转换组件属性和事件处理方法
- 适配 Vue3 Composition API 和 TypeScript 语法

### 3. 样式系统迁移

- 将 ColorUI 样式类转换为 UnoCSS 原子化类名
- 保持视觉效果的一致性
- 优化样式性能和可维护性

### 4. 交互逻辑升级

- 升级 Vue2 Options API 到 Vue3 Composition API
- 优化事件处理和数据绑定逻辑
- 集成 TypeScript 类型系统

## 快速迁移指南

### 1. 基础组件映射

|   旧组件/类名    |  使用场景  |           新组件           |          迁移说明          |
| :--------------: | :--------: | :------------------------: | :------------------------: |
|     `cu-btn`     |  按钮组件  |        `wd-button`         |  支持多种类型、尺寸和状态  |
| `cu-btn bg-blue` |  蓝色按钮  | `wd-button type="primary"` | 使用 type 属性替代颜色类名 |
|   `cu-btn lg`    | 大尺寸按钮 |  `wd-button size="large"`  |   使用 size 属性控制尺寸   |

**示例**:

```vue
<template>
	<!-- 旧代码 -->
	<button class="cu-btn bg-blue lg" @tap="doLogin()">登录</button>

	<!-- 新代码 -->
	<wd-button type="primary" size="large" @click="doLogin">登录</wd-button>
</template>
```

### 2. 列表组件映射

|   旧组件/类名   |     使用场景     |          新组件           |       迁移说明        |
| :-------------: | :--------------: | :-----------------------: | :-------------------: |
| `cu-list menu`  |   菜单列表容器   |      `wd-cell-group`      |     列表容器组件      |
|    `cu-item`    |      列表项      |         `wd-cell`         |      基础列表项       |
| `cu-item arrow` |  带箭头的列表项  |     `wd-cell is-link`     | 使用 is-link 显示箭头 |
|   `.content`    |    列表项内容    |    `wd-cell` 默认插槽     | 直接使用组件内容区域  |
|    `.action`    | 列表项右侧操作区 | `wd-cell` 的 `right` 插槽 |     使用具名插槽      |

**示例**:

```vue
<template>
	<!-- 旧代码 -->
	<view class="cu-list menu">
		<view class="cu-item arrow" @click="gotoDetail">
			<view class="content">
				<text class="cuIcon-notification text-green"></text>
				<view class="text-cut">{{ notice.title }}</view>
			</view>
		</view>
	</view>

	<!-- 新代码 -->
	<wd-cell-group>
		<wd-cell is-link @click="gotoDetail">
			<template #icon>
				<wd-icon name="" custom-class="i-carbon-notification text-green-500 mr-2" />
			</template>
			<template #title>
				<view class="truncate">{{ notice.title }}</view>
			</template>
		</wd-cell>
	</wd-cell-group>
</template>
```

> **📚 完整映射表**: 参阅 [组件映射表.md](组件映射表.md)

### 3. Icon 图标迁移

**核心方针**: 从 `cuIcon-*` ColorUI 图标迁移到基于 `<wd-icon>` 组件的 Carbon 图标系统。

**技术要点**:

1. **Icon 实现方式**: 使用基于类名生成的 iconify 图标系统
2. **图标集**: 本项目使用 `@iconify-json/carbon` (Carbon 图标集)
3. **类名格式**: `i-carbon-*` (UnoCSS + Iconify 规范)
4. **组件要求**: 必须使用 `<wd-icon name="" custom-class="i-carbon-..." />`

**迁移示例**:

```vue
<template>
	<!-- 旧代码: ColorUI 图标 -->
	<text class="cuIcon-notification"></text>
	<text class="cuIcon-notification text-green"></text>

	<!-- 新代码: wd-icon + Carbon 图标 -->
	<wd-icon name="" custom-class="i-carbon-notification" />
	<wd-icon name="" custom-class="i-carbon-notification text-colorui-green" />
</template>
```

**常用图标映射**:

|     ColorUI 图标      |     Carbon 图标映射     |
| :-------------------: | :---------------------: |
| `cuIcon-notification` | `i-carbon-notification` |
|    `cuIcon-close`     |    `i-carbon-close`     |
|    `cuIcon-search`    |    `i-carbon-search`    |
|     `cuIcon-add`      |     `i-carbon-add`      |
|    `cuIcon-delete`    |  `i-carbon-trash-can`   |
|     `cuIcon-edit`     |     `i-carbon-edit`     |
|     `cuIcon-home`     |     `i-carbon-home`     |
|     `cuIcon-user`     | `i-carbon-user-avatar`  |
|     `cuIcon-time`     |     `i-carbon-time`     |

> **📚 完整映射**: 参阅 [references/Icon 图标迁移.md](references/Icon图标迁移.md)

### 4. 表单组件迁移

**表单分区标题**: 必须使用 `form-section-title` 组件

```vue
<script setup lang="ts">
import FormSectionTitle from "@/components/common/form-section-title/index.vue";
</script>

<template>
	<!-- 基础用法 -->
	<wd-cell-group border>
		<FormSectionTitle title="房屋信息" />
		<wd-input label="楼栋" />
	</wd-cell-group>

	<!-- 带图标和必填标记 -->
	<wd-cell-group border class="mt-3">
		<FormSectionTitle title="报修信息" icon="information" icon-class="i-carbon-information text-green-500" required />
		<wd-input label="报修人" />
	</wd-cell-group>
</template>
```

**H5 输入控件可访问性**：迁移到 `wd-input`、`wd-search`、`wd-textarea` 后，业务页面继续保持组件化写法，不要为了 Chrome Issues 回退到原生 `<input>`，也不要在页面内写 `document.querySelector` / `onMounted` 补丁。H5 内部原生控件缺少 `id/name` 的问题由 `src/main.ts` 安装的 `installH5FormControlAttributesPatch()` 统一处理。

**wd-picker 选择器**: 组件嵌套顺序至关重要!

```vue
<!-- ✅ 正确用法 1: 标准模式（推荐） -->
<wd-cell-group border>
  <wd-picker
    v-model="model.category"
    label="分类"
    :label-width="LABEL_WIDTH"
    :columns="categoryOptions"
    label-key="name"
    value-key="id"
  />
</wd-cell-group>

<!-- ✅ 正确用法 2: 自定义插槽模式（wd-picker 包裹 wd-cell） -->
<wd-cell-group border>
  <wd-picker v-model="model.feeFlag" :columns="feeOptions" label-key="name" value-key="id">
    <wd-cell :title-width="LABEL_WIDTH" is-link>
      <text>{{ selectedLabel || '请选择' }}</text>
    </wd-cell>
  </wd-picker>
</wd-cell-group>

<!-- ❌ 错误: wd-cell 不存在 #value 插槽! -->
<wd-cell>
  <template #value>  <!-- 错误! -->
    <wd-picker />
  </template>
</wd-cell>
```

> **📚 详细规范**: 参阅 [references/wd-picker 使用规范.md](references/wd-picker使用规范.md)

**单选和多选组件选型**: 严格遵循统一的组件选型原则!

**核心规则**:

- **单选场景**: 一律使用 `wd-picker` 组件（包括动态数据）
- **多选场景**: 一律使用 `wd-checkbox` 组件（包括动态数据）

```vue
<!-- ✅ 正确: 单选使用 wd-picker -->
<wd-picker
	v-if="item.titleType === '1001'"
	v-model="item.value"
	label="请选择"
	:label-width="LABEL_WIDTH"
	:columns="
		item.options.map((opt) => ({
			label: opt.name,
			value: opt.id,
		}))
	"
	label-key="label"
	value-key="value"
/>

<!-- ✅ 正确: 多选使用 wd-checkbox -->
<view v-else-if="item.titleType === '2002'" class="p-3">
  <wd-checkbox-group
    v-model="item.values"
    @change="(event) => handleCheckboxChange(event.value, item)"
  >
    <wd-checkbox
      v-for="(opt, idx) in item.options"
      :key="idx"
      :value="opt.id"
    >
      {{ opt.name }}
    </wd-checkbox>
  </wd-checkbox-group>
</view>

<!-- ❌ 错误: 单选使用 wd-radio-group -->
<wd-radio-group v-model="item.value">  <!-- 错误! -->
  <wd-radio v-for="opt in item.options" :key="opt.id" :value="opt.id">
    {{ opt.name }}
  </wd-radio>
</wd-radio-group>
```

**核心要点**:

1. **单选场景**: 无论数据是否动态，统一使用 `wd-picker`
2. **多选场景**: 数据绑定到 `string[]` 数组，使用 `wd-checkbox-group` + `wd-checkbox`
3. **事件处理**: `wd-checkbox-group` 使用 `@change` 事件，参数为 `{ value: string[] }`

**完整示例** (参考 `src/pages-sub/inspection/execute-single.vue:316-345`):

```vue
<template>
	<wd-cell-group v-for="(item, index) in titleList" :key="index" border>
		<FormSectionTitle :title="item.itemTitle" />

		<!-- 单选 -->
		<wd-picker
			v-if="item.titleType === '1001'"
			v-model="item.radio as string"
			label="请选择"
			:label-width="LABEL_WIDTH"
			:columns="
				item.inspectionItemTitleValueDtos.map((v) => ({
					label: v.itemValue,
					value: v.itemValue,
				}))
			"
			label-key="label"
			value-key="value"
		/>

		<!-- 多选 -->
		<view v-else-if="item.titleType === '2002'" class="p-3">
			<wd-checkbox-group v-model="item.radio as string[]" @change="(event) => handleCheckboxChange(event.value, item)">
				<wd-checkbox
					v-for="(valueItem, valueIndex) in item.inspectionItemTitleValueDtos"
					:key="valueIndex"
					:value="valueItem.itemValue"
				>
					{{ valueItem.itemValue }}
				</wd-checkbox>
			</wd-checkbox-group>
		</view>
	</wd-cell-group>
</template>

<script setup lang="ts">
/** 单选 Picker 变更 */
function handlePickerChange(value: string, item: InspectionItemTitle) {
	item.radio = value;
}

/** 多选 Checkbox 变更 */
function handleCheckboxChange(values: string[], item: InspectionItemTitle) {
	item.radio = values;
}

/** 初始化数据 */
onLoadTitlesSuccess((data) => {
	titleList.value = data.data?.list || [];

	titleList.value.forEach((item) => {
		if (item.titleType === "1001") {
			// 单选：初始化为空字符串
			item.radio = "";
		} else if (item.titleType === "2002") {
			// 多选：初始化为空数组
			item.radio = [];
		}
	});
});
</script>
```

### 5. 图片组件迁移

**强制使用 `<wd-img>` 替换 `<image>`**

```vue
<!-- 旧代码 -->
<image :src="avatar" mode="aspectFill" style="width: 100px; height: 100px;" />

<!-- 新代码 -->
<wd-img :src="avatar" mode="aspectFill" class="w-100rpx h-100rpx" round />

<!-- ⚠️ 禁止使用 width/height 属性,必须用 UnoCSS 类 -->
<wd-img :src="image" class="w-full h-auto" />
<!-- ✅ 正确 -->
<wd-img :src="image" width="100" />
<!-- ❌ 错误 -->
```

**增强功能**:

```vue
<!-- 带加载和错误状态 -->
<wd-img :src="image" class="w-200rpx h-200rpx">
  <template #loading>
    <wd-loading />
  </template>
  <template #error>
    <view class="text-gray-400">加载失败</view>
  </template>
</wd-img>

<!-- 可预览的图片 -->
<wd-img :src="image" :enable-preview="true" class="w-150rpx h-150rpx" />
```

### 6. 空状态组件迁移

**⚠️ 严格禁止使用 `<wd-empty>` 组件 - 该组件在 wot-design-uni 中不存在！**

**强制使用 `<wd-status-tip>` 组件**

```vue
<!-- ❌ 错误：wd-empty 组件不存在！ -->
<wd-empty description="暂无数据" />

<!-- ❌ 错误：使用旧项目的空状态组件 -->
<view v-if="list.length === 0">
  <no-data-page></no-data-page>
</view>

<!-- ✅ 正确：使用 wd-status-tip -->
<view v-if="list.length === 0">
  <wd-status-tip image="search" tip="暂无数据" />
</view>

<!-- ✅ 正确：在 z-paging 的 empty 插槽中使用 -->
<template #empty>
	<wd-status-tip image="search" tip="暂无数据" />
</template>
```

**7 种内置状态类型**:

- `search`: 搜索无结果（推荐用于列表、搜索页）
- `network`: 网络连接失败
- `content`: 内容为空（默认值）
- `collect`: 收藏/收集为空
- `comment`: 评论/联系人为空
- `halo`: 操作失败/支付失败
- `message`: 消息通知

**使用场景示例**:

```vue
<!-- 搜索结果为空 -->
<wd-status-tip image="search" tip="暂无搜索结果" />

<!-- 列表数据为空 -->
<wd-status-tip image="content" tip="暂无数据" />

<!-- 网络错误 -->
<wd-status-tip image="network" tip="网络连接失败">
  <template #bottom>
    <wd-button @click="retry">重新加载</wd-button>
  </template>
</wd-status-tip>
```

**自定义图片内容**:

```vue
<wd-status-tip tip="自定义空状态">
  <template #image>
    <wd-icon name="" custom-class="i-carbon-warning-alt text-60rpx text-orange-500" />
  </template>
</wd-status-tip>
```

**常见属性**:

|     属性     |             说明             |         类型         |  默认值   |
| :----------: | :--------------------------: | :------------------: | :-------: |
|   `image`    | 预设图片类型或自定义图片 URL |        string        | 'network' |
|    `tip`     |           提示文案           |        string        |     -     |
| `image-size` |           图片尺寸           | string/number/object |     -     |

> **📚 完整文档**: https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/status-tip.md

### 7. 全局反馈组件

**核心原则**: 所有反馈组件统一在 `App.vue` 根组件注册,避免层级遮挡问题。

**⚠️ 严格禁止**:

- 在子组件内直接使用 `<wd-toast />`、`<wd-message-box />`、`<wd-loading />`
- 手动管理 loading 状态

**✅ 必须使用**:

```typescript
// ✅ 正确: 使用全局组合式函数
import { useGlobalToast } from "@/hooks/useGlobalToast";
import { useGlobalMessage } from "@/hooks/useGlobalMessage";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

const toast = useGlobalToast();
const message = useGlobalMessage();
const loading = useGlobalLoading();

// 使用
toast.success("操作成功");
message.confirm({
	msg: "确认删除?",
	success: () => {
		/* 确认回调 */
	},
});
loading.show("加载中...");
loading.hide();
```

> **📚 详细文档**: 参阅 [references/全局反馈组件.md](references/全局反馈组件.md)

### 8. 弹框交互组件选型

**核心原则**: 弹框交互优先使用 `wd-message-box` 而非 `wd-popup`，获得更好的用户体验。

#### 8.1. 组件选型对比

|    对比项    |                `wd-message-box`                |              `wd-popup`              |
| :----------: | :--------------------------------------------: | :----------------------------------: |
|   **场景**   |         确认、提示、输入等标准交互场景         |    自定义复杂内容的弹出式容器组件    |
| **视觉效果** | 系统原生风格，按钮主次分明，输入框有明显边界框 | 需手动实现按钮样式、输入框边框等细节 |
|   **代码**   |     一次性配置对象，支持 Promise 链式调用      |     需维护多个状态变量和模板代码     |
|  **易用性**  |             开箱即用，无需额外代码             |    需手动实现布局、样式和交互逻辑    |

#### 8.2. 错误做法：使用 `wd-popup` 实现用户输入

```vue
<!-- ❌ 错误做法：视觉效果差，代码冗余 -->
<template>
	<wd-button @click="showStopModal = true">暂停</wd-button>

	<!-- 需要手动维护弹窗状态 -->
	<wd-popup v-model="showStopModal" position="center" closable>
		<view class="p-6" style="width: 80vw;">
			<view class="mb-4 text-center text-lg font-bold">暂停原因</view>
			<!-- 输入框没有边界感，留白过大 -->
			<wd-textarea v-model="stopReason" placeholder="请填写暂停原因" :maxlength="200" show-word-limit :rows="4" />
			<!-- 按钮主次不分明 -->
			<view class="mt-4 flex">
				<wd-button block @click="showStopModal = false">取消</wd-button>
				<wd-button block type="primary" custom-class="ml-12rpx" @click="handleConfirm">确定</wd-button>
			</view>
		</view>
	</wd-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

// 需要维护多个状态变量
const showStopModal = ref(false);
const stopReason = ref("");
const currentItem = ref(null);

// 需要手动校验和处理
function handleConfirm() {
	if (!stopReason.value.trim()) {
		toast.error("请填写原因");
		return;
	}
	// 业务逻辑...
	showStopModal.value = false;
}
</script>
```

**存在的问题**:

- 视觉效果差：输入框无边界、留白过大、按钮主次不分明
- 代码冗余：需要维护多个状态变量（`showStopModal`、`stopReason`、`currentItem`）
- 手动校验：需要手动编写输入校验逻辑
- 样式调试：需要反复调试 CSS 才能实现美观效果

#### 8.3. 正确做法：使用 `wd-message-box.prompt()`

```vue
<!-- ✅ 正确做法：简洁高效，视觉美观 -->
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
				// 直接使用输入值进行业务处理
				await stopRepair({
					repairId: item.repairId,
					remark: res.value.trim(),
				});
			}
		},
	});
}
</script>
```

**优势**:

- ✅ 零状态管理：无需定义 `showModal`、`inputValue` 等状态变量
- ✅ 内置校验：`inputValidate` 函数自动校验，校验失败自动提示
- ✅ 视觉规范：系统原生风格，按钮主次分明，输入框有清晰边框
- ✅ Promise 支持：支持 `.then().catch()` 链式调用（可选）
- ✅ 简洁高效：代码量减少 70%，无需维护冗余模板

#### 8.4. `wd-message-box` 常用方法

|   方法    |        场景        |              核心配置               |
| :-------: | :----------------: | :---------------------------------: |
| `confirm` |   确认/取消操作    |   `title`, `msg`, `success` 回调    |
|  `alert`  |      提示信息      |      `title`, `msg`, `success`      |
| `prompt`  | 用户输入（推荐！） | `inputPlaceholder`, `inputValidate` |

#### 8.5. `prompt` 方法核心参数

|        参数        |      说明      |            类型             |         示例值         |
| :----------------: | :------------: | :-------------------------: | :--------------------: |
|      `title`       |    弹窗标题    |          `string`           |      `"暂停维修"`      |
|       `msg`        |    提示信息    |          `string`           |   `"请填写暂停原因"`   |
| `inputPlaceholder` |  输入框占位符  |          `string`           | `"请输入原因（必填）"` |
|    `inputValue`    |  输入框初始值  |       `string/number`       |          `""`          |
|    `maxlength`     | 输入字符数限制 |          `number`           |         `200`          |
|  `inputValidate`   | 自定义校验函数 | `(value) => boolean/string` |       见上方示例       |
|     `success`      |  确认回调函数  |       `(res) => void`       |       见上方示例       |

#### 8.6. 选型决策树

```plain
需要弹框交互？
  ├─ 是标准场景（确认/提示/输入）？
  │   ├─ 是 → 使用 `wd-message-box`（confirm/alert/prompt）
  │   └─ 否 → 继续判断
  └─ 需要复杂自定义内容（如富文本、自定义表单、多步骤流程）？
      ├─ 是 → 使用 `wd-popup`
      └─ 否 → 优先使用 `wd-message-box`
```

#### 8.7. 迁移检查清单

当发现代码中使用 `wd-popup` 实现用户输入时，检查是否可以迁移：

- [ ] 弹框内容是否为标准确认/提示/输入场景？
- [ ] 是否仅包含一个输入框和确认/取消按钮？
- [ ] 是否手动维护了多个状态变量（`showModal`、`inputValue`）？
- [ ] 是否手动实现了输入校验逻辑？
- [ ] 视觉效果是否存在问题（输入框无边界、按钮主次不分明）？

如果以上任意一项为 **是**，**强烈建议迁移到 `wd-message-box.prompt()`**。

> **📚 相关示例**: `src/pages-sub/repair/dispatch.vue:208-231`

#### 8.4. ⚠️ message-box 类型安全使用规范

**核心规范**: 使用 `message.prompt()` 时必须遵守严格的类型安全规范，避免常见的类型错误。

**常见类型错误 1: `inputValidate` 返回类型错误**

```typescript
// ❌ 错误：返回 string | boolean
message.prompt({
	inputValidate: (value: string) => {
		if (!value || !value.trim()) {
			return "暂停原因不能为空"; // ❌ Type Error
		}
		return true;
	},
});

// TypeScript 错误:
// Type '(value: string) => true | "暂停原因不能为空"' is not assignable to type 'InputValidate'.
// Type 'string | boolean' is not assignable to type 'boolean'.
```

**根本原因**:

- wot-design-uni 的 `InputValidate` 类型定义为 `(value: string | number) => boolean`
- **只能返回 `boolean`，不能返回字符串**
- 错误信息必须通过 `inputError` 参数指定

**✅ 正确写法**:

```typescript
message.prompt({
	inputError: "暂停原因不能为空", // ✅ 错误信息通过此参数指定
	inputValidate: (value) => {
		// ✅ 只返回 boolean
		const strValue = String(value || "").trim();
		return strValue.length > 0;
	},
	success: (res) => {
		if (res.action === "confirm" && res.value) {
			console.log("用户输入:", String(res.value).trim());
		}
	},
});
```

---

**常见类型错误 2: 误用 Promise 模式**

```typescript
// ❌ 错误：项目的 useGlobalMessage() 不返回 Promise
async function handleInput() {
	const value = await message.prompt({
		// ❌ Type Error: 返回 void
		title: "输入信息",
	});
	console.log(value.trim()); // ❌ Property 'trim' does not exist on type 'void'
}
```

**根本原因**:

- 项目的 `useGlobalMessage()` **不返回 Promise**，返回 `void`
- wot-design-uni 的原生 API 支持 Promise，但项目封装使用回调模式
- 必须使用 `success` 回调处理结果

**✅ 正确写法**:

```typescript
function handleInput() {
	message.prompt({
		title: "输入信息",
		msg: "请输入内容",
		inputError: "输入不能为空",
		inputValidate: (value) => String(value || "").trim().length > 0,
		success: (res) => {
			// ✅ 使用 success 回调
			if (res.action === "confirm" && res.value) {
				console.log("用户输入:", String(res.value).trim());
			}
		},
	});
}
```

---

**类型安全检查清单**:

- [ ] **`inputValidate` 是否只返回 `boolean`？**
  - ✅ 正确：`return value.trim().length > 0`
  - ❌ 错误：`return "输入不能为空"`

- [ ] **错误信息是否通过 `inputError` 参数指定？**
  - ✅ 正确：`inputError: "输入不能为空"`
  - ❌ 错误：从 `inputValidate` 返回字符串

- [ ] **是否使用了 `await message.prompt()`？**
  - ✅ 正确：使用 `success` 回调
  - ❌ 错误：`const value = await message.prompt(...)`

- [ ] **`res.value` 是否进行了类型转换？**
  - ✅ 正确：`String(res.value).trim()`
  - ❌ 风险：直接 `res.value.trim()`

- [ ] **参数名是否正确？**
  - ✅ 正确：`msg: "弹窗内容"`
  - ⚠️ 可用但不推荐：`message: "弹窗内容"`

> **📚 详细文档**: `src/components/global/message/README.md` - "常见类型错误和解决方案"章节

---

### 9. z-paging 分页组件

**⚠️ 重要变更**：常用 props 已全局配置（`src/main.ts`），无需重复配置！

**全局已配置的 props**（在 `src/main.ts` 中）:

- `:default-page-size="10"` - 每页数量
- `:refresher-enabled="true"` - 下拉刷新
- `:loading-more-enabled="true"` - 上拉加载
- `:show-scrollbar="false"` - 隐藏滚动条

**必须配置的 props**:

- `ref="pagingRef"` - 组件引用
- `v-model="list"` - 列表数据绑定
- `@query="handleQuery"` - 请求触发

**基础用法**:

```vue
<template>
	<z-paging ref="pagingRef" v-model="list" @query="handleQuery">
		<view v-for="item in list" :key="item.id">
			<!-- 列表项 -->
		</view>

		<template #empty>
			<wd-status-tip image="search" tip="暂无数据" />
		</template>
	</z-paging>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const pagingRef = ref();
const list = ref([]);

function handleQuery(pageNo: number, pageSize: number) {
	// 只发请求,不要 await/try/catch
	// 详见 z-paging-integration skill
}

onMounted(() => {
	pagingRef.value?.reload();
});
</script>
```

**特殊场景覆盖全局配置**:

```vue
<!-- 只在需要覆盖全局配置时才显式指定 -->
<z-paging ref="pagingRef" v-model="list" :default-page-size="20" @query="handleQuery">
	<!-- 列表内容 -->
</z-paging>
```

> **📚 详细规范**: 参阅 `.claude/skills/z-paging-integration/SKILL.md`（特别是第 2 节：全局配置说明）

## 迁移策略

### 1. 渐进式迁移原则

- **页面级迁移**: 优先迁移相对独立的页面组件
- **组件级迁移**: 逐个迁移可复用的基础组件
- **功能级迁移**: 按业务功能模块进行分批迁移

### 2. 兼容性保证

- **向后兼容**: 保持原有功能和交互逻辑不变
- **渐进增强**: 利用新组件库的高级特性优化用户体验
- **平台适配**: 确保多平台运行的一致性

### 3. 质量控制

- **类型安全**: 充分利用 TypeScript 提供类型检查
- **性能优化**: 使用 Vue3 组合式 API 优化组件性能
- **代码规范**: 遵循现代化的代码编写规范

## 技术要点

### 1. Vue3 Composition API 迁移

- 使用 `ref` 和 `reactive` 替代 `data`
- 使用 `computed` 和 `watch` 进行响应式计算
- 使用 `onMounted`、`onUnmounted` 等生命周期钩子

### 2. TypeScript 集成

- 为组件 props 定义明确的类型接口
- 使用泛型提升组件的类型安全性
- 充分利用 IDE 的类型提示和检查

### 3. UnoCSS 样式优化

- 使用原子化 CSS 类替代传统的样式类
- 保持样式的一致性和可维护性
- 利用 UnoCSS 的预设和自定义规则

### 4. 平台兼容性处理

- 使用条件编译处理平台差异
- 确保组件在不同平台的一致表现
- 优化小程序和 APP 的性能

## 迁移检查清单

- [ ] **基础组件**
  - [ ] 按钮、列表、标签组件已迁移
  - [ ] 导航、弹窗组件已迁移

- [ ] **表单组件**
  - [ ] 输入框、选择器组件已迁移
  - [ ] 表单分区标题使用 form-section-title
  - [ ] wd-picker 嵌套顺序正确
  - [ ] H5 输入控件依赖全局 `installH5FormControlAttributesPatch()`，无页面级 DOM 补丁

- [ ] **Icon 图标**
  - [ ] 所有 cuIcon-_ 已替换为 i-carbon-_
  - [ ] 使用 wd-icon 组件 + custom-class 属性

- [ ] **图片组件**
  - [ ] 所有 `<image>` 已替换为 `<wd-img>`
  - [ ] 宽高使用 UnoCSS 类,不用 width/height 属性

- [ ] **空状态**
  - [ ] no-data-page 已替换为 wd-status-tip
  - [ ] 选择合适的内置状态类型

- [ ] **全局反馈**
  - [ ] 子组件内无 Toast/Message/Loading 组件
  - [ ] 使用 useGlobalToast/Message/Loading

- [ ] **样式系统**
  - [ ] ColorUI 类名已转换为 UnoCSS
  - [ ] 保持视觉效果一致性

通过系统化的组件迁移,确保项目从传统 ColorUI 架构平滑升级到现代化 wot-design-uni + UnoCSS 技术栈,提升开发效率和用户体验。
