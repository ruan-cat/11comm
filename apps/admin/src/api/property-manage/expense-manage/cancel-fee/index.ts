/**
 * @file cancel-fee API Hook
 * @description CancelFee API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { CancelFeeListItem, CancelFeeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/cancel-fee/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "cancel-fee";

/**
 * cancel-fee列表查询 Hook
 * CancelFee list query hook
 */
export function useCancelFeeListQuery() {
	return useListQuery<CancelFeeListItem, CancelFeeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useCancelFeeListQuery;

