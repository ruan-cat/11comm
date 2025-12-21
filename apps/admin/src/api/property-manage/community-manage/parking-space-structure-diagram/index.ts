/**
 * @file parking-space-structure-diagram API Hook
 * @description ParkingSpaceStructureDiagram API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ParkingSpaceStructureDiagramListItem, ParkingSpaceStructureDiagramQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/community-manage/parking-space-structure-diagram/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "parkingSpaceStructureDiagram";

/**
 * parking-space-structure-diagram列表查询 Hook
 * ParkingSpaceStructureDiagram list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useParkingSpaceStructureDiagramListQuery(
	initialParams: Partial<ParkingSpaceStructureDiagramQueryParams>,
) {
	return useListQuery<ParkingSpaceStructureDiagramListItem, ParkingSpaceStructureDiagramQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useParkingSpaceStructureDiagramListQuery;
