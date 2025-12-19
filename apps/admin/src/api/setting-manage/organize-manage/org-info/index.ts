/**
 * @file 组织信息 API Hook
 * @description Organization info API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { Employee, EmployeeListQuery, OrganizationTreeNode, JsonVO } from "@01s-11comm/type";
import { useQuery } from "@tanstack/vue-query";
import { http } from "@/utils/http";

/** 员工列表 API 路径 */
const LIST_API_URL = "/api/setting-manage/organize-manage/org-info/list";
/** 组织树 API 路径 */
const TREE_API_URL = "/api/setting-manage/organize-manage/org-info/tree";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "orgInfo";

/**
 * 员工列表查询 Hook
 * Employee list query hook
 */
export function useEmployeeListQuery(initialParams: Partial<EmployeeListQuery>) {
	return useListQuery<Employee, EmployeeListQuery>({
		queryKeyPrefix: `${QUERY_KEY_PREFIX}List`,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/**
 * 组织树查询 Hook
 */
export function useOrganizationTreeQuery() {
	return useQuery({
		queryKey: [`${QUERY_KEY_PREFIX}Tree`],
		queryFn: () => http.request<JsonVO<OrganizationTreeNode[]>>("post", TREE_API_URL),
		select: (data) => data.data,
	});
}
