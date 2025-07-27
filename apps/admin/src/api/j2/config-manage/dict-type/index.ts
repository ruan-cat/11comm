import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 字典类型数据传输对象
 */
export interface DictTypeDataModel {
	/** 字典类型名称 */
	specName: string;
	/** 状态,0-正常，1-停用 */
	statusCd: string;
}

/**
 * 添加字典类型参数
 */
export interface AddDictTypeParams {
	/** 字典类型名称 */
	specName: string;
	/** 状态,0-正常，1-停用 */
	statusCd: string;
}

/**
 * 删除字典类型参数
 */
export interface DeleteDictTypeParams {
	/** 字典类型编号 */
	id: string;
}

/**
 * 字典类型传输数据对象
 */
export interface DictTypeTransferDataModel {
	/** 编号 */
	specId: string;
	/** 字典类型名称 */
	specName: string;
	/** 状态,0-正常，1-停用 */
	statusCd: string;
}

/**
 * 修改字典类型参数
 */
export interface UpdateDictTypeParams {
	/** 编号 */
	specId: string;
	/** 字典类型名称 */
	specName: string;
	/** 状态,0-正常，1-停用 */
	statusCd: string;
}

/**
 * 查询字典类型列表参数
 */
export interface QueryDictTypeListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 请选择名称 */
	specName?: string;
}

// ==================== 接口函数 ====================

/**
 * 添加字典类型
 */
export function addDictType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddDictTypeParams>({
		url: "/j2-configmanager/dict-spec/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				specName: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 删除字典类型
 */
export function deleteDictType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteDictTypeParams>({
		url: "/j2-configmanager/dict-spec/delete",
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
 * 修改字典类型
 */
export function updateDictType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateDictTypeParams>({
		url: "/j2-configmanager/dict-spec/modify",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				specId: "",
				specName: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 查询字典类型列表(条件+分页)
 */
export function queryDictTypeList<T = PageDTO<DictTypeTransferDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryDictTypeListParams>({
		url: "/j2-configmanager/dict-spec/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				specName: "",
			},
		},
		options,
	});
}

/**
 * 查询字典类型名称列表
 */
export function queryDictTypeNameList<T = DictTypeTransferDataModel[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T>({
		url: "/j2-configmanager/dict-spec/query-names",
		httpParamWay: "body",
		config: {
			method: "GET",
			data: {},
		},
		options,
	});
}
