/**
 * @file 商户管理员 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MerchantAdmin, MerchantAdminListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/operation-team/merchant-manage/merchant-admin/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "merchantAdmin";

/**
 * 商户管理员列表查询 Hook
 * Merchant admin list query hook
 */
export function useMerchantAdminListQuery(initialParams: Partial<MerchantAdminListQuery>) {
	return useListQuery<MerchantAdmin, MerchantAdminListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useMerchantAdminListQuery;
