/**
 * @file arrears-details-list API Hook
 * @description ArrearsDetailsList API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ArrearsDetailsListListItem, ArrearsDetailsListQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/arrears-details-list/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "arrearsDetailsList";

/**
 * arrears-details-list列表查询 Hook
 * ArrearsDetailsList list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useArrearsDetailsListListQuery(initialParams: Partial<ArrearsDetailsListQueryParams>) {
	return useListQuery<ArrearsDetailsListListItem, ArrearsDetailsListQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useArrearsDetailsListListQuery;
