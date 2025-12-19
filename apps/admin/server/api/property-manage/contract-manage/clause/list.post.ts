/**
 * @file 合同条款列表接口
 * @description Clause list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, ClauseListItem, ClauseQueryParams } from "@01s-11comm/type";
import { mockClauseData } from "./mock-data";

/**
 * 合同条款列表 POST API
 * Clause list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ClauseListItem>>> => {
	const body = await readBody<ClauseQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, clauseName, clauseNumber, clauseType, applicableContractType, status } = body;

	let filteredData = [...mockClauseData];

	/** 数据筛选 */
	if (clauseName) {
		filteredData = filteredData.filter((item) => item.clauseName.includes(clauseName));
	}
	if (clauseNumber) {
		filteredData = filteredData.filter((item) => item.clauseNumber.includes(clauseNumber));
	}
	if (clauseType) {
		filteredData = filteredData.filter((item) => item.clauseType === clauseType);
	}
	if (applicableContractType) {
		filteredData = filteredData.filter((item) => item.applicableContractType === applicableContractType);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
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
