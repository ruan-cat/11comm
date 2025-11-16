---
name: make-form-for-dialog
description: 生成用于命令式弹框的表单组件。生成和命令式弹框的表单组件时，需要按照指定的规则生成，才能实现和命令式弹框的相互配合。
color: blue
---

# 生成用于命令式弹框的表单组件

## 1. 参考文件

你的参考上下文为：

请你参考该目录，学会如何定义表单组件。在合适的位置内组织表单组件所需要的文件：

- apps\admin\src\pages\property-manage\expense-manage\expense-item-setting

- 框架的表单组件使用例子： https://pure-admin.github.io/vue-pure-admin/#/form/index
- `PlusProComponents` 的 form 表单组件： https://plus-pro-components.com/components/form.html
- 组件类型配置： https://plus-pro-components.com/components/config.html

### 1.1 美观数据生成的参考文件

为了生成较为美观的本地数据，请参考以下文件的代码风格和数据生成逻辑：

- apps\admin\src\pages\property-manage\community-manage\house-decoration\test-data.ts
- apps\admin\src\pages\operation-team\data-manage\property-management-company\test-data.ts

## 2. 明确目录结构

通常意义下，你要处理的文件目录结构如下：

```txt
│  index.vue     # 列表页
│  test-data.ts  # 假数据文件
└─components
        form.ts  # 表单类型文件
        form.vue # 表单
```

1. 如果你看到了相关的文件，就做好准备，使用以下的子代理完成修改。
2. 如果你没有看到文件，就按照本文件的要求，新增上述文件。
3. 对于本文件来说，你要重点处理的是 `form.ts` 表单类型文件 、 `form.vue` 表单。**同时需要生成美观的 `test-data.ts` 假数据文件**，确保数据展示效果良好。

### 2.1 美观的假数据生成要求

在生成 `test-data.ts` 文件时，需要满足以下美观性要求：

1. **数据真实性**：生成的假数据要贴近真实业务场景，避免无意义的占位符
2. **数据多样性**：确保不同记录之间有合理的变化，避免重复数据
3. **数据完整性**：所有业务字段都应该有合适的值
4. **数据数量**：生成 35 条数据，便于分页展示效果
5. **中文本土化**：数据内容要符合中文使用习惯

## 3. 与命令式弹框业务高耦合

1. 根据我提供给你的截图，来生成表单组件。注意，表单组件和命令式弹框，是高度耦合的。在你生成表单组件时，也应当做好生成命令式弹框的准备。
2. 如果我没有给你提供截图，请忽略此部分。
3. 在生成表单组件时，要确保表单的布局和样式能够美观地展示数据，提升用户体验。

## 4. 表单组件的目录结构

在制作表单组件时，请遵循以下的目录结构：

```txt
│  index.vue
└─components
        form.ts
        form.vue
```

## 5. 表单组件的文件必须在 `components` 目录内

1. 在你新建表单时，应该都新建在 `components` 目录内。
2. 列表页引用表单时，请使用**相对路径**来应用，不要从根路径内用路径别名来引用文件。

## 6. 业务类型文件 `form.ts`

`form.ts`，该文件时用来给表单组件准备必要的业务类型和常量的。

### 6.1 对外导出 `form.vue` 使用的 `props` 类型

表单组件的 `props` 类型，遵守以下规范：

1. 一定要定义成 `interface。`
2. 一定要定义在 `form.ts` 内对外导出。
3. 一定要包含必填项 **form** 和 **defaultValues**。外部的命令式弹框，打开本弹框时也应该主动传递并补全这些参数。
4. 一定要定义 **defaultForm** 变量，作为默认表单对象值。

比如以下例子：

```ts
/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 物业公司表单_VO = {
	名称: "",
	地址: "",
	电话: "",
	公司法人: "",
	成立日期: "",
	地标: "",
	开通小区: "",
};

/**
 * 物业公司表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyManagementCompanyFormProps {
	/** 表单数据 */
	form: 物业公司表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 物业公司表单_VO;
}
```

其中 `PropertyManagementCompanyFormProps` 是表单组件所需要的 props 类型。

### 6.2 美观的表单字段设计要求

在定义业务类型和默认表单时，要确保表单字段的配置美观：

1. **字段顺序合理**：按照业务逻辑重要性排序字段，重要字段在前
2. **默认值美观**：为表单字段提供合理的默认值，避免空值显示
3. **字段类型合适**：根据数据特点选择合适的表单控件类型
4. **验证友好**：为必填字段提供合适的验证规则和提示信息

### 6.3 不要给业务类型增加额外的索引字段

你**不应该**添加索引签名 `[key: string]: any` 满足 `FieldValues` 要求。

在 `form.vue` 组件内，会使用强制类型转换的方式，满足 `FieldValues` 的类型要求。

## 7. 生成美观的 `test-data.ts` 假数据文件

为了生成较为美观的本地数据，需要按照以下要求生成 `test-data.ts` 文件：

### 7.1 数据生成的基本原则

1. **业务真实性**：数据要符合实际业务场景，具有业务意义
2. **数据多样性**：避免重复和单调的数据，要有合理的随机性
3. **中文本土化**：使用符合中国用户习惯的数据内容
4. **完整性**：确保所有业务字段都有合适的值

### 7.2 具体数据生成要求

#### 7.2.1 文本字段生成

- 使用真实的中文名称、地址、描述等
- 避免使用 "test"、"demo" 等测试专用词汇
- 长度要适中，符合实际使用情况

#### 7.2.2 数值字段生成

- 生成合理的数值范围
- 包含整数和小数的合理分布
- 避免极端值和异常值

#### 7.2.3 日期时间字段生成

- 使用最近一年内的随机日期
- 时间格式要符合中文习惯
- 考虑业务逻辑的时间合理性

#### 7.2.4 枚举/选择字段生成

- 确保各个选项都有合理的分布
- 按照业务重要性设置不同的权重
- 避免所有数据都使用同一个选项

### 7.3 数据结构示例

```ts
/** 美观的假数据示例 */
export const tableData: 业务类型[] = [
	{
		id: 1,
		名称: "万科城市花园",
		地址: "深圳市南山区科技园南区深南大道9988号",
		联系电话: "0755-26781234",
		状态: "正常运营",
		创建时间: "2024-03-15 09:30:00",
		// ... 其他字段
	},
	// ... 生成35条类似的数据
];
```

### 7.4 与表单组件的协调

确保 `test-data.ts` 中定义的业务类型与 `form.ts` 中的类型定义保持一致，实现：

1. **类型统一**：使用相同的接口定义
2. **字段对应**：确保表单字段与数据字段一一对应
3. **验证协调**：数据内容要满足表单验证规则

## 8. 基于 `<PlusForm>` 表单组件实现的 `form.vue`

在你生成表单的代码时，请你务必遵守以下规范和要求。

参考代码：

- apps\admin\src\pages\property-manage\expense-manage\expense-item-setting\components\form.vue

1. 请你务必认真阅读代码实现。
2. 请认真模仿代码编写风格，并为后续的代码修改做准备。

### 8.1 表单美观性配置要求

在配置表单组件时，要特别注意以下美观性要求：

#### 8.1.1 表单项布局优化

```ts
/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "重要字段",
		prop: "importantField",
		valueType: "input",
		// 设置合适的宽度
		width: "200px",
		// 添加字段提示
		fieldProps: {
			clearable: true,
			placeholder: "请输入重要信息",
		},
	},
	{
		label: "选择字段",
		prop: "selectField",
		valueType: "select",
		// 为选择字段提供美观的选项配置
		options: [
			{ label: "选项一", value: "option1" },
			{ label: "选项二", value: "option2" },
		],
		// 设置合理的默认值提示
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
]);
```

#### 8.1.2 表单字段的美观性规范

1. **字段顺序**：按照业务重要性排序，常用字段在前
2. **宽度设置**：为不同类型的字段设置合适的显示宽度
3. **占位符文本**：提供友好和清晰的占位符提示
4. **清除功能**：为输入框和选择器提供清除按钮
5. **搜索过滤**：为选择器添加搜索功能，提升用户体验

#### 8.1.3 表单验证的视觉优化

```ts
/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	重要字段: [
		{ required: true, message: "请填写重要字段", trigger: "blur" },
		// 添加长度限制，提供更好的用户体验
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	联系电话: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		// 使用精确的手机号验证
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	邮箱地址: [
		// 提供友好的邮箱格式提示
		{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
	],
});
```

### 8.2 表单组件的 `props` 对象

`form.vue` 组件必须准备好 `props` 变量，如下例子所示：

```ts
import { ExpenseItemSettingFormProps } from "./form";
const props = defineProps<ExpenseItemSettingFormProps>();
```

1. 其中， `ExpenseItemSettingFormProps` 类型是从本文件相邻的 form.ts 内导入的。
2. 可以看情况设置 props 默认值。
3. 必须使用 form.ts 导出的 props 类型。

### 8.3 默认的表单重置变量 `defaultValues`

form.vue 组件必须准备好 defaultValues 变量，如下例子所示：

```ts
/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 费用项设置表单_VO;
```

1. defaultValues 应该紧接着 props 定义，在 props 定义完后，就定义该变量。
2. 必须做强制类型转换约束。该变量必须被约束为 `FieldValues & 某某业务类型` 的格式。
3. `FieldValues` 是全局导入的类型。请直接使用，不需要你手动导入。

### 8.4 获取表单组件实例 `plusFormInstance`

`form.vue` 组件必须准备好 `plusFormInstance` 变量，如下例子所示：

```ts
import { useTemplateRef } from "vue";
/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
```

1. `useTemplateRef` 要手动从 vue 导入。获取该组件实例时，必须使用 `useTemplateRef` 函数实现。
2. ref 组件引用名称必须为 `plusFormRef` 。
3. 组件实例的变量名称必须为 `plusFormInstance` 。

### 8.5 表单重设 `usePlusFormReset`

表单重设的默认逻辑，一定要用 `usePlusFormReset` 组合式 api 实现。必须在获取到表单实例后，就开始使用该函数实现表单重设。

`usePlusFormReset` 的源码实现如下：

- apps\admin\src\composables\use-plus-form-reset\index.ts

请你直接使用 `usePlusFormReset` 函数即可，`usePlusFormReset` 函数是全局导入的函数，不需要你手动导入。就像这样：

```ts
/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);
```

获取到表单实例后，就直接使用 `usePlusFormReset` 函数即可。不要试图从这个组合式 api 函数内结构出任何工具，请严格按照该要求实现表单组件的生成。

### 8.6 动态计算的表单对象 `formComputed`

表单组件的 form 表单对象，遵循以下的要求，如下代码所示：

```ts
/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & 费用项设置表单_VO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});
```

1. `toRefForm` 必须被深克隆一次。其中，cloneDeep 函数是全局导入的，请直接使用，不需要你手动导入。
2. `form` 必须来自于 `toRefForm` 对象。该对象将传递给 vue 组件。
3. `formComputed` 必须动态返回 form 对象。

### 8.7 表单项配置 `plusFormColumns`

如下代码例子所示：

```ts
/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	/** 此处省略 具体细节请阅读文件 apps\admin\src\pages\property-manage\expense-manage\expense-item-setting\components\form.vue */
]);
```

1. 必须使用 `PlusColumn` 类型做字段约束。
2. `PlusColumn` 类型是全局导入的类型，**不需要**你手动导入。请直接使用。

### 8.8 表单校验规则 `plusFormRules`

如以下代码所示：

```ts
/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	排班名称: [{ required: true, message: "请输入排班名称", trigger: "blur" }],
	排班类型: [{ required: true, message: "请选择排班类型", trigger: "change" }],
	开始时间: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	结束时间: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	星期几: [{ required: true, message: "请选择星期几", trigger: "change" }],
	负责人姓名: [{ required: true, message: "请输入负责人姓名", trigger: "blur" }],
	联系电话: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
});
```

1. 代码注释**必须是**严格的 `/** 表单校验规则 */` 。
2. 必须使用 `PlusFormRules` 类型做字段约束。
3. `PlusFormRules` 类型是全局导入的类型，**不需要**你手动导入。请直接使用。
4. 必须使用 `ref` 来定义响应式变量，不允许使用 `reactive` 来定义。

### 8.9 默认对外导出函数

表单组件必须默认导出：

1. `plusFormInstance` 表单组件实例。
2. `formComputed` 动态计算的，只读的，当前表单对象。

列表页的`命令式弹框`函数，需要使用表单组件对外导出的内容来实现业务。

### 8.10 在模板内使用 `<PlusForm>` 组件

如以下例子所示：

```vue
<template>
	<section class="form-root">
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumnsComputed"
			:rules="plusFormRules"
		/>
	</section>
</template>
```

1. 必须使用 ref 引用，且应用名称仅为 plusFormRef 。
2. 必须增加 class 样式，且选择器名称为 form-root 。
3. 属性 `has-footer` 必须为 false 。

### 8.11 根标签应该为唯一的 section 标签

实现表单组件时，应该提供一个 section 标签，便于页面提供额外的内容。

### 8.12 必须设置宽高的固定样式

必须为表单组件设置默认的宽高演示，仅使用以下的选择器写法：

```scss
.form-root {
	height: 100%;
	width: 100%;
}
```

在 vue 组件内，必须写成以下写法：

```vue
<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
```

- 选择器名称必须为 form-root 。

## 9. 与列表页的美观协调

### 9.1 确保数据展示的一致性

表单组件生成的数据要与列表页的展示保持美观协调：

1. **字段格式统一**：确保表单提交的数据格式与列表页显示格式一致
2. **数据验证配合**：表单验证规则要与数据生成逻辑相配合
3. **用户体验连贯**：从列表页到表单编辑的用户体验要连贯

### 9.2 表单弹框的视觉优化

确保表单在弹框中的显示效果美观：

1. **合适的弹框尺寸**：根据表单字段数量设置合适的弹框宽度和高度
2. **滚动优化**：当表单内容较多时，确保滚动体验良好
3. **响应式布局**：表单在不同屏幕尺寸下都能正常显示

### 9.3 与 `make-list-page` 子代理的协调

当与列表页子代理配合工作时，确保：

1. **数据类型统一**：使用相同的业务类型定义
2. **字段映射一致**：表单字段与列表页表格列保持一致的映射关系
3. **操作流程顺畅**：新增、编辑、查看等操作的用户流程要顺畅

## 10. 代码风格统一要求

### 10.1 遵循项目代码风格

请严格遵循 `.claude\agents\code-style.md` 中定义的代码风格要求：

1. **使用 jsdoc 注释风格**
2. **组件命名使用大驼峰格式**
3. **按钮组件使用正确的 type 类型**
4. **合理使用 i18n 国际化**

### 10.2 类型约束规范

按照 `.claude\agents\fix-type-error.md` 的要求处理类型问题：

1. **主动对齐联合类型**：所有文件使用相同的联合类型定义
2. **单一数据源**：所有联合类型都在同一个文件中定义
3. **减少重复**：避免在多个文件中重复定义相同的联合类型

### 10.3 与命令式弹框的配合

遵循 `.claude\agents\make-dialog.md` 的要求：

1. **正确的模式传递**：使用正确的 mode 值（info 而不是 view）
2. **表单参数传递**：确保 formProps 包含正确的 form 和 defaultValues
3. **弹框按钮配置**：按照要求配置取消、重置、提交按钮
