/**
 * @file 组织管理-数据权限 API Hook
 * @description Data permission API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { DataPermission, DataPermissionListQuery } from "@01s-11comm/type";

/** 数据权限列表 API 路径 */
const LIST_API_URL = resolveAdminApiRequestUrl(
	"/api/setting-manage/organize-manage/data-permission/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "dataPermission";

/**
 * 数据权限列表查询 Hook
 * Data permission list query hook
 */
export function useDataPermissionListQuery(initialParams: Partial<DataPermissionListQuery>) {
	return useListQuery<DataPermission, DataPermissionListQuery>({
		queryKeyPrefix: `${QUERY_KEY_PREFIX}List`,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}
