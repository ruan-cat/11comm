/**
 * @file 系统配置 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { OperationTeamSystemConfig, OperationTeamSystemConfigListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/operation-team/system-manage/system-config/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "systemConfig";

/**
 * 系统配置列表查询 Hook
 * System config list query hook
 */
export function useSystemConfigListQuery(initialParams: Partial<OperationTeamSystemConfigListQuery>) {
	return useListQuery<OperationTeamSystemConfig, OperationTeamSystemConfigListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useSystemConfigListQuery;
