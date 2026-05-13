/**
 * @file 欠费明细表 API Hook
 * @description Arrears details list API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ArrearsDetailsListItem, ArrearsDetailsListQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/report-manage/arrears-details-list/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "arrearsDetailsList";

/**
 * 欠费明细表列表查询 Hook
 * Arrears details list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useArrearsDetailsListQuery(initialParams: Partial<ArrearsDetailsListQueryParams>) {
	return useListQuery<ArrearsDetailsListItem, ArrearsDetailsListQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useArrearsDetailsListQuery;
