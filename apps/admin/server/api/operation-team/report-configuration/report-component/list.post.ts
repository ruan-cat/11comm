/**
 * @file 报表组件列表接口
 * @description Report component list API
 * POST /api/operation-team/report-configuration/report-component/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ReportComponentListItem, ReportComponentQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockReportComponentData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReportComponentListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<ReportComponentQueryParams>(event);
	const defaultParams: ReportComponentQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选 - 使用通用筛选工具函数
	const filteredData = filterDataByQuery(mockReportComponentData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式 - 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ReportComponentListItem>> = {
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
	};

	return response;
});

