/**
 * @file 合同乙方 API Hook
 * @description Second party API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { SecondPartyListItem, SecondPartyQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/second-party/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "secondParty";

/**
 * 合同乙方列表查询 Hook
 * Second party list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useSecondPartyListQuery(initialParams: Partial<SecondPartyQueryParams>) {
	return useListQuery<SecondPartyListItem, SecondPartyQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useSecondPartyListQuery;
