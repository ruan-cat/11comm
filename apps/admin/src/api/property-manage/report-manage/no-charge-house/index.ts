/**
 * @file no-charge-house API Hook
 * @description NoChargeHouse API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { NoChargeHouseListItem, NoChargeHouseQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/no-charge-house/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "noChargeHouse";

/**
 * no-charge-house列表查询 Hook
 * NoChargeHouse list query hook
 */
export function useNoChargeHouseListQuery() {
	return useListQuery<NoChargeHouseListItem, NoChargeHouseQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useNoChargeHouseListQuery;
