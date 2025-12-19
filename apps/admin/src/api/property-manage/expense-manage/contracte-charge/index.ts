/**
 * @file contracte-charge API Hook
 * @description ContracteCharge API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ContracteChargeListItem, ContracteChargeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/contracte-charge/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "contracteCharge";

/**
 * contracte-charge列表查询 Hook
 * ContracteCharge list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useContracteChargeListQuery(initialParams: Partial<ContracteChargeQueryParams>) {
	return useListQuery<ContracteChargeListItem, ContracteChargeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useContracteChargeListQuery;
