/**
 * @file my API Hook
 * @description My API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { MyCommunityListItem, MyCommunityQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/community-manage/my/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "my";

/**
 * my列表查询 Hook
 * My list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useMyListQuery(initialParams: Partial<MyCommunityQueryParams>) {
	return useListQuery<MyCommunityListItem, MyCommunityQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useMyListQuery;
