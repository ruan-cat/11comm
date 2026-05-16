/**
 * @file 产权登记 API Hook
 * @description Property registration API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { PropertyRegisterListItem, PropertyRegisterQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/community-manage/property-register/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "propertyRegister";

/**
 * 产权登记列表查询 Hook
 * Property registration list query hook
 */
export function usePropertyRegisterListQuery(initialParams: Partial<PropertyRegisterQueryParams>) {
	return useListQuery<PropertyRegisterListItem, PropertyRegisterQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePropertyRegisterListQuery;
