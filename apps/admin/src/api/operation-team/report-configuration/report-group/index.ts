import { useListQuery } from "@/composables/use-list-query";
import type { ReportGroupListItem, ReportGroupQueryParams } from "@01s-11comm/type/business/operation-team/report-configuration/report-group";

/**
 * @description 报表组列表查询 Hook
 * Report group list query hook
 */
export function useReportGroupListQuery(initialParams?: Partial<ReportGroupQueryParams>) {
	return useListQuery<ReportGroupListItem, ReportGroupQueryParams>({
		queryKeyPrefix: "report-group-list",
		apiUrl: "/api/operation-team/report-configuration/report-group/list",
		initialParams,
	});
}

