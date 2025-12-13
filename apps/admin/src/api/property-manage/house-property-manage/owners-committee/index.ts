/**
 * @file owners-committee API Hook
 * @description OwnersCommittee API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OwnersCommitteeListItem, OwnersCommitteeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/owners-committee/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownersCommittee";

/**
 * owners-committee列表查询 Hook
 * OwnersCommittee list query hook
 */
export function useOwnersCommitteeListQuery() {
	return useListQuery<OwnersCommitteeListItem, OwnersCommitteeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useOwnersCommitteeListQuery;
