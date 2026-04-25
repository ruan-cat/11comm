---
name: use-wd-form
description: |
  使用 wot-design-uni 的 wd-form 组件编写表单页的标准规范 - 提供表单结构、wd-picker 选择器、校验规则、提交处理的完整规范。

  触发条件（满足任意一项即触发）：
  - 页面包含 <wd-form> 组件
  - 需要实现表单页面（创建、编辑、提交等）
  - 需要添加选择功能（必须使用 wd-picker 而非 wd-radio-group）
  - 需要添加表单分区标题（必须使用 FormSectionTitle）
  - 用户提及"表单"、"wd-form"、"表单校验"、"表单提交"等关键词
  - 从 Vue2 迁移表单页面
  - 需要实现单选/多选功能（单选用 wd-picker，多选用 wd-checkbox-group）

  必须协同的技能：
  - beautiful-component-design（FormSectionTitle、图标、美化）
  - api-migration（如果有接口调用）
  - api-error-handling（如果有接口调用）
  - code-migration + component-migration（从 Vue2 迁移时）

  禁止项：
  - 禁止使用 wd-radio-group 实现单选（应使用 wd-picker）
  - 禁止使用 <view class="section-title"> 代替 FormSectionTitle
  - 禁止 wd-cell 包裹 wd-picker（正确：wd-picker 包裹 wd-cell）
  - 禁止使用不存在的 #value 插槽
  - 禁止单选初始化为数组（应为空字符串）
  - 禁止多选初始化为字符串（应为空数组）

  覆盖场景：维修工单创建、房屋申请、投诉录单、活动报名、用户信息编辑等所有表单页面。
---

# 使用 `<wd-form>` 表单组件编写表单页的实施规范

本技能文件定义了在本项目中使用 `wot-design-uni` 组件库的 `<wd-form>` 组件编写表单页的标准规范。所有表单页面必须遵循此规范，确保代码风格统一、美观且易于维护。

## ⚠️ 多技能协同

表单页面通常需要同时使用：

- `beautiful-component-design` - FormSectionTitle、图标、美化
- `api-migration` - 如果有接口调用
- `api-error-handling` - 如果有接口调用

从 Vue2 迁移表单：

- `code-migration` + `component-migration` - 代码和组件迁移

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

---

## 核心文档与参考

参考示例：

- `src/pages-sub/repair/pool-dispatch.vue` - 完整表单示例
- `src/pages-sub/repair/pool-finish.vue` - 复杂表单示例

组件文档：

- [wd-form 组件文档](https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/form.md)
- [wd-cell 组件文档](https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/cell.md)

## 1. 核心规范概述

表单必须：

- 使用 `<wd-form>` 包裹所有表单项
- 使用 `<wd-cell-group>` 分组表单项
- 定义 `formRules` 校验规则
- 使用 `FormInstance` 类型导入

## 2. 表单组件基本结构

### 2.1. 模板部分

表单必须使用以下结构：

```vue
<template>
	<view class="page-container">
		<wd-form ref="formRef" :model="model" :rules="formRules">
			<!-- 表单内容分组 -->
			<view class="section-title"> 分组标题 </view>
			<wd-cell-group border>
				<!-- 具体的表单项 -->
				<wd-input
					v-model="model.fieldName"
					label="字段标签"
					:label-width="LABEL_WIDTH"
					prop="fieldName"
					placeholder="请输入..."
					clearable
					:rules="formRules.fieldName"
				/>
				<!-- 更多表单项... -->
			</wd-cell-group>

			<!-- 提交按钮 -->
			<view class="mt-6 px-3 pb-6">
				<wd-button block type="success" size="large" @click="handleSubmit"> 提交 </wd-button>
			</view>
		</wd-form>
	</view>
</template>
```

**关键要求**：

1. `<wd-form>` 组件必须包含三个必需属性：
   - `ref="formRef"` - 组件引用，用于调用表单方法
   - `:model="model"` - 表单数据双向绑定
   - `:rules="formRules"` - 表单校验规则

2. 使用 `wd-cell-group` 和 `wd-cell` 组织表单项：
   - **必须**使用 `wd-cell-group` 包裹表单项组
   - `wd-cell-group` **必须**添加 `border` 属性以增强美观度
   - 每个逻辑分组使用独立的 `wd-cell-group`

3. 分组标题：
   - 使用 `<view class="section-title">` 作为每组表单项的标题
   - 放置在 `wd-cell-group` 之前

### 2.2. 脚本部分

```vue
<script setup lang="ts">
import type { FormRules } from "wot-design-uni/components/wd-form/types";
import { reactive, ref } from "vue";

/** 表单引用 */
const formRef = ref();

/** 表单标签统一宽度（可选，但推荐使用以保持统一） */
const LABEL_WIDTH = "80px";

/** 表单数据模型 */
const model = reactive({
	fieldName: "",
	// 更多字段...
});

/** 表单校验规则 */
const formRules: FormRules = {
	fieldName: [{ required: true, message: "请填写字段" }],
	// 更多规则...
};

/** 提交表单 */
async function handleSubmit() {
	formRef.value
		.validate()
		.then(async ({ valid, errors }: { valid: boolean; errors: any[] }) => {
			if (!valid) {
				console.error("表单校验失败:", errors);
				return;
			}

			// 提交逻辑...
		})
		.catch((error: any) => {
			console.error("表单校验异常:", error);
		});
}
</script>
```

**关键要求**：

1. **必须**导入 `FormRules` 类型（从 `wot-design-uni/components/wd-form/types`）
2. **必须**定义 `formRef` 引用
3. **必须**定义 `model` 响应式数据对象（使用 `reactive`）
4. **必须**定义 `formRules` 校验规则对象（类型为 `FormRules`）
5. 推荐定义统一的 `LABEL_WIDTH` 常量，保持表单标签宽度一致

### 2.3. 样式部分

```vue
<style lang="scss" scoped>
.page-container {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.section-title {
	margin: 0;
	font-weight: 400;
	font-size: 14px;
	color: rgba(69, 90, 100, 0.6);
	padding: 20px 15px 10px;
}

/** 自定义样式（如需要） */
:deep(.custom-class) {
	/* 样式规则 */
}
</style>
```

## 3. 常用表单组件示例

### 3.1. 文本输入框（wd-input）

```vue
<template>
	<wd-cell-group border>
		<wd-input
			v-model="model.username"
			label="用户名"
			:label-width="LABEL_WIDTH"
			prop="username"
			placeholder="请输入用户名"
			clearable
			:rules="formRules.username"
		/>
	</wd-cell-group>
</template>
```

### 3.2. 选择器（wd-picker）

#### ⚠️ 重要警告：避免错误的嵌套方式和插槽使用

**❌ 错误用法 - 使用了不存在的 `#value` 插槽**：

```vue
<!-- ❌ 禁止这样写！使用了不存在的 #value 插槽，会导致无法显示和点击 -->
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

**问题原因**：

1. **`wd-cell` 组件没有 `#value` 插槽**！根据官方文档，`wd-cell` 组件支持的插槽只有：`title`、`default`（右侧内容）、`icon`、`label`。`#value` 插槽是 `wd-cell-group` 组件的插槽，不是 `wd-cell` 的插槽。
2. 即使改用正确的插槽，`wd-cell` 包裹 `wd-picker` 也会导致点击事件被阻挡，选择器无法正常弹出。

---

#### 3.2.1. 标准用法（使用 label 属性）✅

```vue
<template>
	<wd-cell-group border>
		<wd-picker
			v-model="model.category"
			label="分类"
			:label-width="LABEL_WIDTH"
			prop="category"
			:columns="categoryOptions"
			label-key="name"
			value-key="id"
			:rules="formRules.category"
		/>
	</wd-cell-group>
</template>
```

**使用场景**：绝大多数情况下使用此方式，简洁明了。

---

#### 3.2.2. 自定义插槽用法（动态标题或自定义显示）✅

当需要动态标题或自定义选中值显示时，使用自定义插槽方式。**注意：`wd-picker` 包裹 `wd-cell`，而不是反过来！**

```vue
<template>
	<wd-cell-group border>
		<wd-picker v-model="model.feeFlag" :columns="feeOptions" label-key="name" value-key="id" @confirm="handleFeeChange">
			<wd-cell :title="dynamicTitle" :title-width="LABEL_WIDTH" is-link center custom-value-class="cell-value-left">
				<text :class="model.feeFlag ? 'text-gray-900' : 'text-gray-400'">
					{{ selectedLabel || "请选择" }}
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

**关键要点**：

1. **组件嵌套顺序**：`wd-picker` 包裹 `wd-cell`（而不是反过来）
2. `:title-width="LABEL_WIDTH"` - 与其他表单项保持一致的标签宽度
3. `center` - 使内容垂直居中
4. `custom-value-class="cell-value-left"` - 确保选中值左对齐
5. 必须添加 `:deep(.cell-value-left)` 样式

**使用场景**：仅在需要动态标题或复杂自定义显示时使用。

---

#### 3.2.3. 单选和多选组件选型原则

**⚠️ 核心规则**：严格遵循统一的组件选型标准，确保用户体验一致性。

| 场景 |   必须使用的组件    |  数据类型  |                              说明                              |
| :--: | :-----------------: | :--------: | :------------------------------------------------------------: |
| 单选 |     `wd-picker`     |  `string`  |             无论数据是否动态，统一使用 `wd-picker`             |
| 多选 | `wd-checkbox-group` | `string[]` | 无论数据是否动态，统一使用 `wd-checkbox-group` + `wd-checkbox` |

**❌ 禁止使用**：

- `wd-radio-group` - 即使是单选场景，也应该使用 `wd-picker`
- 在多选场景中使用 `wd-picker` 的多列选择模式

---

**1. 单选场景 - 使用 `wd-picker`**

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle title="基本信息" />

		<!-- ✅ 正确：单选使用 wd-picker -->
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

<script setup lang="ts">
const categoryOptions = [
	{ id: "1", name: "选项A" },
	{ id: "2", name: "选项B" },
	{ id: "3", name: "选项C" },
];

const model = reactive({
	category: "", // 单选：string 类型
});
</script>
```

---

**2. 动态单选场景 - 仍然使用 `wd-picker`**

即使选项是动态从后端获取的，仍然使用 `wd-picker`：

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle :title="item.itemTitle" />

		<!-- ✅ 正确：动态单选仍使用 wd-picker -->
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
	</wd-cell-group>
</template>

<script setup lang="ts">
/** 动态表单项数据初始化 */
onLoadSuccess((data) => {
	titleList.value = data.data?.list || [];

	titleList.value.forEach((item) => {
		if (item.titleType === "1001") {
			// 单选：初始化为空字符串
			item.value = "";
		}
	});
});
</script>
```

---

**3. 多选场景 - 使用 `wd-checkbox-group`**

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle title="选择功能" />

		<!-- ✅ 正确：多选使用 wd-checkbox-group -->
		<view class="p-3">
			<wd-checkbox-group v-model="model.features" @change="handleFeaturesChange">
				<wd-checkbox v-for="feature in featureOptions" :key="feature.id" :value="feature.id">
					{{ feature.name }}
				</wd-checkbox>
			</wd-checkbox-group>
		</view>
	</wd-cell-group>
</template>

<script setup lang="ts">
const featureOptions = [
	{ id: "feature1", name: "功能1" },
	{ id: "feature2", name: "功能2" },
	{ id: "feature3", name: "功能3" },
];

const model = reactive({
	features: [] as string[], // 多选：string[] 类型
});

/** 多选变更处理 */
function handleFeaturesChange(event: { value: string[] }) {
	model.features = event.value;
	console.log("已选择:", model.features);
}
</script>
```

---

**4. 动态多选场景 - 仍然使用 `wd-checkbox-group`**

```vue
<template>
	<wd-cell-group border>
		<FormSectionTitle :title="item.itemTitle" />

		<!-- ✅ 正确：动态多选使用 wd-checkbox-group -->
		<view v-if="item.titleType === '2002'" class="p-3">
			<wd-checkbox-group v-model="item.values" @change="(event) => handleCheckboxChange(event.value, item)">
				<wd-checkbox v-for="(opt, idx) in item.options" :key="idx" :value="opt.id">
					{{ opt.name }}
				</wd-checkbox>
			</wd-checkbox-group>
		</view>
	</wd-cell-group>
</template>

<script setup lang="ts">
/** 多选变更处理 */
function handleCheckboxChange(values: string[], item: any) {
	item.values = values;
	console.log(`${item.itemTitle} 已选择:`, values);
}

/** 动态表单项数据初始化 */
onLoadSuccess((data) => {
	titleList.value = data.data?.list || [];

	titleList.value.forEach((item) => {
		if (item.titleType === "2002") {
			// 多选：初始化为空数组
			item.values = [];
		}
	});
});
</script>
```

---

**5. 完整示例：单选和多选混合场景**

参考 `src/pages-sub/inspection/execute-single.vue:316-345`

```vue
<template>
	<view class="inspection-execute-single">
		<wd-form ref="formRef" :model="formData" :rules="formRules">
			<!-- 动态表单项 -->
			<wd-cell-group v-for="(item, index) in titleList" :key="index" border :class="index > 0 ? 'mt-3' : ''">
				<FormSectionTitle
					:title="item.itemTitle"
					icon="checkbox-checked"
					icon-class="i-carbon-checkbox-checked text-blue-500"
				/>

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
					<wd-checkbox-group
						v-model="item.radio as string[]"
						@change="(event) => handleCheckboxChange(event.value, item)"
					>
						<wd-checkbox
							v-for="(valueItem, valueIndex) in item.inspectionItemTitleValueDtos"
							:key="valueIndex"
							:value="valueItem.itemValue"
						>
							{{ valueItem.itemValue }}
						</wd-checkbox>
					</wd-checkbox-group>
				</view>

				<!-- 文本输入 -->
				<wd-textarea v-else v-model="item.radio as string" placeholder="请回答" :maxlength="512" show-word-limit />
			</wd-cell-group>
		</wd-form>
	</view>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "wot-design-uni/components/wd-form/types";
import type { InspectionItemTitle } from "@/types/inspection";
import { onMounted, reactive, ref } from "vue";
import { useRequest } from "alova/client";
import { getInspectionItemTitles } from "@/api/inspection";
import FormSectionTitle from "@/components/common/form-section-title/index.vue";

/** 表单标签统一宽度 */
const LABEL_WIDTH = "80px";

/** 表单实例 */
const formRef = ref<FormInstance>();

/** 巡检项标题列表（动态表单项） */
const titleList = ref<InspectionItemTitle[]>([]);

/** 加载巡检项标题 - 链式回调写法 */
const { send: sendLoadTitles } = useRequest(
	() =>
		getInspectionItemTitles({
			itemId: itemId.value,
			page: 1,
			row: 100,
		}),
	{
		immediate: false,
	},
).onSuccess((data) => {
	titleList.value = data.data?.list || [];

	// 初始化 radio 字段
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

/** 多选 Checkbox 变更 */
function handleCheckboxChange(values: string[], item: InspectionItemTitle) {
	item.radio = values;
}
</script>
```

---

**6. 组件选型决策树**

```plain
需要选择功能？
  ├─ 单选（只能选一个）？
  │   └─ 使用 wd-picker
  │       - 数据类型: string
  │       - 静态数据: 直接定义 columns
  │       - 动态数据: map 转换为 columns 格式
  │
  └─ 多选（可以选多个）？
      └─ 使用 wd-checkbox-group + wd-checkbox
          - 数据类型: string[]
          - 事件: @change="(event) => handler(event.value)"
          - 初始化: 空数组 []
```

---

**7. 常见错误**

| ❌ 错误写法                      | ✅ 正确写法           | 说明                           |
| :------------------------------- | :-------------------- | :----------------------------- |
| `<wd-radio-group>` 用于单选      | `<wd-picker>`         | 单选统一使用 wd-picker         |
| 多选初始化为 `''`                | 多选初始化为 `[]`     | 多选数据类型必须是数组         |
| 单选初始化为 `[]`                | 单选初始化为 `''`     | 单选数据类型必须是字符串       |
| `@update:model-value` 处理多选   | `@change` 处理多选    | wd-checkbox-group 使用 @change |
| 多选直接赋值 `item.values = '1'` | `item.values = ['1']` | 多选赋值必须是数组             |

---

### 3.3. 日期时间选择器（wd-datetime-picker）

```vue
<template>
	<wd-cell-group border>
		<wd-datetime-picker
			v-model="model.appointmentDate"
			type="date"
			label="预约日期"
			:label-width="LABEL_WIDTH"
			prop="appointmentDate"
			:min-date="Date.now()"
			:rules="formRules.appointmentDate"
		/>

		<wd-datetime-picker
			v-model="model.appointmentTime"
			type="time"
			label="预约时间"
			:label-width="LABEL_WIDTH"
			prop="appointmentTime"
			:rules="formRules.appointmentTime"
		/>
	</wd-cell-group>
</template>
```

### 3.4. 文本域（wd-textarea）

```vue
<template>
	<wd-cell-group border>
		<wd-textarea
			v-model="model.description"
			label="描述"
			:label-width="LABEL_WIDTH"
			prop="description"
			placeholder="请输入描述"
			:maxlength="500"
			show-word-limit
			:rules="formRules.description"
		/>
	</wd-cell-group>
</template>
```

### 3.5. 自定义单元格（wd-cell）

用于实现选择跳转、显示只读信息等场景：

```vue
<template>
	<wd-cell-group border>
		<wd-cell
			title="选择地址"
			:title-width="LABEL_WIDTH"
			is-link
			center
			custom-value-class="cell-value-left"
			@click="handleSelectAddress"
		>
			<text :class="model.address ? '' : 'text-gray-400'">
				{{ model.address || "请选择地址" }}
			</text>
		</wd-cell>

		<!-- 只读信息显示 -->
		<wd-cell title="收费标准" :title-width="LABEL_WIDTH" :value="priceInfo" center />
	</wd-cell-group>
</template>

<style lang="scss" scoped>
/** wd-cell 值靠左对齐 */
:deep(.cell-value-left) {
	flex: 1;
	text-align: left !important;
}
</style>
```

### 3.6. 文件上传（wd-upload）

```vue
<template>
	<view class="section-title"> 相关图片 </view>
	<view class="bg-white p-3">
		<wd-upload
			v-model:file-list="model.photos"
			:limit="9"
			:max-size="10 * 1024 * 1024"
			:before-upload="handleBeforeUpload"
			@success="handleUploadSuccess"
			@fail="handleUploadFail"
		/>
	</view>
</template>

<script setup lang="ts">
import type { UploadBeforeUpload, UploadFile } from "wot-design-uni/components/wd-upload/types";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

const model = reactive({
	photos: [] as UploadFile[],
});

/** 图片上传前处理 */
const handleBeforeUpload: UploadBeforeUpload = ({ files, resolve }) => {
	const file = files[0];
	const maxSize = 10 * 1024 * 1024;

	if (file.size && file.size > maxSize) {
		toast.warning("图片大小不能超过10MB");
		resolve(false);
		return;
	}
	resolve(true);
};

/** 图片上传成功 */
function handleUploadSuccess(response: any) {
	console.log("图片上传成功:", response);
}

/** 图片上传失败 */
function handleUploadFail(error: any) {
	toast.error("图片上传失败");
	console.error("图片上传失败:", error);
}
</script>
```

## 4. 表单校验

### 4.1. 基础校验规则

```typescript
const formRules: FormRules = {
	// 必填校验
	username: [{ required: true, message: "请填写用户名" }],

	// 手机号校验
	phone: [
		{ required: true, message: "请填写手机号" },
		{ required: false, pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
	],

	// 自定义校验器
	appointmentDate: [
		{
			required: true,
			message: "请选择预约日期",
			validator: (value) => {
				return value && typeof value === "number" ? Promise.resolve() : Promise.reject(new Error("请选择预约日期"));
			},
		},
	],
};
```

### 4.2. 表单提交与校验

```typescript
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();
const loading = useGlobalLoading();

/** 提交表单 */
async function handleSubmit() {
	// 表单校验
	formRef.value
		.validate()
		.then(async ({ valid, errors }: { valid: boolean; errors: any[] }) => {
			if (!valid) {
				console.error("表单校验失败:", errors);
				return;
			}

			loading.loading("提交中...");

			try {
				// 提交逻辑
				await submitForm(model);
				loading.close();
				toast.success("提交成功");
			} catch (error) {
				loading.close();
				toast.error("提交失败");
			}
		})
		.catch((error: any) => {
			console.error("表单校验异常:", error);
		});
}
```

### 4.3. 额外的自定义校验

对于表单组件不支持的动态校验（如依赖其他字段的校验），在提交时手动校验：

```typescript
/**
 * 位置信息校验
 * @returns 返回错误信息，如果验证通过则返回空字符串
 */
function validateLocation(): string {
  if (someCondition && !model.fieldA) {
    return '请选择字段A'
  }
  if (anotherCondition && !model.fieldB) {
    return '请选择字段B'
  }
  return ''
}

/** 提交表单 */
async function handleSubmit() {
  // 自定义校验
  const locationError = validateLocation()
  if (locationError) {
    toast.warning(locationError)
    return
  }

  // 表单校验
  formRef.value.validate().then(...)
}
```

## 5. 完整示例参考

完整的表单页面实现示例，请参考：

- **文件路径**: `src/pages-sub/repair/add-order.vue`
- **访问地址**: http://localhost:3000/#/pages-sub/repair/add-order

该文件展示了：

1. 完整的表单结构组织
2. 多种表单组件的使用
3. 复杂的表单校验逻辑
4. 表单数据的提交处理
5. 良好的代码组织和注释

## 6. 代码规范要点

### 6.1. 必须遵守的规范

1. **表单组件声明**：
   - ✅ 必须：`<wd-form ref="formRef" :model="model" :rules="formRules">`
   - ❌ 禁止：缺少任何一个必需属性

2. **布局组织**：
   - ✅ 必须：使用 `wd-cell-group` 包裹表单项
   - ✅ 必须：`wd-cell-group` 添加 `border` 属性
   - ❌ 禁止：直接在 `wd-form` 下放置表单组件，不使用 `wd-cell-group`

3. **分组标题**：
   - ✅ 必须：使用 `<view class="section-title">` 作为分组标题
   - ✅ 必须：标题放在对应的 `wd-cell-group` 之前

4. **标签宽度**：
   - ✅ 推荐：定义统一的 `LABEL_WIDTH` 常量（如 `'80px'`）
   - ✅ 推荐：所有表单项使用 `:label-width="LABEL_WIDTH"`

5. **TypeScript 类型**：
   - ✅ 必须：导入并使用 `FormRules` 类型
   - ✅ 必须：为 `model` 使用 `reactive`
   - ✅ 必须：为 `formRef` 使用 `ref()`

### 6.2. 推荐的最佳实践

1. 使用 `useGlobalToast` 和 `useGlobalLoading` 提供用户反馈
2. 为每个表单项添加清晰的 `prop` 属性
3. 合理使用 `clearable` 属性提升用户体验
4. 为选择器组件指定 `label-key` 和 `value-key`
5. 使用 `:maxlength` 和 `show-word-limit` 限制文本输入长度
6. 为函数添加 JSDoc 注释说明其用途
7. H5 端输入控件的原生 `id/name` 由 `src/main.ts` 中的 `installH5FormControlAttributesPatch()` 统一补齐，页面内不要编写 `document.querySelector` / `onMounted` 补丁

### 6.3. 页面顶部注释

每个表单页面必须在文件顶部提供注释，说明业务名称和访问地址：

```vue
<!--
  表单页面名称
  功能：页面功能描述

  访问地址: http://localhost:3000/#/pages-sub/xxx/xxx
  建议携带参数: ?param1=xxx&param2=xxx

  完整示例: http://localhost:3000/#/pages-sub/xxx/xxx?param1=xxx&param2=xxx
-->
```

## 7. 注意事项

1. **不要滥用全局样式**：避免在 `uno.config.ts` 中为业务特定样式创建 shortcuts
2. **保持组件独立性**：表单组件应尽可能独立，减少对全局状态的依赖
3. **错误处理**：合理使用 try-catch 和错误提示，提升用户体验
4. **性能优化**：对于大型表单，考虑使用 `v-show` 而非 `v-if` 控制显示
5. **无障碍支持**：为表单项提供清晰的标签和提示信息
6. **H5 原生控件属性**：`wd-input`、`wd-search`、`wd-textarea` 在 H5 会渲染内部原生控件；项目级补丁 `src/utils/h5-form-control-attributes.ts` 会统一补齐缺失的 `id/name`，禁止在业务页面重复写 DOM patch
7. **原生控件例外**：如果确实直接使用 `<input>` 或 `<textarea>`，优先在模板中显式提供稳定的 `id` 或 `name`，不要依赖页面级脚本事后修补

## 8. 工具和资源

### 8.1. 相关 Hooks

- `useGlobalToast` - 全局提示消息
- `useGlobalLoading` - 全局加载状态
- `useRequest` (from alova/client) - 接口请求管理

### 8.2. 样式工具

- UnoCSS - 原子化 CSS
- SCSS - CSS 预处理器

### 8.3. 类型定义

在编写表单时，充分利用 TypeScript 类型定义：

```typescript
import type { FormRules } from "wot-design-uni/components/wd-form/types";
import type { UploadBeforeUpload, UploadFile } from "wot-design-uni/components/wd-upload/types";
```

## 9. 总结

遵循本规范编写表单页面，可以确保：

1. ✅ 代码风格统一，易于维护
2. ✅ 界面美观，用户体验良好
3. ✅ 校验逻辑清晰，错误处理完善
4. ✅ 组件使用规范，符合最佳实践
5. ✅ 类型安全，减少运行时错误

在实际开发中，请始终参考 `src/pages-sub/repair/add-order.vue` 作为标准范例。
