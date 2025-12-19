/**
 * @file 合同打印列表接口
 * @description Print list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, PrintListItem, PrintQueryParams } from "@01s-11comm/type";
import { mockPrintData } from "./mock-data";

/**
 * 合同打印列表 POST API
 * Print list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<PrintListItem>>> => {
	const body = await readBody<PrintQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, contractName, contractNumber, contractType, printStatus } = body;

	let filteredData = [...mockPrintData];

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
	if (printStatus) {
		filteredData = filteredData.filter((item) => item.printStatus === printStatus);
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
