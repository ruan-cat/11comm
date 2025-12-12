/**
 * @file 初始化单元格列表接口
 * @description Initialize cell list API
 */

/** 获取初始化单元格列表 POST /api/operation-team/system-manage/initialize-cell/list */
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, InitializeCellListItem, InitializeCellQueryParams } from "@01s-11comm/type";
import { mockInitializeCellData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<InitializeCellListItem>>> => {
	const body = await readBody<InitializeCellQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, cellName, cellType, buildingName, status } = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockInitializeCellData];

	if (cellName) {
		filteredData = filteredData.filter((item) => item.cellName.toLowerCase().includes(cellName.toLowerCase()));
	}
	if (cellType) {
		filteredData = filteredData.filter((item) => item.cellType === cellType);
	}
	if (buildingName) {
		filteredData = filteredData.filter((item) => item.buildingName.toLowerCase().includes(buildingName.toLowerCase()));
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<InitializeCellListItem>> = {
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
