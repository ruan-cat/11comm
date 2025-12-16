/**
 * @file 组织管理-班次设置 API Hook
 * @description Shift setting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ShiftSetting, ShiftSettingListQuery } from "@01s-11comm/type";

/** 班次设置列表 API 路径 */
const LIST_API_URL = "/api/setting-manage/organize-manage/shift-setting/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "shiftSetting";

/**
 * 班次设置列表查询 Hook
 */
export function useShiftSettingListQuery() {
	return useListQuery<ShiftSetting, ShiftSettingListQuery>({
		queryKeyPrefix: `${QUERY_KEY_PREFIX}List`,
		apiUrl: LIST_API_URL,
	});
}
