/**
 * @file expense-summary-table API Hook
 * @description ExpenseSummaryTable API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ReportExpenseSummaryTableListItem, ReportExpenseSummaryTableQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/report-manage/expense-summary-table/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "expenseSummaryTable";

/**
 * expense-summary-table列表查询 Hook
 * ExpenseSummaryTable list query hook
 */
export function useExpenseSummaryTableListQuery(initialParams: Partial<ReportExpenseSummaryTableQueryParams>) {
	return useListQuery<ReportExpenseSummaryTableListItem, ReportExpenseSummaryTableQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useExpenseSummaryTableListQuery;
