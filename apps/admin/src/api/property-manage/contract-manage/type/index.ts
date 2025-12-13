/**
 * @file type API Hook
 * @description Type API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { TypeListItem, TypeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/type/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "type";

/**
 * type列表查询 Hook
 * Type list query hook
 */
export function useTypeListQuery() {
	return useListQuery<TypeListItem, TypeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useTypeListQuery;
