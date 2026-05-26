/**
 * @file 字典管理 API Hook
 * @description 封装字典管理列表、详情和 CUD 正式业务接口调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { DictionaryDetailItem, DictionaryListItem, DictionaryQueryParams, JsonVO } from "@01s-11comm/type";

/** API 路径 */
const API_PREFIX = "/api/dev-team/config-manage/dictionary";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const DETAIL_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/detail`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "dictionary";

export interface DictionaryDetailPayload {
	/** 字典记录主键，作为详情接口查询参数透传。 */
	id: string;
}

/** 字典写入接口的统一字段集合，新增和修改共用这组业务字段。 */
export interface DictionaryWritePayload {
	dictionaryName: string;
	dictionaryCode: string;
	dictionaryType: string;
	dictionaryDescription: string;
	remark: string;
}

/** 新增字典时完整提交写入字段。 */
export type DictionaryCreatePayload = DictionaryWritePayload;

/** 修改字典时允许局部提交写入字段，但必须携带 id 用于服务端定位记录。 */
export type DictionaryUpdatePayload = Partial<DictionaryWritePayload> & {
	id: string;
};

export interface DictionaryDeletePayload {
	/** 删除接口只接收单条字典记录 id，不承载其他业务字段。 */
	id: string;
}

/**
 * 字典列表查询 Hook
 * 统一暴露给页面层使用，负责把搜索参数交给 useListQuery 并绑定当前业务查询键。
 */
export function useDictionaryListQuery(initialParams: Partial<DictionaryQueryParams>) {
	return useListQuery<DictionaryListItem, DictionaryQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 获取字典详情，payload 会作为 query params 传给正式 detail 接口。 */
export function getDictionaryDetail(payload: DictionaryDetailPayload) {
	return http.get<JsonVO<DictionaryDetailItem | null>, DictionaryDetailPayload>(DETAIL_API_URL, {
		params: payload,
	});
}

/** 新增字典记录，data 字段保持为服务端 create 接口期望的写入 payload。 */
export function createDictionary(payload: DictionaryCreatePayload) {
	return http.post<JsonVO<DictionaryDetailItem | null>, DictionaryCreatePayload>(CREATE_API_URL, {
		data: payload,
	});
}

/** 修改字典记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateDictionary(payload: DictionaryUpdatePayload) {
	return http.post<JsonVO<DictionaryDetailItem | null>, DictionaryUpdatePayload>(UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除字典记录，服务端按 data.id 解析目标记录。 */
export function deleteDictionary(payload: DictionaryDeletePayload) {
	return http.post<JsonVO<null>, DictionaryDeletePayload>(DELETE_API_URL, {
		data: payload,
	});
}

export default useDictionaryListQuery;
