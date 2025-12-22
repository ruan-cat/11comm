/**
 * @file 报表组件 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReportComponent, ReportComponentListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/report-configuration/report-component/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reportComponent";

/**
 * 报表组件列表查询 Hook
 * Report component list query hook
 */
export function useReportComponentListQuery(initialParams: Partial<ReportComponentListQuery>) {
	return useListQuery<ReportComponent, ReportComponentListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReportComponentListQuery;
