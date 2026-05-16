/**
 * @file 缓存刷新查询 Hook
 * @description 提供缓存刷新列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { RefreshCacheListItem, RefreshCacheQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/dev-team/cache-manage/refresh-cache/list", import.meta.env);

/**
 * 获取缓存刷新列表数据
 * Get refresh cache list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useRefreshCacheListQuery(initialParams: Partial<RefreshCacheQueryParams>) {
	return useListQuery<RefreshCacheListItem, RefreshCacheQueryParams>({
		queryKeyPrefix: "devTeam:cacheManage:refreshCache:list",
		apiUrl: API_URL,
		initialParams,
	});
}
