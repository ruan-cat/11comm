/**
 * @file reserve-venue API Hook
 * @description ReserveVenue API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReserveVenueListItem, ReserveVenueQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/reserve-venue/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reserveVenue";

/**
 * reserve-venue列表查询 Hook
 * ReserveVenue list query hook
 */
export function useReserveVenueListQuery() {
	return useListQuery<ReserveVenueListItem, ReserveVenueQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useReserveVenueListQuery;
