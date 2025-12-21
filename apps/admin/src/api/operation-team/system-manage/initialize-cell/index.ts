/**
 * @file 小区初始化查询 Hook
 * @description 提供小区初始化列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { InitializeCellListItem, InitializeCellQueryParams } from "@01s-11comm/type";

/**
 * 获取小区初始化列表数据
 * Get initialize cell list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useInitializeCellListQuery(initialParams: Partial<InitializeCellQueryParams>) {
	return useListQuery<InitializeCellListItem, InitializeCellQueryParams>({
		queryKeyPrefix: "operationTeam:systemManage:initializeCell:list",
		apiUrl: "/api/operation-team/system-manage/initialize-cell/list",
		initialParams,
	});
}
