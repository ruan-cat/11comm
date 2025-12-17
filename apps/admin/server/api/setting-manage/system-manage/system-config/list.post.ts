import { defineEventHandler } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { SystemConfig } from "@01s-11comm/type";
import { mockSystemConfigData } from "./mock-data";

/**
 * @description 系统配置列表 POST API
 */
export default defineEventHandler(async (): Promise<JsonVO<PageDTO<SystemConfig>>> => {
	// 系统配置只有一个，直接返回
	const pageData = mockSystemConfigData;
	const total = pageData.length;

	// 返回标准格式
	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex: 1,
			pageSize: 10,
			totalPages: 1,
		},
		timestamp: Date.now(),
	};
});
