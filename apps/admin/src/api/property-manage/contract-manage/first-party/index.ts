/**
 * @file first-party API Hook
 * @description FirstParty API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { FirstPartyListItem, FirstPartyQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/first-party/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "first-party";

/**
 * first-party列表查询 Hook
 * FirstParty list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useFirstPartyListQuery(initialParams: Partial<FirstPartyQueryParams>) {
	return useListQuery<FirstPartyListItem, FirstPartyQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useFirstPartyListQuery;
