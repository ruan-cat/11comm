/**
 * @file 社区配置查询 Hook
 * @description 提供社区配置列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { CommunityConfigListItem, CommunityConfigQueryParams } from "@01s-11comm/type";

/**
 * 获取社区配置列表数据
 * Get community config list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useCommunityConfigListQuery(initialParams: Partial<CommunityConfigQueryParams>) {
	return useListQuery<CommunityConfigListItem, CommunityConfigQueryParams>({
		queryKeyPrefix: "operationTeam:systemManage:communityConfiguration:list",
		apiUrl: "/api/operation-team/system-manage/community-configuration/list",
		initialParams,
	});
}
