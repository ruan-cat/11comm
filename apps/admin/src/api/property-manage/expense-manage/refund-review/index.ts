/**
 * @file refund-review API Hook
 * @description RefundReview API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { RefundReviewListItem, RefundReviewQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/expense-manage/refund-review/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "refundReview";

/**
 * refund-review列表查询 Hook
 * RefundReview list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useRefundReviewListQuery(initialParams: Partial<RefundReviewQueryParams>) {
	return useListQuery<RefundReviewListItem, RefundReviewQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useRefundReviewListQuery;
