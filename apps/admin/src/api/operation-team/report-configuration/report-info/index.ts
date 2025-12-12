import { useListQuery } from "@/composables/use-list-query";
import type { ReportInfoListItem, ReportInfoQueryParams } from "@01s-11comm/type/business/operation-team/report-configuration/report-info";

/**
 * @description 报表信息列表查询 Hook
 * Report info list query hook
 */
export function useReportInfoListQuery(initialParams?: Partial<ReportInfoQueryParams>) {
	return useListQuery<ReportInfoListItem, ReportInfoQueryParams>({
		queryKeyPrefix: "report-info-list",
		apiUrl: "/api/operation-team/report-configuration/report-info/list",
		initialParams,
	});
}

