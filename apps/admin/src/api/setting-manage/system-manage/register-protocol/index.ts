/**
 * @file 注册协议 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { SettingManagementRegisterProtocolDisplay, SettingManagementRegisterProtocolListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/setting-manage/system-manage/register-protocol/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "registerProtocol";

/**
 * 注册协议列表查询 Hook
 * Register protocol list query hook
 */
export function useRegisterProtocolListQuery(initialParams: Partial<SettingManagementRegisterProtocolListQuery>) {
	return useListQuery<SettingManagementRegisterProtocolDisplay, SettingManagementRegisterProtocolListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useRegisterProtocolListQuery;
