/**
 * @file patrol-report API Hook
 * @description PatrolReport API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PatrolReportListItem, PatrolReportQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/patrol-report/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "patrolReport";

/**
 * patrol-report列表查询 Hook
 * PatrolReport list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function usePatrolReportListQuery(initialParams: Partial<PatrolReportQueryParams>) {
	return useListQuery<PatrolReportListItem, PatrolReportQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePatrolReportListQuery;
