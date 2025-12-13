/**
 * @file return-visit API Hook
 * @description ReturnVisit API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReturnVisitListItem, ReturnVisitQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/repairs-manage/return-visit/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "returnVisit";

/**
 * return-visit列表查询 Hook
 * ReturnVisit list query hook
 */
export function useReturnVisitListQuery() {
	return useListQuery<ReturnVisitListItem, ReturnVisitQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useReturnVisitListQuery;
