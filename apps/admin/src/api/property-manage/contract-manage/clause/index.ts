/**
 * @file 合同条款 API Hook
 * @description Clause API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ClauseListItem, ClauseQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/clause/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "clause";

/**
 * 合同条款列表查询 Hook
 * Clause list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useClauseListQuery(initialParams: Partial<ClauseQueryParams>) {
	return useListQuery<ClauseListItem, ClauseQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useClauseListQuery;
