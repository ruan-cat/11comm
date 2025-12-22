/**
 * @file 密码修改记录 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ChangePasswordRecord, ChangePasswordRecordListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/system-manage/change-password/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "changePasswordRecord";

/**
 * 密码修改记录列表查询 Hook
 * Change password record list query hook
 */
export function useChangePasswordRecordListQuery(initialParams: Partial<ChangePasswordRecordListQuery>) {
	return useListQuery<ChangePasswordRecord, ChangePasswordRecordListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useChangePasswordRecordListQuery;
