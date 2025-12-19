import type { OptionsType } from "../../../common";

/**
 * @description refund-review列表数据
 * RefundReview list item
 */
export interface RefundReviewListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
	/** 退费单号 Refund order number */
	refundOrderNumber: string;
	/** 缴费单号 Payment order number */
	paymentOrderNumber: string;
	/** 费用类型 Fee type */
	feeType: string;
	/** 付费对象 Payer */
	payer: string;
	/** 付费周期 Payment period */
	paymentPeriod: string;
	/** 应付金额实付金额 Amount */
	payablePaidAmount: string;
	/** 申请时间 Apply time */
	applyTime: string;
	/** 退费原因 Refund reason */
	refundReason: string;
	/** 申请人 Applicant */
	applicant: string;
	/** 审核状态 Audit status */
	auditStatus: string;
	/** 审核人 Auditor */
	auditor: string;
}

/**
 * @description refund-review列表查询参数
 * RefundReview list query parameters
 */
export interface RefundReviewQueryParams {
	/** 退费单号 Refund order number */
	refundOrderNumber?: string;
	/** 缴费单号 Payment order number */
	paymentOrderNumber?: string;
	/** 费用类型 Fee type */
	feeType?: string;
	/** 审核状态 Audit status */
	auditStatus?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const refundReviewStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 退费审核表单VO
 * Refund review form VO
 */
export interface RefundReviewFormVO {
	/** 退费单号 Refund order number */
	refundOrderNumber: string;
	/** 缴费单号 Payment order number */
	paymentOrderNumber: string;
	/** 费用类型 Fee type */
	feeType: string;
	/** 付费对象 Payer */
	payer: string;
	/** 付费周期 Payment period */
	paymentPeriod: string;
	/** 应付金额实付金额 Amount */
	payablePaidAmount: string;
	/** 申请时间 Apply time */
	applyTime: string;
	/** 退费原因 Refund reason */
	refundReason: string;
	/** 申请人 Applicant */
	applicant: string;
	/** 审核状态 Audit status */
	auditStatus: string;
	/** 审核人 Auditor */
	auditor: string;
	/** 审核备注 Audit remark */
	auditRemark: string;
}
