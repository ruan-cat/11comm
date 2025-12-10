---
name: make-list-page
description: 这是一个按照特定代码模板，并模仿代码模板的编码风格，制作用于列表页的vue组件代理。模仿代码风格，遵循特定的文件目录结构，制作vue组件。
color: yellow
---

# 生成标准列表页

请深度思考。并按照以下要求制作标准的列表页。

## 1. 工作流程

你的核心工作流程如下：

1. 主动阅读我提供的图片。首先从图片内获取到必要的业务字段信息，为后续生成列表页和搜索栏的字段，准备好必要的业务字段。
2. 如果我没有给你提供任何截图，那么你就不需要提取业务字段信息了。跳过这部分。
3. 阅读我提供给你的参考文件。生成标准列表页时，有特定的代码风格和模板，请你主动阅读我提供给你的参考文件，模仿其代码风格。
4. 总结出参考文件的代码风格。
5. 仔细阅读本文档的编码要求。
6. 深度的，全面的阅读我提供的代码文件，通常是列表页文件。请深度思考，自主分析，对比我提供给你的目标列表页文件，和本文档所要求的差异。深度思考其差异项，并按照本文档和参考文件的代码风格，修改我提供给你的列表页文件。

## 2. 参考资料

### 2.1 本地参考文件

请你**务必阅读**以下文件，以该 vue 组件的代码为模板，模仿制作页面。

1. 房屋装修 标准模板
   - 列表页 apps\admin\src\pages\property-manage\community-manage\house-decoration\index.vue
   - 假数据 apps\admin\src\pages\property-manage\community-manage\house-decoration\test-data.ts
2. 物业公司 标准模板
   - 列表页 apps\admin\src\pages\operation-team\data-manage\property-management-company\index.vue
   - 假数据 apps\admin\src\pages\operation-team\data-manage\property-management-company\test-data.ts
   - 表单组件 apps\admin\src\pages\operation-team\data-manage\property-management-company\components\form.vue
   - 表单类型 apps\admin\src\pages\operation-team\data-manage\property-management-company\components\form.ts
3. 小区公示 标准模板
   - 文件夹目录 apps\admin\src\pages\property-manage\community-manage\notice
   - 列表页 index.vue
   - 假数据 test-data.ts
   - 表单组件 components\form.vue
   - 表单类型 components\form.ts

### 2.2 云端参考资料

你**必须**先用 fetch 工具，读取一下 url 站点的文档，否则接下来的任务你将缺少上下文，导致你无法完成任务。

- [`plus-pro-components` 的 `FormItemValueType` 类型](https://github.com/plus-pro-components/plus-pro-components/blob/dev/docs/components/type.md#formitemvaluetype)

## 3. 注意事项

在你运行这个子代理的时候，或者是直接按照要求阅读此文件的时候，请注意以下注意事项：

1. 不要运行任何类型检查命令，不要做任何主动的类型检查。
2. 不要运行任何格式化命令。
3. **不增加额外的业务字段** ： 不要随意地给业务代码增加字段，不要增加额外的字段。
4. **保留中文字段名** ： 不要更改掉字段的命名。如果字段本身的名称就是中文名，那就`保留中文名`。除非你收到明确的指令要求你更换掉中文命名的字段名，否则你就原样`保留中文字段名`。

## 4. 术语说明

本文使用的术语如下：

- **列表页**： 即我传递给你的 vue 组件。
- **假分页请求**： 即 `loadTableData` 函数，是一个直接写在 `列表页` 里面的函数。一个模拟接口请求的异步函数。
- **假数据文件**： 即 `列表页` 旁边的 `test-data.ts` 文件。用于存放各种在前端层面写死的假数据。
- **表格列配置**： 即表格组件渲染的关键配置。该配置实现表格的表头、操作栏配置等。

## 5. 明确目录结构

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
3. 对于本文件来说，你要重点处理的是 `index.vue` 列表页文件 和 `test-data.ts` 假数据文件。至于其他文件，你可以新建一个空文件，或不处理。其他文件交由其他子代理处理即可。你会在适当的时候阅读他们。

## 6. 组件命名风格

请阅读文件 `.claude\agents\code-style.md` ，或者是自己调用 `code-style` 代码风格子代理。

## 7. 用 `假数据文件` `test-data.ts` 来存储业务类型与假数据

1. 请你在我给定的页面内，在对应的 `index.vue` 文件旁边，新建一个 `test-data.ts` 文件。并在此处存储业务类型，和假数据。不要把用于填充的占位数据，放到组件内。
2. 给表格组件准备假数据时，请你准备好 35 条假数据。

### 7.1 存储表格组件的假数据

在 `假数据文件` 存储表格数据时。需要满足以下要求：

1. 定义业务类型用中文来定义。
2. 对外返回名为 `tableData` 的业务类型数组。该数据包含了表格组件需要使用的假数据。

### 7.2 存储下拉列表使用的假数据

1. 如果 `plusSearchColumns` 表格搜索栏组件 的 下拉列表有选项，请你将下拉列表的数据也一并存储在 `假数据文件` 内。
2. 在对下拉列表数据做类型约束时，请使用 `plus-pro-components` 包提供的 `OptionsType` 类型来约束下拉列表数组。

```ts
import { type OptionsType } from "plus-pro-components";
```

3. 使用 `OptionsType` 类型约束的下拉列表数组，例子如下：

```ts
/** 组件类型选项 */
export const 组件类型Options: OptionsType = [
	{ label: "表格", value: "表格" },
	{ label: "饼状图", value: "饼状图" },
	{ label: "柱状图", value: "柱状图" },
	{ label: "折线图", value: "折线图" },
	{ label: "数据卡片", value: "数据卡片" },
];

/** 查询方式选项 */
export const 查询方式Options: OptionsType = [
	{ label: "SQL", value: "sql" },
	{ label: "JAVA", value: "java" },
];
```

4. 下拉列表数组的变量名命名规则为： `*Options` ，比如 `查询方式Options` 、 `组件类型Options` 这样的。

### 7.3 不允许使用函数的形式批量生成

针对 tableData 数组，该数组必须是一个字面量数组。不允许使用函数生成的方式，生成数组。必须使用字面量的形式，直接写数组元素出来。

## 8. 制作并使用 loadTableData `假分页请求` 函数

需要你制作出假的请求接口函数，在列表页内模拟接口请求。要求模拟以下行为：

1. 搜索栏查询。
2. 分页查询。
3. 函数名必须是 `loadTableData` 函数。

`loadTableData` 函数的写法例子如下：

```ts
/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.小区ID) {
			filteredData = filteredData.filter((item) => item.小区ID.includes(plusSearchModel.value.小区ID!));
		}
		if (plusSearchModel.value.小区名称) {
			filteredData = filteredData.filter((item) => item.小区名称.includes(plusSearchModel.value.小区名称!));
		}
		if (plusSearchModel.value.省) {
			filteredData = filteredData.filter((item) => item.省份 === plusSearchModel.value.省);
		}
		if (plusSearchModel.value.城市) {
			filteredData = filteredData.filter((item) => item.城市 === plusSearchModel.value.城市);
		}
		if (plusSearchModel.value.区县) {
			filteredData = filteredData.filter((item) => item.区县 === plusSearchModel.value.区县);
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}
```

### 8.1 在 onMounted 回调内调用 `假分页请求`

在 onMounted 回调内，必须按照以下格式调用 `假分页请求` ：

```ts
onMounted(async () => {
	await loadTableData();
});
```

1. 每个列表页必须提供 onMounted 生命周期函数。如果没有，就补全。
2. onMounted 必须写在整个脚本的最下面。
3. onMounted 的回调函数必须写成 async 异步函数。

### 8.2 不需要增加任何加载等待效果

不需要你增加任何 loading 加载效果。直接在 `假分页请求` 内拆分数据。

## 9. 列表页必须提供的变量和函数

这里将整个列表页一定会提供的变量和函数，都列举出来。

1. 你在生成列表页时，请直接照搬照抄这些代码即可。
2. 在你处理列表页时，列表页本身就可能有了以下函数或变量，请你按照各自的要求，做替换或者是更改。

### 9.1 重置搜索条件并重新加载数据 `handleReSearch`

直接照搬替换即可，以本文档的代码写法为主。

```ts
/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}
```

### 9.2 执行搜索 `handleSearch`

直接照搬替换即可，以本文档的代码写法为主。

```ts
/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}
```

### 9.3 假分页请求 `loadTableData`

参考 [制作并使用 loadTableData `假分页请求` 函数](#8-制作并使用-loadtabledata-假分页请求-函数) 部分。

### 9.4 分页配置 `pagination`

直接照搬替换即可，以本文档的代码写法为主。

```ts
/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});
```

### 9.5 处理页数变化 `handlePageSizeChange`

直接照搬替换即可，以本文档的代码写法为主。

```ts
/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}
```

### 9.6 处理页码变化 `handleCurrentPageChange`

直接照搬替换即可，以本文档的代码写法为主。

```ts
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}
```

### 9.7 表格搜索栏组件配置 `plusSearchProps`

直接照搬替换即可，以本文档的代码写法为主。

1. `defaultValues` 必须要使用 `plusSearchDefaultValues` 变量。
2. columns 表单配置，**必须留空**。此部分配置交由其他变量专门配置。
3. labelWidth 默认为 140
4. labelPosition 默认为 right
5. showNumber 固定为 3

```ts
/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});
```

### 9.8 表格搜索栏重置功能用的默认数据 `plusSearchDefaultValues` 和其他相关的变量

以下面的写法为参考例子，请不要无条件的照搬照抄，请注意根据业务场景做修改：

1. 必须按照以下例子所示，使用**固定的** jsdoc 注释文本。
2. 必须按照要求，在列表页内定义以下这几个变量：
   - plusSearchModelRef
   - plusSearchDefaultValues
   - plusSearchModel
3. 这几个变量是高度耦合的，定义时请不要拆分到各处，必须都写在一起。统一代码写法，便于阅读。
4. 必须定义 `plusSearchModelRef` 变量。其中类型约束必须是 `FieldValues & 具体的业务类型` 的形式。这个变量不允许被响应式包装。
5. `FieldValues` 类型是全局类型，请你直接使用即可，无需考虑如何导入。
6. `plusSearchDefaultValues` 将作为搜索栏要默认重置的数据，初始化的时候必须经过一次深克隆，确保数据绝对纯净。
7. plusSearchModel 是双向绑定的变量，用 plusSearchModelRef 加上 vue 的 ref 做二次封装。

```ts
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 物业公司_列表查询_VO = {
	物业编号: "",
	物业名称: "",
	物业电话: "",
};
/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);
```

## 10. 分批次生成表格

1. 在对话时，我会给你一张截图，请根据截图来生成列表页。
2. 请你根据图片识别，读取出一个`表格`所需要的字段、和`搜索栏`所需要的字段。
3. 如果我没有提供给你截图，请跳过此部分。

## 11. 没有要求就不要生成左侧可能的单选按钮栏

1. 我所给你的页面，其左侧可能会多出一条`按钮栏`，这些`按钮栏`是可以交互的，通常点击左侧`按钮栏`，就能触发右侧`表格`数据的接口重新请求，重新加载数据。
2. 但是没有我的要求下，请你不要去主动生成这一条`按钮栏`。

## 12. 不要准备任何样式，不要编写任何样式

在你生成列表页时，请你不要编写任何样式。样式这一块就保留这样的写法即可。留空。

在没有得到任何样式优化的任务时，你处理的列表页组件，其样式就是默认留空的。

```html
<style lang="scss" scoped>
	.index-root {
	}
</style>
```

## 13. 表格列配置 `columns`

在表格组件中，`columns` 用来配置表格列的表头、操作栏等关键表格信息。

### 13.1 `表格列配置` 的首列必须是 序号列配置

例子如下：

```ts
/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "报表编号",
		prop: "报表编号",
		width: 120,
	},
	{
		label: "报表组",
		prop: "报表组",
		width: 150,
	},
	{
		label: "选项标题",
		prop: "选项标题",
		width: 150,
	},
	{
		label: "描述",
		prop: "描述",
		minWidth: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);
```

1. 其首列**必须是** `defaultPureTableIndexColumn` 配置。
2. 这是一个全局配置。你直接使用即可。**不需要**你手动导入该变量。
3. 首列已经默认配置了 fixed 固定列配置。如果你看到第二列的配置包含了 fixed 配置。请务必移除掉该配置，避免冗余配置。

### 13.2 `表格列配置` 不允许使用其他的配置

如下错误例子所示，`表格列配置` 能允许配置的项很严格，不允许配置其他类型的表格列。

```ts
/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	/** 不应该增加其他类型的表格列！ 这会导致表格渲染出现严重的故障！ */
	{
		type: "selection",
		width: 55,
		reserveSelection: true,
	},
	{
		label: "报表编号",
		prop: "报表编号",
		width: 120,
	},
	{
		label: "报表组",
		prop: "报表组",
		width: 150,
	},
]);
```

### 13.3 在 `表格列配置` 内使用 i18n 函数的规范

如果你打算使用 i18n 函数来获取文本，请你使用以下写法来调用 i18n ：

错误的例子：

在这个例子内，label 标签是不会因为 i18n 而实现全局变化的。

```ts
/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantNumber")),
		prop: "商户编号",
		width: 120,
		fixed: true,
	},
	/** 更多表列配置…… */
]);
```

正确的例子：

应该用 headerRenderer 搭配函数的方式来使用 i18n 文本。

```ts
/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		headerRenderer: () => transformI18n($t("operation-team_merchant-manage.merchant-info.merchantNumber")),
		prop: "商户编号",
		width: 120,
		fixed: true,
	},
	/** 更多表列配置…… */
]);
```

### 13.4 不需要总是去准备表格表头的 i18n 文本

直接准备好平时常用的中文文本即可，并不需要每一个表头都要应用 i18n 文本。比如以下例子就是可以接受的：

```ts
/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "商户编号",
		prop: "商户编号",
		width: 120,
		fixed: true,
	},
	/** 更多表列配置…… */
]);
```

### 13.5 优先使用中文

如果 `表格列配置` 的 label 项本来就准备好了中文，那么你就不需要主动增加 i18n 翻译。

### 13.6 表格操作栏的标题必须用 i18n 函数

表格操作栏，其标题**必须使用固定的 i18n 函数写法**。如下例子：

```ts
/** 表格列配置 */
const columns = ref<TableColumnList>([
	/** ... 其他配置 */
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);
```

1. 必须使用 i18n 函数来渲染表头。
2. 宽度**必须是** width 。不允许使用 minWidth 。

## 14. 基于 `<PureTable>` 表格组件的列表页

请你模仿我提供给你的上下文代码，生成表格页。

表格页必须包含以下功能：

- 左侧操作栏
- 顶部的按钮栏
- 底部的分页栏
- 右侧的固定首行

### 14.1 忽略类型报错

你在生成 `<PureTable>` 表格组件时，请你忽略类型报错。你**必须**使用以下写法来忽略掉类型报错。

```html
<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
```

### 14.2 使用 `<PureTable>` 表格组件

在列表页内使用 `<PureTable>` 组件时，一定是在 `<PureTableBar>` 组件的插槽内使用的。例子如下：

```vue
<template>
	<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
		<template #buttons>
			<!-- 某些按钮... -->
		</template>

		<template #default="{ size, dynamicColumns }">
			<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
			<PureTable
				:="pureTableProps"
				:columns="dynamicColumns"
				:size="size"
				@page-size-change="handlePageSizeChange"
				@page-current-change="handleCurrentPageChange"
			>
				<template #operation="{ row }">
					<!-- 某些按钮... -->
				</template>
			</PureTable>
		</template>
	</PureTableBar>
</template>
```

**必须**满足以下的格式要求：

1. `<PureTable>` 组件必须在 `<PureTableBar>` 组件的 default 默认插槽内使用。
2. `<PureTable>` 组件必须使用 `<PureTableBar>` 组件 default 默认插槽所暴露出的 size 和 dynamicColumns 这两个变量。必须分别用到 size 和 columns 属性上。
3. 必须使用 `@page-size-change` 和 `@page-current-change` 这两个分页事件，且不允许使用别的分页事件了。
4. 分页事件的函数名必须为统一的 `handlePageSizeChange` 和 `handleCurrentPageChange` ，哪怕预留一个空的异步函数，也必须预留好这两个固定名称的空函数。
5. 不允许在 `<PureTable>` 组件上直接使用 `v-loading` 指令。该组件的加载等待效果交给别的手段实现。

## 15. 基于 `<PureTableBar>` 的表格拓展栏

每一个列表页都必须包含 `<PureTableBar>` 组件。你需要实现以下功能：

- 不管是否有操作按钮。都应该提前预留好按钮插槽。

## 16. 基于 `<PlusSearch>` 的表格搜索栏

每一个表格页都必须包含一个表格搜索栏。

### 16.1 `PlusColumn` 类型与搜索栏配置字段

在你给搜索栏配置字段时，你会使用到全局类型 `PlusColumn` ，该类型是全局导入的类型，不需要你手动导入。

配置字段时，你需要配置正确的 `valueType` ，请你使用合适的工具，主动阅读以下网站地址，读懂该字段应该如何配置。

字段 `valueType` 使用的是 `plus-pro-components` 的 `FormItemValueType` 类型。

### 16.2 `plusSearchColumns` 表格搜索栏组件的表单配置必须是 `computed`

1. `plusSearchColumns` 必须设计成 `computed` ，用于实现动态切换的 `i18n` 文本

### 16.3 `plusSearchColumns` 的 `jsdoc` 注释必须提供额外的说明注释

`plusSearchColumns` 需要提供明确的 `issue` 链接，告诉其他人为什么要写成 `computed` 的形式。其 `jsdoc` 格式如下例子：

错误例子：

```ts
/** 表格搜索栏组件 表单配置 */
```

正确例子：

```ts
/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
```

你有且只能写固定的 `@see https://github.com/plus-pro-components/plus-pro-components/issues/184` 注释。不能胡编乱造，照抄即可。

### 16.4 搜索栏字段不需要在 `fieldProps` 内配置任何 `type`

**不需要**你为了数值类型的搜索栏而实现专门的配置。请参考以下例子：

错误的例子：

```ts
/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 物业电话 */
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.phone")),
		prop: "物业电话",
		valueType: "input",
		fieldProps: {
			type: "number",
		},
	},
]);
```

正确的例子：

不需要在 `fieldProps` 内配置任何 `type` 。

```ts
/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 物业电话 */
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.phone")),
		prop: "物业电话",
		valueType: "input",
	},
]);
```

### 16.5 不需要配置 `fieldProps.placeholder` 占位符文本

在你生成表格搜索栏的配置时，不需要你生成 placeholder 提示文本。比如以下例子：

错误例子：

```ts
/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 商户名称 */
	{
		label: "商户名称",
		prop: "商户名称",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入商户名称",
		},
	},
]);
```

正确例子：

不需要配置 `fieldProps.placeholder` 占位符文本。

```ts
/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 商户名称 */
	{ label: "商户名称", prop: "商户名称", valueType: "input" },
]);
```

### 16.6 `<PlusSearch>` 表格搜索栏的组件写法

必须按照以下方式来编写 `<PlusSearch>` 组件，必须提供以下内容：

```vue
<template>
	<PlusSearch
		v-model="plusSearchModel"
		:="plusSearchProps"
		:columns="plusSearchColumns"
		@search="handleSearch"
		@reset="handleReSearch"
	/>
</template>
```

其中，`<PlusSearch>` 表格搜索栏组件相关的变量与函数如下：

- plusSearchModel
- plusSearchProps
- plusSearchColumns
- handleSearch
- handleReSearch

请你自主学习模仿上述写法。

## 17. 其他杂项要求

1. 检查列表页代码是否已经存在 `<!-- {{ plusSearchModel }} -->` 注释，如果存在就删除。
2. 检查列表页代码是否已经存在 `<h2>XXXX</h2>` 的标题，如果模板内存在，就删除。列表页代码不需要占位符。
