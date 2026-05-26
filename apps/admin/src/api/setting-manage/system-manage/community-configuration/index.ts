/**
 * @file 小区配置 API Hook
 * @description 封装小区配置列表和 CUD 正式业务接口调用。
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { resolveAdminApiRequestUrl } from "@/utils/http/api-base-url";
import type {
	JsonVO,
	SettingManagementCommunityConfigurationListQuery,
	SmCommunityConfiguration,
} from "@01s-11comm/type";

const API_PREFIX = "/api/setting-manage/system-manage/community-configuration";
const LIST_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/list`, import.meta.env);
const CREATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/create`, import.meta.env);
const UPDATE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/update`, import.meta.env);
const DELETE_API_URL = resolveAdminApiRequestUrl(`${API_PREFIX}/delete`, import.meta.env);

/** 小区配置列表查询键前缀，必须与页面缓存刷新逻辑保持一致。 */
const QUERY_KEY_PREFIX = "communityConfiguration";

/** 小区配置写入接口字段集合，新增和修改共用这些服务端字段名。 */
export interface CommunityConfigurationPayload {
	csId?: string;
	communityId?: string;
	communityName?: string;
	settingName?: string;
	settingValue?: string;
	settingType?: string;
	statusCd?: string;
	remark?: string;
	operator?: string;
}

/** 新增小区配置时提交的业务 payload。 */
export type CommunityConfigurationCreatePayload = CommunityConfigurationPayload;

/** 修改小区配置时允许局部提交写入字段，但必须携带 id 用于服务端定位记录。 */
export type CommunityConfigurationUpdatePayload = Partial<CommunityConfigurationPayload> & {
	id: string;
};

export interface CommunityConfigurationDeletePayload {
	/** 删除接口只接收单条小区配置记录 id，不承载其他业务字段。 */
	id: string;
}

/** 小区配置列表查询 Hook，页面层只需要传入初始搜索参数。 */
export function useCommunityConfigurationListQuery(
	initialParams: Partial<SettingManagementCommunityConfigurationListQuery>,
) {
	return useListQuery<SmCommunityConfiguration, SettingManagementCommunityConfigurationListQuery>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

/** 新增小区配置记录，data 字段保持为服务端 create 接口期望的写入 payload。 */
export function createCommunityConfiguration(payload: CommunityConfigurationCreatePayload) {
	return http.request<JsonVO<SmCommunityConfiguration | null>>("post", CREATE_API_URL, {
		data: payload,
	});
}

/** 修改小区配置记录，data 中的 id 用于定位记录，其余字段为局部更新内容。 */
export function updateCommunityConfiguration(payload: CommunityConfigurationUpdatePayload) {
	return http.request<JsonVO<SmCommunityConfiguration | null>>("post", UPDATE_API_URL, {
		data: payload,
	});
}

/** 删除小区配置记录，服务端按 data.id 解析目标记录。 */
export function deleteCommunityConfiguration(payload: CommunityConfigurationDeletePayload) {
	return http.request<JsonVO<null>>("post", DELETE_API_URL, {
		data: payload,
	});
}

export default useCommunityConfigurationListQuery;
