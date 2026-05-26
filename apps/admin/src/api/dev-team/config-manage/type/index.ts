/**
 * @file 配置类型 API Hook
 * @description 封装基于 dt_config_types 表的配置类型列表、详情和 CUD 正式业务调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { BaseListQueryParams, DictionaryTypeDetailItem, DictionaryTypeListItem, JsonVO } from "@01s-11comm/type";

const API_PREFIX = "/api/dev-team/config-manage/type";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const DETAIL_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/detail`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 配置类型列表查询键前缀，必须与页面缓存刷新逻辑保持一致。 */
const QUERY_KEY_PREFIX = "dictionaryType";

/** 配置类型列表搜索参数，继承通用分页并补充类型业务筛选字段。 */
export interface DictionaryTypeQueryParams extends BaseListQueryParams {
	typeName?: string;
	typeCode?: string;
	typeDescription?: string;
	sortOrder?: number | string;
}

export interface DictionaryTypeDetailPayload {
	/** 配置类型记录主键，作为详情接口查询参数透传。 */
	id: string;
}

/** 配置类型写入接口字段集合，新增和修改共用这些服务端字段名。 */
export interface DictionaryTypeWritePayload {
	typeName: string;
	typeCode: string;
	typeDescription: string;
	sortOrder: number;
}

/** 新增配置类型时完整提交写入字段。 */
export type DictionaryTypeCreatePayload = DictionaryTypeWritePayload;

/** 修改配置类型时允许局部提交写入字段，但必须携带 id 用于服务端定位记录。 */
export type DictionaryTypeUpdatePayload = Partial<DictionaryTypeWritePayload> & {
	id: string;
};

export interface DictionaryTypeDeletePayload {
	/** 删除接口只接收单条配置类型记录 id，不承载其他业务字段。 */
	id: string;
}

/** 配置类型列表查询 Hook，页面层只需要传入初始搜索参数。 */
export function useDictionaryTypeListQuery(initialParams: Partial<DictionaryTypeQueryParams>) {
	return useListQuery<DictionaryTypeListItem, DictionaryTypeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 获取配置类型详情，payload 会作为 query params 传给正式 detail 接口。 */
export function getDictionaryTypeDetail(payload: DictionaryTypeDetailPayload) {
	return http.get<JsonVO<DictionaryTypeDetailItem | null>, DictionaryTypeDetailPayload>(DETAIL_API_URL, {
		params: payload,
	});
}

/** 新增配置类型记录，data 字段保持为服务端 create 接口期望的写入 payload。 */
export function createDictionaryType(payload: DictionaryTypeCreatePayload) {
	return http.post<JsonVO<DictionaryTypeDetailItem | null>, DictionaryTypeCreatePayload>(CREATE_API_URL, {
		data: payload,
	});
}

/** 修改配置类型记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateDictionaryType(payload: DictionaryTypeUpdatePayload) {
	return http.post<JsonVO<DictionaryTypeDetailItem | null>, DictionaryTypeUpdatePayload>(UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除配置类型记录，服务端按 data.id 解析目标记录。 */
export function deleteDictionaryType(payload: DictionaryTypeDeletePayload) {
	return http.post<JsonVO<null>, DictionaryTypeDeletePayload>(DELETE_API_URL, {
		data: payload,
	});
}

export default useDictionaryTypeListQuery;
