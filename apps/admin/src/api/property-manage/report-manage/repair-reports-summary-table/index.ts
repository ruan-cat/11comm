/**
 * @file repair-reports-summary-table API Hook
 * @description RepairReportsSummaryTable API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { RepairReportsSummaryTableListItem, RepairReportsSummaryTableQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/repair-reports-summary-table/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "repairReportsSummaryTable";

/**
 * repair-reports-summary-table列表查询 Hook
 * RepairReportsSummaryTable list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useRepairReportsSummaryTableListQuery(initialParams: Partial<RepairReportsSummaryTableQueryParams>) {
	return useListQuery<RepairReportsSummaryTableListItem, RepairReportsSummaryTableQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useRepairReportsSummaryTableListQuery;
