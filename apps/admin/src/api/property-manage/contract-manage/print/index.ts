/**
 * @file 合同打印 API Hook
 * @description Print API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PrintListItem, PrintQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/contract-manage/print/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "print";

/**
 * 合同打印列表查询 Hook
 * Print list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function usePrintListQuery(initialParams: Partial<PrintQueryParams>) {
	return useListQuery<PrintListItem, PrintQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePrintListQuery;
