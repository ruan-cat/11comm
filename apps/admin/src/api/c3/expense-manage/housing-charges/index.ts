import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 创建房屋费用参数
 */
export interface AddHouseFeeDTO {
	/** 房屋号 */
	house_id: string;
	/** 费用类型 */
	fee_type: string;
	/** 收费项目 */
	charge_project: string;
	/** 开始时间 */
	start_time: string;
	/** 结束时间 */
	end_time: string;
	/** 金额 */
	amount: number;
	/** 配置id */
	config_id: string;
}

/**
 * 变更房屋费用参数
 */
export interface ModifyHouseFeeDTO {
	/** 费用id */
	fee_id: string;
	/** 建账时间 */
	create_time: string;
	/** 应收开始时间 */
	start_time: string;
	/** 应收结束时间 */
	end_time: string;
}

/**
 * 取消房屋费用参数
 */
export interface HouseFeeIdDTO {
	/** 费用id */
	fee_id: string;
}

/**
 * 缴纳房屋费用参数
 */
export interface PayFeeDTO {
	/** 是否选择账户 */
	flag: boolean;
	/** 账户类型 */
	account_type: string;
	/** 账户名 */
	account_name: string;
	/** 账户金额 */
	account_amount: number;
	/** 费用id */
	fee_id: string;
	/** 缴费周期 */
	pay_fee_time?: string;
	/** 缴费周期 */
	cycle: number;
	/** 实际缴费周期 */
	real_cycle: number;
	/** 收费开始时间 */
	pay_fee_start_time: string;
	/** 收费截至时间 */
	pay_fee_end_time: string;
	/** 缴费方式 */
	pay_fee_way?: string;
	/** 实收款 */
	amount: number;
	/** 应缴金额 */
	amount_due: number;
	/** 应收款 */
	pay_amount: number;
	/** 备注 */
	remark: string;
	/** 社区id */
	community_id: string;
}

/**
 * 房屋费用信息
 */
export interface HouseFeeMgrDTO {
	/** 费用id */
	fee_id?: string;
	/** 费用项目 */
	fee_name?: string;
	/** 费用标识 */
	fee_flag?: string;
	/** 费用类型 */
	fee_type?: string;
	/** 应收金额 */
	fee_pay?: number;
	/** 建帐时间 */
	makeTime?: string;
	/** 计费起始时间 */
	startTime?: string;
	/** 计费结束时间 */
	endTime?: string;
	/** 状态 */
	status?: string;
	/** 业主id */
	owner_id?: string;
	/** 业主名称 */
	ownerNameLike?: string;
	/** 房屋号 */
	roomNum?: string;
	/** 业主联系方式 */
	owner_phone?: string;
	/** 费用批次 */
	fee_order?: string;
}

/**
 * 获取房屋费用列表查询参数
 */
export interface QueryHouseFeeListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区ID */
	communityId?: string;
	/** 房屋号 */
	roomNum?: string;
	/** 状态 */
	status?: string;
	/** 业主名称 */
	ownerNameLike?: string;
}

/**
 * 获取房屋费用详情查询参数
 */
export interface HouseFeeDetailParams {
	/** 费用id */
	fee_id: string;
}

/**
 * 获取房屋费用项信息查询参数
 */
export interface QueryHouseFeeItemsParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区ID */
	communityId: string;
	/** 房屋号 */
	roomNum: string;
}

/**
 * 缴纳记录信息
 */
export interface RemitFeeDTO {
	/** 编号 */
	detail_id?: string;
	/** 费用项 */
	receipt_id?: string;
	/** 收费对象 */
	pay_obj?: string;
	/** 周期(单位:月) */
	cycle?: number;
	/** 应收/实收(单位:元) */
	receive_received?: string;
	/** 缴费方式 */
	pay_path?: string;
	/** 缴费起始段 */
	pay_period?: string;
	/** 缴费时间 */
	pay_time?: string;
	/** 收银员 */
	receive_id?: string;
	/** 状态 */
	status_cd?: string;
	/** 备注 */
	remark?: string;
	/** 操作 */
	opt?: string;
}

/**
 * 获取缴纳记录查询参数
 */
export interface QueryPaymentRecordsParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 编号 */
	detail_id?: string;
	/** 费用项 */
	receipt_id?: string;
	/** 收费对象 */
	pay_obj?: string;
	/** 周期(单位:月) */
	cycle?: number;
	/** 应收/实收(单位:元) */
	receive_received?: string;
	/** 缴费方式 */
	pay_path?: string;
	/** 缴费起始段 */
	pay_period?: string;
	/** 缴费时间 */
	pay_time?: string;
	/** 收银员 */
	receive_id?: string;
	/** 状态 */
	status_cd?: string;
	/** 备注 */
	remark?: string;
	/** 操作 */
	opt?: string;
}

/**
 * 获取缴纳记录详情查询参数
 */
export interface PaymentRecordDetailParams {
	/** 记录ID */
	id: string;
}

/**
 * 缴纳记录详情信息
 */
export interface PaymentDetailDTO {
	/** 缴费ID */
	fee_id?: string;
	/** 周期(单位:月) */
	cycle?: string;
	/** 缴费方式 */
	pay_path?: string;
	/** 应收金额 */
	receivable_amount?: string;
	/** 实收金额 */
	amount?: string;
	/** 缴费时间 */
	pay_time?: string;
	/** 缴费开始 */
	start_time?: string;
	/** 缴费结束 */
	end_time?: string;
	/** 收银员 */
	receive_id?: string;
	/** 状态 */
	status_cd?: string;
	/** 备注 */
	remark?: string;
	/** 操作 */
	opt?: string;
}

/**
 * 获取费用修改记录查询参数
 */
export interface QueryFeeModifyRecordsParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 费用类型 */
	fee_id: string;
}

/**
 * 费用修改记录信息
 */
export interface FeeModifyDTO {
	/** 费用类型 */
	fee_id?: string;
	/** 费用项 */
	fee_pro?: string;
	/** 建账时间 */
	pay_start?: string;
	/** 计费起始时间 */
	pay_end?: string;
	/** 动作 */
	actions?: string;
	/** 操作人 */
	oporator?: string;
	/** 操作时间 */
	opt_time?: string;
}

// ==================== 接口函数 ====================

/**
 * 创建房屋费用
 * @description 创建新的房屋费用信息
 */
export function addHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, AddHouseFeeDTO>({
		url: "/c3-housefeemgr/add-housefee",
		httpParamWay: "query",
		config: {
			method: "POST",
			params: {
				house_id: "",
				fee_type: "",
				charge_project: "",
				start_time: "",
				end_time: "",
				amount: 0,
				config_id: "",
			},
		},
		options,
	});
}

/**
 * 变更房屋费用
 * @description 修改现有房屋费用信息
 */
export function modifyHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ModifyHouseFeeDTO>({
		url: "/c3-housefeemgr/modify-housefee",
		httpParamWay: "query",
		config: {
			method: "POST",
			params: {
				fee_id: "",
				create_time: "",
				start_time: "",
				end_time: "",
			},
		},
		options,
	});
}

/**
 * 取消房屋费用
 * @description 删除指定的房屋费用信息
 */
export function deleteHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, HouseFeeIdDTO>({
		url: "/c3-housefeemgr/delete-housefee",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				fee_id: "",
			},
		},
		options,
	});
}

/**
 * 缴纳房屋费用
 * @description 缴纳指定的房屋费用
 */
export function payHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, PayFeeDTO>({
		url: "/c3-housefeemgr/pay-fee",
		httpParamWay: "query",
		config: {
			method: "POST",
			params: {
				flag: false,
				account_type: "",
				account_name: "",
				account_amount: 0,
				fee_id: "",
				cycle: 0,
				real_cycle: 0,
				pay_fee_start_time: "",
				pay_fee_end_time: "",
				amount: 0,
				amount_due: 0,
				pay_amount: 0,
				remark: "",
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 获取房屋费用列表
 * @description 分页获取房屋费用列表，支持条件查询
 */
export function queryHouseFeeList<T = PageDTO<HouseFeeMgrDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryHouseFeeListParams>({
		url: "/c3-housefeemgr/query-housefee-page",
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
 * 获取房屋费用详情
 * @description 根据费用id获取房屋费用详细信息
 */
export function getHouseFeeDetail<T = HouseFeeMgrDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, HouseFeeDetailParams>({
		url: "/c3-housefeemgr/query-housefeedetail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				fee_id: "",
			},
		},
		options,
	});
}

/**
 * 获取房屋费用项信息
 * @description 根据房屋号获取费用项信息列表
 */
export function getHouseFeeItems<T = PageDTO<HouseFeeMgrDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryHouseFeeItemsParams>({
		url: "/c3-housefeemgr/query-housefeeitem",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "",
				roomNum: "",
			},
		},
		options,
	});
}

/**
 * 获取缴纳记录
 * @description 分页获取缴纳记录列表，支持条件查询
 */
export function getPaymentRecords<T = PageDTO<RemitFeeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPaymentRecordsParams>({
		url: "/c3-housefeemgr/query-paymentrecord-page",
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
 * 获取缴纳记录详情
 * @description 根据记录ID获取缴纳记录详细信息
 */
export function getPaymentRecordDetail<T = PaymentDetailDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, PaymentRecordDetailParams>({
		url: "/c3-housefeemgr/query-paymentrecord-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				id: "",
			},
		},
		options,
	});
}

/**
 * 获取费用修改记录
 * @description 分页获取费用修改记录列表，支持条件查询
 */
export function getFeeModifyRecords<T = PageDTO<FeeModifyDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryFeeModifyRecordsParams>({
		url: "/c3-housefeemgr/query-modifyrecord-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				fee_id: "",
			},
		},
		options,
	});
}
