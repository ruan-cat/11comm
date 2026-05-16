/**
 * @file 报表组件 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ReportComponentListItem, ReportComponentQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/operation-team/report-configuration/report-component/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reportComponent";

/**
 * 报表组件列表查询 Hook
 * Report component list query hook
 */
export function useReportComponentListQuery(initialParams: Partial<ReportComponentQueryParams>) {
	return useListQuery<ReportComponentListItem, ReportComponentQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReportComponentListQuery;
