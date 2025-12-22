/**
 * @file Vehicle Charge 列表接口
 * @description Vehicle Charge list API
 * POST /api/property-manage/expense-manage/vehicle-charge/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, VehicleChargeListItem, VehicleChargeQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockVehicleChargeData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<VehicleChargeListItem>>> => {
	const body = await readBody<VehicleChargeQueryParams>(event);
	const defaultParams: VehicleChargeQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockVehicleChargeData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<VehicleChargeListItem>> = {
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
