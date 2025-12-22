import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { MandatoryReturnIssueListItem, MandatoryReturnIssueQueryParams } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockMandatoryReturnIssueData } from "./mock-data";

/**
 * @description mandatory-return-issue列表 POST API
 * MandatoryReturnIssue list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<MandatoryReturnIssueListItem>>> => {
	const body = await readBody<MandatoryReturnIssueQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, name, status } = body;

	// 使用 filterDataByQuery 进行数据筛选
	const filteredData = filterDataByQuery(mockMandatoryReturnIssueData, { name, status });

	// 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 创建响应对象并添加完整类型约束
	const response: JsonVO<PageDTO<MandatoryReturnIssueListItem>> = {
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
