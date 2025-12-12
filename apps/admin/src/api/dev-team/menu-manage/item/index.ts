/**
 * @file 菜单项 API Hook
 * @description Menu item API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MenuItemListItem, MenuItemQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/dev-team/menu-manage/item/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "menuItem";

/**
 * 菜单项列表查询 Hook
 * Menu item list query hook
 */
export function useMenuItemListQuery() {
	return useListQuery<MenuItemListItem, MenuItemQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useMenuItemListQuery;
