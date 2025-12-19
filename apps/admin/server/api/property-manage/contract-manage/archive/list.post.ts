/**
 * @file 合同归档列表接口
 * @description Archive list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, ArchiveListItem, ArchiveQueryParams } from "@01s-11comm/type";
import { mockArchiveData } from "./mock-data";

/**
 * 合同归档列表 POST API
 * Archive list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ArchiveListItem>>> => {
	const body = await readBody<ArchiveQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, contractName, contractNumber, contractType, partyA, partyB, archiveNumber, status } = body;

	let filteredData = [...mockArchiveData];

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
	if (partyA) {
		filteredData = filteredData.filter((item) => item.partyA.includes(partyA));
	}
	if (partyB) {
		filteredData = filteredData.filter((item) => item.partyB.includes(partyB));
	}
	if (archiveNumber) {
		filteredData = filteredData.filter((item) => item.archiveNumber.includes(archiveNumber));
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
