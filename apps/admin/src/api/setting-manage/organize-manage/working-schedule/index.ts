/**
 * @file 组织管理-排班表 API Hook
 * @description Working schedule API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { WorkingSchedule, WorkingScheduleListQuery } from "@01s-11comm/type";

/** 排班表列表 API 路径 */
const LIST_API_URL = "/api/setting-manage/organize-manage/working-schedule/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "workingSchedule";

/**
 * 排班表列表查询 Hook
 */
export function useWorkingScheduleListQuery() {
	return useListQuery<WorkingSchedule, WorkingScheduleListQuery>({
		queryKeyPrefix: `${QUERY_KEY_PREFIX}List`,
		apiUrl: LIST_API_URL,
	});
}
