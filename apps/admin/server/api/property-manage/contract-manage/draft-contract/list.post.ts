import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { DraftContractListItem, DraftContractQueryParams } from "@01s-11comm/type";
import { mockDraftContractData } from "./mock-data";

/**
 * @description draft-contract列表 POST API
 * DraftContract list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<DraftContractListItem>>> => {
	const body = await readBody<DraftContractQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, contractName, contractNumber, contractType, status } = body;

	let filteredData = [...mockDraftContractData];

	// 数据筛选
	if (contractName) {
		filteredData = filteredData.filter((item) => item.contractName.includes(contractName));
	}
	if (contractNumber) {
		filteredData = filteredData.filter((item) => item.contractNumber.includes(contractNumber));
	}
	if (contractType) {
		filteredData = filteredData.filter((item) => item.contractType === contractType);
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
