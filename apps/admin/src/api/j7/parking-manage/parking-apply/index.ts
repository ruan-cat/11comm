import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加申请参数
 */
export interface AddApplyParams {
	/** 申请人id */
	applyPersonId: string;
	/** 申请人电话 */
	applyPersonLink: string;
	/** 申请人 */
	applyPersonName: string;
	/** 汽车品牌 */
	carBrand: string;
	/** 颜色 */
	carColor: string;
	/** 车牌号 */
	carNum: string;
	/** 车辆类型 */
	carType: string;
	/** 小区id */
	communityId: string;
	/** 结束时间 */
	endTime: string;
	/** 备注 */
	remark?: string;
	/** 起租时间 */
	startTime: string;
}

/**
 * 修改申请参数
 */
export interface ModifyApplyParams {
	/** 申请ID */
	applyId: string;
	/** 汽车品牌 */
	carBrand: string;
	/** 颜色 */
	carColor: string;
	/** 车牌号 */
	carNum: string;
	/** 车辆类型 */
	carType: string;
	/** 结束时间 */
	endTime: string;
	/** 备注 */
	remark?: string;
	/** 起租时间 */
	startTime: string;
}

/**
 * 获取申请列表参数
 */
export interface GetParkingApplyListParams {
	/** 申请人名称 */
	applyPersonName?: string;
	/** 车辆品牌 */
	carBrand?: string;
	/** 申请id */
	id?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 停车申请数据模型
 */
export interface ParkingApplyDataModel {
	/** 申请ID */
	applyId?: string;
	/** 汽车品牌 */
	carBrand?: string;
	/** 颜色 */
	carColor?: string;
	/** 车牌号 */
	carNum?: string;
	/** 车辆类型 */
	carType?: string;
	/** 结束时间 */
	endTime?: string;
	/** 备注 */
	remark?: string;
	/** 起租时间 */
	startTime?: string;
}

/**
 * 删除申请参数
 */
export interface RemoveApplyParams {
	/** 申请id */
	applyId: string;
}

/**
 * 审核申请参数
 */
export interface ReviewApplicationParams {
	/** 申请ID */
	applyId?: string;
	/** 费用项ID */
	configId?: string;
	/** 费用ID */
	feeId?: string;
	/** 车位ID */
	psId?: string;
	/** 备注 */
	remark?: string;
	/** 状态 */
	state?: string;
}

// ==================== 接口函数 ====================

/**
 * 添加申请
 */
export function addApply<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddApplyParams>({
		url: "/j7-park/park-manage/parking-apply/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				applyPersonId: "",
				applyPersonLink: "",
				applyPersonName: "",
				carBrand: "",
				carColor: "",
				carNum: "",
				carType: "",
				communityId: "",
				endTime: "",
				startTime: "",
			},
		},
		options,
	});
}

/**
 * 修改申请
 */
export function modifyApply<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyApplyParams>({
		url: "/j7-park/park-manage/parking-apply/modify",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				applyId: "",
				carBrand: "",
				carColor: "",
				carNum: "",
				carType: "",
				endTime: "",
				startTime: "",
			},
		},
		options,
	});
}

/**
 * 获取申请列表（分页+条件）
 */
export function getParkingApplyList<T = PageDTO<ParkingApplyDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetParkingApplyListParams>({
		url: "/j7-park/park-manage/parking-apply/query",
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
 * 删除申请
 */
export function removeApply<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveApplyParams>({
		url: "/j7-park/park-manage/parking-apply/remove",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				applyId: "",
			},
		},
		options,
	});
}

/**
 * 审核申请
 */
export function reviewApplication<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ReviewApplicationParams>({
		url: "/j7-park/park-manage/parking-apply/review",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}
