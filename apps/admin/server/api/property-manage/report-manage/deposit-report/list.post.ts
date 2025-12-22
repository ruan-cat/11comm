import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { DepositReportListItem, DepositReportQueryParams } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockDepositReportData } from "./mock-data";

/**
 * @description deposit-report列表 POST API
 * DepositReport list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<DepositReportListItem>>> => {
	const body = await readBody<DepositReportQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, 费用ID, 状态 } = body;

	// 使用 filterDataByQuery 进行数据筛选
	const filteredData = filterDataByQuery(mockDepositReportData, { 费用ID, 状态 });

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
