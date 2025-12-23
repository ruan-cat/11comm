import type { OptionsType } from "../../../common";

// ==================== 联合类型定义 ====================

/** 费用标识联合类型 Fee identifier union type */
export type FeeIdentifierType = "周期性费用" | "一次性费用";

/** 付费类型联合类型 Payment type union type */
export type PaymentType = "预付费" | "后付费";

/** 账户抵扣联合类型 Account deduction union type */
export type AccountDeductionType = "是" | "否";

/** 手机缴费联合类型 Mobile payment union type */
export type MobilePaymentType = "是" | "否";

/** 进位方式联合类型 Rounding method union type */
export type RoundingMethodType = "四舍五入" | "向上取整" | "向下取整";

/** 保留小数位联合类型 Decimal places union type */
export type DecimalPlacesType = "取整" | "1位" | "2位" | "3位" | "4位";

/** 状态联合类型 Status union type */
export type StatusType = "启用" | "禁用";

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
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
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
	{ label: "未缴费", value: "未缴费" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "逾期", value: "逾期" },
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
	feeIdentifier: "周期性费用",
	paymentType: "预付费",
	paymentCycleMonths: "1",
	prepaidPeriodDays: "30",
	unit: "元/平方米·月",
	accountDeduction: "是",
	mobilePayment: "是",
	roundingMethod: "四舍五入",
	decimalPlaces: "2位",
	status: "启用",
	calculationFormula: "",
	billingUnitPrice: "",
	fixedFee: "",
};
