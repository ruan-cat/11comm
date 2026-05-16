/**
 * @file change API Hook
 * @description Change API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type {
	ChangeCreatePayload,
	ChangeDeletePayload,
	ChangeQueryParams,
	ChangeUpdatePayload,
	ContractChangeDetailVO,
	JsonVO,
	ChangeListItem,
} from "@01s-11comm/type";

/** API 璺緞 */
const LIST_API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/change/list", import.meta.env);
/** 详情接口路径 */
const DETAIL_API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/change/detail", import.meta.env);
/** 创建接口路径 */
const CREATE_API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/change/create", import.meta.env);
/** 更新接口路径 */
const UPDATE_API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/change/update", import.meta.env);
/** 删除接口路径 */
const DELETE_API_URL = resolveAdminApiRequestUrl("/api/property-manage/contract-manage/change/delete", import.meta.env);

/** 鏌ヨ閿墠缂€ */
const QUERY_KEY_PREFIX = "change";

/** 详情参数 */
export interface ChangeDetailPayload {
	id: string;
}

/**
 * change鍒楄〃鏌ヨ Hook
 * Change list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useChangeListQuery(initialParams: Partial<ChangeQueryParams>) {
	return useListQuery<ChangeListItem, ChangeQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/**
 * 查询合同变更详情
 * @param payload - 详情查询参数
 */
export function getChangeDetail(payload: ChangeDetailPayload) {
	return http.post<JsonVO<ContractChangeDetailVO>, ChangeDetailPayload>(DETAIL_API_URL, { data: payload });
}

/**
 * 创建合同变更
 * @param payload - 创建参数
 */
export function createChange(payload: ChangeCreatePayload) {
	return http.post<JsonVO<ContractChangeDetailVO>, ChangeCreatePayload>(CREATE_API_URL, { data: payload });
}

/**
 * 更新合同变更
 * @param payload - 更新参数
 */
export function updateChange(payload: ChangeUpdatePayload) {
	return http.post<JsonVO<ContractChangeDetailVO>, ChangeUpdatePayload>(UPDATE_API_URL, { data: payload });
}

/**
 * 删除合同变更
 * @param payload - 删除参数
 */
export function deleteChange(payload: ChangeDeletePayload) {
	return http.post<JsonVO<null>, ChangeDeletePayload>(DELETE_API_URL, { data: payload });
}

export default {
	useChangeListQuery,
	getChangeDetail,
	createChange,
	updateChange,
	deleteChange,
};
