import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加配置项模型
 */
export interface AddConfigItemParams {
	/** 配置项 */
	domain: string;
	/** 名称 */
	domainName: string;
	/** 描述 */
	remark: string;
	/** 排序 */
	seq: number;
}

/**
 * 配置项名称传输数据对象
 */
export interface ConfigItemNameDataModel {
	/** 名称 */
	domainName: string;
	/** 编号 */
	id: string;
	/** 描述 */
	remark: string;
}

/**
 * 删除配置项参数
 */
export interface DeleteConfigItemParams {
	/** 配置项编号 */
	id: string;
}

/**
 * 查询配置项列表参数
 */
export interface QueryConfigItemListParams {
	/** 配置项 */
	domain?: string;
	/** 配置项名称 */
	domainName?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 配置项传输数据对象
 */
export interface ConfigItemDataModel {
	/** 配置项 */
	domain: string;
	/** 名称 */
	domainName: string;
	/** 配置项id */
	id: string;
	/** 描述 */
	remark: string;
	/** 排序 */
	seq: string;
}

/**
 * 配置项数据传输模型（用于修改）
 */
export interface UpdateConfigItemParams {
	/** 配置项 */
	domain: string;
	/** 名称 */
	domainName: string;
	/** 配置项id */
	id: string;
	/** 描述 */
	remark: string;
	/** 排序 */
	seq: string;
}

// ==================== 接口函数 ====================

/**
 * 添加配置项
 */
export function addConfigItem<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddConfigItemParams>({
		url: "/j2-configmanager/c-mapping-domain/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				domain: "",
				domainName: "",
				remark: "",
				seq: 0,
			},
		},
		options,
	});
}

/**
 * 获取配置项名称列表
 */
export function queryConfigItemNameList<T = ConfigItemNameDataModel[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T>({
		url: "/j2-configmanager/c-mapping-domain/all-domain-name",
		httpParamWay: "body",
		config: {
			method: "GET",
			data: {},
		},
		options,
	});
}

/**
 * 删除配置项
 */
export function deleteConfigItem<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteConfigItemParams>({
		url: "/j2-configmanager/c-mapping-domain/delete",
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
 * 获取配置项列表（条件+分页）
 */
export function queryConfigItemList<T = PageDTO<ConfigItemDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryConfigItemListParams>({
		url: "/j2-configmanager/c-mapping-domain/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				domain: "",
				domainName: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 修改配置项
 */
export function updateConfigItem<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateConfigItemParams>({
		url: "/j2-configmanager/c-mapping-domain/update",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				domain: "",
				domainName: "",
				id: "",
				remark: "",
				seq: "",
			},
		},
		options,
	});
}
