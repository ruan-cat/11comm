/**
 * @file point API Hook
 * @description Point API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PointListItem, PointQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/patrol-manage/point/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "point";

/**
 * point列表查询 Hook
 * Point list query hook
 */
export function usePointListQuery() {
	return useListQuery<PointListItem, PointQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default usePointListQuery;
