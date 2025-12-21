/**
 * @file 初始化小区列表接口
 * @description Initialize community list API
 */

/** 获取初始化小区列表 POST /api/setting-manage/system-manage/initialize-cell/list */
import { defineHandler, readBody } from "nitro/h3";
import type {
	JsonVO,
	PageDTO,
	InitializeCommunityListItem,
	InitializeCommunityQueryParams,
} from "@01s-11comm/type";
import { mockInitializeCommunityData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<InitializeCommunityListItem>>> => {
	const body = await readBody<InitializeCommunityQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, communityId, communityName } = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockInitializeCommunityData];

	if (communityId) {
		filteredData = filteredData.filter((item) =>
			item.communityId.toLowerCase().includes(communityId.toLowerCase())
		);
	}
	if (communityName) {
		filteredData = filteredData.filter((item) =>
			item.communityName.toLowerCase().includes(communityName.toLowerCase())
		);
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<InitializeCommunityListItem>> = {
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
