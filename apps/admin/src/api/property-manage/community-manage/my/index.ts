/**
 * @file my API Hook
 * @description My API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MyListItem, MyQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/community-manage/my/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "my";

/**
 * my列表查询 Hook
 * My list query hook
 */
export function useMyListQuery() {
	return useListQuery<MyListItem, MyQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useMyListQuery;
