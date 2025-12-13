/**
 * @file data-statistics API Hook
 * @description DataStatistics API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { DataStatisticsListItem, DataStatisticsQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/report-manage/data-statistics/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "dataStatistics";

/**
 * data-statistics列表查询 Hook
 * DataStatistics list query hook
 */
export function useDataStatisticsListQuery() {
	return useListQuery<DataStatisticsListItem, DataStatisticsQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default useDataStatisticsListQuery;
