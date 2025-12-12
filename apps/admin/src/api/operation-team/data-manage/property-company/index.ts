import { useListQuery } from "@/composables/use-list-query";
import type { PropertyCompanyListItem, PropertyCompanyQueryParams } from "@01s-11comm/type/business/operation-team/data-manage/property-company";

/**
 * @description 物业公司列表查询 Hook
 * Property company list query hook
 */
export function usePropertyCompanyListQuery(initialParams?: Partial<PropertyCompanyQueryParams>) {
	return useListQuery<PropertyCompanyListItem, PropertyCompanyQueryParams>({
		queryKeyPrefix: "property-company-list",
		apiUrl: "/api/operation-team/data-manage/property-company/list",
		initialParams,
	});
}

