/**
 * @file 系统管理-系统配置-系统配置列表接口
 * @description System config list API
 * POST /api/setting-manage/system-manage/system-config/list
 */

import { defineHandler } from "nitro/h3";
import type { JsonVO, PageDTO, SystemConfig } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { mockSystemConfigData } from "./mock-data";

export default defineHandler(async (): Promise<JsonVO<PageDTO<SystemConfig>>> => {
	// 系统配置只有一个，直接返回
	const pageData = mockSystemConfigData;
	const total = pageData.length;
	const pageIndex = DEFAULT_PAGE_INDEX;
	const pageSize = DEFAULT_PAGE_SIZE;

	// 返回标准格式 - 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<SystemConfig>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: 1,
		},
	};

	return response;
});
