/**
 * @file 产权登记 API Hook
 * @description PropertyRegister API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { PropertyRegisterListItem, PropertyRegisterQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/community-manage/property-register/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "property-register";

/**
 * 产权登记列表查询 Hook
 * PropertyRegister list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function usePropertyRegisterListQuery(initialParams: Partial<PropertyRegisterQueryParams>) {
	return useListQuery<PropertyRegisterListItem, PropertyRegisterQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default usePropertyRegisterListQuery;
