/**
 * @file issues API Hook
 * @description Issues API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { IssuesListItem, IssuesQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/repairs-manage/issues/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "issues";

/**
 * issues列表查询 Hook
 * Issues list query hook
 */
export function useIssuesListQuery() {
	return useListQuery<IssuesListItem, IssuesQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useIssuesListQuery;
