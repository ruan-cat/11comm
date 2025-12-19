/**
 * @file expense-item-setting API Hook
 * @description ExpenseItemSetting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ExpenseItemSettingListItem, ExpenseItemSettingQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/expense-item-setting/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "expenseItemSetting";

/**
 * expense-item-setting列表查询 Hook
 * ExpenseItemSetting list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useExpenseItemSettingListQuery(initialParams: Partial<ExpenseItemSettingQueryParams>) {
	return useListQuery<ExpenseItemSettingListItem, ExpenseItemSettingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useExpenseItemSettingListQuery;
