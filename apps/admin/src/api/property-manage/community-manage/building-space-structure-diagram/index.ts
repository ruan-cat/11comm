/**
 * @file 楼宇空间结构图查询 Hook
 * @description 提供楼宇空间结构图列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { BuildingSpaceStructureDiagramListItem, BuildingSpaceStructureDiagramQueryParams } from "@01s-11comm/type";

/**
 * 获取楼宇空间结构图列表数据
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useBuildingSpaceStructureDiagramListQuery(initialParams?: Partial<BuildingSpaceStructureDiagramQueryParams>) {
	return useListQuery<BuildingSpaceStructureDiagramListItem, BuildingSpaceStructureDiagramQueryParams>({
		queryKeyPrefix: "propertyManage:communityManage:buildingSpaceStructureDiagram:list",
		apiUrl: "/api/property-manage/community-manage/building-space-structure-diagram/list",
		initialParams,
	});
}