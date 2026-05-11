/**
 * @file owner-vehicle API Hook
 * @description OwnerVehicle API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { OwnerVehicleListItem, OwnerVehicleQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/parking-manage/owner-vehicle/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownerVehicle";

/**
 * owner-vehicle列表查询 Hook
 * OwnerVehicle list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useOwnerVehicleListQuery(initialParams: Partial<OwnerVehicleQueryParams>) {
	return useListQuery<OwnerVehicleListItem, OwnerVehicleQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useOwnerVehicleListQuery;
