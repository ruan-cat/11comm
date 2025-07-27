import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加配置项参数
 */
export interface AddConfigParams {
	/** 域名 */
	domain: string;
	/** 配置键 */
	key: string;
	/** 配置名称 */
	name: string;
	/** 备注 */
	remark?: string;
	/** 配置值 */
	value: string;
}

/**
 * 删除配置参数
 */
export interface DeleteConfigParams {
	/** 配置ID */
	id: string;
}

/**
 * 查询配置列表参数
 */
export interface QueryConfigListParams {
	/** 配置项 */
	domain?: string;
	/** 键 */
	key?: string;
	/** 名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 配置项数据模型
 */
export interface ConfigDataModel {
	/** 域名 */
	domain: string;
	/** 配置项编号 */
	id: number;
	/** 配置键 */
	key: string;
	/** 配置名称 */
	name: string;
	/** 备注 */
	remark?: string;
	/** 配置值 */
	value: string;
}

/**
 * 修改配置项参数
 */
export interface UpdateConfigParams {
	/** 域名 */
	domain: string;
	/** ID */
	id: string;
	/** 配置键 */
	key: string;
	/** 配置名称 */
	name: string;
	/** 备注 */
	remark?: string;
	/** 配置值 */
	value: string;
}

// ==================== 接口函数 ====================

/**
 * 添加配置
 */
export function addConfig<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddConfigParams>({
		url: "/j2-configmanager/config/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				domain: "",
				key: "",
				name: "",
				remark: "",
				value: "",
			},
		},
		options,
	});
}

/**
 * 删除配置
 */
export function deleteConfig<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteConfigParams>({
		url: "/j2-configmanager/config/delete",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				id: "",
			},
		},
		options,
	});
}

/**
 * 获取配置列表（条件+分页）
 */
export function queryConfigList<T = PageDTO<ConfigDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryConfigListParams>({
		url: "/j2-configmanager/config/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				domain: "",
				key: "",
				name: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 修改配置
 */
export function updateConfig<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateConfigParams>({
		url: "/j2-configmanager/config/updata",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				domain: "",
				id: "",
				key: "",
				name: "",
				remark: "",
				value: "",
			},
		},
		options,
	});
}
