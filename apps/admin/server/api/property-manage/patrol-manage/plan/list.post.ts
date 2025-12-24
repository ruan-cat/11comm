/**
 * @file Plan 列表接口
 * @description Plan list API
 * POST /api/property-manage/patrol-manage/plan/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, PatrolPlanListItem, PatrolPlanQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockPlanData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PatrolPlanListItem>>> => {
	const body = await readBody<PatrolPlanQueryParams>(event);
	const defaultParams: PatrolPlanQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockPlanData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<PatrolPlanListItem>> = {
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
