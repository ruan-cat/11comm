import { defineEventHandler } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { RegisterProtocol } from "@01s-11comm/type";
import { mockRegisterProtocolData } from "./mock-data";

/**
 * @description 注册协议列表 POST API
 */
export default defineEventHandler(async (): Promise<JsonVO<PageDTO<RegisterProtocol>>> => {
	// 注册协议只有一个，直接返回
	const pageData = mockRegisterProtocolData;
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
