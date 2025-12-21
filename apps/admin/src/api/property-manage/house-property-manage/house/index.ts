import { useListQuery } from "@/composables/use-list-query";
import type { HouseListItem, HouseQueryParams } from "@01s-11comm/type";

/**
 * @description 房屋管理列表查询 Hook
 * House list query hook
 */
export function useHouseListQuery(initialParams: Partial<HouseQueryParams>) {
	return useListQuery<HouseListItem, HouseQueryParams>({
		queryKeyPrefix: "house-list",
		apiUrl: "/api/property-manage/house-property-manage/house/list",
		initialParams,
	});
}
