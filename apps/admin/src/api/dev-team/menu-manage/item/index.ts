import { useListQuery } from "@/composables/use-list-query";
import type { MenuItemListItem, MenuItemQueryParams } from "@01s-11comm/type/business/dev-team/menu-manage/item";

/**
 * @description 菜单项列表查询 Hook
 * Menu item list query hook
 */
export function useMenuItemListQuery(initialParams?: Partial<MenuItemQueryParams>) {
	return useListQuery<MenuItemListItem, MenuItemQueryParams>({
		queryKeyPrefix: "menu-item-list",
		apiUrl: "/api/dev-team/menu-manage/item/list",
		initialParams,
	});
}
