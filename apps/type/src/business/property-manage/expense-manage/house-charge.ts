import type { OptionsType } from "../../../common";

// ==================== 联合类型定义 ====================

/** 费用标识联合类型 Fee identifier union type */
export type FeeIdentifierType = "recurring" | "one_time";

/** 付费类型联合类型 Payment type union type */
export type PaymentType = "prepaid" | "postpaid";

/** 账户抵扣联合类型 Account deduction union type */
export type AccountDeductionType = "yes" | "no";

/** 手机缴费联合类型 Mobile payment union type */
export type MobilePaymentType = "yes" | "no";

/** 进位方式联合类型 Rounding method union type */
export type RoundingMethodType = "round" | "ceil" | "floor";

/** 保留小数位联合类型 Decimal places union type */
export type DecimalPlacesType = "0" | "1" | "2" | "3" | "4";

/** 状态联合类型 Status union type */
export type StatusType = "enabled" | "disabled";

/** 费用类型联合类型 Expense type union type */
export type ExpenseType =
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
	| "公摊费";

// ==================== 接口定义 ====================

/**
 * @description house-charge列表数据
 * HouseCharge list item
 */
export interface HouseChargeListItem {
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
 * @description house-charge列表查询参数
 * HouseCharge list query parameters
 */
export interface HouseChargeQueryParams {
	/** 名称 Name */
	name?: string;
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
export const houseChargeStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/**
 * @description 费用标识选项
 * Fee identifier options
 */
export const feeIdentifierOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
];

/**
 * @description 房屋收费类型选项
 * House charge type options
 */
export const houseChargeTypeOptions: OptionsType = [
	{ label: "基础费用", value: "基础费用" },
	{ label: "增值服务费", value: "增值服务费" },
];

/**
 * @description 状态选项
 * Payment status options
 */
export const paymentStatusOptions: OptionsType = [
	{ label: "未缴费", value: "unpaid" },
	{ label: "已缴费", value: "paid" },
	{ label: "逾期", value: "overdue" },
];

// ==================== 表单数据接口 ====================

/**
 * @description 房屋收费表单数据类型
 * House charge form data type
 */
export interface HouseChargeFormVO {
	/** 费用类型 Expense Type */
	expenseType: ExpenseType;
	/** 收费项目 Charge Item */
	chargeItem: string;
	/** 费用标识 Fee Identifier */
	feeIdentifier: FeeIdentifierType;
	/** 付费类型 Payment Type */
	paymentType: PaymentType;
	/**
	 * 缴费周期(单位:月) Payment cycle (unit: month)
	 * @description 费用类型为 押金 时，该表单隐藏
	 * Hidden when expense type is 押金
	 */
	paymentCycleMonths?: string;
	/**
	 * 预付期(单位:天) Prepaid period (unit: days)
	 * @description 费用类型为 煤气费 时，该表单隐藏
	 * Hidden when expense type is 煤气费
	 */
	prepaidPeriodDays?: string;
	/** 单位 Unit */
	unit: string;
	/** 账户抵扣 Account Deduction */
	accountDeduction: AccountDeductionType;
	/** 手机缴费 Mobile Payment */
	mobilePayment: MobilePaymentType;
	/** 进位方式 Rounding Method */
	roundingMethod: RoundingMethodType;
	/** 保留小数位 Decimal Places */
	decimalPlaces: DecimalPlacesType;
	/** 状态 Status */
	status: StatusType;
	/** 计算公式 Calculation Formula */
	calculationFormula: string;
	/** 计费单价 Billing Unit Price */
	billingUnitPrice: string;
	/** 固定费用 Fixed Fee */
	fixedFee: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultHouseChargeForm: HouseChargeFormVO = {
	expenseType: "物业费",
	chargeItem: "",
	feeIdentifier: "recurring",
	paymentType: "prepaid",
	paymentCycleMonths: "1",
	prepaidPeriodDays: "30",
	unit: "元/平方米·月",
	accountDeduction: "yes",
	mobilePayment: "yes",
	roundingMethod: "round",
	decimalPlaces: "2",
	status: "enabled",
	calculationFormula: "",
	billingUnitPrice: "",
	fixedFee: "",
};
