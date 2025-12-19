/**
 * @file 抄表类型列表接口
 * @description Meter reading type list API
 * POST /api/property-manage/expense-manage/meter-reading-type/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, MeterReadingTypeListItem, MeterReadingTypeQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockMeterReadingTypeData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<MeterReadingTypeListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<MeterReadingTypeQueryParams>(event);
	const defaultParams: MeterReadingTypeQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选
	const filteredData = filterDataByQuery(mockMeterReadingTypeData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式
	const response: JsonVO<PageDTO<MeterReadingTypeListItem>> = {
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
