/**
 * @file 小区配置 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { CommunityConfiguration, CommunityConfigurationListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/operation-team/system-manage/community-configuration/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "communityConfiguration";

/**
 * 小区配置列表查询 Hook
 * Community configuration list query hook
 */
export function useCommunityConfigurationListQuery(initialParams: Partial<CommunityConfigurationListQuery>) {
	return useListQuery<CommunityConfiguration, CommunityConfigurationListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

/**
 * 小区配置列表查询 Hook (别名)
 * Community configuration list query hook (alias)
 */
export const useCommunityConfigListQuery = useCommunityConfigurationListQuery;

export default useCommunityConfigurationListQuery;
