/**
 * @file change API Hook
 * @description Change API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ChangeListItem, ChangeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/change/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "change";

/**
 * change列表查询 Hook
 * Change list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useChangeListQuery(initialParams: Partial<ChangeQueryParams>) {
	return useListQuery<ChangeListItem, ChangeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useChangeListQuery;
