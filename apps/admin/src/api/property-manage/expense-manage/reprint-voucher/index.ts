/**
 * @file reprint-voucher API Hook
 * @description ReprintVoucher API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ReprintVoucherListItem, ReprintVoucherQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/reprint-voucher/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "reprintVoucher";

/**
 * reprint-voucher列表查询 Hook
 * ReprintVoucher list query hook
 */
export function useReprintVoucherListQuery() {
	return useListQuery<ReprintVoucherListItem, ReprintVoucherQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useReprintVoucherListQuery;
