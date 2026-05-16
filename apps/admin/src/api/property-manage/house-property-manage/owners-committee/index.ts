/**
 * @file owners-committee API Hook
 * @description OwnersCommittee API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { OwnersCommitteeListItem, OwnersCommitteeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/house-property-manage/owners-committee/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownersCommittee";

/**
 * owners-committee列表查询 Hook
 * OwnersCommittee list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useOwnersCommitteeListQuery(initialParams: Partial<OwnersCommitteeQueryParams>) {
	return useListQuery<OwnersCommitteeListItem, OwnersCommitteeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useOwnersCommitteeListQuery;
