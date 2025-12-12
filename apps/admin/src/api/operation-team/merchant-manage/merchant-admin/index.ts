import { useListQuery } from "@/composables/use-list-query";
import type { MerchantAdminListItem, MerchantAdminQueryParams } from "@01s-11comm/type";

/**
 * @description 商户管理员列表查询 Hook
 * Merchant admin list query hook
 */
export function useMerchantAdminListQuery(initialParams?: Partial<MerchantAdminQueryParams>) {
	return useListQuery<MerchantAdminListItem, MerchantAdminQueryParams>({
		queryKeyPrefix: "merchant-admin-list",
		apiUrl: "/api/operation-team/merchant-manage/merchant-admin/list",
		initialParams,
	});
}

