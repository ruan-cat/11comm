/**
 * @file 水电抄表列表接口
 * @description Water and electricity meter reading list API
 * POST /api/property-manage/expense-manage/water-and-electricity-meter-reading/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, WaterAndElectricityMeterReadingListItem, WaterAndElectricityMeterReadingQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockWaterAndElectricityMeterReadingData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<WaterAndElectricityMeterReadingListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<WaterAndElectricityMeterReadingQueryParams>(event);
	const defaultParams: WaterAndElectricityMeterReadingQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选
	const filteredData = filterDataByQuery(mockWaterAndElectricityMeterReadingData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式
	const response: JsonVO<PageDTO<WaterAndElectricityMeterReadingListItem>> = {
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
