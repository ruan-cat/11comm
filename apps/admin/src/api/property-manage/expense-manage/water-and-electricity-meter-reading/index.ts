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
 */
export function useWaterAndElectricityMeterReadingListQuery() {
	return useListQuery<WaterAndElectricityMeterReadingListItem, WaterAndElectricityMeterReadingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useWaterAndElectricityMeterReadingListQuery;
