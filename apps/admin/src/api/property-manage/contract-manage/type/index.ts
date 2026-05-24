/**
 * @file type API Hook
 * @description Type API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { TypeListItem, TypeQueryParams } from "@01s-11comm/type";

/** API 路径 */
export const TYPE_LIST_API_PATH = "/api/property-manage/contract-manage/type/list";
const API_URL = resolveAdminApiRequestUrl(TYPE_LIST_API_PATH, import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "type";

/**
 * type列表查询 Hook
 * Type list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useTypeListQuery(initialParams: Partial<TypeQueryParams>) {
	return useListQuery<TypeListItem, TypeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useTypeListQuery;
