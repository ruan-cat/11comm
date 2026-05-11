/**
 * @file carport-apply API Hook
 * @description CarportApply API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { CarportApplyListItem, CarportApplyQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/parking-manage/carport-apply/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "carportApply";

/**
 * carport-apply列表查询 Hook
 * CarportApply list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useCarportApplyListQuery(initialParams: Partial<CarportApplyQueryParams>) {
	return useListQuery<CarportApplyListItem, CarportApplyQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useCarportApplyListQuery;
