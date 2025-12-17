/**
 * @file 小区配置 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { CommunityConfiguration, CommunityConfigurationListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/setting-manage/system-manage/community-configuration/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "communityConfiguration";

/**
 * 小区配置列表查询 Hook
 */
export function useCommunityConfigurationListQuery() {
	return useListQuery<CommunityConfiguration, CommunityConfigurationListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useCommunityConfigurationListQuery;
