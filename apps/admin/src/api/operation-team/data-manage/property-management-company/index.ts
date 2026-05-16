/**
 * @file 物业公司 API Hook
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { PropertyCompanyListItem, PropertyCompanyQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/operation-team/data-manage/property-management-company/list",
	import.meta.env,
);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "propertyManagementCompany";

/**
 * 物业公司列表查询 Hook
 * Property management company list query hook
 */
export function usePropertyManagementCompanyListQuery(initialParams: Partial<PropertyCompanyQueryParams>) {
	return useListQuery<PropertyCompanyListItem, PropertyCompanyQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePropertyManagementCompanyListQuery;
