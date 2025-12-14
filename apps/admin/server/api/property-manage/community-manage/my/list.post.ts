import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { MyCommunityListItem, MyCommunityQueryParams } from "@01s-11comm/type";
import { mockMyData } from "./mock-data";

/**
 * @description my列表 POST API
 * My list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<MyCommunityListItem>>> => {
	const body = await readBody<MyCommunityQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, communityName, status, province, city, district, communityCode } = body;

	let filteredData = [...mockMyData];

	// 数据筛选
	if (communityName) {
		filteredData = filteredData.filter((item) => item.communityName.includes(communityName));
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (province) {
		filteredData = filteredData.filter((item) => item.province.includes(province));
	}
	if (city) {
		filteredData = filteredData.filter((item) => item.city.includes(city));
	}
	if (district) {
		filteredData = filteredData.filter((item) => item.district.includes(district));
	}
	if (communityCode) {
		filteredData = filteredData.filter((item) => item.communityCode.includes(communityCode));
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
