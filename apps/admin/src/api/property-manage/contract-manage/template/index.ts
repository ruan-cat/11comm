/**
 * @file 合同模板 API Hook
 * @description Template API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { TemplateListItem, TemplateQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/template/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "template";

/**
 * 合同模板列表查询 Hook
 * Template list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useTemplateListQuery(initialParams: Partial<TemplateQueryParams>) {
	return useListQuery<TemplateListItem, TemplateQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useTemplateListQuery;
