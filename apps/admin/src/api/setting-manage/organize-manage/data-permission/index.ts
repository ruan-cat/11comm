/**
 * @file 组织管理-数据权限 API Hook
 * @description Data permission API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { DataPermission, DataPermissionListQuery } from "@01s-11comm/type";

/** 数据权限列表 API 路径 */
const LIST_API_URL = "/api/setting-manage/organize-manage/data-permission/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "dataPermission";

/**
 * 数据权限列表查询 Hook
 */
export function useDataPermissionListQuery() {
	return useListQuery<DataPermission, DataPermissionListQuery>({
		queryKeyPrefix: `${QUERY_KEY_PREFIX}List`,
		apiUrl: LIST_API_URL,
	});
}
