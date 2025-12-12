import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { SystemConfigListItem, SystemConfigQueryParams } from "@01s-11comm/type";
import { mockSystemConfigData } from "./mock-data";

/**
 * @description 系统配置列表 POST API
 * System config list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<SystemConfigListItem>>> => {
	const body = await readBody<SystemConfigQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, configName, configType, configGroup, status } = body;

	let filteredData = [...mockSystemConfigData];

	// 数据筛选
	if (configName) {
		filteredData = filteredData.filter((item) => item.configName.includes(configName));
	}
	if (configType) {
		filteredData = filteredData.filter((item) => item.configType === configType);
	}
	if (configGroup) {
		filteredData = filteredData.filter((item) => item.configGroup === configGroup);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

	// 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 返回标准格式
	return {
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
		timestamp: Date.now(),
	};
});

