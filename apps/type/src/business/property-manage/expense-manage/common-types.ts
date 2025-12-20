import type { OptionsType, BaseListQueryParams } from "../../../common";

// ==================== 通用选项定义 ====================

/** 自定义费用选项 Custom expense options */
export const customExpenseOptions: OptionsType = [
	{ label: "固定费用", value: "固定费用" },
	{ label: "计量费用", value: "计量费用" },
	{ label: "比例费用", value: "比例费用" },
];

/** 使用状态选项 Usage status options */
export const usageStatusOptions: OptionsType = [
	{ label: "未使用", value: "未使用" },
	{ label: "已使用", value: "已使用" },
	{ label: "已过期", value: "已过期" },
];

/** 费用状态选项 Expense status options */
export const expenseStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 通用类型定义 ====================

/**
 * @description 退费审核表单 VO
 * Refund review form VO
 */
export interface RefundReviewFormVO {
	/** 退费金额 Refund amount */
	refundAmount: number;
	/** 退费原因 Refund reason */
	refundReason: string;
	/** 审核状态 Audit status */
	auditStatus: string;
	/** 审核意见 Audit comment */
	auditComment?: string;
}

/**
 * @description 补打收据表单 VO
 * Reprint receipt form VO
 */
export interface ReprintReceiptFormVO {
	/** 收据编号 Receipt number */
	receiptNumber: string;
	/** 补打原因 Reprint reason */
	reprintReason: string;
	/** 申请人 Applicant */
	applicant: string;
	/** 申请时间 Application time */
	applicationTime: string;
}

/**
 * @description 抄表类型 VO
 * Meter reading type VO
 */
export interface MeterReadingTypeVO {
	/** 表类型名称 Meter type name */
	meterTypeName: string;
	/** 表单位 Meter unit */
	meterUnit: string;
	/** 计费方式 Billing method */
	billingMethod: string;
	/** 单价 Unit price */
	unitPrice: number;
	/** 状态 Status */
	status: string;
}

// ==================== 通用列表数据类型 ====================

/**
 * @description 通用列表数据项接口
 * Common list item interface
 */
export interface CommonListItem {
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
}

/**
 * @description 通用查询参数接口
 * Common query params interface
 */
export interface CommonQueryParams extends BaseListQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
}
