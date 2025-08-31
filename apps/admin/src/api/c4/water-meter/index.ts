import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 水电抄表查询参数
 */
export interface QueryWaterMeterParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 表id */
	water_id?: string;
	/** 抄表类型 */
	meter_type?: string;
	/** 房屋名称1-1-101 */
	obj_name?: string;
}

/**
 * 水电抄表数据模型
 */
export interface WaterMeterDataModel {
	/** 抄表类型 */
	meter_type?: string;
	/** 房屋名称1-1-101 */
	obj_name?: string;
	/** 上期度数 */
	pre_degrees?: number;
	/** 本期度数 */
	cur_degrees?: number;
	/** 上期读表时间 */
	pre_reading_time?: string;
	/** 本期读表时间 */
	cur_reading_time?: string;
	/** 备注 */
	remark?: string;
	/** 表id */
	water_id?: string;
	/** 创建时间 */
	create_time?: string;
}

/**
 * 添加水电抄表参数
 */
export interface AddWaterMeterParams {
	/** 抄表类型 */
	meter_type?: string;
	/** 房屋名称1-1-101 */
	obj_name?: string;
	/** 上期度数 */
	pre_degrees?: number;
	/** 本期度数 */
	cur_degrees?: number;
	/** 上期读表时间 */
	pre_reading_time?: string;
	/** 本期读表时间 */
	cur_reading_time?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 修改水电抄表参数
 */
export interface ModifyWaterMeterParams {
	/** 抄表类型 */
	meter_type?: string;
	/** 房屋名称1-1-101 */
	obj_name?: string;
	/** 上期度数 */
	pre_degrees?: number;
	/** 本期度数 */
	cur_degrees?: number;
	/** 上期读表时间 */
	pre_reading_time?: string;
	/** 本期读表时间 */
	cur_reading_time?: string;
	/** 备注 */
	remark?: string;
	/** 表id */
	water_id?: string;
	/** 创建时间 */
	create_time?: string;
}

/**
 * 删除水电抄表参数
 */
export interface DeleteWaterMeterParams {
	/** 表id */
	water_id: string;
}

// ==================== 接口函数 ====================

/**
 * 水电抄表分页查询
 */
export function queryWaterMeter<T = PageDTO<WaterMeterDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryWaterMeterParams>({
		url: "/c4-watermeter/query-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 添加水电抄表
 */
export function addWaterMeter<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddWaterMeterParams>({
		url: "/c4-watermeter/add-meter",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 修改水电抄表
 */
export function modifyWaterMeter<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyWaterMeterParams>({
		url: "/c4-watermeter/modify-meter",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 删除水电抄表
 */
export function deleteWaterMeter<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteWaterMeterParams>({
		url: "/c4-watermeter/remove-meter",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				water_id: "",
			},
		},
		options,
	});
}
