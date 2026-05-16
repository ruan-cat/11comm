/**
 * @file 字典管理 API Hook
 * @description Dictionary management API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { DictionaryListItem, DictionaryQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/dev-team/config-manage/dictionary/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "dictionary";

/**
 * 字典列表查询 Hook
 * Dictionary list query hook
 */
export function useDictionaryListQuery(initialParams: Partial<DictionaryQueryParams>) {
	return useListQuery<DictionaryListItem, DictionaryQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useDictionaryListQuery;
