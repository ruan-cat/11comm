/**
 * @file 报表信息查询 Hook
 * @description 提供报表信息列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReportInfoListItem, ReportInfoQueryParams } from "@01s-11comm/type";

/**
 * 获取报表信息列表数据
 * Get report info list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useReportInfoListQuery(initialParams: Partial<ReportInfoQueryParams>) {
	return useListQuery<ReportInfoListItem, ReportInfoQueryParams>({
		queryKeyPrefix: "operationTeam:reportConfiguration:reportInfo:list",
		apiUrl: "/api/operation-team/report-configuration/report-info/list",
		initialParams,
	});
}
