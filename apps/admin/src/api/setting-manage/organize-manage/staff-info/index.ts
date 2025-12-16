/**
 * @file 员工信息 API Hook
 * @description Staff info API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { StaffInfo, StaffInfoListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/setting-manage/organize-manage/staff-info/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "staffInfo";

/**
 * 员工信息列表查询 Hook
 */
export function useStaffInfoListQuery() {
	return useListQuery<StaffInfo, StaffInfoListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useStaffInfoListQuery;
