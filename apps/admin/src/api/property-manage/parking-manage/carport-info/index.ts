/**
 * @file carport-info API Hook
 * @description CarportInfo API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { CarportInfoListItem, CarportInfoQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/parking-manage/carport-info/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "carportInfo";

/**
 * carport-info列表查询 Hook
 * CarportInfo list query hook
 */
export function useCarportInfoListQuery() {
	return useListQuery<CarportInfoListItem, CarportInfoQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useCarportInfoListQuery;
