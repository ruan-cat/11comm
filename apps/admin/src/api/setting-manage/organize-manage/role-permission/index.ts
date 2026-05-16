/**
 * @file 组织管理-角色权限 API Hook
 * @description Role permission API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { RolePermission, RolePermissionListQuery } from "@01s-11comm/type";

/** 角色权限列表 API 路径 */
const LIST_API_URL = resolveAdminApiRequestUrl(
	"/api/setting-manage/organize-manage/role-permission/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "rolePermission";

/**
 * 角色权限列表查询 Hook
 * Role permission list query hook
 */
export function useRolePermissionListQuery(initialParams: Partial<RolePermissionListQuery>) {
	return useListQuery<RolePermission, RolePermissionListQuery>({
		queryKeyPrefix: `${QUERY_KEY_PREFIX}List`,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}
