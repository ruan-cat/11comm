import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

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

// ==================== 接口函数 ====================

/**
 * 抄表类型分页查询
 * @description
 * 获取抄表类型分页列表
 */
export function queryAllMeterReadingType<T = PageDTO<TableReadingTypeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-tablereadingtype/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
		options,
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
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				type_name: "",
				remark: "",
				community_id: "",
			},
		},
		options,
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
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				type_name: "",
				remark: "",
				type_id: "",
			},
		},
		options,
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
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				type_id: "",
			},
		},
		options,
	});
}
