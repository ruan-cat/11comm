/**
 * @file 配置项管理 API Hook
 * @description Config item management API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ConfigItemListItem, ConfigItemQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/dev-team/config-manage/item/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "configItem";

/**
 * 配置项列表查询 Hook
 * Config item list query hook
 */
export function useConfigItemListQuery(initialParams: Partial<ConfigItemQueryParams>) {
	return useListQuery<ConfigItemListItem, ConfigItemQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useConfigItemListQuery;
