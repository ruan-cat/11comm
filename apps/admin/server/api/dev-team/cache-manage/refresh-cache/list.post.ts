import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { RefreshCacheListItem, RefreshCacheQueryParams } from "@01s-11comm/type";
import { mockRefreshCacheData } from "./mock-data";

/**
 * @description 刷新缓存列表 POST API
 * Refresh cache list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<RefreshCacheListItem>>> => {
	const body = await readBody<RefreshCacheQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, cacheId, cacheCode, cacheName, cacheKey, cacheType, cacheGroup, status, refreshStrategy } = body;

	let filteredData = [...mockRefreshCacheData];

	// 数据筛选
	if (cacheId) {
		filteredData = filteredData.filter((item) => item.cacheId.includes(cacheId));
	}
	if (cacheCode) {
		filteredData = filteredData.filter((item) => item.cacheCode.includes(cacheCode));
	}
	if (cacheName) {
		filteredData = filteredData.filter((item) => item.cacheName.includes(cacheName));
	}
	if (cacheKey) {
		filteredData = filteredData.filter((item) => item.cacheKey.includes(cacheKey));
	}
	if (cacheType) {
		filteredData = filteredData.filter((item) => item.cacheType === cacheType);
	}
	if (cacheGroup) {
		filteredData = filteredData.filter((item) => item.cacheGroup.includes(cacheGroup));
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (refreshStrategy) {
		filteredData = filteredData.filter((item) => item.refreshStrategy === refreshStrategy);
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

