import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加停车场参数
 */
export interface AddParkingLotParams {
	/** 小区id */
	communityId: string;
	/** 停车场编号 */
	num: string;
	/** 外部编码 */
	out_num?: string;
	/** 备注 */
	remark?: string;
	/** 停车场类型 */
	type: string;
}

/**
 * 获取停车场列表参数
 */
export interface GetParkingLotListParams {
	/** 停车场编号 */
	num?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 停车场类型 */
	type_cd?: string;
}

/**
 * 停车场信息数据模型
 */
export interface ParkingLotInfoDataModel {
	/** 创建时间 */
	create_time?: string;
	/** 停车场编号 */
	num?: string;
	/** 外部编码 */
	out_num?: string;
	/** 停车场id */
	pa_id?: string;
	/** 备注 */
	remark?: string;
	/** 停车场类型 */
	type?: string;
}

/**
 * 停车场查询参数
 */
export interface ParkingLotQueryParams {
	/** 社区Id */
	communityId?: string;
	/** 状态 */
	statusCd?: string;
	/** 停车场类型 */
	typeCd?: string;
}

/**
 * 停车场名称数据模型
 */
export interface ParkingLotNameDataModel {
	/** 停车场名称列表 */
	names?: string[];
}

/**
 * 删除停车场参数
 */
export interface RemoveParkingLotParams {
	/** 停车场ID */
	paId: string;
}

/**
 * 修改停车场参数
 */
export interface UpdateParkingLotParams {
	/** 停车场编号 */
	num: string;
	/** 外部编码 */
	out_num?: string;
	/** 停车场id */
	pa_id?: string;
	/** 备注 */
	remark?: string;
	/** 停车场类型 */
	type: string;
}

// ==================== 接口函数 ====================

/**
 * 添加停车场
 */
export function insertParkingLot<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddParkingLotParams>({
		url: "/j7-park/park-manage/parking-lot-manage/insert-parking-lot",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				communityId: "",
				num: "",
				type: "",
			},
		},
		options,
	});
}

/**
 * 获取停车场列表（条件+分页）
 */
export function listParkingLots<T = PageDTO<ParkingLotInfoDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetParkingLotListParams>({
		url: "/j7-park/park-manage/parking-lot-manage/list-parking-lots",
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
 * 获取停车场名称列表
 */
export function listParkingAreaName<T = ParkingLotNameDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ParkingLotQueryParams>({
		url: "/j7-park/park-manage/parking-lot-manage/list-parkingArea-name",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 删除停车场
 */
export function removeParkingLot<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveParkingLotParams>({
		url: "/j7-park/park-manage/parking-lot-manage/remove-parking-lot",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				paId: "",
			},
		},
		options,
	});
}

/**
 * 修改停车场
 */
export function updateParkingLot<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateParkingLotParams>({
		url: "/j7-park/park-manage/parking-lot-manage/update-parking-lot",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				num: "",
				type: "",
			},
		},
		options,
	});
}
