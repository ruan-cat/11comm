/**
 * @file owner-information API Hook
 * @description OwnerInformation API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { OwnerInformationListItem, OwnerInformationQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/house-property-manage/owner-information/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "ownerInformation";

/**
 * owner-information列表查询 Hook
 * OwnerInformation list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useOwnerInformationListQuery(initialParams: Partial<OwnerInformationQueryParams>) {
	return useListQuery<OwnerInformationListItem, OwnerInformationQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useOwnerInformationListQuery;
