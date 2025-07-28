import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取取消费用列表查询参数
 */
export interface QueryCancelFeeListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 申请人姓名 */
	applicant_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 费用类型 */
	fee_type?: string;
	/** 取消状态 */
	cancel_status?: string;
	/** 申请开始时间 */
	apply_start_time?: string;
	/** 申请结束时间 */
	apply_end_time?: string;
}

/**
 * 申请取消参数
 */
export interface ApplyCancelParams {
	/** 申请人姓名 */
	applicant_name?: string;
	/** 申请人电话 */
	applicant_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 费用ID */
	fee_id?: string;
	/** 费用类型 */
	fee_type?: string;
	/** 费用金额 */
	fee_amount?: number;
	/** 取消原因 */
	cancel_reason?: string;
	/** 申请备注 */
	apply_remark?: string;
}

/**
 * 审核取消参数
 */
export interface AuditCancelParams {
	/** 取消申请ID */
	cancel_id?: string;
	/** 审核结果 */
	audit_result?: string;
	/** 审核意见 */
	audit_opinion?: string;
	/** 审核人 */
	auditor?: string;
}

/**
 * 取消费用数据模型
 */
export interface CancelFeeDataModel {
	/** 取消申请ID */
	cancel_id?: string;
	/** 申请人姓名 */
	applicant_name?: string;
	/** 申请人电话 */
	applicant_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 房屋地址 */
	room_address?: string;
	/** 费用ID */
	fee_id?: string;
	/** 费用类型 */
	fee_type?: string;
	/** 费用名称 */
	fee_name?: string;
	/** 费用金额 */
	fee_amount?: number;
	/** 取消原因 */
	cancel_reason?: string;
	/** 申请时间 */
	apply_time?: string;
	/** 申请备注 */
	apply_remark?: string;
	/** 取消状态 */
	cancel_status?: string;
	/** 审核结果 */
	audit_result?: string;
	/** 审核意见 */
	audit_opinion?: string;
	/** 审核人 */
	auditor?: string;
	/** 审核时间 */
	audit_time?: string;
	/** 处理状态 */
	process_status?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取取消费用列表（条件+分页）
 */
export function getCancelFeeList<T = PageDTO<CancelFeeDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCancelFeeListParams>({
		url: "/c5-cancel-fee/list",
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
 * 申请取消
 */
export function applyCancel<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ApplyCancelParams>({
		url: "/c5-cancel-fee/apply",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 审核取消
 */
export function auditCancel<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AuditCancelParams>({
		url: "/c5-cancel-fee/audit",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}
