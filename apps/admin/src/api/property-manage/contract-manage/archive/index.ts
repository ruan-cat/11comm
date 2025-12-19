/**
 * @file 合同归档 API Hook
 * @description Archive API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ArchiveListItem, ArchiveQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/archive/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "archive";

/**
 * 合同归档列表查询 Hook
 * Archive list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useArchiveListQuery(initialParams: Partial<ArchiveQueryParams>) {
	return useListQuery<ArchiveListItem, ArchiveQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useArchiveListQuery;
