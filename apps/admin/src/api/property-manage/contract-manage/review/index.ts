/**
 * @file 合同审核 API Hook
 * @description Review API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ReviewListItem, ReviewQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/review/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "review";

/**
 * 合同审核列表查询 Hook
 * Review list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useReviewListQuery(initialParams: Partial<ReviewQueryParams>) {
	return useListQuery<ReviewListItem, ReviewQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReviewListQuery;
