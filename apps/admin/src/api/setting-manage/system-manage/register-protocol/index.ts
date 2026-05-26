/**
 * @file 注册协议 API Hook
 * @description 封装注册协议列表和 CUD 正式业务接口调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type {
	JsonVO,
	SettingManagementRegisterProtocolDisplay,
	SettingManagementRegisterProtocolListQuery,
	SmRegisterProtocol,
} from "@01s-11comm/type";

/** API 路径 */
const API_PREFIX = "/api/setting-manage/system-manage/register-protocol";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "registerProtocol";

/** 注册协议写入接口字段集合，新增和修改共用这些服务端字段名。 */
export interface RegisterProtocolPayload {
	protocolType?: string | null;
	protocolTitle: string;
	protocolContent?: string | null;
	version?: string | null;
	status?: "enabled" | "disabled" | string;
}

/** 新增注册协议时提交的业务 payload。 */
export type RegisterProtocolCreatePayload = RegisterProtocolPayload;

/** 修改注册协议时允许局部提交写入字段，但必须携带 id 用于服务端定位记录。 */
export type RegisterProtocolUpdatePayload = Partial<RegisterProtocolPayload> & {
	id: string;
};

export interface RegisterProtocolDeletePayload {
	/** 删除接口只接收单条注册协议记录 id，不承载其他业务字段。 */
	id: string;
}

/**
 * 注册协议列表查询 Hook
 * 统一暴露给页面层使用，负责把搜索参数交给 useListQuery 并绑定当前业务查询键。
 */
export function useRegisterProtocolListQuery(initialParams: Partial<SettingManagementRegisterProtocolListQuery>) {
	return useListQuery<SettingManagementRegisterProtocolDisplay, SettingManagementRegisterProtocolListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 新增注册协议记录，data 字段保持为服务端 create 接口期望的写入 payload。 */
export function createRegisterProtocol(payload: RegisterProtocolCreatePayload) {
	return http.request<JsonVO<SmRegisterProtocol | null>>("post", CREATE_API_URL, {
		data: payload,
	});
}

/** 修改注册协议记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateRegisterProtocol(payload: RegisterProtocolUpdatePayload) {
	return http.request<JsonVO<SmRegisterProtocol | null>>("post", UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除注册协议记录，服务端按 data.id 解析目标记录。 */
export function deleteRegisterProtocol(payload: RegisterProtocolDeletePayload) {
	return http.request<JsonVO<null>>("post", DELETE_API_URL, {
		data: payload,
	});
}

export default useRegisterProtocolListQuery;
