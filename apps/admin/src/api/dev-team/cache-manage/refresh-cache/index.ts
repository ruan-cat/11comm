import { useListQuery } from "@/composables/use-list-query";
import type { RefreshCacheListItem, RefreshCacheQueryParams } from "@01s-11comm/type/business/dev-team/cache-manage/refresh-cache";

/**
 * @description 刷新缓存列表查询 Hook
 * Refresh cache list query hook
 */
export function useRefreshCacheListQuery(initialParams?: Partial<RefreshCacheQueryParams>) {
	return useListQuery<RefreshCacheListItem, RefreshCacheQueryParams>({
		queryKeyPrefix: "refresh-cache-list",
		apiUrl: "/api/dev-team/cache-manage/refresh-cache/list",
		initialParams,
	});
}
