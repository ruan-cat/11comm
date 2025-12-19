/**
 * @file item API Hook
 * @description Item API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ItemListItem, ItemQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/patrol-manage/item/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "item";

/**
 * item列表查询 Hook
 * Item list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useItemListQuery(initialParams: Partial<ItemQueryParams>) {
	return useListQuery<ItemListItem, ItemQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useItemListQuery;
