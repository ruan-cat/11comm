/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";
import { mockConfigCenterData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	const body = await readBody<ConfigCenterQueryParams>(event);
	const defaultParams: ConfigCenterQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const { pageIndex = 1, pageSize = 10, ...filters } = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockConfigCenterData];

	if (filters?.configName) {
		filteredData = filteredData.filter((item) => item.configName.includes(filters.configName!));
	}
	if (filters?.configType) {
		filteredData = filteredData.filter((item) => item.configType === filters.configType);
	}
	if (filters?.status) {
		filteredData = filteredData.filter((item) => item.status === filters.status);
	}
	if (filters?.configKey) {
		filteredData = filteredData.filter((item) => item.configKey.includes(filters.configKey!));
	}

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
