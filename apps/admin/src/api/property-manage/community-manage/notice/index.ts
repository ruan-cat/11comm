import { useListQuery } from "@/composables/use-list-query";
import type { CommunityNoticeListItem, CommunityNoticeQueryParams } from "@01s-11comm/type";

/**
 * @description 小区公示列表查询 Hook
 * Community notice list query hook
 */
export function useCommunityNoticeListQuery(initialParams?: Partial<CommunityNoticeQueryParams>) {
	return useListQuery<CommunityNoticeListItem, CommunityNoticeQueryParams>({
		queryKeyPrefix: "community-notice-list",
		apiUrl: "/api/property-manage/community-manage/notice/list",
		initialParams,
	});
}
