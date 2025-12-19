/**
 * @file 社区信息查询 Hook
 * @description 提供社区信息列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { CommunityInfoListItem, CommunityInfoQueryParams } from "@01s-11comm/type";

/**
 * 获取社区信息列表数据
 * Get community info list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useCommunityInfoListQuery(initialParams: Partial<CommunityInfoQueryParams>) {
	return useListQuery<CommunityInfoListItem, CommunityInfoQueryParams>({
		queryKeyPrefix: "operationTeam:dataManage:communityInformation:list",
		apiUrl: "/api/operation-team/data-manage/community-information/list",
		initialParams,
	});
}
