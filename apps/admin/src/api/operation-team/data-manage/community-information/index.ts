/**
 * @file 小区信息 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { CommunityInfoListItem, CommunityInfoQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/data-manage/community-information/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "communityInfo";

/**
 * 小区信息列表查询 Hook
 * Community info list query hook
 */
export function useCommunityInfoListQuery(initialParams: Partial<CommunityInfoQueryParams>) {
	return useListQuery<CommunityInfoListItem, CommunityInfoQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useCommunityInfoListQuery;
