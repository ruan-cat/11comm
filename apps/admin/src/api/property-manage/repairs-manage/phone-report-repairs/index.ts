/**
 * @file phone-report-repairs API Hook
 * @description PhoneReportRepairs API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PhoneReportRepairsListItem, PhoneReportRepairsQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/repairs-manage/phone-report-repairs/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "phoneReportRepairs";

/**
 * phone-report-repairs列表查询 Hook
 * PhoneReportRepairs list query hook
 */
export function usePhoneReportRepairsListQuery() {
	return useListQuery<PhoneReportRepairsListItem, PhoneReportRepairsQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default usePhoneReportRepairsListQuery;
