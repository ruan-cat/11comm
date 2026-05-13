/**
 * @file statement-expenses API Hook
 * @description StatementExpenses API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { StatementExpensesListItem, StatementExpensesQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/report-manage/statement-expenses/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "statementExpenses";

/**
 * statement-expenses列表查询 Hook
 * StatementExpenses list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useStatementExpensesListQuery(initialParams: Partial<StatementExpensesQueryParams>) {
	return useListQuery<StatementExpensesListItem, StatementExpensesQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useStatementExpensesListQuery;
