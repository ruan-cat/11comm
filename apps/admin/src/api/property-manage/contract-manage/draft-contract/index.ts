/**
 * @file draft-contract API Hook
 * @description DraftContract API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { DraftContractListItem, DraftContractQueryParamsType } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/draft-contract/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "draft-contract";

/**
 * draft-contract列表查询 Hook
 * DraftContract list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useDraftContractListQuery(initialParams: Partial<DraftContractQueryParamsType>) {
	return useListQuery<DraftContractListItem, DraftContractQueryParamsType>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useDraftContractListQuery;

