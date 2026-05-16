import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { HouseListItem, HouseQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/house-property-manage/house/list", import.meta.env);

/**
 * @description 房屋管理列表查询 Hook
 * House list query hook
 */
export function useHouseListQuery(initialParams: Partial<HouseQueryParams>) {
	return useListQuery<HouseListItem, HouseQueryParams>({
		queryKeyPrefix: "house-list",
		apiUrl: API_URL,
		initialParams,
	});
}
