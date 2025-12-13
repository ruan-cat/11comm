/**
 * @file owner-account API Hook
 * @description OwnerAccount API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OwnerAccountListItem, OwnerAccountQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/owner-account/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownerAccount";

/**
 * owner-account列表查询 Hook
 * OwnerAccount list query hook
 */
export function useOwnerAccountListQuery() {
	return useListQuery<OwnerAccountListItem, OwnerAccountQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useOwnerAccountListQuery;
