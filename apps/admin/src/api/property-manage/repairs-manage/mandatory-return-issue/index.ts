/**
 * @file mandatory-return-issue API Hook
 * @description MandatoryReturnIssue API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { MandatoryReturnIssueListItem, MandatoryReturnIssueQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/property-manage/repairs-manage/mandatory-return-issue/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "mandatoryReturnIssue";

/**
 * mandatory-return-issue列表查询 Hook
 * MandatoryReturnIssue list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useMandatoryReturnIssueListQuery(initialParams: Partial<MandatoryReturnIssueQueryParams>) {
	return useListQuery<MandatoryReturnIssueListItem, MandatoryReturnIssueQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useMandatoryReturnIssueListQuery;
