/**
 * @file 注册协议查询 Hook
 * @description 提供注册协议列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { RegisterProtocolListItem, RegisterProtocolQueryParams } from "@01s-11comm/type";

/**
 * 获取注册协议列表数据
 * Get register protocol list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useRegisterProtocolListQuery(initialParams: Partial<RegisterProtocolQueryParams>) {
	return useListQuery<RegisterProtocolListItem, RegisterProtocolQueryParams>({
		queryKeyPrefix: "operationTeam:systemManage:registerProtocol:list",
		apiUrl: "/api/operation-team/system-manage/register-protocol/list",
		initialParams,
	});
}
