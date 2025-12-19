import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { StatementExpensesListItem, StatementExpensesQueryParams } from "@01s-11comm/type";
import { mockStatementExpensesData } from "./mock-data";

/**
 * @description statement-expenses列表 POST API
 * StatementExpenses list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<StatementExpensesListItem>>> => {
	const body = await readBody<StatementExpensesQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, community, ownerName, expenseType, expenseStatus } = body;

	let filteredData = [...mockStatementExpensesData];

	// 数据筛选
	if (community) {
		filteredData = filteredData.filter((item) => item.community.includes(community));
	}
	if (ownerName) {
		filteredData = filteredData.filter((item) => item.ownerName.includes(ownerName));
	}
	if (expenseType) {
		filteredData = filteredData.filter((item) => item.expenseType === expenseType);
	}
	if (expenseStatus) {
		filteredData = filteredData.filter((item) => item.expenseStatus === expenseStatus);
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
