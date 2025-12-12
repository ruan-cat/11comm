import { useListQuery } from "@/composables/use-list-query";
import type { ReportComponentListItem, ReportComponentQueryParams } from "@01s-11comm/type";

/**
 * @description 报表组件列表查询 Hook
 * Report component list query hook
 */
export function useReportComponentListQuery(initialParams?: Partial<ReportComponentQueryParams>) {
	return useListQuery<ReportComponentListItem, ReportComponentQueryParams>({
		queryKeyPrefix: "report-component-list",
		apiUrl: "/api/operation-team/report-configuration/report-component/list",
		initialParams,
	});
}

