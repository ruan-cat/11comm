/**
 * @file reminder-for-overdue-payments API Hook
 * @description ReminderForOverduePayments API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReminderForOverduePaymentsListItem, ReminderForOverduePaymentsQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/reminder-for-overdue-payments/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reminderForOverduePayments";

/**
 * reminder-for-overdue-payments列表查询 Hook
 * ReminderForOverduePayments list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useReminderForOverduePaymentsListQuery(initialParams: Partial<ReminderForOverduePaymentsQueryParams>) {
	return useListQuery<ReminderForOverduePaymentsListItem, ReminderForOverduePaymentsQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReminderForOverduePaymentsListQuery;
