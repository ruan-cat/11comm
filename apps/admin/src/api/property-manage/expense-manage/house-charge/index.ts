/**
 * @file house-charge API Hook
 * @description HouseCharge API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/house-charge/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "houseCharge";

/**
 * house-charge列表查询 Hook
 * HouseCharge list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useHouseChargeListQuery(initialParams: Partial<HouseChargeQueryParams>) {
	return useListQuery<HouseChargeListItem, HouseChargeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useHouseChargeListQuery;
