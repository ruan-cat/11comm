/**
 * @file owner-member API Hook
 * @description OwnerMember API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OwnerMemberListItem, OwnerMemberQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/owner-member/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownerMember";

/**
 * owner-member列表查询 Hook
 * OwnerMember list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useOwnerMemberListQuery(initialParams: Partial<OwnerMemberQueryParams>) {
	return useListQuery<OwnerMemberListItem, OwnerMemberQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useOwnerMemberListQuery;
