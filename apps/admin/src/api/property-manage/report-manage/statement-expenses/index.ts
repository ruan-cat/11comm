/**
 * @file statement-expenses API Hook
 * @description StatementExpenses API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { StatementExpensesListItem, StatementExpensesQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/statement-expenses/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "statementExpenses";

/**
 * statement-expenses列表查询 Hook
 * StatementExpenses list query hook
 */
export function useStatementExpensesListQuery() {
	return useListQuery<StatementExpensesListItem, StatementExpensesQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useStatementExpensesListQuery;
