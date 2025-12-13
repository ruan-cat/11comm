/**
 * @file owner-vehicle API Hook
 * @description OwnerVehicle API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OwnerVehicleListItem, OwnerVehicleQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/parking-manage/owner-vehicle/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownerVehicle";

/**
 * owner-vehicle列表查询 Hook
 * OwnerVehicle list query hook
 */
export function useOwnerVehicleListQuery() {
	return useListQuery<OwnerVehicleListItem, OwnerVehicleQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useOwnerVehicleListQuery;
