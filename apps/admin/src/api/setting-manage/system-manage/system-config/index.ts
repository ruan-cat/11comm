/**
 * @file 系统配置 API Hook
 * @description System config API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { SystemConfigListItem, SystemConfigQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/setting-manage/system-manage/system-config/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "systemConfig";

/**
 * 系统配置列表查询 Hook
 * System config list query hook
 */
export function useSystemConfigListQuery(initialParams: Partial<SystemConfigQueryParams>) {
	return useListQuery<SystemConfigListItem, SystemConfigQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useSystemConfigListQuery;
