/**
 * @file expire API Hook
 * @description Expire API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ExpireListItem, ExpireQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/expire/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "expire";

/**
 * expire列表查询 Hook
 * Expire list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useExpireListQuery(initialParams: Partial<ExpireQueryParams>) {
	return useListQuery<ExpireListItem, ExpireQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useExpireListQuery;
