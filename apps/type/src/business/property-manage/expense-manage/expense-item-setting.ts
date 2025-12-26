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

/** 费用类型联合类型 */
export type ExpenseItemFeeType =
	| "物业费"
	| "押金"
	| "停车费"
	| "煤气费"
	| "取暖费"
	| "维修费"
	| "服务费"
	| "其他"
	| "水费"
	| "电费"
	| "租金"
	| "公摊费"
	| "燃气费"
	| "垃圾处理费"
	| "电梯费"
	| "绿化费"
	| "安防费"
	| "维修基金"
	| "暖气费"
	| "网络费"
	| "清洁费"
	| "照明费"
	| "消防费"
	| "广告费"
	| "装修费"
	| "会费"
	| "安保费"
	| "设施费";

/** 费用标识联合类型 */
export type ExpenseItemIdentifierType = "周期性费用" | "一次性费用";

/** 付费类型联合类型 */
export type ExpenseItemPaymentType = "预付费" | "后付费";

/** 账户抵扣联合类型 */
export type ExpenseItemAccountDeductionType = "是" | "否";

/** 手机缴费联合类型 */
export type ExpenseItemMobilePaymentType = "是" | "否";

/** 进位方式联合类型 */
export type ExpenseItemRoundingModeType = "四舍五入" | "向上取整" | "向下取整";

/** 保留小数位联合类型 */
export type ExpenseItemDecimalPlacesType = "取整" | "1位" | "2位" | "3位" | "4位";

export interface ExpenseItemSettingFormVO {
	feeType: ExpenseItemFeeType;
	expenseItem: string;
	expenseIdentifier: ExpenseItemIdentifierType;
	paymentType: ExpenseItemPaymentType;
	/**
	 * 费用类型为 押金 时，该表单隐藏
	 */
	paymentCycle?: string;
	/**
	 * 费用类型为 煤气费 时，该表单隐藏
	 */
	prepaymentPeriod?: string;
	unit: string;
	accountDeduction: ExpenseItemAccountDeductionType;
	mobilePayment: ExpenseItemMobilePaymentType;
	roundingMode: ExpenseItemRoundingModeType;
	decimalPlaces: ExpenseItemDecimalPlacesType;
	status: string;
	formula: string;
	billingUnitPrice: string;
	fixedFee: string | `${number}` | number;
}

