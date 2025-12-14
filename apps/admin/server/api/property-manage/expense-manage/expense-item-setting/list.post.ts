import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ExpenseItemSettingListItem, ExpenseItemSettingQueryParams } from "@01s-11comm/type";
import { mockExpenseItemSettingData } from "./mock-data";

/**
 * @description expense-item-setting列表 POST API
 * ExpenseItemSetting list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ExpenseItemSettingListItem>>> => {
	const body = await readBody<ExpenseItemSettingQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, code, expenseItem, expenseIdentifier, paymentType, accountDeduction, status } = body;

	let filteredData = [...mockExpenseItemSettingData];

	// 数据筛选
	if (code) {
		filteredData = filteredData.filter((item) => item.code.includes(code));
	}
	if (expenseItem) {
		filteredData = filteredData.filter((item) => item.expenseItem.includes(expenseItem));
	}
	if (expenseIdentifier) {
		filteredData = filteredData.filter((item) => item.expenseIdentifier === expenseIdentifier);
	}
	if (paymentType) {
		filteredData = filteredData.filter((item) => item.paymentType === paymentType);
	}
	if (accountDeduction) {
		filteredData = filteredData.filter((item) => item.accountDeduction === accountDeduction);
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
