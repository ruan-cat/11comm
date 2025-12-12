import { useListQuery } from "@/composables/use-list-query";
import type { HandingBusinessListItem, HandingBusinessQueryParams } from "@01s-11comm/type/business/property-manage/community-manage/handing-business";

/**
 * @description 业务受理列表查询 Hook
 * Handing business list query hook
 */
export function useHandingBusinessListQuery(initialParams?: Partial<HandingBusinessQueryParams>) {
	return useListQuery<HandingBusinessListItem, HandingBusinessQueryParams>({
		queryKeyPrefix: "handing-business-list",
		apiUrl: "/api/property-manage/community-manage/handing-business/list",
		initialParams,
	});
}

