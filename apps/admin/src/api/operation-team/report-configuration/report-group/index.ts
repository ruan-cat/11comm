/**
 * @file 报表分组查询 Hook
 * @description 提供报表分组列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReportGroupListItem, ReportGroupQueryParams } from "@01s-11comm/type";

/**
 * 获取报表分组列表数据
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useReportGroupListQuery(initialParams?: Partial<ReportGroupQueryParams>) {
	return useListQuery<ReportGroupListItem, ReportGroupQueryParams>({
		queryKeyPrefix: "operationTeam:reportConfiguration:reportGroup:list",
		apiUrl: "/api/operation-team/report-configuration/report-group/list",
		initialParams,
	});
}
