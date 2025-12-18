/**
 * @file 配置中心 API Hook
 * @description Configuration center API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/dev-team/config-manage/center/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "configCenter";

/**
 * 配置中心列表查询 Hook
 * Configuration center list query hook
 */
export function useConfigCenterListQuery(initialParams?: Partial<ConfigCenterQueryParams>) {
	return useListQuery<ConfigCenterListItem, ConfigCenterQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useConfigCenterListQuery;
