/**
 * @file 小区配置列表接口
 * @description Community configuration list API
 */

/** 获取小区配置列表 POST /api/operation-team/system-manage/community-configuration/list */
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, CommunityConfigListItem, CommunityConfigQueryParams } from "@01s-11comm/type";
import { mockCommunityConfigData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<CommunityConfigListItem>>> => {
	const body = await readBody<CommunityConfigQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, communityId, communityName, settingName, settingType, statusCd } = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockCommunityConfigData];

	if (communityId) {
		filteredData = filteredData.filter((item) => item.communityId.toLowerCase().includes(communityId.toLowerCase()));
	}
	if (communityName) {
		filteredData = filteredData.filter((item) => item.communityName.toLowerCase().includes(communityName.toLowerCase()));
	}
	if (settingName) {
		filteredData = filteredData.filter((item) => item.settingName.toLowerCase().includes(settingName.toLowerCase()));
	}
	if (settingType) {
		filteredData = filteredData.filter((item) => item.settingType === settingType);
	}
	if (statusCd) {
		filteredData = filteredData.filter((item) => item.statusCd === statusCd);
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<CommunityConfigListItem>> = {
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
