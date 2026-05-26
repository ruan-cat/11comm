/**
 * @file 初始化小区查询 Hook
 * @description 封装初始化小区列表和 CUD 正式业务接口调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type {
	InitializeCommunityListItem,
	InitializeCommunityQueryParams,
	JsonVO,
	SmInitializeCell,
} from "@01s-11comm/type";

/** API 路径 */
const API_PREFIX = "/api/setting-manage/system-manage/initialize-cell";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 初始化小区写入接口字段集合，configParams 保留为后端初始化任务参数透传对象。 */
export interface InitializeCellPayload {
	initItem: string;
	initStatus?: string | null;
	configParams?: unknown;
}

/** 新增初始化小区任务时提交的业务 payload。 */
export type InitializeCellCreatePayload = InitializeCellPayload;

/** 修改初始化小区任务时允许局部提交写入字段，但必须携带 id 用于服务端定位记录。 */
export type InitializeCellUpdatePayload = Partial<InitializeCellPayload> & {
	id: string;
};

export interface InitializeCellDeletePayload {
	/** 删除接口只接收单条初始化小区任务 id，不承载其他业务字段。 */
	id: string;
}

/**
 * 获取初始化小区列表数据
 * @param initialParams 初始查询参数
 * @returns 查询结果
 */
export function useInitializeCommunityListQuery(initialParams: Partial<InitializeCommunityQueryParams>) {
	return useListQuery<InitializeCommunityListItem, InitializeCommunityQueryParams>({
		queryKeyPrefix: "settingManage:systemManage:initializeCommunity:list",
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 新增初始化小区任务，data 字段保持为服务端 create 接口期望的写入 payload。 */
export function createInitializeCell(payload: InitializeCellCreatePayload) {
	return http.request<JsonVO<SmInitializeCell | null>>("post", CREATE_API_URL, {
		data: payload,
	});
}

/** 修改初始化小区任务，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateInitializeCell(payload: InitializeCellUpdatePayload) {
	return http.request<JsonVO<SmInitializeCell | null>>("post", UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除初始化小区任务，服务端按 data.id 解析目标记录。 */
export function deleteInitializeCell(payload: InitializeCellDeletePayload) {
	return http.request<JsonVO<null>>("post", DELETE_API_URL, {
		data: payload,
	});
}
