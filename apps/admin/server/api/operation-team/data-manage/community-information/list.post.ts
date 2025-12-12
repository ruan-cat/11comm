import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { CommunityInfoListItem, CommunityInfoQueryParams } from "@01s-11comm/type/business/operation-team/data-manage/community-information";
import { mockCommunityInfoData } from "./mock-data";

/**
 * @description 小区信息列表 POST API
 * Community information list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<CommunityInfoListItem>>> => {
	const body = await readBody<CommunityInfoQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, communityId, communityName, province, city, district } = body;

	let filteredData = [...mockCommunityInfoData];

	// 数据筛选
	if (communityId) {
		filteredData = filteredData.filter((item) => item.communityId.includes(communityId));
	}
	if (communityName) {
		filteredData = filteredData.filter((item) => item.communityName.includes(communityName));
	}
	if (province) {
		filteredData = filteredData.filter((item) => item.province === province);
	}
	if (city) {
		filteredData = filteredData.filter((item) => item.city === city);
	}
	if (district) {
		filteredData = filteredData.filter((item) => item.district === district);
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

