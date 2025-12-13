/**
 * @file repairs-todo API Hook
 * @description RepairsTodo API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { RepairsTodoListItem, RepairsTodoQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/repairs-manage/repairs-todo/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "repairsTodo";

/**
 * repairs-todo列表查询 Hook
 * RepairsTodo list query hook
 */
export function useRepairsTodoListQuery() {
	return useListQuery<RepairsTodoListItem, RepairsTodoQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useRepairsTodoListQuery;
