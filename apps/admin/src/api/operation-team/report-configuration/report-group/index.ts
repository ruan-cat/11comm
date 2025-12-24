/**
 * @file 报表组 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReportGroupListItem, ReportGroupQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/report-configuration/report-group/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reportGroup";

/**
 * 报表组列表查询 Hook
 * Report group list query hook
 */
export function useReportGroupListQuery(initialParams: Partial<ReportGroupQueryParams>) {
	return useListQuery<ReportGroupListItem, ReportGroupQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReportGroupListQuery;
