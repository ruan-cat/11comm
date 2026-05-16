/**
 * @file site-management API Hook
 * @description SiteManagement API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { SiteManagementListItem, SiteManagementQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/house-property-manage/site-management/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "siteManagement";

/**
 * site-management列表查询 Hook
 * SiteManagement list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useSiteManagementListQuery(initialParams: Partial<SiteManagementQueryParams>) {
	return useListQuery<SiteManagementListItem, SiteManagementQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useSiteManagementListQuery;
