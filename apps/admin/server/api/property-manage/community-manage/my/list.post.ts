/**
 * @file 我的小区列表接口
 * @description My community list API
 * POST /api/property-manage/community-manage/my/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, MyCommunityListItem, MyCommunityQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockMyData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<MyCommunityListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<MyCommunityQueryParams>(event);
	const defaultParams: MyCommunityQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选 - 使用通用筛选工具函数
	const filteredData = filterDataByQuery(mockMyData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式 - 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<MyCommunityListItem>> = {
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
