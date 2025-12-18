import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ExpenseSummaryTableListItem, ExpenseSummaryTableQueryParams } from "@01s-11comm/type";
import { mockExpenseSummaryTableData } from "./mock-data";

/**
 * @description 费用汇总表列表 POST API
 * ExpenseSummaryTable list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ExpenseSummaryTableListItem>>> => {
	const body = await readBody<ExpenseSummaryTableQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, time, expenseItemId, expenseItemName, status } = body;

	let filteredData = [...mockExpenseSummaryTableData];

	// 数据筛选
	if (time) {
		filteredData = filteredData.filter((item) => item.time.includes(time));
	}
	if (expenseItemId) {
		filteredData = filteredData.filter((item) => item.expenseItemId.includes(expenseItemId));
	}
	if (expenseItemName) {
		filteredData = filteredData.filter((item) => item.expenseItemName.includes(expenseItemName));
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

	// 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 返回标准格式
	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
		timestamp: Date.now(),
	};
});
