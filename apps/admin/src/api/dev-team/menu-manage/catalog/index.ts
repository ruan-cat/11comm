/**
 * @file 菜单目录 API Hook
 * @description Menu catalog API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MenuCatalogListItem, MenuCatalogQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/dev-team/menu-manage/catalog/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "menuCatalog";

/**
 * 菜单目录列表查询 Hook
 * Menu catalog list query hook
 */
export function useMenuCatalogListQuery() {
	return useListQuery<MenuCatalogListItem, MenuCatalogQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useMenuCatalogListQuery;
