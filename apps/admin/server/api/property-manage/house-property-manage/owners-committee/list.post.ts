/**
 * @file Owners Committee 列表接口
 * @description Owners Committee list API
 * POST /api/property-manage/house-property-manage/owners-committee/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, OwnersCommitteeListItem, OwnersCommitteeQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockOwnersCommitteeData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnersCommitteeListItem>>> => {
	const body = await readBody<OwnersCommitteeQueryParams>(event);
	const defaultParams: OwnersCommitteeQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockOwnersCommitteeData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<OwnersCommitteeListItem>> = {
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
