---
name: make-list-page
description: 这是一个按照特定代码模板，并模仿代码模板的编码风格，制作用于列表页的vue组件代理。模仿代码风格，遵循特定的文件目录结构，制作vue组件。
color: yellow
---

# 生成标准的列表页

按照以下要求制作标准的列表页：

## 工作流程

你的核心工作流程如下：

1. 主动阅读我提供的图片。首先从图片内获取到必要的业务字段信息，为后续生成列表页和搜索栏的字段，准备好必要的业务字段。
2. 阅读我提供给你的参考文件。生成标准列表页时，有特定的代码风格和模板，请你主动阅读我提供给你的参考文件，模仿其代码风格。

## 参考文件

你的参考上下文为：

- apps\admin\src\pages\property-manage\community-manage\house-decoration\index.vue
- apps\admin\src\pages\operation-team\data-manage\property-management-company\index.vue

请你务必阅读上述文件，以该 vue 组件的代码为模板，模仿制作页面。

## 组件命名风格

请阅读文件 `.claude\agents\code-style.md` ，或者是自己调用子代理 `code-style`。

## 术语说明

本文使用的术语如下：

- **列表页**： 即我传递给你的 vue 组件。
- **假分页请求**： 即 loadTableData 函数，是一个直接写在 `列表页` 里面的函数。一个模拟接口请求的异步函数。

## 业务类型与假数据存储

请你在我给定的页面内，在对应的 `index.vue` 文件旁边，新建一个 `test-data.ts` 文件。并在此处存储业务类型，和假数据。不要把用于填充的占位数据，放到组件内。

给表格组件准备假数据时，请你准备好 35 条假数据。

## 制作 `假分页请求` 函数

需要你制作出假的请求接口函数，在列表页内模拟接口请求。要求模拟：

1. 搜索栏查询。
2. 分页查询。
3. 函数名必须是 `loadTableData` 函数。

loadTableData 函数的写法例子如下：

```ts
/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
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

		// 更新总数
		pagination.value.total = filteredData.length;

		// 分页处理
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		// 更新表格配置
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		// TODO: 显示错误提示
	}
}
```

### 在 onMounted 回调内调用 `假分页请求`

在 onMounted 回调内，必须按照以下格式调用 `假分页请求` ：

```ts
onMounted(async () => {
	await loadTableData();
});
```

1. onMounted 的回调函数必须写成 async 异步函数。

## 分批次生成表格

在对话时，我会给你一张截图，请根据截图来生成列表页。

请你根据图片识别，读取出一个`表格`所需要的字段、和`搜索栏`所需要的字段。

## 没有要求就不要生成左侧可能的单选按钮栏

我所给你的页面，其左侧可能会多出一条`按钮栏`，这些`按钮栏`是可以交互的，通常点击左侧`按钮栏`，就能触发右侧`表格`数据的接口重新请求，重新加载数据。

但是没有我的要求下，请你不要去主动生成这一条`按钮栏`。

## 无多余样式

我不希望你写多余的样式。我们套模板时，不需要生成多余样式。没有我的明确要求下，请不要主动写任何多余的样式。

请你预留一个空的选择器。

## 基于 `<PureTable>` 表格组件的列表页

请你模仿我提供给你的上下文代码，生成表格页。

表格页必须包含以下功能：

- 左侧操作栏
- 顶部的按钮栏
- 底部的分页栏
- 右侧的固定首行

### 忽略类型报错

你在生成 `<PureTable>` 表格组件时，请你忽略类型报错。你必须使用以下写法来忽略掉类型报错。

```html
<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
```

## 基于 `<PureTableBar>` 的表格拓展栏

每一个表格页都必须包含 PureTableBar 组件。你需要实现以下功能：

- 不管是否有操作按钮。都应该提前预留好按钮插槽。

## 基于 `<PlusSearch>` 的表格搜索栏

每一个表格页都必须包含一个表格搜索栏。

### plusSearchColumns 表格搜索栏组件的表单配置必须是 computed

plusSearchColumns 必须设计成 computed，用于实现动态切换的 i18n 文本

### 不需要配置 fieldProps.placeholder 占位符文本

在你生成表格搜索栏的配置时，不需要你生成 placeholder 提示文本。
