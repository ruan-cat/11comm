/**
 * @file 班次设置 API Hook
 * @description Shift setting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ShiftSettingListItem, ShiftSettingQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/setting-manage/organize-manage/shift-setting/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "shiftSetting";

/**
 * 班次设置列表查询 Hook
 * Shift setting list query hook
 */
export function useShiftSettingListQuery(initialParams: Partial<ShiftSettingQueryParams>) {
	return useListQuery<ShiftSettingListItem, ShiftSettingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useShiftSettingListQuery;
