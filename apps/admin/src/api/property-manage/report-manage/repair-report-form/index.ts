/**
 * @file repair-report-form API Hook
 * @description RepairReportForm API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { RepairReportFormListItem, RepairReportFormQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/repair-report-form/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "repairReportForm";

/**
 * repair-report-form列表查询 Hook
 * RepairReportForm list query hook
 */
export function useRepairReportFormListQuery() {
	return useListQuery<RepairReportFormListItem, RepairReportFormQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useRepairReportFormListQuery;
