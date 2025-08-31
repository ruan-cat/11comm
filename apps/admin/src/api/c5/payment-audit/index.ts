import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取缴费审核列表查询参数
 */
export interface QueryPaymentAuditListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	owner_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 缴费类型 */
	payment_type?: string;
	/** 审核状态 */
	audit_status?: string;
	/** 缴费开始时间 */
	payment_start_time?: string;
	/** 缴费结束时间 */
	payment_end_time?: string;
}

/**
 * 获取缴费审核详情查询参数
 */
export interface QueryPaymentAuditDetailParams {
	/** 缴费审核ID */
	payment_audit_id: string;
}

/**
 * 获取缴费历史列表查询参数
 */
export interface QueryPaymentHistoryListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	owner_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 缴费类型 */
	payment_type?: string;
	/** 开始时间 */
	start_time?: string;
	/** 结束时间 */
	end_time?: string;
}

/**
 * 批量审核参数
 */
export interface BatchAuditParams {
	/** 审核ID列表 */
	audit_ids?: string[];
	/** 审核结果 */
	audit_result?: string;
	/** 审核意见 */
	audit_opinion?: string;
	/** 审核人 */
	auditor?: string;
}

/**
 * 审核费用参数
 */
export interface AuditFeeParams {
	/** 缴费审核ID */
	payment_audit_id?: string;
	/** 审核结果 */
	audit_result?: string;
	/** 审核意见 */
	audit_opinion?: string;
	/** 审核人 */
	auditor?: string;
	/** 调整金额 */
	adjusted_amount?: number;
}

/**
 * 缴费审核数据模型
 */
export interface PaymentAuditDataModel {
	/** 缴费审核ID */
	payment_audit_id?: string;
	/** 业主姓名 */
	owner_name?: string;
	/** 业主电话 */
	owner_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 缴费类型 */
	payment_type?: string;
	/** 缴费金额 */
	payment_amount?: number;
	/** 缴费方式 */
	payment_method?: string;
	/** 缴费时间 */
	payment_time?: string;
	/** 缴费凭证 */
	payment_voucher?: string;
	/** 审核状态 */
	audit_status?: string;
	/** 审核结果 */
	audit_result?: string;
	/** 审核意见 */
	audit_opinion?: string;
	/** 审核人 */
	auditor?: string;
	/** 审核时间 */
	audit_time?: string;
	/** 调整金额 */
	adjusted_amount?: number;
	/** 备注 */
	remark?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取缴费审核列表
 */
export function getPaymentAuditList<T = PageDTO<PaymentAuditDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPaymentAuditListParams>({
		url: "/c5-payment-audit/list",
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
 * 获取缴费审核详情
 */
export function getPaymentAuditDetail<T = PaymentAuditDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPaymentAuditDetailParams>({
		url: "/c5-payment-audit/detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				payment_audit_id: "",
			},
		},
		options,
	});
}

/**
 * 获取缴费历史列表
 */
export function getPaymentHistoryList<T = PageDTO<PaymentAuditDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPaymentHistoryListParams>({
		url: "/c5-payment-audit/history",
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
 * 批量审核
 */
export function batchAudit<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, BatchAuditParams>({
		url: "/c5-payment-audit/batch-audit",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 审核费用
 */
export function auditFee<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AuditFeeParams>({
		url: "/c5-payment-audit/audit",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}
