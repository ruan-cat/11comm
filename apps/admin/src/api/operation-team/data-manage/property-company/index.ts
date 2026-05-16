/**
 * @file 物业公司查询 Hook
 * @description 提供物业公司列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { PropertyCompanyListItem, PropertyCompanyQueryParams } from "@01s-11comm/type";

const API_URL = resolveAdminApiRequestUrl("/api/operation-team/data-manage/property-company/list", import.meta.env);

/**
 * 获取物业公司列表数据
 * Get property company list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function usePropertyCompanyListQuery(initialParams: Partial<PropertyCompanyQueryParams>) {
	return useListQuery<PropertyCompanyListItem, PropertyCompanyQueryParams>({
		queryKeyPrefix: "operationTeam:dataManage:propertyCompany:list",
		apiUrl: API_URL,
		initialParams,
	});
}
