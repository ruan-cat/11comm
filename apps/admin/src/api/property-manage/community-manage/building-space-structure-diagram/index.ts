/**
 * @file 楼栋结构图 API Hook
 * @description Building space structure diagram API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { BuildingSpaceStructureDiagramListItem, BuildingSpaceStructureDiagramQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/community-manage/building-space-structure-diagram/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "buildingSpaceStructureDiagram";

/**
 * 楼栋结构图列表查询 Hook
 * Building space structure diagram list query hook
 */
export function useBuildingSpaceStructureDiagramListQuery(
	initialParams: Partial<BuildingSpaceStructureDiagramQueryParams>,
) {
	return useListQuery<BuildingSpaceStructureDiagramListItem, BuildingSpaceStructureDiagramQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useBuildingSpaceStructureDiagramListQuery;
