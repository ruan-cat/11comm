import { useListQuery } from "@/composables/use-list-query";
import type { MenuCatalogListItem, MenuCatalogQueryParams } from "@01s-11comm/type/business/dev-team/menu-manage/catalog";

/**
 * @description 菜单目录列表查询 Hook
 * Menu catalog list query hook
 */
export function useMenuCatalogListQuery(initialParams?: Partial<MenuCatalogQueryParams>) {
	return useListQuery<MenuCatalogListItem, MenuCatalogQueryParams>({
		queryKeyPrefix: "menu-catalog-list",
		apiUrl: "/api/dev-team/menu-manage/catalog/list",
		initialParams,
	});
}
