import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { CommunityNoticeListItem, CommunityNoticeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/community-manage/notice/list", import.meta.env);

/**
 * @description 小区公示列表查询 Hook
 * Community notice list query hook
 */
export function useCommunityNoticeListQuery(initialParams: Partial<CommunityNoticeQueryParams>) {
	return useListQuery<CommunityNoticeListItem, CommunityNoticeQueryParams>({
		queryKeyPrefix: "community-notice-list",
		apiUrl: API_URL,
		initialParams,
	});
}
