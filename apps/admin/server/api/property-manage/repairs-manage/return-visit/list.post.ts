import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReturnVisitListItem, ReturnVisitQueryParams } from "@01s-11comm/type";
import { mockReturnVisitData } from "./mock-data";

/**
 * @description return-visit列表 POST API
 * ReturnVisit list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ReturnVisitListItem>>> => {
	const body = await readBody<ReturnVisitQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, name, status } = body;

	let filteredData = [...mockReturnVisitData];

	// 数据筛选
	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
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
