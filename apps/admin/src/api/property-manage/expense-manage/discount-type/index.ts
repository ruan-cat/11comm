/**
 * @file discount-type API Hook
 * @description DiscountType API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { DiscountTypeListItem, DiscountTypeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/expense-manage/discount-type/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "discountType";

/**
 * discount-type列表查询 Hook
 * DiscountType list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useDiscountTypeListQuery(initialParams: Partial<DiscountTypeQueryParams>) {
	return useListQuery<DiscountTypeListItem, DiscountTypeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useDiscountTypeListQuery;
