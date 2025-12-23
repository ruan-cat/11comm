import type { OptionsType } from "../../../common";

/**
 * @description expense-item-setting列表数据
 * ExpenseItemSetting list item
 */
export interface ExpenseItemSettingListItem {
	/** ID */
	id: string;
	/** 编号 Code */
	code: string;
	/** 费用类型 Fee Type */
	feeType: string;
	/** 收费项目 Expense Item */
	expenseItem: string;
	/** 费用标识 Expense Identifier */
	expenseIdentifier: string;
	/** 付费类型 Payment Type */
	paymentType: string;
	/** 缴费周期 Payment Cycle */
	paymentCycle: string;
	/** 公式 Formula */
	formula: string;
	/** 计费单价 Billing Unit Price */
	billingUnitPrice: string;
	/** 附加/固定费用 Fixed Fee */
	fixedFee: string;
	/** 账户抵扣 Account Deduction */
	accountDeduction: string;
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
 * @description expense-item-setting列表查询参数
 * ExpenseItemSetting list query parameters
 */
export interface ExpenseItemSettingQueryParams {
	/** 编号 Code */
	code?: string;
	/** 收费项目 Expense Item */
	expenseItem?: string;
	/** 费用标识 Expense Identifier */
	expenseIdentifier?: string;
	/** 付费类型 Payment Type */
	paymentType?: string;
	/** 账户抵扣 Account Deduction */
	accountDeduction?: string;
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
export const expenseItemSettingStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 费用项设置标识选项
 * Expense item setting identifier options
 */
export const expenseItemSettingIdentifierOptions: OptionsType = [
	{ label: "周期性费用", value: "周期性费用" },
	{ label: "一次性费用", value: "一次性费用" },
];

/**
 * @description 费用项设置付费类型选项
 * Expense item setting payment type options
 */
export const expenseItemSettingPaymentTypeOptions: OptionsType = [
	{ label: "预付费", value: "预付费" },
	{ label: "后付费", value: "后付费" },
];

/**
 * @description 费用项设置抵扣选项
 * Expense item setting deduction options
 */
export const expenseItemSettingDeductionOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];

