/**
 * @file 系统配置 API Hook
 * @description 封装系统配置列表和 CUD 正式业务接口调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { JsonVO, SmSystemConfig, SystemConfigListItem, SystemConfigQueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_PREFIX = "/api/setting-manage/system-manage/system-config";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "systemConfig";

/** 系统配置写入接口字段集合，新增和修改共用这些服务端字段名。 */
export interface SystemConfigPayload {
	configKey: string;
	configValue?: string | null;
	configType?: string | null;
	configDescription?: string | null;
	status?: "enabled" | "disabled";
}

/** 新增系统配置时提交的业务 payload。 */
export type SystemConfigCreatePayload = SystemConfigPayload;

/** 修改系统配置时允许局部提交写入字段，但必须携带 id 用于服务端定位记录。 */
export type SystemConfigUpdatePayload = Partial<SystemConfigPayload> & {
	id: string;
};

export interface SystemConfigDeletePayload {
	/** 删除接口只接收单条系统配置记录 id，不承载其他业务字段。 */
	id: string;
}

/** 系统配置列表搜索参数，兼容页面层补充的筛选字段。 */
export type SystemConfigListQueryParams = SystemConfigQueryParams & {
	configKey?: string;
	configType?: string;
	status?: string;
};

/**
 * 系统配置列表查询 Hook
 * 统一暴露给页面层使用，负责把搜索参数交给 useListQuery 并绑定当前业务查询键。
 */
export function useSystemConfigListQuery(initialParams: Partial<SystemConfigListQueryParams>) {
	return useListQuery<SystemConfigListItem, SystemConfigListQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 新增系统配置记录，data 字段保持为服务端 create 接口期望的写入 payload。 */
export function createSystemConfig(payload: SystemConfigCreatePayload) {
	return http.request<JsonVO<SmSystemConfig | null>>("post", CREATE_API_URL, {
		data: payload,
	});
}

/** 修改系统配置记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateSystemConfig(payload: SystemConfigUpdatePayload) {
	return http.request<JsonVO<SmSystemConfig | null>>("post", UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除系统配置记录，服务端按 data.id 解析目标记录。 */
export function deleteSystemConfig(payload: SystemConfigDeletePayload) {
	return http.request<JsonVO<null>>("post", DELETE_API_URL, {
		data: payload,
	});
}

export default useSystemConfigListQuery;
