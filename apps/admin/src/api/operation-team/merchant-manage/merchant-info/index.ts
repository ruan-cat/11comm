import { useListQuery } from "@/composables/use-list-query";
import type { MerchantInfoListItem, MerchantInfoQueryParams } from "@01s-11comm/type/business/operation-team/merchant-manage/merchant-info";

/**
 * @description 商户信息列表查询 Hook
 * Merchant info list query hook
 */
export function useMerchantInfoListQuery(initialParams?: Partial<MerchantInfoQueryParams>) {
	return useListQuery<MerchantInfoListItem, MerchantInfoQueryParams>({
		queryKeyPrefix: "merchant-info-list",
		apiUrl: "/api/operation-team/merchant-manage/merchant-info/list",
		initialParams,
	});
}

