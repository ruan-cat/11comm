/**
 * @file point API Hook
 * @description Point API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { PointListItem, PointQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/patrol-manage/point/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "point";

/**
 * point列表查询 Hook
 * Point list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function usePointListQuery(initialParams: Partial<PointQueryParams>) {
	return useListQuery<PointListItem, PointQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePointListQuery;
