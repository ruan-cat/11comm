/**
 * @file vehicle-charge API Hook
 * @description VehicleCharge API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { VehicleChargeListItem, VehicleChargeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/vehicle-charge/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "vehicleCharge";

/**
 * vehicle-charge列表查询 Hook
 * VehicleCharge list query hook
 */
export function useVehicleChargeListQuery() {
	return useListQuery<VehicleChargeListItem, VehicleChargeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useVehicleChargeListQuery;
