/**
 * @file discount-setting API Hook
 * @description DiscountSetting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { DiscountSettingListItem, DiscountSettingQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/expense-manage/discount-setting/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "discountSetting";

/**
 * discount-setting列表查询 Hook
 * DiscountSetting list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useDiscountSettingListQuery(initialParams: Partial<DiscountSettingQueryParams>) {
	return useListQuery<DiscountSettingListItem, DiscountSettingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useDiscountSettingListQuery;
