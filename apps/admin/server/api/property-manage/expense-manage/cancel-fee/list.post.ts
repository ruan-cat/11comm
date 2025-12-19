/**
 * @file 取消费物列表接口
 * @description Cancel fee list API
 * POST /api/property-manage/expense-manage/cancel-fee/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, CancelFeeListItem, CancelFeeQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockCancelFeeData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<CancelFeeListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<CancelFeeQueryParams>(event);
	const defaultParams: CancelFeeQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选
	const filteredData = filterDataByQuery(mockCancelFeeData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式
	const response: JsonVO<PageDTO<CancelFeeListItem>> = {
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
