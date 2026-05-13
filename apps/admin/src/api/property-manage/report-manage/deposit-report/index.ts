/**
 * @file deposit-report API Hook
 * @description DepositReport API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { DepositReportListItem, DepositReportQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/report-manage/deposit-report/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "depositReport";

/**
 * deposit-report列表查询 Hook
 * DepositReport list query hook
 */
export function useDepositReportListQuery(initialParams: Partial<DepositReportQueryParams>) {
	return useListQuery<DepositReportListItem, DepositReportQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useDepositReportListQuery;
