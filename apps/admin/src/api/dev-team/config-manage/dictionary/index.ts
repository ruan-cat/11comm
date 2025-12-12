/**
 * @file 字典管理 API Hook
 * @description Dictionary management API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { DictionaryListItem, DictionaryQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/dev-team/config-manage/dictionary/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "dictionary";

/**
 * 字典列表查询 Hook
 * Dictionary list query hook
 */
export function useDictionaryListQuery() {
	return useListQuery<DictionaryListItem, DictionaryQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useDictionaryListQuery;
