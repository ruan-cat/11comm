/**
 * @file 菜单组 API Hook
 * @description Menu group API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MenuGroupListItem, MenuGroupQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/dev-team/menu-manage/group/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "menuGroup";

/**
 * 菜单组列表查询 Hook
 * Menu group list query hook
 */
export function useMenuGroupListQuery() {
	return useListQuery<MenuGroupListItem, MenuGroupQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useMenuGroupListQuery;
