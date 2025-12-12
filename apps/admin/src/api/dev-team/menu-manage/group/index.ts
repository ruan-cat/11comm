import { useListQuery } from "@/composables/use-list-query";
import type { MenuGroupListItem, MenuGroupQueryParams } from "@01s-11comm/type";

/**
 * @description 菜单组列表查询 Hook
 * Menu group list query hook
 */
export function useMenuGroupListQuery(initialParams?: Partial<MenuGroupQueryParams>) {
	return useListQuery<MenuGroupListItem, MenuGroupQueryParams>({
		queryKeyPrefix: "menu-group-list",
		apiUrl: "/api/dev-team/menu-manage/group/list",
		initialParams,
	});
}
