/**
 * @file 初始化小区 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { InitializeCell, InitializeCellListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/system-manage/initialize-cell/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "initializeCell";

/**
 * 初始化小区列表查询 Hook
 * Initialize cell list query hook
 */
export function useInitializeCellListQuery(initialParams: Partial<InitializeCellListQuery>) {
	return useListQuery<InitializeCell, InitializeCellListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useInitializeCellListQuery;
