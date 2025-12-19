/**
 * @file fee-reminder API Hook
 * @description FeeReminder API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { FeeReminderListItem, FeeReminderQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/fee-reminder/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "feeReminder";

/**
 * fee-reminder列表查询 Hook
 * FeeReminder list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useFeeReminderListQuery(initialParams: Partial<FeeReminderQueryParams>) {
	return useListQuery<FeeReminderListItem, FeeReminderQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useFeeReminderListQuery;
