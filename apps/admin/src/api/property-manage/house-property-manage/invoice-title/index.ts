/**
 * @file invoice-title API Hook
 * @description InvoiceTitle API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { InvoiceTitleListItem, InvoiceTitleQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/invoice-title/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "invoiceTitle";

/**
 * invoice-title列表查询 Hook
 * InvoiceTitle list query hook
 */
export function useInvoiceTitleListQuery() {
	return useListQuery<InvoiceTitleListItem, InvoiceTitleQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useInvoiceTitleListQuery;
