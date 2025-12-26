import type { OptionsType } from "../../../common";
import { expenseItemOptions } from "../../../common/business-options";

/**
 * @description payment-review列表数据
 * PaymentReview list item
 */
export interface PaymentReviewListItem {
	/** ID */
	id: string;
	/** 房屋 House */
	house: string;
	/** 费用项目 Expense Item */
	expenseItem: string;
	/** 付费周期 Payment Period */
	paymentPeriod: string;
	/** 缴费起始时间 Payment Start Time */
	paymentStartTime: string;
	/** 缴费结束时间 Payment End Time */
	paymentEndTime: string;
	/** 应付金额 Payable Amount */
	payableAmount: string;
	/** 实付金额 Paid Amount */
	paidAmount: string;
	/** 操作员工 Operator */
	operator: string;
	/** 缴费时间 Payment Time */
	paymentTime: string;
	/** 审核状态 Audit Status */
	auditStatus: string;
	/** 审核说明 Audit Description */
	auditDescription: string;
	/** 缴费备注 Payment Remark */
	paymentRemark: string;
	/** 详情 Details */
	details: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description payment-review列表查询参数
 * PaymentReview list query parameters
 */
export interface PaymentReviewQueryParams {
	/** 房屋 House */
	house?: string;
	/** 费用项目 Expense Item */
	expenseItem?: string;
	/** 审核状态 Audit Status */
	auditStatus?: string;
	/** 缴费起始时间 Payment Start Time */
	paymentStartTime?: string;
	/** 缴费结束时间 Payment End Time */
	paymentEndTime?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const paymentReviewStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// 注意：expenseItemOptions 已从 "../../../common/business-options" 导入

/**
 * @description 缴费审核状态选项
 * Payment review status options
 */
export const paymentReviewAuditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];

/**
 * 缴费审核表单数据类型
 */
export interface PaymentReviewFormVO {
	/** 房屋 */
	house: string;
	/** 费用项目 */
	expenseItem: string;
	/** 付费周期 */
	paymentPeriod: string;
	/** 缴费起始时间 */
	paymentStartTime: string;
	/** 缴费结束时间 */
	paymentEndTime: string;
	/** 应付金额 */
	payableAmount: string;
	/** 实付金额 */
	paidAmount: string;
	/** 操作员工 */
	operator: string;
	/** 缴费时间 */
	paymentTime: string;
	/** 审核状态 */
	auditStatus: string;
	/** 审核说明 */
	auditDescription: string;
	/** 缴费备注 */
	paymentRemark: string;
	/** 详情 */
	details: string;
}
