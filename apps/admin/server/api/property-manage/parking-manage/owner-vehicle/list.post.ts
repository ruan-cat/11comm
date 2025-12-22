/**
 * @file Owner Vehicle 列表接口
 * @description Owner Vehicle list API
 * POST /api/property-manage/parking-manage/owner-vehicle/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, OwnerVehicleListItem, OwnerVehicleQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockOwnerVehicleData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnerVehicleListItem>>> => {
	const body = await readBody<OwnerVehicleQueryParams>(event);
	const defaultParams: OwnerVehicleQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockOwnerVehicleData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<OwnerVehicleListItem>> = {
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
