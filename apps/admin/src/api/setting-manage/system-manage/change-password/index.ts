/**
 * @file 密码修改记录 API Hook
 * @description 封装密码修改记录列表和 CUD 正式业务接口调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type {
	ChangePasswordRecord,
	ChangePasswordRecordFormVO,
	ChangePasswordRecordListQuery,
	JsonVO,
} from "@01s-11comm/type";

/** API 路径 */
const API_PREFIX = "/api/setting-manage/system-manage/change-password";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "changePasswordRecord";

export type ChangePasswordRecordCreatePayload = ChangePasswordRecordFormVO;

/** 修改密码记录时允许局部提交表单字段，但必须携带 id 用于服务端定位记录。 */
export type ChangePasswordRecordUpdatePayload = Partial<ChangePasswordRecordFormVO> & {
	id: string;
};

export interface ChangePasswordRecordDeletePayload {
	/** 删除接口只接收单条密码修改记录 id，不承载其他业务字段。 */
	id: string;
}

/**
 * 密码修改记录列表查询 Hook
 * 统一暴露给页面层使用，负责把搜索参数交给 useListQuery 并绑定当前业务查询键。
 */
export function useChangePasswordRecordListQuery(initialParams: Partial<ChangePasswordRecordListQuery>) {
	return useListQuery<ChangePasswordRecord, ChangePasswordRecordListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 新增密码修改记录，data 字段保持为服务端 create 接口期望的表单 payload。 */
export function createChangePasswordRecord(payload: ChangePasswordRecordCreatePayload) {
	return http.request<JsonVO<ChangePasswordRecord | null>>("post", CREATE_API_URL, {
		data: payload,
	});
}

/** 修改密码修改记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateChangePasswordRecord(payload: ChangePasswordRecordUpdatePayload) {
	return http.request<JsonVO<ChangePasswordRecord | null>>("post", UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除密码修改记录，服务端按 data.id 解析目标记录。 */
export function deleteChangePasswordRecord(payload: ChangePasswordRecordDeletePayload) {
	return http.request<JsonVO<null>>("post", DELETE_API_URL, {
		data: payload,
	});
}

export default useChangePasswordRecordListQuery;
