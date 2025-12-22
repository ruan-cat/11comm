import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReturnVisitListItem, ReturnVisitQueryParams } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockReturnVisitData } from "./mock-data";

/**
 * @description return-visit列表 POST API
 * ReturnVisit list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReturnVisitListItem>>> => {
	const body = await readBody<ReturnVisitQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, name, status } = body;

	// 使用 filterDataByQuery 进行数据筛选
	const filteredData = filterDataByQuery(mockReturnVisitData, { name, status });

	// 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 创建响应对象并添加完整类型约束
	const response: JsonVO<PageDTO<ReturnVisitListItem>> = {
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

	return response;
});
