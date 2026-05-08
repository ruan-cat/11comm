/**
 * @file repairs-setting API Hook
 * @description RepairsSetting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { RepairsSettingListItem, RepairsSettingQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/repairs-manage/repairs-setting/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "repairsSetting";

/**
 * repairs-setting列表查询 Hook
 * RepairsSetting list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useRepairsSettingListQuery(initialParams: Partial<RepairsSettingQueryParams>) {
	return useListQuery<RepairsSettingListItem, RepairsSettingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useRepairsSettingListQuery;
