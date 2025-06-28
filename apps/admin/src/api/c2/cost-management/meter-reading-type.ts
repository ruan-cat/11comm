import { useRequest } from "@/composables/use-request";

/**
 * 抄表类型信息
 */
export interface TableReadingTypeDTO {
	/** 名称 */
	type_name: string;
	/** 说明 */
	remark: string;
	/** 小区id */
	community_id: string;
	/** 抄表类型id */
	type_id?: string;
	/** 创建时间 */
	create_time?: string;
}

/**
 * 新增抄表类型参数
 */
export interface TableReadingTypeAddDTO {
	/** 名称 */
	type_name: string;
	/** 说明 */
	remark: string;
	/** 小区id */
	community_id: string;
}

/**
 * 修改抄表类型参数
 */
export interface TableReadingTypeUpdateDTO {
	/** 名称 */
	type_name: string;
	/** 说明 */
	remark: string;
	/** 抄表类型id */
	type_id: string;
}

/**
 * 删除抄表类型参数
 */
export interface TableReadingTypeRemoveDTO {
	/** 抄表类型id */
	type_id: string;
}

/**
 * 抄表类型分页查询
 * @description
 * 获取抄表类型分页列表
 */
export function queryAllMeterReadingType<T = PageDTO<TableReadingTypeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-tablereadingtype/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
	});
}

/**
 * 新增抄表类型
 * @description
 * 添加新的抄表类型
 */
export function addMeterReadingType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TableReadingTypeAddDTO>({
		url: "/comm-c2-tablereadingtype/add",
		options,
		httpParamWay: "body",
		config: {
			method: "post",
			data: {
				type_name: "",
				remark: "",
				community_id: "",
			},
		},
	});
}

/**
 * 修改抄表类型
 * @description
 * 更新抄表类型信息
 */
export function updateMeterReadingType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TableReadingTypeUpdateDTO>({
		url: "/comm-c2-tablereadingtype/upadte",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				type_name: "",
				remark: "",
				type_id: "",
			},
		},
	});
}

/**
 * 删除抄表类型
 * @description
 * 删除指定的抄表类型
 */
export function removeMeterReadingType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TableReadingTypeRemoveDTO>({
		url: "/comm-c2-tablereadingtype/delete",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				type_id: "",
			},
		},
	});
}
