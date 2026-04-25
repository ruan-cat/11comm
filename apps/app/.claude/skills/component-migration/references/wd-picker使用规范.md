# wd-picker 选择器使用规范

## ⚠️ 关键警告：避免错误的组件嵌套和插槽使用

在迁移选择器组件时,**组件嵌套顺序和插槽使用至关重要**,错误的使用会导致选择器无法点击或根本无法显示。

## 1. 错误用法剖析

### ❌ 严重错误示例

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

### 问题原因

1. **`wd-cell` 组件没有 `#value` 插槽**！
   - 根据官方文档,`wd-cell` 组件支持的插槽只有：`title`、`default`（右侧内容）、`icon`、`label`
   - `#value` 插槽是 `wd-cell-group` 组件的插槽,不是 `wd-cell` 的插槽

2. **`wd-cell` 包裹 `wd-picker` 会阻挡点击事件**
   - 即使改用正确的插槽,`wd-cell` 包裹 `wd-picker` 也会导致点击事件被阻挡
   - 选择器弹窗无法正常打开

## 2. 正确用法

### ✅ 正确用法 1: 标准模式（推荐）

**使用场景**: 绝大多数情况下使用此方式。

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

<script setup lang="ts">
import { ref } from "vue";
import type { ColumnItem } from "wot-design-uni/components/wd-picker-view/types";

const LABEL_WIDTH = "100rpx";

const model = ref({
	category: "",
});

const categoryOptions: ColumnItem[] = [
	{ value: "1", label: "类别1" },
	{ value: "2", label: "类别2" },
	{ value: "3", label: "类别3" },
];
</script>
```

**特点**:

- 简洁明了,代码量最少
- 直接使用 `label` 属性设置标题
- 自动处理选中值显示
- 适用于 90% 的选择器场景

---

### ✅ 正确用法 2: 自定义插槽模式

**使用场景**: 需要动态标题或自定义选中值显示时。

**关键要点**: `wd-picker` **包裹** `wd-cell`,而不是反过来！

```vue
<template>
	<wd-cell-group border>
		<!-- ✅ 正确：wd-picker 包裹 wd-cell，用于自定义显示 -->
		<wd-picker
			v-model="model.feeFlag"
			:columns="feeOptions"
			label-key="label"
			value-key="value"
			@confirm="handleFeeChange"
		>
			<wd-cell :title="dynamicTitle" :title-width="LABEL_WIDTH" is-link center custom-value-class="cell-value-left">
				<text :class="model.feeFlag ? 'text-gray-900' : 'text-gray-400'">
					{{ selectedLabel || "请选择" }}
				</text>
			</wd-cell>
		</wd-picker>
	</wd-cell-group>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ColumnItem } from "wot-design-uni/components/wd-picker-view/types";

const LABEL_WIDTH = "100rpx";

const model = ref({
	feeFlag: "",
});

const feeOptions: ColumnItem[] = [
	{ value: "0", label: "否" },
	{ value: "1", label: "是" },
];

const dynamicTitle = computed(() => {
	return model.value.feeFlag ? "已收费" : "是否收费";
});

const selectedLabel = computed(() => {
	const item = feeOptions.find((opt) => opt.value === model.value.feeFlag);
	return item?.label;
});

function handleFeeChange(event: any) {
	console.log("选择结果:", event);
}
</script>

<style lang="scss" scoped>
/** wd-cell 值靠左对齐 - 确保选择器选中值与其他表单项对齐 */
:deep(.cell-value-left) {
	flex: 1;
	text-align: left !important;
}
</style>
```

**特点**:

- 支持动态标题（根据选中状态改变标题）
- 支持自定义选中值显示样式
- 支持自定义占位符颜色
- 需要手动计算选中值标签

---

### ✅ 正确用法 3: 多列选择器

```vue
<template>
	<wd-cell-group border>
		<wd-picker
			v-model="model.area"
			label="所在地区"
			:label-width="LABEL_WIDTH"
			:columns="areaColumns"
			@confirm="handleAreaConfirm"
		/>
	</wd-cell-group>
</template>

<script setup lang="ts">
import { ref } from "vue";

const LABEL_WIDTH = "100rpx";

const model = ref({
	area: ["", "", ""], // 多列选择器需要数组
});

// 三级联动数据
const areaColumns = ref([
	[
		{ value: "110000", label: "北京市" },
		{ value: "120000", label: "天津市" },
	],
	[{ value: "110100", label: "北京市" }],
	[
		{ value: "110101", label: "东城区" },
		{ value: "110102", label: "西城区" },
	],
]);

function handleAreaConfirm(event: any) {
	console.log("选中地区:", event);
}
</script>
```

---

## 3. 迁移检查清单

迁移 `wd-picker` 组件时,请务必检查以下几点:

### 必须检查项

- ✅ **组件嵌套顺序**: `wd-picker` 在外层,`wd-cell` 在内层（如果使用自定义插槽）
- ✅ **label 属性**: 标准模式下直接使用 `label` 属性设置标题
- ✅ **title-width**: 自定义插槽模式下在 `wd-cell` 上设置 `:title-width`
- ✅ **点击测试**: 迁移后务必测试选择器能否正常点击弹出

### 严格禁止项

- ❌ **禁止使用 `#value` 插槽**: **`wd-cell` 组件没有 `#value` 插槽**！不要将 `wd-picker` 或任何内容放在 `wd-cell` 的 `#value` 插槽内
- ❌ **禁止错误嵌套**: 将 `wd-picker` 放在 `wd-cell` 内部会导致点击事件被阻挡
- ❌ **禁止省略 label-key/value-key**: 数据源使用自定义字段时必须指定这两个属性

---

## 4. 常见问题排查

### 问题 1: 选择器无法点击

**症状**: 点击选择器没有任何反应,弹窗不出现

**原因**: `wd-picker` 被 `wd-cell` 包裹,点击事件被阻挡

**解决**: 改为 `wd-picker` 包裹 `wd-cell`

```vue
<!-- ❌ 错误 -->
<wd-cell>
  <wd-picker />  <!-- 被包裹,无法点击 -->
</wd-cell>

<!-- ✅ 正确 -->
<wd-picker>
  <wd-cell />  <!-- 作为子元素 -->
</wd-picker>
```

---

### 问题 2: 选择器根本不显示

**症状**: 页面上看不到选择器,或只能看到标题

**原因**: 使用了不存在的 `#value` 插槽

**解决**: 移除 `#value` 插槽,使用正确的嵌套方式

```vue
<!-- ❌ 错误 -->
<wd-cell>
  <template #value>  <!-- 不存在的插槽 -->
    <wd-picker />
  </template>
</wd-cell>

<!-- ✅ 正确 -->
<wd-picker label="标题">
  <!-- 直接使用默认插槽或不使用插槽 -->
</wd-picker>
```

---

### 问题 3: 选中值不显示

**症状**: 选择器可以打开,选择后不显示选中的值

**原因**:

1. `v-model` 绑定的值类型不匹配
2. `value-key` 设置错误
3. 数据源格式不正确

**解决**:

```vue
<script setup lang="ts">
import type { ColumnItem } from "wot-design-uni/components/wd-picker-view/types";

// ✅ 正确: v-model 绑定字符串
const selectedValue = ref<string>("");

// ✅ 正确: 使用标准的 ColumnItem 格式
const options: ColumnItem[] = [
	{ value: "1", label: "选项1" }, // value 必须是字符串
	{ value: "2", label: "选项2" },
];
</script>

<template>
	<!-- ✅ 正确: label-key 和 value-key 与数据源字段匹配 -->
	<wd-picker v-model="selectedValue" :columns="options" label-key="label" value-key="value" />
</template>
```

---

### 问题 4: 多列选择器显示异常

**症状**: 多列选择器只显示一列或显示错乱

**原因**:

1. `v-model` 绑定的值不是数组
2. 数组长度与列数不匹配

**解决**:

```vue
<script setup lang="ts">
// ✅ 正确: 三列选择器绑定三元素数组
const selectedValues = ref<string[]>(["", "", ""]);

// ✅ 正确: columns 是二维数组
const multiColumns = ref([
	[{ value: "1", label: "省" }], // 第一列
	[{ value: "1", label: "市" }], // 第二列
	[{ value: "1", label: "区" }], // 第三列
]);
</script>

<template>
	<wd-picker v-model="selectedValues" :columns="multiColumns" />
</template>
```

---

## 5. 最佳实践

### 1. 统一使用 ColumnItem 类型

```typescript
import type { ColumnItem } from "wot-design-uni/components/wd-picker-view/types";

// ✅ 推荐: 使用统一的 ColumnItem 类型
const options: ColumnItem[] = [
	{ value: "1", label: "选项1" },
	{ value: "2", label: "选项2" },
];

// ❌ 不推荐: 使用自定义字段名
const options = [
	{ id: 1, name: "选项1" }, // 需要额外配置 label-key="name" value-key="id"
];
```

### 2. 优先使用标准模式

```vue
<!-- ✅ 推荐: 90% 场景使用标准模式 -->
<wd-picker v-model="value" label="标题" :columns="options" />

<!-- ⚠️ 仅在必要时使用自定义模式 -->
<wd-picker v-model="value" :columns="options">
  <wd-cell title="动态标题">
    <text>{{ customDisplay }}</text>
  </wd-cell>
</wd-picker>
```

### 3. 提供完整的类型注解

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'

interface FormData {
  category: string
}

const model = ref<FormData>({
  category: ''
})

const categoryOptions: ColumnItem[] = [
  { value: '1', label: '类别1' },
  { value: '2', label: '类别2' }
]

const selectedLabel = computed<string>(() => {
  const item = categoryOptions.find(opt => opt.value === model.value.category)
  return item?.label || ''
})
</script>
```

### 4. 统一 label-width

```typescript
// constants/form.ts
export const LABEL_WIDTH = '100rpx'

// 组件中使用
<wd-picker label="标题" :label-width="LABEL_WIDTH" />
```

---

## 6. 总结

### 核心原则

1. **嵌套顺序**: `wd-picker` 包裹 `wd-cell`,不是反过来
2. **插槽使用**: `wd-cell` 没有 `#value` 插槽
3. **优先标准模式**: 90% 场景使用 `label` 属性即可
4. **类型安全**: 使用 `ColumnItem` 类型和完整的类型注解

### 迁移口诀

- **标准模式**: 直接用 label 属性
- **自定义模式**: picker 包 cell
- **禁止使用**: #value 插槽
- **测试要点**: 能否点击弹出

遵循本规范,可以避免 99% 的 `wd-picker` 使用问题！
