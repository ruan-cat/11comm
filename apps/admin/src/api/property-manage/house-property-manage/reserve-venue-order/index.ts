/**
 * @file reserve-venue-order API Hook
 * @description ReserveVenueOrder API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ReserveVenueOrderListItem, ReserveVenueOrderQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/house-property-manage/reserve-venue-order/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reserveVenueOrder";

/**
 * reserve-venue-order列表查询 Hook
 * ReserveVenueOrder list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useReserveVenueOrderListQuery(initialParams: Partial<ReserveVenueOrderQueryParams>) {
	return useListQuery<ReserveVenueOrderListItem, ReserveVenueOrderQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReserveVenueOrderListQuery;
