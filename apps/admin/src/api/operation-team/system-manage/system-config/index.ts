/**
 * @file 系统配置查询 Hook
 * @description 提供系统配置列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { SystemConfigListItem, SystemConfigQueryParams } from "@01s-11comm/type";

/**
 * 获取系统配置列表数据
 * Get system config list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useSystemConfigListQuery(initialParams: Partial<SystemConfigQueryParams>) {
	return useListQuery<SystemConfigListItem, SystemConfigQueryParams>({
		queryKeyPrefix: "operationTeam:systemManage:systemConfig:list",
		apiUrl: "/api/operation-team/system-manage/system-config/list",
		initialParams,
	});
}
