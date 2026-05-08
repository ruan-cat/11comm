/**
 * @file payment-details-form API Hook
 * @description PaymentDetailsForm API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { PaymentDetailsFormListItem, PaymentDetailsFormQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/report-manage/payment-details-form/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "paymentDetailsForm";

/**
 * payment-details-form列表查询 Hook
 * PaymentDetailsForm list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function usePaymentDetailsFormListQuery(initialParams: Partial<PaymentDetailsFormQueryParams>) {
	return useListQuery<PaymentDetailsFormListItem, PaymentDetailsFormQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePaymentDetailsFormListQuery;
