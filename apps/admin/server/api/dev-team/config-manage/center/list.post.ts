/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockConfigCenterData } from "./mock-data";
import consola from "consola";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	const body = await readBody<ConfigCenterQueryParams>(event);
	const defaultParams: ConfigCenterQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockConfigCenterData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
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
