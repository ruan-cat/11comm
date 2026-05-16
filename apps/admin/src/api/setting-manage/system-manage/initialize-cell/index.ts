/**
 * @file 初始化小区查询 Hook
 * @description 提供初始化小区列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { InitializeCommunityListItem, InitializeCommunityQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/setting-manage/system-manage/initialize-cell/list", import.meta.env);

/**
 * 获取初始化小区列表数据
 * Get initialize community list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useInitializeCommunityListQuery(initialParams: Partial<InitializeCommunityQueryParams>) {
	return useListQuery<InitializeCommunityListItem, InitializeCommunityQueryParams>({
		queryKeyPrefix: "settingManage:systemManage:initializeCommunity:list",
		apiUrl: API_URL,
		initialParams,
	});
}
