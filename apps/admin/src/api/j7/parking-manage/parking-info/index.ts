import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 批量添加车位参数
 */
export interface BatchAddParkingSpacesParams {
	/** 结束编号 */
	endNumber: number;
	/** 编号前缀 */
	numberPrefix?: string;
	/** 停车场ID */
	paId: string;
	/** 车位类型 */
	parkingType: string;
	/** 开始编号 */
	startNumber: number;
}

/**
 * 车位保存参数
 */
export interface ParkingSaveParams {
	/** 车位面积 */
	area: number;
	/** 小区id */
	communityId: string;
	/** 车位编号 */
	num: string;
	/** 停车场ID */
	paId: string;
	/** 车位类型 */
	parkingType: string;
	/** 车位ID */
	psId: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取车位列表参数
 */
export interface GetParkingInfoListParams {
	/** 车位编号 */
	num?: string;
	/** 停车场ID */
	paId?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 车位ID */
	psId?: string;
	/** 车位状态 */
	state?: string;
}

/**
 * 车位查询数据模型
 */
export interface ParkingInfoDataModel {
	/** 车位面积 */
	area?: number;
	/** 小区id */
	communityId?: string;
	/** 创建时间 */
	createTime?: string;
	/** 车位编号 */
	num?: string;
	/** 停车场ID */
	paId?: string;
	/** 停车场编号 */
	paNum?: string;
	/** 车位类型 */
	parkingType?: string;
	/** 车位ID */
	psId?: string;
	/** 备注 */
	remark?: string;
	/** 车位状态 */
	state?: string;
}

/**
 * 删除车位参数
 */
export interface RemoveParkingSpaceParams {
	/** 车位ID */
	psId: string;
}

// ==================== 接口函数 ====================

/**
 * 批量添加车位
 */
export function batchAddParkingSpaces<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, BatchAddParkingSpacesParams>({
		url: "/j7-park/park-manage/parking-info/batch-add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				endNumber: 0,
				paId: "",
				parkingType: "",
				startNumber: 0,
			},
		},
		options,
	});
}

/**
 * 修改车位
 */
export function updateParkingInfo<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ParkingSaveParams>({
		url: "/j7-park/park-manage/parking-info/edit",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				area: 0,
				communityId: "",
				num: "",
				paId: "",
				parkingType: "",
				psId: "",
			},
		},
		options,
	});
}

/**
 * 获取车位列表（条件+分页）
 */
export function getParkingInfoList<T = PageDTO<ParkingInfoDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetParkingInfoListParams>({
		url: "/j7-park/park-manage/parking-info/query",
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
 * 删除车位
 */
export function removeParkingSpace<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, RemoveParkingSpaceParams>({
		url: "/j7-park/park-manage/parking-info/remove/{psId}",
		httpParamWay: "path",
		config: {
			method: "DELETE",
			url: "/j7-park/park-manage/parking-info/remove/{psId}",
		},
		options,
	});
}

/**
 * 添加车位
 */
export function saveParkingInfo<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ParkingSaveParams>({
		url: "/j7-park/park-manage/parking-info/save",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				area: 0,
				communityId: "",
				num: "",
				paId: "",
				parkingType: "",
				psId: "",
			},
		},
		options,
	});
}
