/**
 * @file house-charge API Hook
 * @description HouseCharge API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { HouseChargeListItem, HouseChargeQueryParams, JsonVO } from "@01s-11comm/type";

/** API 路径前缀 */
const API_PREFIX = "/api/property-manage/expense-manage/house-charge";

/** API 路径 */
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const DETAIL_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/detail`, import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "houseCharge";

export interface HouseChargeDetailPayload {
	id: string;
}

export type HouseChargeDetailVO = HouseChargeListItem & {
	houseId?: string;
	expenseItem?: string;
	receivableAmount?: string;
	receivedAmount?: string;
	billingPeriod?: string;
	billDate?: string;
	dueDate?: string;
};

/**
 * house-charge列表查询 Hook
 * HouseCharge list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useHouseChargeListQuery(initialParams: Partial<HouseChargeQueryParams>) {
	return useListQuery<HouseChargeListItem, HouseChargeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/**
 * Query house-charge detail.
 * Phase5 keeps house-charge read-only on the admin side.
 */
export function getHouseChargeDetail(payload: HouseChargeDetailPayload) {
	return http.post<JsonVO<HouseChargeDetailVO | null>, HouseChargeDetailPayload>(DETAIL_API_URL, { data: payload });
}

export default useHouseChargeListQuery;
