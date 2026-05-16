/**
 * @file 菜单组 API Hook
 * @description Menu group API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { MenuGroupListItem, MenuGroupQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/dev-team/menu-manage/group/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "menuGroup";

/**
 * 菜单组列表查询 Hook
 * Menu group list query hook
 */
export function useMenuGroupListQuery(initialParams: Partial<MenuGroupQueryParams>) {
	return useListQuery<MenuGroupListItem, MenuGroupQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useMenuGroupListQuery;
