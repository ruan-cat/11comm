/**
 * @file expense-summary-table API Hook
 * @description ExpenseSummaryTable API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ExpenseSummaryTableListItem, ExpenseSummaryTableQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/expense-summary-table/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "expenseSummaryTable";

/**
 * expense-summary-table列表查询 Hook
 * ExpenseSummaryTable list query hook
 */
export function useExpenseSummaryTableListQuery() {
	return useListQuery<ExpenseSummaryTableListItem, ExpenseSummaryTableQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useExpenseSummaryTableListQuery;
