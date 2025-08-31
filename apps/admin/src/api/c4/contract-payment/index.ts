import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取合同费用列表查询参数
 */
export interface QueryContractPaymentParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 付款方id，即合同id */
	payer_obj_id: string;
}

/**
 * 合同费用数据模型
 */
export interface ContractPaymentDataModel {
	/** 付款方id，即合同id */
	payer_obj_id?: string;
	/** 费用项目 */
	fee_name?: string;
	/** 费用标志 */
	fee_flag?: string;
	/** 费用类型 */
	fee_type_cd?: string;
	/** 应收金额（固定费用） */
	additional_amount?: number;
	/** 创建时间 */
	create_time?: string;
	/** 开始时间 */
	start_time?: string;
	/** 结束时间 */
	end_time?: string;
	/** 每平单价 */
	square_price?: number;
	/** 状态 */
	state?: string;
}

/**
 * 创建合同费用参数
 */
export interface AddContractPaymentParams {
	/** 付款方id，即合同id */
	payer_obj_id?: string;
	/** 费用项目 */
	fee_name?: string;
	/** 费用标志 */
	fee_flag?: string;
	/** 费用类型 */
	fee_type_cd?: string;
	/** 应收金额（固定费用） */
	additional_amount?: number;
	/** 创建时间 */
	create_time?: string;
	/** 开始时间 */
	start_time?: string;
	/** 结束时间 */
	end_time?: string;
	/** 每平单价 */
	square_price?: number;
	/** 状态 */
	state?: string;
}

/**
 * 更改合同费用参数
 */
export interface ModifyContractPaymentParams {
	/** 费用id */
	fee_id?: string;
	/** 开始时间 */
	start_time?: string;
	/** 结束时间 */
	end_time?: string;
	/** 创建时间 */
	create_time?: string;
}

/**
 * 取消合同费用参数
 */
export interface RemoveContractPaymentParams {
	/** 费用ID */
	fee_id: string;
}

/**
 * 缴纳合同费用参数
 */
export interface ChargeContractPaymentParams {
	/** 费用项目 */
	feeid?: string;
	/** 请选择缴费周期 */
	chargecycle?: string;
	/** 可填，请填写备注 */
	remark?: string;
	/** 应收款 */
	receivable?: string;
	/** 支付方式 */
	chargeway?: string;
	/** 实收款 */
	received?: string;
	/** 收银员 */
	cashier?: string;
}

/**
 * 合同缴费记录查询参数
 */
export interface QueryContractPaymentRecordParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 付款方id，即合同id */
	payer_obj_id: string;
}

/**
 * 合同缴费记录数据模型
 */
export interface ContractPaymentRecordDataModel {
	/** 费用项目 */
	feeid?: string;
	/** 费用对象 */
	feeobj?: string;
	/** 收费对象 */
	chargeobj?: string;
	/** 请选择缴费周期 */
	chargecycle?: string;
	/** 应收款 */
	receivable?: string;
	/** 实收款 */
	received?: string;
	/** 支付方式 */
	chargeway?: string;
	/** 计费起始时间 */
	coststarttime?: string;
	/** 计费结束时间 */
	costendtime?: string;
	/** 缴费时间 */
	chargetime?: string;
	/** 收银员 */
	cashier?: string;
	/** 状态 */
	statu?: string;
	/** 可填，请填写备注 */
	remark?: string;
	/** 付款方id，即合同id */
	payer_obj_id?: string;
}

/**
 * 合同费用记录详情查询参数
 */
export interface QueryContractPaymentRecordDetailParams {
	/** 费用ID */
	"cost-id"?: string;
	/** ID */
	id: string;
}

/**
 * 合同费用记录详情数据模型
 */
export interface ContractPaymentRecordDetailDataModel {
	/** 费用项目 */
	feeid?: string;
	/** 请选择缴费周期 */
	chargecycle?: string;
	/** 可填，请填写备注 */
	remark?: string;
	/** 应收款 */
	receivable?: string;
	/** 支付方式 */
	chargeway?: string;
	/** 实收款 */
	received?: string;
	/** 收银员 */
	cashier?: string;
	/** 请选择开始的时间 */
	choosestarttime?: string;
	/** 请选择结束的时间 */
	chooseendtime?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取合同费用列表
 */
export function queryContractPayment<T = PageDTO<ContractPaymentDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryContractPaymentParams>({
		url: "/c4-contractpay/contractpay-query",
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
 * 创建合同费用
 */
export function addContractPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddContractPaymentParams>({
		url: "/c4-contractpay/contractpay-add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 更改合同费用
 */
export function modifyContractPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyContractPaymentParams>({
		url: "/c4-contractpay/contractpay-modify",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 取消合同费用
 */
export function removeContractPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RemoveContractPaymentParams>({
		url: "/c4-contractpay/contractpay-remove",
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
 * 缴纳合同费用
 */
export function chargeContractPayment<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ChargeContractPaymentParams>({
		url: "/c4-contractpay/contractpay-charge",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 合同缴费记录分页查询
 */
export function queryContractPaymentRecord<T = PageDTO<ContractPaymentRecordDataModel>>(
	options: UseAxiosOptionsJsonVO<T>,
) {
	return useRequest<ParamsQueryKey, T, QueryContractPaymentRecordParams>({
		url: "/c4-contractpay/contractpay-query-page",
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
 * 获取合同费用记录详情
 */
export function queryContractPaymentRecordDetail<T = ContractPaymentRecordDetailDataModel>(
	options: UseAxiosOptionsJsonVO<T>,
) {
	return useRequest<ParamsQueryKey, T, QueryContractPaymentRecordDetailParams>({
		url: "/c4-contractpay/contractpay-contract-record",
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
