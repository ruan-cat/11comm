import { useListQuery } from "@/composables/use-list-query";
import type { SystemConfigListItem, SystemConfigQueryParams } from "@01s-11comm/type";

/**
 * @description 系统配置列表查询 Hook
 * System config list query hook
 */
export function useSystemConfigListQuery(initialParams?: Partial<SystemConfigQueryParams>) {
	return useListQuery<SystemConfigListItem, SystemConfigQueryParams>({
		queryKeyPrefix: "system-config-list",
		apiUrl: "/api/operation-team/system-manage/system-config/list",
		initialParams,
	});
}

