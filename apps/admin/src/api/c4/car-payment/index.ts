import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取车辆费用查询参数
 */
export interface QueryCarPaymentParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 付款方id */
	payer_obj_id: string;
}

/**
 * 车辆费用数据模型
 */
export interface CarPaymentDataModel {
	/** 车辆 */
	car_name?: string;
	/** 必填，请选择费用类型 */
	fee_type?: string;
	/** 必填，请选择收费项目 */
	fee_name?: string;
	/** 费用标识 */
	fee_flag?: string;
	/** 必填,请填写建帐时间 */
	create_time?: string;
	/** 应收费用 */
	rece_pay?: number;
	/** 费用项ID */
	fee_item_id?: string;
	/** 收费金额 */
	amount?: number;
	/** 催缴类型 */
	call_type?: string;
	/** 付款类型 */
	pay_type?: string;
	/** 请选择缴费周期 */
	pay_cycle?: string;
	/** 公式 */
	formula?: string;
	/** 缴费单价 */
	unit_price?: number;
	/** 剩余费用 */
	sur_fee?: number;
	/** 固定费用 */
	fix_fee?: number;
	/** 季度 */
	qdt?: string;
	/** 费用ID */
	fee_id?: string;
	/** 小区ID */
	community_id?: string;
	/** 可填，请填写备注 */
	text?: string;
	/** 说明 */
	description?: string;
	/** 状态 */
	status?: string;
	/** 必填，请选择支付 */
	pay_way?: string;
	/** 实际支付 */
	act_pay?: number;
	/** 必填,请填写应收开始时间 */
	start_time?: string;
	/** 必填,请填写应收结束时间 */
	end_time?: string;
	/** 欠费主键 */
	owe_id?: string;
	/** 付款方id */
	payer_obj_id?: string;
	/** 收入对象ID */
	income_obj_id?: string;
	/** 用户ID */
	user_id?: string;
	/** 单价 */
	square_price?: number;
	/** 计算公式 */
	computing_formula?: string;
	/** 账单类型 */
	bill_type?: string;
	/** 计算公式文本 */
	computing_formula_text?: string;
	/** 扣除来源 */
	deduct_from?: string;
	/** 在线支付 */
	pay_online?: string;
	/** 规模 */
	scale?: string;
	/** 小数位 */
	decimal_place?: number;
	/** 单位 */
	units?: string;
	/** 预付周期 */
	prepayment_period?: string;
	/** 业主ID */
	owner_id?: string;
	/** 业主名称 */
	owner_name?: string;
	/** 配置名称 */
	config_name?: string;
	/** 业主电话 */
	owner_tel?: string;
	/** 请填写停车场-车位，如1-101 */
	payer_obj_name?: string;
	/** 截止时间 */
	deadline_time?: string;
	/** 已付金额 */
	paid_amount?: number;
}

/**
 * 删除车辆费用参数
 */
export interface CarPaymentDeleteParams {
	/** 费用ID */
	fee_id: string;
}

/**
 * 获取车辆费用详情参数
 */
export interface QueryVehicleFeeParams {
	/** 费用ID */
	fee_id?: string;
}

/**
 * 车辆费用详情数据模型
 */
export interface VehicleFeeDataModel {
	/** 费用ID */
	fee_id?: string;
	/** 费用标识 */
	fee_flag?: string;
	/** 费用类型 */
	fee_type_cd?: string;
	/** 支付对象 */
	value?: string;
	/** 费用项 */
	fee_name?: string;
	/** 费用状态 */
	state?: string;
	/** 建账时间 */
	create_time?: string;
	/** 应收开始时间 */
	start_time?: string;
	/** 应收结束时间 */
	end_time?: string;
	/** 批次 */
	batch_id?: string;
	/** 欠费金额 */
	owe_amount?: number;
	/** 业主ID */
	owner_id?: string;
	/** 业主名称 */
	owner_name?: string;
	/** 业主联系方式 */
	link?: string;
	/** 月份ID */
	month_id?: string;
}

/**
 * 获取缴费记录查询参数
 */
export interface QueryPaymentRecordsParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 费用项 */
	fee_name?: string;
	/** 支付对象 */
	value?: string;
	/** 建账时间 */
	creat_time?: string;
}

/**
 * 缴费记录数据模型
 */
export interface PaymentRecordDataModel {
	/** 费用项 */
	fee_name?: string;
	/** 支付对象 */
	value?: string;
	/** 周期(单位:月) */
	cycle?: number;
	/** 应收金额 */
	receivable_amount?: number;
	/** 实收金额 */
	received_amount?: number;
	/** 建账时间 */
	create_time?: string;
	/** 缴费时间 */
	pay_fee_time?: string;
	/** 收银员 */
	cashier_name?: string;
	/** 状态 */
	status_cd?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取缴费明细记录参数
 */
export interface QueryPaymentDetailedRecordParams {
	/** 明细ID */
	detail_id?: string;
}

/**
 * 缴费明细记录数据模型
 */
export interface PaymentDetailedRecordDataModel {
	/** 费用ID */
	fee_id?: string;
	/** 周期(单位:月) */
	cycle?: number;
	/** 应收金额 */
	receivable_amount?: number;
	/** 实收金额 */
	received_amount?: number;
	/** 缴费时间 */
	pay_fee_time?: string;
	/** 建账时间 */
	create_time?: string;
	/** 截止时间 */
	deadline_time?: string;
	/** 收银员 */
	cashier_name?: string;
	/** 状态 */
	status_cd?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取费用修改记录查询参数
 */
export interface QueryModificationRecordsParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 费用项 */
	fee_name?: string;
}

/**
 * 费用修改记录数据模型
 */
export interface FeeModificationRecordDataModel {
	/** 费用项 */
	fee_name?: string;
	/** 建账时间 */
	create_time?: string;
	/** 应收开始时间 */
	start_time?: string;
	/** 操作人 */
	create_user_name?: string;
	/** 操作时间 */
	cur_month_time?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取车辆费用
 */
export function queryCarPayment<T = PageDTO<CarPaymentDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCarPaymentParams>({
		url: "/c4-carpayment/query-carpayment",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				payer_obj_id: "",
			},
		},
		options,
	});
}

/**
 * 创建车辆费用
 */
export function addCarPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CarPaymentDataModel>({
		url: "/c4-carpayment/add-carpayment",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 变更车辆费用
 */
export function modifyCarPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CarPaymentDataModel>({
		url: "/c4-carpayment/modify-carpayment",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 删除车辆费用
 */
export function removeCarPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CarPaymentDeleteParams>({
		url: "/c4-carpayment/remove-carpayment",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				fee_id: "",
			},
		},
		options,
	});
}

/**
 * 缴纳车辆费用
 */
export function payCarPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CarPaymentDataModel>({
		url: "/c4-carpayment/paycarpayment",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 获取车辆费用详情
 */
export function queryVehicleFeeDetail<T = VehicleFeeDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryVehicleFeeParams>({
		url: "/c4-carpayment/query-get-vehiclefee",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 获取缴费记录
 */
export function queryPaymentRecords<T = PageDTO<PaymentRecordDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPaymentRecordsParams>({
		url: "/c4-carpayment/query-get-payment-records",
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
 * 获取缴费明细记录
 */
export function queryPaymentDetailedRecord<T = PaymentDetailedRecordDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPaymentDetailedRecordParams>({
		url: "/c4-carpayment/query-get-paymentdetailed-recordes",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 获取费用修改记录
 */
export function queryModificationRecords<T = PageDTO<FeeModificationRecordDataModel>>(
	options: UseAxiosOptionsJsonVO<T>,
) {
	return useRequest<ParamsQueryKey, T, QueryModificationRecordsParams>({
		url: "/c4-carpayment/query-get-modification-records",
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
