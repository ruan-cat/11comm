/**
 * @file 报表信息 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReportInfo, ReportInfoListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/report-configuration/report-info/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reportInfo";

/**
 * 报表信息列表查询 Hook
 * Report info list query hook
 */
export function useReportInfoListQuery(initialParams: Partial<ReportInfoListQuery>) {
	return useListQuery<ReportInfo, ReportInfoListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReportInfoListQuery;
