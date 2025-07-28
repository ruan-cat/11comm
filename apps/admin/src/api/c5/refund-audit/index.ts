import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取退费审核列表查询参数
 */
export interface QueryRefundAuditListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 申请人姓名 */
	applicant_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 退费类型 */
	refund_type?: string;
	/** 审核状态 */
	audit_status?: string;
	/** 申请开始时间 */
	apply_start_time?: string;
	/** 申请结束时间 */
	apply_end_time?: string;
}

/**
 * 获取退费审核详情查询参数
 */
export interface QueryRefundAuditDetailParams {
	/** 退费申请ID */
	refund_id: string;
}

/**
 * 获取退费历史列表查询参数
 */
export interface QueryRefundHistoryListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 申请人姓名 */
	applicant_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 退费类型 */
	refund_type?: string;
	/** 开始时间 */
	start_time?: string;
	/** 结束时间 */
	end_time?: string;
}

/**
 * 申请退费参数
 */
export interface ApplyRefundParams {
	/** 申请人姓名 */
	applicant_name?: string;
	/** 申请人电话 */
	applicant_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 退费类型 */
	refund_type?: string;
	/** 退费金额 */
	refund_amount?: number;
	/** 退费原因 */
	refund_reason?: string;
	/** 费用项目 */
	fee_items?: string;
	/** 退费期间 */
	refund_period?: string;
	/** 申请备注 */
	apply_remark?: string;
}

/**
 * 审核退费参数
 */
export interface AuditRefundParams {
	/** 退费申请ID */
	refund_id?: string;
	/** 审核结果 */
	audit_result?: string;
	/** 审核意见 */
	audit_opinion?: string;
	/** 审核人 */
	auditor?: string;
	/** 退费金额调整 */
	actual_refund_amount?: number;
}

/**
 * 导出退费审核参数
 */
export interface ExportRefundAuditParams {
	/** 申请人姓名 */
	applicant_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 退费类型 */
	refund_type?: string;
	/** 审核状态 */
	audit_status?: string;
	/** 申请开始时间 */
	apply_start_time?: string;
	/** 申请结束时间 */
	apply_end_time?: string;
}

/**
 * 退费审核数据模型
 */
export interface RefundAuditDataModel {
	/** 退费申请ID */
	refund_id?: string;
	/** 申请人姓名 */
	applicant_name?: string;
	/** 申请人电话 */
	applicant_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 退费类型 */
	refund_type?: string;
	/** 退费金额 */
	refund_amount?: number;
	/** 实际退费金额 */
	actual_refund_amount?: number;
	/** 退费原因 */
	refund_reason?: string;
	/** 费用项目 */
	fee_items?: string;
	/** 退费期间 */
	refund_period?: string;
	/** 申请时间 */
	apply_time?: string;
	/** 申请备注 */
	apply_remark?: string;
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
	/** 状态 */
	status?: string;
}

/**
 * 退费审核详情数据模型
 */
export interface RefundAuditDetailDataModel {
	/** 退费申请ID */
	refund_id?: string;
	/** 申请人姓名 */
	applicant_name?: string;
	/** 申请人电话 */
	applicant_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 房屋地址 */
	room_address?: string;
	/** 退费类型 */
	refund_type?: string;
	/** 退费金额 */
	refund_amount?: number;
	/** 实际退费金额 */
	actual_refund_amount?: number;
	/** 退费原因 */
	refund_reason?: string;
	/** 费用项目 */
	fee_items?: string;
	/** 退费期间 */
	refund_period?: string;
	/** 申请时间 */
	apply_time?: string;
	/** 申请备注 */
	apply_remark?: string;
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
	/** 相关费用明细 */
	fee_details?: any[];
	/** 审核记录 */
	audit_records?: any[];
}

/**
 * 退费历史数据模型
 */
export interface RefundHistoryDataModel {
	/** 退费申请ID */
	refund_id?: string;
	/** 申请人姓名 */
	applicant_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 退费类型 */
	refund_type?: string;
	/** 退费金额 */
	refund_amount?: number;
	/** 实际退费金额 */
	actual_refund_amount?: number;
	/** 申请时间 */
	apply_time?: string;
	/** 审核时间 */
	audit_time?: string;
	/** 退费状态 */
	refund_status?: string;
	/** 处理人 */
	handler?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取退费审核列表
 */
export function getRefundAuditList<T = PageDTO<RefundAuditDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRefundAuditListParams>({
		url: "/c5-refund-audit/list",
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
 * 获取退费审核详情
 */
export function getRefundAuditDetail<T = RefundAuditDetailDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRefundAuditDetailParams>({
		url: "/c5-refund-audit/detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				refund_id: "",
			},
		},
		options,
	});
}

/**
 * 获取退费历史列表
 */
export function getRefundHistoryList<T = PageDTO<RefundHistoryDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRefundHistoryListParams>({
		url: "/c5-refund-audit/history",
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
 * 申请退费
 */
export function applyRefund<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ApplyRefundParams>({
		url: "/c5-refund-audit/apply",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 审核退费
 */
export function auditRefund<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AuditRefundParams>({
		url: "/c5-refund-audit/audit",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 导出退费审核
 */
export function exportRefundAudit<T = ArrayBuffer>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ExportRefundAuditParams>({
		url: "/c5-refund-audit/export",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
			responseType: "blob",
		},
		options,
	});
}
