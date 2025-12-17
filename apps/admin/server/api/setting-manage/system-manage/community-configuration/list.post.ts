import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { CommunityConfiguration, CommunityConfigurationListQuery } from "@01s-11comm/type";
import { mockCommunityConfigurationData } from "./mock-data";

/**
 * @description 小区配置列表 POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<CommunityConfiguration>>> => {
	const body = await readBody<CommunityConfigurationListQuery>(event);
	const {
		pageIndex = 1,
		pageSize = 10,
		communityName,
		settingName,
		settingType,
		statusCd,
	} = body;

	let filteredData = [...mockCommunityConfigurationData];

	// 数据筛选
	if (communityName) {
		filteredData = filteredData.filter((item) => item.communityName.includes(communityName));
	}
	if (settingName) {
		filteredData = filteredData.filter((item) => item.settingName.includes(settingName));
	}
	if (settingType) {
		filteredData = filteredData.filter((item) => item.settingType === settingType);
	}
	if (statusCd) {
		filteredData = filteredData.filter((item) => item.statusCd === statusCd);
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
