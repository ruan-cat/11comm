/**
 * @file 配置中心 API Hook
 * @description 封装配置中心列表、详情和 CUD 正式业务接口调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type {
	ConfigCenterDetailItem,
	ConfigCenterFormVO,
	ConfigCenterListItem,
	ConfigCenterQueryParams,
	JsonVO,
} from "@01s-11comm/type";

/** API 路径 */
const API_PREFIX = "/api/dev-team/config-manage/center";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const DETAIL_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/detail`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "configCenter";

export interface ConfigCenterDetailPayload {
	/** 配置中心记录主键，作为详情接口的查询参数透传。 */
	id: string;
}

/** 新增配置中心时直接复用表单 VO，保持前端表单字段与服务端 create payload 一致。 */
export type ConfigCenterCreatePayload = ConfigCenterFormVO;

/** 修改配置中心时允许局部提交表单字段，但必须携带 id 用于服务端定位记录。 */
export type ConfigCenterUpdatePayload = Partial<ConfigCenterFormVO> & {
	id: string;
};

export interface ConfigCenterDeletePayload {
	/** 删除接口只接收单条配置中心记录 id，不承载其他业务字段。 */
	id: string;
}

/**
 * 配置中心列表查询 Hook
 * 统一暴露给页面层使用，负责把搜索参数交给 useListQuery 并绑定当前业务查询键。
 */
export function useConfigCenterListQuery(initialParams: Partial<ConfigCenterQueryParams>) {
	return useListQuery<ConfigCenterListItem, ConfigCenterQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 获取配置中心详情，payload 会作为 query params 传给正式 detail 接口。 */
export function getConfigCenterDetail(payload: ConfigCenterDetailPayload) {
	return http.get<JsonVO<ConfigCenterDetailItem | null>, ConfigCenterDetailPayload>(DETAIL_API_URL, {
		params: payload,
	});
}

/** 新增配置中心记录，data 字段保持为服务端 create 接口期望的表单 payload。 */
export function createConfigCenter(payload: ConfigCenterCreatePayload) {
	return http.post<JsonVO<ConfigCenterDetailItem | null>, ConfigCenterCreatePayload>(CREATE_API_URL, {
		data: payload,
	});
}

/** 修改配置中心记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateConfigCenter(payload: ConfigCenterUpdatePayload) {
	return http.post<JsonVO<ConfigCenterDetailItem | null>, ConfigCenterUpdatePayload>(UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除配置中心记录，服务端按 data.id 解析目标记录。 */
export function deleteConfigCenter(payload: ConfigCenterDeletePayload) {
	return http.post<JsonVO<null>, ConfigCenterDeletePayload>(DELETE_API_URL, {
		data: payload,
	});
}

export default useConfigCenterListQuery;
