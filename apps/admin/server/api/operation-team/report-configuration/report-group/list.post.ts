import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReportGroupListItem, ReportGroupQueryParams } from "@01s-11comm/type";
import { mockReportGroupData } from "./mock-data";

/**
 * @description 报表组列表 POST API
 * Report group list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ReportGroupListItem>>> => {
	const body = await readBody<ReportGroupQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, groupId, name, url } = body;

	let filteredData = [...mockReportGroupData];

	// 数据筛选
	if (groupId) {
		filteredData = filteredData.filter((item) => item.groupId.includes(groupId));
	}
	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}
	if (url) {
		filteredData = filteredData.filter((item) => item.url.includes(url));
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

