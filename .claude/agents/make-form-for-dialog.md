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

## 2. 与命令式弹框业务高耦合

1. 根据我提供给你的截图，来生成表单组件。注意，表单组件和命令式弹框，是高度耦合的。在你生成表单组件时，也应当做好生成命令式弹框的准备。
2. 如果我没有给你提供截图，请忽略此部分。

## 3. 表单组件的目录结构

在制作表单组件时，请遵循以下的目录结构：

```txt
│  index.vue
└─components
        form.ts
        form.vue
```

## 4. 表单组件的文件必须在 `components` 目录内

1. 在你新建表单时，应该都新建在 `components` 目录内。
2. 列表页引用表单时，请使用**相对路径**来应用，不要从根路径内用路径别名来引用文件。

## 5. 业务类型文件 `form.ts`

`form.ts`，该文件时用来给表单组件准备必要的业务类型和常量的。

### 5.1 对外导出 `form.vue` 使用的 `props` 类型

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

### 5.2 不要给业务类型增加额外的索引字段

你**不应该**添加索引签名 `[key: string]: any` 满足 `FieldValues` 要求。

在 `form.vue` 组件内，会使用强制类型转换的方式，满足 `FieldValues` 的类型要求。

## 6. 基于 `<PlusForm>` 表单组件实现的 `form.vue`

在你生成表单的代码时，请你务必遵守以下规范和要求：

参考代码：

- apps\admin\src\pages\property-manage\expense-manage\expense-item-setting\components\form.vue

1. 请你务必认真阅读代码实现。
2. 请认真模仿代码编写风格，并为后续的代码修改做准备。

### 6.1 表单组件的 `props` 对象

`form.vue` 组件必须准备好 `props` 变量，如下例子所示：

```ts
import { ExpenseItemSettingFormProps } from "./form";
const props = defineProps<ExpenseItemSettingFormProps>();
```

1. 其中， `ExpenseItemSettingFormProps` 类型是从本文件相邻的 form.ts 内导入的。
2. 可以看情况设置 props 默认值。
3. 必须使用 form.ts 导出的 props 类型。

### 6.2 默认的表单重置变量 `defaultValues`

form.vue 组件必须准备好 defaultValues 变量，如下例子所示：

```ts
/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 费用项设置表单_VO;
```

1. defaultValues 应该紧接着 props 定义，在 props 定义完后，就定义该变量。
2. 必须做强制类型转换约束。该变量必须被约束为 `FieldValues & 某某业务类型` 的格式。
3. `FieldValues` 是全局导入的类型。请直接使用，不需要你手动导入。

### 6.3 获取表单组件实例 `plusFormInstance`

`form.vue` 组件必须准备好 `plusFormInstance` 变量，如下例子所示：

```ts
import { useTemplateRef } from "vue";
/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
```

1. `useTemplateRef` 要手动从 vue 导入。获取该组件实例时，必须使用 `useTemplateRef` 函数实现。
2. ref 组件引用名称必须为 `plusFormRef` 。
3. 组件实例的变量名称必须为 `plusFormInstance` 。

### 6.4 表单重设 `usePlusFormReset`

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

### 6.5 动态计算的表单对象 `formComputed`

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

### 6.6 表单项配置 `plusFormColumns`

如下代码例子所示：

```ts
/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 此处省略 具体细节请阅读文件 apps\admin\src\pages\property-manage\expense-manage\expense-item-setting\components\form.vue
]);
```

1. 必须使用 `PlusColumn` 类型做字段约束。
2. `PlusColumn` 类型是全局导入的类型，不需要你手动导入。请直接使用。

### 6.7 默认对外导出函数

表单组件必须默认导出：

1. `plusFormInstance` 表单组件实例。
2. `formComputed` 动态计算的，只读的，当前表单对象。

列表页的`命令式弹框`函数，需要使用表单组件对外导出的内容来实现业务。

### 6.8 在模板内使用 `<PlusForm>` 组件

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

### 6.9 根标签应该为唯一的 section 标签

实现表单组件时，应该提供一个 section 标签，便于页面提供额外的内容。

### 6.10 必须设置宽高的固定样式

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
