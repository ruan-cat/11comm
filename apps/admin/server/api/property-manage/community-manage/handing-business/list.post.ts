import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { HandingBusinessListItem, HandingBusinessQueryParams } from "@01s-11comm/type";
import { mockHandingBusinessData } from "./mock-data";

/**
 * @description 业务受理列表 POST API
 * Handing business list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<HandingBusinessListItem>>> => {
	const body = await readBody<HandingBusinessQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, feeItem, feeId, feeType, status } = body;

	let filteredData = [...mockHandingBusinessData];

	// 数据筛选
	if (feeItem) {
		filteredData = filteredData.filter((item) => item.feeItem.includes(feeItem));
	}
	if (feeId) {
		filteredData = filteredData.filter((item) => item.feeId.includes(feeId));
	}
	if (feeType) {
		filteredData = filteredData.filter((item) => item.feeType === feeType);
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

