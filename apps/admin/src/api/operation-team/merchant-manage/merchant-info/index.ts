/**
 * @file 商户信息 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { MerchantInfo, MerchantInfoListQuery } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/operation-team/merchant-manage/merchant-info/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "merchantInfo";

/**
 * 商户信息列表查询 Hook
 * Merchant info list query hook
 */
export function useMerchantInfoListQuery(initialParams: Partial<MerchantInfoListQuery>) {
	return useListQuery<MerchantInfo, MerchantInfoListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useMerchantInfoListQuery;
