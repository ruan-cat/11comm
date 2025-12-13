/**
 * @file repairs-have-done API Hook
 * @description RepairsHaveDone API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { RepairsHaveDoneListItem, RepairsHaveDoneQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/repairs-manage/repairs-have-done/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "repairsHaveDone";

/**
 * repairs-have-done列表查询 Hook
 * RepairsHaveDone list query hook
 */
export function useRepairsHaveDoneListQuery() {
	return useListQuery<RepairsHaveDoneListItem, RepairsHaveDoneQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useRepairsHaveDoneListQuery;
