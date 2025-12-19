/**
 * @file plan API Hook
 * @description Plan API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PlanListItem, PlanQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/patrol-manage/plan/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "plan";

/**
 * plan列表查询 Hook
 * Plan list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function usePlanListQuery(initialParams: Partial<PlanQueryParams>) {
	return useListQuery<PlanListItem, PlanQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePlanListQuery;
