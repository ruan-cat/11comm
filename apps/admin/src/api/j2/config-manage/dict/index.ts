import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加字典参数
 */
export interface AddDictParams {
	/** 描述 */
	description?: string;
	/** 名称 */
	name: string;
	/** 字典类型对应编号 */
	specId: string;
	/** 值 */
	statusCd?: string;
}

/**
 * 修改字典参数
 */
export interface UpdateDictParams {
	/** 描述 */
	description?: string;
	/** 字典编号 */
	id: number;
	/** 名称 */
	name?: string;
	/** 字典类型对应编号 */
	specId?: string;
	/** 值 */
	statusCd?: string;
}

/**
 * 查询字典列表参数
 */
export interface QueryDictListParams {
	/** 名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 字典类型对应编号 */
	specId?: string;
	/** 值 */
	statusCd?: string;
}

/**
 * 字典数据模型
 */
export interface DictDataModel {
	/** 描述 */
	description?: string;
	/** 名称 */
	name?: string;
	/** 字典类型名称 */
	specName?: string;
	/** 值 */
	statusCd?: string;
}

/**
 * 删除字典参数
 */
export interface DeleteDictParams {
	/** 字典编号 */
	id: string;
}

// ==================== 接口函数 ====================

/**
 * 添加字典
 */
export function addDict<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddDictParams>({
		url: "/j2-configmanager/sys/add-t_dict",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				description: "",
				name: "",
				specId: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 修改字典
 */
export function updateDict<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateDictParams>({
		url: "/j2-configmanager/sys/modify-t_dict",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				description: "",
				id: 0,
				name: "",
				specId: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 获取字典列表(条件+分页)
 */
export function queryDictList<T = PageDTO<DictDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryDictListParams>({
		url: "/j2-configmanager/sys/query-t_dict",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				name: "",
				pageIndex: 1,
				pageSize: 10,
				specId: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 删除字典
 */
export function deleteDict<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteDictParams>({
		url: "/j2-configmanager/sys/remove-t_dict",
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
