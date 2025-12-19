/**
 * @file 修改密码记录查询 Hook
 * @description 提供修改密码记录列表数据查询功能
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ChangePasswordRecordListItem, ChangePasswordRecordQueryParams } from "@01s-11comm/type";

/**
 * 获取修改密码记录列表数据
 * Get change password record list data
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useChangePasswordRecordListQuery(initialParams: Partial<ChangePasswordRecordQueryParams>) {
	return useListQuery<ChangePasswordRecordListItem, ChangePasswordRecordQueryParams>({
		queryKeyPrefix: "operationTeam:systemManage:changePassword:list",
		apiUrl: "/api/operation-team/system-manage/change-password/list",
		initialParams,
	});
}