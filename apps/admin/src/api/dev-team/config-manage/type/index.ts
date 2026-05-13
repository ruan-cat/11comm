/**
 * @file 字典类型管理 API Hook
 * @description Dictionary type management API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { DictionaryTypeListItem, DictionaryTypeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/dev-team/config-manage/type/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "dictionaryType";

/**
 * 字典类型列表查询 Hook
 * Dictionary type list query hook
 */
export function useDictionaryTypeListQuery(initialParams: Partial<DictionaryTypeQueryParams>) {
	return useListQuery<DictionaryTypeListItem, DictionaryTypeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useDictionaryTypeListQuery;
