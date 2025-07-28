import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 跟踪记录查询参数
 */
export interface QueryTrackRecordParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 跟踪记录id */
	ardr_id: string;
}

/**
 * 跟踪记录查询参数（分页）
 */
export interface QueryRecordParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 空置房申请id */
	ard_id: string;
}

/**
 * 添加跟踪记录参数
 */
export interface AddTrackRecordParams {
	/** 跟踪记录id */
	ardr_id?: string;
	/** 房屋名称 */
	room_name?: string;
	/** 创建人（操作人员） */
	create_user_name?: string;
	/** 创建时间 */
	create_time?: string;
	/** 状态 */
	state?: string;
	/** 是否违规 */
	is_true?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 删除跟踪记录参数
 */
export interface DeleteTrackRecordParams {
	/** 跟踪记录id */
	ardr_id: string;
}

/**
 * 优惠申请查询参数
 */
export interface QueryApplyDiscountParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 房屋名称 */
	room_name?: string;
	/** 申请类型 */
	apply_type: string;
	/** 状态 */
	state: string;
}

/**
 * 添加优惠申请参数
 */
export interface AddApplyDiscountParams {
	/** 房屋名称 */
	roomName?: string;
	/** 申请类型 */
	applyType?: string;
	/** 创建人 */
	createUserName?: string;
	/** 创建手机号 */
	createUserTel?: string;
	/** 开始时间 */
	startTime?: string;
	/** 结束时间 */
	endTime?: string;
	/** 创建备注 */
	createRemark?: string;
}

/**
 * 修改优惠申请参数
 */
export interface ModifyApplyDiscountParams {
	/** 房屋名称 */
	roomName?: string;
	/** 申请类型 */
	applyType?: string;
	/** 创建人 */
	createUserName?: string;
	/** 创建手机号 */
	createUserTel?: string;
	/** 开始时间 */
	startTime?: string;
	/** 结束时间 */
	endTime?: string;
	/** 创建备注 */
	createRemark?: string;
	/** 主键id */
	ardId?: string;
	/** 小区id */
	communityId?: string;
	/** 房屋id */
	roomId?: string;
	/** 折扣id */
	discountId?: string;
	/** 验房人 */
	checkUserId?: string;
	/** 通过人 */
	reviewUserId?: string;
	/** 审核状态 */
	state?: string;
	/** 验房备注信息 */
	checkRemark?: string;
	/** 通过备注信息 */
	reviewRemark?: string;
	/** 创建时间 */
	createTime?: string;
	/** 数据状态 */
	statusCd?: string;
	/** 是否可用 */
	inUse?: string;
	/** 业务id */
	bId?: string;
	/** 费用id */
	feeId?: string;
	/** 返还方式 */
	returnWay?: string;
	/** 返还金额 */
	returnAmount?: string;
}

/**
 * 删除优惠申请参数
 */
export interface RemoveApplyDiscountParams {
	/** 空置房申请id */
	ard_id: string;
}

/**
 * 修改优惠申请状态参数
 */
export interface ModifyApplyDiscountStateParams {
	/** 空置房申请id */
	ard_id: string;
	/** 审核状态 */
	state: string;
}

/**
 * 优惠申请数据模型
 */
export interface ApplyDiscountDataModel {
	/** 房屋名称 */
	roomName?: string;
	/** 申请类型 */
	applyType?: string;
	/** 创建人 */
	createUserName?: string;
	/** 创建手机号 */
	createUserTel?: string;
	/** 开始时间 */
	startTime?: string;
	/** 结束时间 */
	endTime?: string;
	/** 创建备注 */
	createRemark?: string;
	/** 主键id */
	ardId?: string;
	/** 小区id */
	communityId?: string;
	/** 房屋id */
	roomId?: string;
	/** 折扣id */
	discountId?: string;
	/** 验房人 */
	checkUserId?: string;
	/** 通过人 */
	reviewUserId?: string;
	/** 审核状态 */
	state?: string;
	/** 验房备注信息 */
	checkRemark?: string;
	/** 通过备注信息 */
	reviewRemark?: string;
	/** 创建时间 */
	createTime?: string;
	/** 数据状态 */
	statusCd?: string;
	/** 是否可用 */
	inUse?: string;
	/** 业务id */
	bId?: string;
	/** 费用id */
	feeId?: string;
	/** 返还方式 */
	returnWay?: string;
	/** 返还金额 */
	returnAmount?: string;
}

/**
 * 跟踪记录数据模型
 */
export interface ApplyDiscountRecordDataModel {
	/** 空置房验房跟踪记录id */
	ardr_id?: string;
	/** 房屋名称 */
	room_name?: string;
	/** 操作人员 */
	create_user_name?: string;
	/** 创建时间 */
	create_time?: string;
	/** 状态 */
	state?: string;
	/** 是否违规 */
	is_true?: string;
	/** 备注 */
	remark?: string;
}

// ==================== 接口函数 ====================

/**
 * 查看跟踪记录详情
 */
export function queryTrackRecordDetail<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryTrackRecordParams>({
		url: "/c4-applydiscount/track-record-query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				ardr_id: "",
			},
		},
		options,
	});
}

/**
 * 添加跟踪记录
 */
export function addTrackRecord<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddTrackRecordParams>({
		url: "/c4-applydiscount/track-record-add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 删除跟踪记录
 */
export function deleteTrackRecord<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteTrackRecordParams>({
		url: "/c4-applydiscount/track-record-delete",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				ardr_id: "",
			},
		},
		options,
	});
}

/**
 * 优惠申请分页查询
 */
export function queryAllApplyDiscount<T = PageDTO<ApplyDiscountDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryApplyDiscountParams>({
		url: "/c4-applydiscount/query-all-applydiscount",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				apply_type: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 添加优惠申请
 */
export function addApplyDiscount<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddApplyDiscountParams>({
		url: "/c4-applydiscount/add-applyDiscount",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 优惠申请修改
 */
export function modifyApplyDiscount<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyApplyDiscountParams>({
		url: "/c4-applydiscount/all-modify-applydiscount",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 获取跟踪记录（分页）
 */
export function queryRecord<T = PageDTO<ApplyDiscountRecordDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRecordParams>({
		url: "/c4-applydiscount/query-record",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				ard_id: "",
			},
		},
		options,
	});
}

/**
 * 删除优惠申请
 */
export function removeApplyDiscount<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RemoveApplyDiscountParams>({
		url: "/applydiscount/remove-apply-discount",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				ard_id: "",
			},
		},
		options,
	});
}

/**
 * 修改优惠申请状态
 */
export function modifyApplyDiscountState<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyApplyDiscountStateParams>({
		url: "/c4-applydiscount/modify-discount-state",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				ard_id: "",
				state: "",
			},
		},
		options,
	});
}
