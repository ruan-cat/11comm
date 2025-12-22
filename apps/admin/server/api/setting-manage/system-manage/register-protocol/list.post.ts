/**
 * @file 系统管理-注册协议-注册协议列表接口
 * @description Register protocol list API
 * POST /api/setting-manage/system-manage/register-protocol/list
 */

import { defineHandler } from "nitro/h3";
import type { JsonVO, PageDTO, SettingManagementRegisterProtocolDisplay } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { mockRegisterProtocolData } from "./mock-data";

export default defineHandler(async (): Promise<JsonVO<PageDTO<SettingManagementRegisterProtocolDisplay>>> => {
	// 注册协议只有一个，直接返回
	const pageData = mockRegisterProtocolData;
	const total = pageData.length;
	const pageIndex = DEFAULT_PAGE_INDEX;
	const pageSize = DEFAULT_PAGE_SIZE;

	// 返回标准格式 - 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<SettingManagementRegisterProtocolDisplay>> = {
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
