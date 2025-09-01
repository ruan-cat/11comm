# 在列表页内对接接口

::: tip

TODO: 需要被迁移改写成具体的提示词 但是现在 apifox 的接口返回的 mock 配置很不合适，故不做处理。

这里仅仅是存储已经设计好的写法。但几乎不使用。

:::

```ts
const {
	execute: queryReportGroupListExecute,
	data: queryReportGroupListData,
	isLoading: queryReportGroupListIsLoading,
} = queryReportGroupList({
	onSuccess(data) {
		tableData.value = data.data.rows;
	},
	onError(error) {
		console.error("查询报表组列表失败:", error);
	},
});

async function doQueryReportGroupListExecute() {
	const params: ReportGroupQueryParams = {
		pageIndex: pagination.value.currentPage,
		pageSize: pagination.value.pageSize,
	};
	Object.keys(plusSearchModel.value).forEach((key) => {
		if (!isEmpty(plusSearchModel.value[key])) {
			params[key] = plusSearchModel.value[key];
		}
	});
	await queryReportGroupListExecute({ params });
}
```
