/**
 * @file 员工信息 API Hook
 * @description Staff info API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { StaffInfo, StaffInfoListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/setting-manage/organize-manage/staff-info/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "staffInfo";

/**
 * 员工信息列表查询 Hook
 * Staff info list query hook
 */
export function useStaffInfoListQuery(initialParams: Partial<StaffInfoListQuery>) {
	return useListQuery<StaffInfo, StaffInfoListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useStaffInfoListQuery;
