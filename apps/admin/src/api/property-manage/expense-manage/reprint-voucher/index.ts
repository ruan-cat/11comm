/**
 * @file reprint-voucher API Hook
 * @description ReprintVoucher API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { ReprintVoucherListItem, ReprintVoucherQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/expense-manage/reprint-voucher/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reprintVoucher";

/**
 * reprint-voucher列表查询 Hook
 * ReprintVoucher list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useReprintVoucherListQuery(initialParams: Partial<ReprintVoucherQueryParams>) {
	return useListQuery<ReprintVoucherListItem, ReprintVoucherQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useReprintVoucherListQuery;
