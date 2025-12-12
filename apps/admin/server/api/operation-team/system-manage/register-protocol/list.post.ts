/**
 * @file 注册协议列表接口
 * @description Register protocol list API
 */

/** 获取注册协议列表 POST /api/operation-team/system-manage/register-protocol/list */
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, RegisterProtocolListItem, RegisterProtocolQueryParams } from "@01s-11comm/type";
import { mockRegisterProtocolData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RegisterProtocolListItem>>> => {
	const body = await readBody<RegisterProtocolQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, protocolName, protocolType, status, isMandatory } = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockRegisterProtocolData];

	if (protocolName) {
		filteredData = filteredData.filter((item) => item.protocolName.toLowerCase().includes(protocolName.toLowerCase()));
	}
	if (protocolType) {
		filteredData = filteredData.filter((item) => item.protocolType === protocolType);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (isMandatory) {
		filteredData = filteredData.filter((item) => item.isMandatory === isMandatory);
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<RegisterProtocolListItem>> = {
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
