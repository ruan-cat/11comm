/**
 * @file refund-review API Hook
 * @description RefundReview API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { RefundReviewListItem, RefundReviewQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/refund-review/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "refundReview";

/**
 * refund-review列表查询 Hook
 * RefundReview list query hook
 */
export function useRefundReviewListQuery() {
	return useListQuery<RefundReviewListItem, RefundReviewQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useRefundReviewListQuery;
