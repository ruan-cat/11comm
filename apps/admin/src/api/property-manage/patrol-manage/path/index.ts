/**
 * @file path API Hook
 * @description Path API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PathListItem, PathQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/patrol-manage/path/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "path";

/**
 * path列表查询 Hook
 * Path list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function usePathListQuery(initialParams: Partial<PathQueryParams>) {
	return useListQuery<PathListItem, PathQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePathListQuery;
