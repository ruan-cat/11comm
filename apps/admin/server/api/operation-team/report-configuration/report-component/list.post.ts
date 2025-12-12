import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReportComponentListItem, ReportComponentQueryParams } from "@01s-11comm/type";
import { mockReportComponentData } from "./mock-data";

/**
 * @description 报表组件列表 POST API
 * Report component list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ReportComponentListItem>>> => {
	const body = await readBody<ReportComponentQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, componentId, componentName, componentType, queryMethod } = body;

	let filteredData = [...mockReportComponentData];

	// 数据筛选
	if (componentId) {
		filteredData = filteredData.filter((item) => item.componentId.includes(componentId));
	}
	if (componentName) {
		filteredData = filteredData.filter((item) => item.componentName.includes(componentName));
	}
	if (componentType) {
		filteredData = filteredData.filter((item) => item.componentType === componentType);
	}
	if (queryMethod) {
		filteredData = filteredData.filter((item) => item.queryMethod === queryMethod);
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

