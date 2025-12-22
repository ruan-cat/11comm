/**
 * @file Parking Space Structure Diagram 列表接口
 * @description Parking Space Structure Diagram list API
 * POST /api/property-manage/community-manage/parking-space-structure-diagram/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ParkingSpaceStructureDiagramListItem, ParkingSpaceStructureDiagramQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockParkingSpaceStructureDiagramData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ParkingSpaceStructureDiagramListItem>>> => {
	const body = await readBody<ParkingSpaceStructureDiagramQueryParams>(event);
	const defaultParams: ParkingSpaceStructureDiagramQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockParkingSpaceStructureDiagramData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ParkingSpaceStructureDiagramListItem>> = {
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
