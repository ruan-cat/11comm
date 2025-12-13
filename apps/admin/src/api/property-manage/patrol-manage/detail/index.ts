/**
 * @file detail API Hook
 * @description Detail API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { DetailListItem, DetailQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/patrol-manage/detail/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "detail";

/**
 * detail列表查询 Hook
 * Detail list query hook
 */
export function useDetailListQuery() {
	return useListQuery<DetailListItem, DetailQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useDetailListQuery;
