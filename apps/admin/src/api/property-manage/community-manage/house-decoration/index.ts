/**
 * @file 房屋装修 API Hook
 * @description House decoration API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { HouseDecorationListItem, HouseDecorationQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/community-manage/house-decoration/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "houseDecoration";

/**
 * 房屋装修列表查询 Hook
 * House decoration list query hook
 */
export function useHouseDecorationListQuery(initialParams: Partial<HouseDecorationQueryParams>) {
	return useListQuery<HouseDecorationListItem, HouseDecorationQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useHouseDecorationListQuery;
