---
name: make-dialog
description: 生成基于 addDialog 函数的命令式弹框。每当需要生成弹框时，就使用本代理来生成弹框。生成的是命令式弹框。生成弹框的页面多种多样，但主要是列表页需要生成弹框。
color: blue
---

# 生成基于 `addDialog` 函数的命令式弹框

我们通常在列表页内实现弹框。

## 1. 参考文件

你的参考上下文为：

- 命令式弹框源码： `apps\admin\src\views\components\dialog\index.vue`
- 弹框案例： https://pure-admin.github.io/vue-pure-admin/#/components/dialog

使用命令式弹框的组件：

- `apps\admin\src\pages\property-manage\expense-manage\expense-item-setting\index.vue`
- `apps\admin\src\pages\operation-team\data-manage\property-management-company\index.vue`

请务必阅读上述文件。

## 明确目录结构

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
3. 对于本文件来说，你要重点处理的是 `index.vue` 列表页文件 、 `form.ts` 表单类型文件 、 `form.vue` 表单。至于其他文件，你可以新建一个空文件，或不处理。其他文件交由其他子代理处理即可。你会在适当的时候阅读他们。

## 2. 与生成表单组件高耦合

1. 根据我提供给你的截图，来生成表单组件。注意，表单组件和命令式弹框，是高度耦合的。在你生成命令式弹框时，也应该同时开始生成表单组件。
2. 如果我没有给你提供截图，请忽略。

## 3. 主动为新增或编辑按钮增加打开弹框函数

在你生成命令式弹框的函数时，你也应该主动的将打开弹框的函数，应用到按钮上。比如新增按钮和编辑按钮。

## 4. 使用 useMode 组合式 api 实现模式控制

每一个弹框表单，都需要实现模式控制。根据模式来做出不同的行为。典型的是根据`新增`或`编辑`模式，动态更新弹框`标题`或`调用不同的接口`。

比如该函数：

```ts
const { mode, modeText, setMode, isAdd, isEdit } = useMode();
```

- useMode 是全局导入的函数，请直接使用。不需要你手动导入。

## 5. 固定编写一段测试的异步函数

在生成命令式弹框的前面，你固定地使用以下代码段，实现一个模拟的异步操作。

```ts
const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}
```

- useToggle 是全局导入的组合式 api 函数，不需要你手动导入，请直接使用。

## 6. 弹框组件实例

比如以下例子：

```ts
import { type ExpenseItemSettingFormProps, defaultForm } from "./components/form";
import ExpenseItemSettingForm from "./components/form.vue";

const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);
```

在使用弹框的组件内，请按照以下要求来编写弹框组件：

1. 使用相对路径的方式，导入表单组件。该组件将作为弹框组件的实例。
2. 在导入完表单后，随即新建弹框组件的实例。
3. 实例必须预备好实例的类型，使用 typescript 的工具类型 `InstanceType` 来获得到实例类型。

## 7. 严格的 `addDialog` 打开弹框函数传参

实现命令式弹框，最重要的就是二次封装 `addDialog` 函数。该函数有一系列严格的传参，请阅读以下内容。

### 7.1 默认弹框属性 `defaultAddDialogParams`

每一个弹框都包含有这些默认属性，请直接使用以下的方式实现解构赋值。

```ts
addDialog({
	...defaultAddDialogParams,
});
```

1. **全局导入** ： 该变量 defaultAddDialogParams 是全局导入的，你不需要考虑如何导入该对象。
2. **必须写在第一行** ： 该变量包含了很多预设的变量，故需要以解构赋值的方式，写在第一行。便于其他可能的覆盖。
3. **不需要重复定义** ： 该变量是全局导入的，请不要再重复定义一次。

### 7.2 弹框标题 `title`

弹框标题往往是动态变化的，请你使用 `组合式api` `useMode` 函数来实现标题动态变化。其中，`useMode` 是全局自动导入的函数，不需要你手动导入。

如以下模板所示：

```ts
const { modeText } = useMode();

/** 打开弹框 */
function openDialog() {
	/** 弹框标题 */
	const title = `${modeText.value}费用项设置`;

	addDialog({
		title,
	});
}
```

如果标题不是动态变化的，是固定的，也请定义单独的 `title` 常量。

```ts
/** 打开弹框 */
function openDialog() {
	/** 弹框标题 */
	const title = `费用项设置`;

	addDialog({
		title,
	});
}
```

### 7.3 弹框属性 `props`

即被渲染组件的 props。一般是表单组件的 props。

如以下模板所示：

- 以相对路径的方式，获取到表单组件的 props 属性类型。
- 获取弹框组件的默认表单对象 defaultForm。
- 组装 `formProps` 时，务必对传入的值做一次深克隆 cloneDeep。其中，cloneDeep 是全局自动导入的函数，不需要你手动导入。
- 在 addDialog 函数中传入 props 对象。

```ts
import { type ExpenseItemSettingFormProps, defaultForm } from "./components/form";

function openDialog() {
	/** 表单组件需要的props */
	const formProps: ExpenseItemSettingFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	addDialog({
		props: formProps,
	});
}
```

### 7.4 弹框渲染函数 `contentRenderer`

命令式弹框渲染组件，使用的是 vue 的渲染函数语法。

具体写法如下例子所示：

- ExpenseItemSettingForm 是通过相对路径导入的被渲染组件。通常是表单组件。
- expenseItemSettingFormInstance 是被渲染组件的组件实例。
- formProps 是该组件全部的 props 对象。

```ts
addDialog({
	contentRenderer: () =>
		h(ExpenseItemSettingForm, {
			ref: expenseItemSettingFormInstance,
			...formProps,
		}),
});
```

### 7.5 关闭回调函数 `doBeforeClose`

弹框关闭时，必须提供通用的关闭回调函数，写法几乎是固定的。

如下例子：

```ts
function openDialog() {
	/** 表单组件需要的props */
	const formProps: ExpenseItemSettingFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		async doBeforeClose({ options, index }) {
			const formComputed = expenseItemSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
	});
}
```

其中，expenseItemSettingFormInstance 是弹框组件的实例。要从弹框组件内获取固定对外导出的 formComputed 变量。

在你实际生成时，请你替换为实际的弹框组件实例。

useDoBeforeClose 函数是全局导入的函数，不需要你手动导入。

### 7.6 弹框底部按钮栏 `footerButtons`

请严格按照我提供给你的模板。编排按钮的位置、样式、和其他固定的交互函数。

如下例子：

```ts
const config = {
	footerButtons: [
		{
			label: transformI18n($t("common.buttons.cancel")),
			type: "info",
			btnClick: async ({ dialog: { options, index }, button }) => {
				/** console.log(options, index, button); */
				const formComputed = expenseItemSettingFormInstance.value.formComputed;
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			},
		},

		{
			label: transformI18n($t("common.buttons.reset")),
			type: "warning",
			btnClick: ({ dialog: { options, index }, button }) => {
				/** 手动重置表单 */
				expenseItemSettingFormInstance.value.plusFormInstance.handleReset();
			},
		},

		{
			label: transformI18n($t("common.buttons.submit")),
			type: "success",
			btnClick: async ({ dialog: { options, index }, button }) => {
				/** 提交表单时 校验 */
				const res = await expenseItemSettingFormInstance.value.plusFormInstance.handleSubmit();
				if (res) {
					button.btn.loading = true;
					await testAsync();
					button.btn.loading = false;
					closeDialog(options, index);
				}
			},
		},
	],
};
```

#### 7.6.1 严格的按钮排布顺序

1. 取消按钮
2. 重置按钮
3. 提交按钮

该顺序不能错乱。

#### 7.6.2 取消按钮

取消按钮的固定模板如下：

```js
const footerButtons = [
	{
		label: transformI18n($t("common.buttons.cancel")),
		type: "info",
		btnClick: async ({ dialog: { options, index }, button }) => {
			const formComputed = expenseItemSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
	},
];
```

1. 请注意将 expenseItemSettingFormInstance 替换成实际的表单组件实例。
2. 取消按钮的按钮类型必须是 `info` 类型。
3. 关闭的回调函数必须使用 `await useDoBeforeClose({ defaultValues, formComputed, index, options })` 的方式实现弹框关闭。

#### 7.6.3 重置按钮

重置按钮的固定模板如下：

```js
const footerButtons = [
	{
		label: transformI18n($t("common.buttons.reset")),
		type: "warning",
		btnClick: ({ dialog: { options, index }, button }) => {
			expenseItemSettingFormInstance.value.plusFormInstance.handleReset();
		},
	},
];
```

1. 请注意将 expenseItemSettingFormInstance 替换成实际的表单组件实例。
2. 重置按钮的类型必须是 `warning` 类型。
3. 重置函数必须使用表单组件实例，本身暴露出来的 `plusFormInstance.handleReset()` 函数。

#### 7.6.4 提交按钮

提交按钮的固定模板如下：

```js
const footerButtons = [
	{
		label: transformI18n($t("common.buttons.submit")),
		type: "success",
		btnClick: async ({ dialog: { options, index }, button }) => {
			const res = await expenseItemSettingFormInstance.value.plusFormInstance.handleSubmit();
			if (res) {
				button.btn.loading = true;
				await testAsync();
				button.btn.loading = false;
				closeDialog(options, index);
			}
		},
	},
];
```

1. 请注意将 expenseItemSettingFormInstance 替换成实际的表单组件实例。
2. 提交按钮的类型必须是 `success` 类型。
3. 请注意，务必先生成好固定的，测试的异步函数。测试用的异步函数在此处使用。
4. 提交函数必须使用表单组件实例提供的 `plusFormInstance.handleSubmit()` 函数。
5. 按钮的加载等待效果，必须使用 `button.btn.loading` 的形式。

## 严格的 `addDialog` 二次封装要求

在你封装 `addDialog` 函数时，需要满足以下严格的要求：

### 二次封装的函数名称必须为 `openDialog`

1. 为了增强语义性，便于统一管控查询，你二次封装 `addDialog` 函数时，其函数必须名为 `openDialog` 。
2. 如果你检查到目标 vue 组件，本身存在了了二次封装 `addDialog` 函数的函数，但是命名风格不合适，请你统一改成 `openDialog` 。
3. 如果你有更改名称，请在最后的修改报告内提及你更改函数名称的修改项。

### 同一个弹框组件实例，只新建唯一一个 `openDialog` 函数

1. contentRenderer 会要求我们传递弹框组件的组件实例，在不同的打开模式下，比如新增、编辑、或查看模式时，如果打开的都是同一个弹框组件，就只新建唯一一个 `openDialog` 函数。

### `openDialog` 函数必须要手动传递模式 `mode`

如下例子所示：

```ts
import { useMode, type Mode } from "@/composables/use-mode";
import { type 合同类型表单_VO } from "./components/form";
/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 合同类型_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);
}
```

1. `openDialog` 函数的形参约束，必须是传递一个对象。
2. 必须要全局导入 `use-mode` 模块的 `Mode` 类型。用 `Mode` 类型来约束形参 mode 的取值。
3. 形参 mode 的设计必须是必填项，必须要求外部传递有效的 mode 值。
4. 形参 row 必须设计成可选项。因为在表格操作栏内肯定会提供表格列数据，但是在单独的新增按钮内，却不一定提供 row 数据，所以必须设计成可选项。
5. `openDialog` 函数内部的模式判断逻辑，不能用形参 row 来决定，要统一用 mode 形参来决定。
6. 如果你处理的目标文件，本身的代码逻辑并不满足该要求，请你修改至本要求。

### 根据业务模式，给弹框组件 `formProps` 组装并传递正确的参数

1. 按照子代理 [make-form-for-dialog](./make-form-for-dialog.md) 的要求，弹框组件必须提供必填项 **form** 和 **defaultValues**。在你封装 `openDialog` 函数时，你传递给弹框组件的变量通常是 `formProps` ，且满足必填项 **form** 和 **defaultValues** 。
2. 你需要根据不同的打开模式，来动态组装出合适的，正确的必填项 `form` 和 `defaultValues` 。

#### 错误组装 `formProps` 的例子

注意 defaultValues 的赋值逻辑，该例子是错误的赋值逻辑。这里在不经过任何逻辑判断的情况下，就无条件的赋值为 `cloneDeep(defaultForm)` ，这是不对的。这会导致严重的 bug。这会导致编辑模式和查看模式下，打开弹框后，表单项都是全空的，因为默认的 defaultForm 就是一个全空的业务对象。

应该做逻辑判断。

```ts
/** 表单组件需要的props */
const formProps: AddFormProps = {
	form: isEdit.value
		? cloneDeep({
				类型名称: row.类型名称,
				是否审核: row.是否审核 === "是" ? "是" : "否",
				描述: row.描述,
			})
		: cloneDeep(defaultForm),
	defaultValues: cloneDeep(defaultForm),
};
```

#### 正确组装 `formProps` 的例子

按照上述要做逻辑判断的要求，具体应该写成如下代码：

```ts
/** 表单组件需要的props */
const formProps: AddFormProps = {
	form: isEdit.value
		? cloneDeep({
				类型名称: row.类型名称,
				是否审核: row.是否审核 === "是" ? "是" : "否",
				描述: row.描述,
			})
		: cloneDeep(defaultForm),
	defaultValues: isEdit.value
		? cloneDeep({
				类型名称: row.类型名称,
				是否审核: row.是否审核 === "是" ? "是" : "否",
				描述: row.描述,
			})
		: cloneDeep(defaultForm),
};
```

`defaultValues` 的取值也应该做逻辑判断，根据编辑模式来传递已经赋值后的业务字段。

#### 推荐的写法

上述的正确写法，很容易导致你写比较冗长的代码，你应该主动的用以下形式的写法，来完成组件的 `formProps` 赋初值逻辑：

1. 一定要导入表单的业务类型，和弹框组件的 props 类型。这里导入的业务类型是 `合同类型表单_VO` ，请你根据情况自行导入。
2. 导入`业务类型`时，请你优先从最近的 typescript 文件内导入`业务类型`，根据目录结构，你应该优先从以下文件内导入设计好的业务类型。
   - `form.ts`
   - `test-data.ts`
3. 定义 `业务对象` ，然后根据模式，去动态赋值业务对象。
4. 业务对象在新增模式下，必须深克隆一个全新的 `defaultForm` 对象，即 `cloneDeep(defaultForm)` 写法。
5. 业务对象在编辑模式下，必须整合好来自形参传递的 row 数据。
6. 在处理业务对象 和 row 数据之间的类型差异时，不允许你使用 typescript 的强制类型转换写法来处理，缺少的字段请你手动补全，就像下面的写法一样。
7. 使用业务对象的字段做赋值时，必须用可选链的方式做判断，做好保险的取值赋值写法。如 `row?.描述 || ""` 写法。
8. 在 `formProps` 内使用准备好数据的 `业务对象`。

```ts
import { type AddFormProps, defaultForm, type 合同类型表单_VO } from "./components/form";
import { useMode, type Mode } from "@/composables/use-mode";
/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();
/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 合同类型_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);
	/** 业务对象 */
	const 合同类型表单_VO: 合同类型表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					类型名称: row?.类型名称 || "",
					是否审核: row?.是否审核 === "是" ? "是" : "否",
					描述: row?.描述 || "",
				})
			: cloneDeep(defaultForm);
	/** 表单组件需要的props */
	const formProps: AddFormProps = {
		form: 合同类型表单_VO,
		defaultValues: 合同类型表单_VO,
	};
	addDialog({
		// 在addDialog内使用formProps时，注意赋值给props。
		props: formProps,
	});
}
```
