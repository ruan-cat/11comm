/**
 * @file 商家信息查询 Hook
 * @description 提供商家信息列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MerchantInfoListItem, MerchantInfoQueryParams } from "@01s-11comm/type";

/**
 * 获取商家信息列表数据
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useMerchantInfoListQuery(initialParams?: Partial<MerchantInfoQueryParams>) {
	return useListQuery<MerchantInfoListItem, MerchantInfoQueryParams>({
		queryKeyPrefix: "operationTeam:merchantManage:merchantInfo:list",
		apiUrl: "/api/operation-team/merchant-manage/merchant-info/list",
		initialParams,
	});
}
