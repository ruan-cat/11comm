/**
 * @file payment-review API Hook
 * @description PaymentReview API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PaymentReviewListItem, PaymentReviewQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/payment-review/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "paymentReview";

/**
 * payment-review列表查询 Hook
 * PaymentReview list query hook
 */
export function usePaymentReviewListQuery() {
	return useListQuery<PaymentReviewListItem, PaymentReviewQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default usePaymentReviewListQuery;
