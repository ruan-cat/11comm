import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { CommunityNoticeListItem, CommunityNoticeQueryParams } from "@01s-11comm/type";
import { mockCommunityNoticeData } from "./mock-data";

/**
 * @description 小区公示列表 POST API
 * Community notice list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<CommunityNoticeListItem>>> => {
	const body = await readBody<CommunityNoticeQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, noticeTitle, noticeType } = body;

	let filteredData = [...mockCommunityNoticeData];

	// 数据筛选
	if (noticeTitle) {
		filteredData = filteredData.filter((item) => item.noticeTitle.includes(noticeTitle));
	}
	if (noticeType) {
		filteredData = filteredData.filter((item) => item.noticeType === noticeType);
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

