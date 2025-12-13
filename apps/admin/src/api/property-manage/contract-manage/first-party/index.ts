/**
 * @file first-party API Hook
 * @description FirstParty API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { FirstPartyListItem, FirstPartyQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/first-party/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "firstParty";

/**
 * first-party列表查询 Hook
 * FirstParty list query hook
 */
export function useFirstPartyListQuery() {
	return useListQuery<FirstPartyListItem, FirstPartyQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useFirstPartyListQuery;
