/**
 * @file discount-setting API Hook
 * @description DiscountSetting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { DiscountSettingListItem, DiscountSettingQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/discount-setting/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "discountSetting";

/**
 * discount-setting列表查询 Hook
 * DiscountSetting list query hook
 */
export function useDiscountSettingListQuery() {
	return useListQuery<DiscountSettingListItem, DiscountSettingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useDiscountSettingListQuery;
