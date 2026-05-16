/**
 * @file invoice API Hook
 * @description Invoice API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { InvoiceListItem, InvoiceQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/house-property-manage/invoice/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "invoice";

/**
 * invoice列表查询 Hook
 * Invoice list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useInvoiceListQuery(initialParams: Partial<InvoiceQueryParams>) {
	return useListQuery<InvoiceListItem, InvoiceQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useInvoiceListQuery;
