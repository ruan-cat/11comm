import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, RefreshCacheListItem, RefreshCacheQueryParams } from "@01s-11comm/type";
import { mockRefreshCacheData } from "./mock-data";

/**
 * 刷新缓存列表查询接口
 * POST /api/dev-team/cache-manage/refresh-cache/list
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<RefreshCacheListItem>>> => {
	const body = await readBody<RefreshCacheQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, cacheId, cacheCode, cacheName, cacheKey, cacheType, cacheGroup, status, refreshPolicy } = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockRefreshCacheData];

	if (cacheId) {
		filteredData = filteredData.filter((item) => item.cacheId.toLowerCase().includes(cacheId.toLowerCase()));
	}
	if (cacheCode) {
		filteredData = filteredData.filter((item) => item.cacheCode.toLowerCase().includes(cacheCode.toLowerCase()));
	}
	if (cacheName) {
		filteredData = filteredData.filter((item) => item.cacheName.toLowerCase().includes(cacheName.toLowerCase()));
	}
	if (cacheKey) {
		filteredData = filteredData.filter((item) => item.cacheKey.toLowerCase().includes(cacheKey.toLowerCase()));
	}
	if (cacheType) {
		filteredData = filteredData.filter((item) => item.cacheType === cacheType);
	}
	if (cacheGroup) {
		filteredData = filteredData.filter((item) => item.cacheGroup.toLowerCase().includes(cacheGroup.toLowerCase()));
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (refreshPolicy) {
		filteredData = filteredData.filter((item) => item.refreshPolicy === refreshPolicy);
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<RefreshCacheListItem>> = {
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