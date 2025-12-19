/**
 * @file discount-apply API Hook
 * @description DiscountApply API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { DiscountApplyListItem, DiscountApplyQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/discount-apply/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "discountApply";

/**
 * discount-apply列表查询 Hook
 * DiscountApply list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useDiscountApplyListQuery(initialParams: Partial<DiscountApplyQueryParams>) {
	return useListQuery<DiscountApplyListItem, DiscountApplyQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useDiscountApplyListQuery;
