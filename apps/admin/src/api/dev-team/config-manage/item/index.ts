/**
 * @file 配置项 API Hook
 * @description 封装基于字典项接口承载的配置项列表、详情和 CUD 正式业务调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type { BaseListQueryParams, JsonVO } from "@01s-11comm/type";

const API_PREFIX = "/api/dev-team/config-manage/item";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const DETAIL_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/detail`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 配置项列表查询键前缀，必须与页面缓存刷新逻辑保持一致。 */
const QUERY_KEY_PREFIX = "configItem";

/** 配置项列表项，字段形态对齐字典项后端返回结构。 */
export interface DictionaryItemListItem {
	id: string;
	dictionaryId: string | null;
	itemName: string | null;
	itemCode: string | null;
	itemValue: string | null;
	sortOrder: number | null;
	isDefault?: boolean | null;
	createTime: string;
	updateTime: string;
}

/** 配置项列表搜索参数，继承通用分页并补充字典项业务筛选字段。 */
export interface DictionaryItemQueryParams extends BaseListQueryParams {
	dictionaryId?: string;
	itemName?: string;
	itemCode?: string;
}

export interface ConfigItemDetailPayload {
	/** 配置项记录主键，作为详情接口查询参数透传。 */
	id: string;
}

/** 配置项写入接口字段集合，新增和修改共用这些服务端字段名。 */
export interface ConfigItemWritePayload {
	dictionaryId: string;
	itemName: string;
	itemCode: string;
	sortOrder: number;
	isDefault: boolean;
}

/** 新增配置项时完整提交写入字段。 */
export type ConfigItemCreatePayload = ConfigItemWritePayload;

/** 修改配置项时允许局部提交写入字段，但必须携带 id 用于服务端定位记录。 */
export type ConfigItemUpdatePayload = Partial<ConfigItemWritePayload> & {
	id: string;
};

export interface ConfigItemDeletePayload {
	/** 删除接口只接收单条配置项记录 id，不承载其他业务字段。 */
	id: string;
}

/** 配置项列表查询 Hook，页面层只需要传入初始搜索参数。 */
export function useConfigItemListQuery(initialParams: Partial<DictionaryItemQueryParams>) {
	return useListQuery<DictionaryItemListItem, DictionaryItemQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 获取配置项详情，payload 会作为 query params 传给正式 detail 接口。 */
export function getConfigItemDetail(payload: ConfigItemDetailPayload) {
	return http.get<JsonVO<DictionaryItemListItem | null>, ConfigItemDetailPayload>(DETAIL_API_URL, {
		params: payload,
	});
}

/** 新增配置项记录，data 字段保持为服务端 create 接口期望的写入 payload。 */
export function createConfigItem(payload: ConfigItemCreatePayload) {
	return http.post<JsonVO<DictionaryItemListItem | null>, ConfigItemCreatePayload>(CREATE_API_URL, {
		data: payload,
	});
}

/** 修改配置项记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateConfigItem(payload: ConfigItemUpdatePayload) {
	return http.post<JsonVO<DictionaryItemListItem | null>, ConfigItemUpdatePayload>(UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除配置项记录，服务端按 data.id 解析目标记录。 */
export function deleteConfigItem(payload: ConfigItemDeletePayload) {
	return http.post<JsonVO<null>, ConfigItemDeletePayload>(DELETE_API_URL, {
		data: payload,
	});
}

export default useConfigItemListQuery;
