/**
 * @file overdue-payment-information API Hook
 * @description OverduePaymentInformation API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OverduePaymentInformationListItem, OverduePaymentInformationQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/overdue-payment-information/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "overduePaymentInformation";

/**
 * overdue-payment-information列表查询 Hook
 * OverduePaymentInformation list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useOverduePaymentInformationListQuery(initialParams: Partial<OverduePaymentInformationQueryParams>) {
	return useListQuery<OverduePaymentInformationListItem, OverduePaymentInformationQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useOverduePaymentInformationListQuery;
