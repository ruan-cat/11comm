/**
 * @file Repair Report Form 列表接口
 * @description Repair Report Form list API
 * POST /api/property-manage/report-manage/repair-report-form/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, RepairReportFormListItem, RepairReportFormQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockRepairReportFormData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RepairReportFormListItem>>> => {
	const body = await readBody<RepairReportFormQueryParams>(event);
	const defaultParams: RepairReportFormQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockRepairReportFormData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<RepairReportFormListItem>> = {
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
