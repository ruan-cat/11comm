/**
 * @file 商家管理员查询 Hook
 * @description 提供商家管理员列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MerchantAdminListItem, MerchantAdminQueryParams } from "@01s-11comm/type";

/**
 * 获取商家管理员列表数据
 * Get merchant admin list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useMerchantAdminListQuery(initialParams: Partial<MerchantAdminQueryParams>) {
	return useListQuery<MerchantAdminListItem, MerchantAdminQueryParams>({
		queryKeyPrefix: "operationTeam:merchantManage:merchantAdmin:list",
		apiUrl: "/api/operation-team/merchant-manage/merchant-admin/list",
		initialParams,
	});
}
