/**
 * @file reserve-venue-order API Hook
 * @description ReserveVenueOrder API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReserveVenueOrderListItem, ReserveVenueOrderQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/reserve-venue-order/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reserveVenueOrder";

/**
 * reserve-venue-order列表查询 Hook
 * ReserveVenueOrder list query hook
 */
export function useReserveVenueOrderListQuery() {
	return useListQuery<ReserveVenueOrderListItem, ReserveVenueOrderQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useReserveVenueOrderListQuery;
