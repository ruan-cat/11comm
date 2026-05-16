/**
 * @file reserve-venue API Hook
 * @description ReserveVenue API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ReserveVenueListItem, ReserveVenueQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/house-property-manage/reserve-venue/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reserveVenue";

/**
 * reserve-venue列表查询 Hook
 * ReserveVenue list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useReserveVenueListQuery(initialParams: Partial<ReserveVenueQueryParams>) {
	return useListQuery<ReserveVenueListItem, ReserveVenueQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReserveVenueListQuery;
