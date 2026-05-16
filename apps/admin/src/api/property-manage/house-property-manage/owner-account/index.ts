/**
 * @file 业主账户 API Hook
 * @description OwnerAccount API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { OwnerAccountListItem, OwnerAccountQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/house-property-manage/owner-account/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownerAccount";

/**
 * 业主账户列表查询 Hook
 * OwnerAccount list query hook
 */
export function useOwnerAccountListQuery(initialParams: Partial<OwnerAccountQueryParams>) {
	return useListQuery<OwnerAccountListItem, OwnerAccountQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useOwnerAccountListQuery;
