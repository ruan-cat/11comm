/**
 * @file parking-lot API Hook
 * @description ParkingLot API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ParkingLotListItem, ParkingLotQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/parking-manage/parking-lot/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "parkingLot";

/**
 * parking-lot列表查询 Hook
 * ParkingLot list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useParkingLotListQuery(initialParams: Partial<ParkingLotQueryParams>) {
	return useListQuery<ParkingLotListItem, ParkingLotQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useParkingLotListQuery;
