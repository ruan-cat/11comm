/**
 * @file owner-payment-details API Hook
 * @description OwnerPaymentDetails API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OwnerPaymentDetailsListItem, OwnerPaymentDetailsQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/owner-payment-details/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownerPaymentDetails";

/**
 * owner-payment-details列表查询 Hook
 * OwnerPaymentDetails list query hook
 */
export function useOwnerPaymentDetailsListQuery() {
	return useListQuery<OwnerPaymentDetailsListItem, OwnerPaymentDetailsQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useOwnerPaymentDetailsListQuery;
