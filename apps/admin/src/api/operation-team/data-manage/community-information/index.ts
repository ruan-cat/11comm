import { useListQuery } from "@/composables/use-list-query";
import type { CommunityInfoListItem, CommunityInfoQueryParams } from "@01s-11comm/type/business/operation-team/data-manage/community-information";

/**
 * @description 小区信息列表查询 Hook
 * Community information list query hook
 */
export function useCommunityInfoListQuery(initialParams?: Partial<CommunityInfoQueryParams>) {
	return useListQuery<CommunityInfoListItem, CommunityInfoQueryParams>({
		queryKeyPrefix: "community-info-list",
		apiUrl: "/api/operation-team/data-manage/community-information/list",
		initialParams,
	});
}

