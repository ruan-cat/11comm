/**
 * @file invoice API Hook
 * @description Invoice API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { InvoiceListItem, InvoiceQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/invoice/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "invoice";

/**
 * invoice列表查询 Hook
 * Invoice list query hook
 */
export function useInvoiceListQuery() {
	return useListQuery<InvoiceListItem, InvoiceQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useInvoiceListQuery;
