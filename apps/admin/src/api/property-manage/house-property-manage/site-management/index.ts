/**
 * @file site-management API Hook
 * @description SiteManagement API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { SiteManagementListItem, SiteManagementQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/site-management/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "siteManagement";

/**
 * site-management列表查询 Hook
 * SiteManagement list query hook
 */
export function useSiteManagementListQuery() {
	return useListQuery<SiteManagementListItem, SiteManagementQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useSiteManagementListQuery;
