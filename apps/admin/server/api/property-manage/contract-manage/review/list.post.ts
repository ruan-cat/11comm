/**
 * @file 合同审核列表接口
 * @description Review list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, ReviewListItem, ReviewQueryParams } from "@01s-11comm/type";
import { mockReviewData } from "./mock-data";

/**
 * 合同审核列表 POST API
 * Review list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ReviewListItem>>> => {
	const body = await readBody<ReviewQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, contractName, contractNumber, contractType, reviewStatus, submitter } = body;

	let filteredData = [...mockReviewData];

	/** 数据筛选 */
	if (contractName) {
		filteredData = filteredData.filter((item) => item.contractName.includes(contractName));
	}
	if (contractNumber) {
		filteredData = filteredData.filter((item) => item.contractNumber.includes(contractNumber));
	}
	if (contractType) {
		filteredData = filteredData.filter((item) => item.contractType === contractType);
	}
	if (reviewStatus) {
		filteredData = filteredData.filter((item) => item.reviewStatus === reviewStatus);
	}
	if (submitter) {
		filteredData = filteredData.filter((item) => item.submitter.includes(submitter));
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
