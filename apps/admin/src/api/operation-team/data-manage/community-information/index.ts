/**
 * @file 小区信息 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { CommunityInformation, CommunityInformationListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/data-manage/community-information/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "communityInformation";

/**
 * 小区信息列表查询 Hook
 * Community information list query hook
 */
export function useCommunityInformationListQuery(initialParams: Partial<CommunityInformationListQuery>) {
	return useListQuery<CommunityInformation, CommunityInformationListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useCommunityInformationListQuery;
