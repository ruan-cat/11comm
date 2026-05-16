/**
 * @file return-visit API Hook
 * @description ReturnVisit API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ReturnVisitListItem, ReturnVisitQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/repairs-manage/return-visit/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "returnVisit";

/**
 * return-visit列表查询 Hook
 * ReturnVisit list query hook
 */
export function useReturnVisitListQuery(initialParams: Partial<ReturnVisitQueryParams>) {
	return useListQuery<ReturnVisitListItem, ReturnVisitQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReturnVisitListQuery;
