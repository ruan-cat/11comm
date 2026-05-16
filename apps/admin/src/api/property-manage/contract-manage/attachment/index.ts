/**
 * @file 合同附件 API Hook
 * @description Attachment API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { AttachmentListItem, AttachmentQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/attachment/list", import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "attachment";

/**
 * 合同附件列表查询 Hook
 * Attachment list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useAttachmentListQuery(initialParams: Partial<AttachmentQueryParams>) {
	return useListQuery<AttachmentListItem, AttachmentQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default useAttachmentListQuery;
