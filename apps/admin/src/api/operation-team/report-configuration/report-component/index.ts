/**
 * @file 报表组件查询 Hook
 * @description 提供报表组件列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReportComponentListItem, ReportComponentQueryParams } from "@01s-11comm/type";

/**
 * 获取报表组件列表数据
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useReportComponentListQuery(initialParams?: Partial<ReportComponentQueryParams>) {
	return useListQuery<ReportComponentListItem, ReportComponentQueryParams>({
		queryKeyPrefix: "operationTeam:reportConfiguration:reportComponent:list",
		apiUrl: "/api/operation-team/report-configuration/report-component/list",
		initialParams,
	});
}
