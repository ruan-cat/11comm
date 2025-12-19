/**
 * @file water-and-electricity-meter-reading API Hook
 * @description WaterAndElectricityMeterReading API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { WaterAndElectricityMeterReadingListItem, WaterAndElectricityMeterReadingQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/expense-manage/water-and-electricity-meter-reading/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "waterAndElectricityMeterReading";

/**
 * water-and-electricity-meter-reading列表查询 Hook
 * WaterAndElectricityMeterReading list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useWaterAndElectricityMeterReadingListQuery(initialParams: Partial<WaterAndElectricityMeterReadingQueryParams>) {
	return useListQuery<WaterAndElectricityMeterReadingListItem, WaterAndElectricityMeterReadingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useWaterAndElectricityMeterReadingListQuery;
