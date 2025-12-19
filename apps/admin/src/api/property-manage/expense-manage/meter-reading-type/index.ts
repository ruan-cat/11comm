/**
 * @file meter-reading-type API Hook
 * @description MeterReadingType API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MeterReadingTypeListItem, MeterReadingTypeQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/meter-reading-type/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "meterReadingType";

/**
 * meter-reading-type列表查询 Hook
 * MeterReadingType list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useMeterReadingTypeListQuery(initialParams: Partial<MeterReadingTypeQueryParams>) {
	return useListQuery<MeterReadingTypeListItem, MeterReadingTypeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useMeterReadingTypeListQuery;
