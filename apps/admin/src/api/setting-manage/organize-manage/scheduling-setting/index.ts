/**
 * @file 组织管理-排班设置 API Hook
 * @description Scheduling setting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { SchedulingSetting, SchedulingSettingListQuery } from "@01s-11comm/type";

/** 排班设置列表 API 路径 */
const LIST_API_URL = "/api/setting-manage/organize-manage/scheduling-setting/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "schedulingSetting";

/**
 * 排班设置列表查询 Hook
 * Scheduling setting list query hook
 */
export function useSchedulingSettingListQuery(initialParams: Partial<SchedulingSettingListQuery>) {
	return useListQuery<SchedulingSetting, SchedulingSettingListQuery>({
		queryKeyPrefix: `${QUERY_KEY_PREFIX}List`,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}
