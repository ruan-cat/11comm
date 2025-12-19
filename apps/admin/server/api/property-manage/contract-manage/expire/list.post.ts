import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ExpireListItem, ExpireQueryParams } from "@01s-11comm/type";
import { mockExpireData } from "./mock-data";

/**
 * @description expire列表 POST API
 * Expire list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<ExpireListItem>>> => {
	const body = await readBody<ExpireQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, contractName, contractNumber, contractType, processingStatus } = body;

	let filteredData = [...mockExpireData];

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
	if (processingStatus) {
		filteredData = filteredData.filter((item) => item.processingStatus === processingStatus);
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
