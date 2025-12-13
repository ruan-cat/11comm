/**
 * @file task API Hook
 * @description Task API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { TaskListItem, TaskQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/patrol-manage/task/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "task";

/**
 * task列表查询 Hook
 * Task list query hook
 */
export function useTaskListQuery() {
	return useListQuery<TaskListItem, TaskQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useTaskListQuery;
