/**
 * @file 房屋装修查询 Hook
 * @description 提供房屋装修列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { HouseDecorationListItem, HouseDecorationQueryParams } from "@01s-11comm/type";

/**
 * 获取房屋装修列表数据
 * Get house decoration list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useHouseDecorationListQuery(initialParams: Partial<HouseDecorationQueryParams>) {
	return useListQuery<HouseDecorationListItem, HouseDecorationQueryParams>({
		queryKeyPrefix: "propertyManage:communityManage:houseDecoration:list",
		apiUrl: "/api/property-manage/community-manage/house-decoration/list",
		initialParams,
	});
}
