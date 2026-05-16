import { useListQuery } from "@/composables/use-list-query";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { HandingBusinessListItem, HandingBusinessQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = resolveAdminApiRequestUrl(
	"/api/property-manage/community-manage/handing-business/list",
	import.meta.env,
);

/**
 * @description 业务受理列表查询 Hook
 * Handing business list query hook
 */
export function useHandingBusinessListQuery(initialParams: Partial<HandingBusinessQueryParams>) {
	return useListQuery<HandingBusinessListItem, HandingBusinessQueryParams>({
		queryKeyPrefix: "handing-business-list",
		apiUrl: API_URL,
		initialParams,
	});
}
