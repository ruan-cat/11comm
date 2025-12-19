/**
 * @file outstanding-fees-analysis API Hook
 * @description OutstandingFeesAnalysis API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OutstandingFeesAnalysisListItem, OutstandingFeesAnalysisQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/outstanding-fees-analysis/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "outstandingFeesAnalysis";

/**
 * outstanding-fees-analysis列表查询 Hook
 * OutstandingFeesAnalysis list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useOutstandingFeesAnalysisListQuery(initialParams: Partial<OutstandingFeesAnalysisQueryParams>) {
	return useListQuery<OutstandingFeesAnalysisListItem, OutstandingFeesAnalysisQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useOutstandingFeesAnalysisListQuery;
