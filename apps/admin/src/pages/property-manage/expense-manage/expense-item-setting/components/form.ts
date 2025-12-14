const _feeType = [
	"物业费",
	"押金",
	"停车费",
	"煤气费",
	"取暖费",
	"维修费",
	"服务费",
	"其他",
	"水费",
	"电费",
	"租金",
	"公摊费",
	"燃气费",
	"垃圾处理费",
	"电梯费",
	"绿化费",
	"安防费",
	"维修基金",
	"暖气费",
	"网络费",
	"清洁费",
	"照明费",
	"消防费",
	"广告费",
	"装修费",
	"会费",
	"安保费",
	"设施费",
] as const;

// ==================== 联合类型定义 ====================

/** 费用类型联合类型 */
export type FeeType = (typeof _feeType)[number];

/** 费用标识联合类型 */
export type ExpenseIdentifierType = "周期性费用" | "一次性费用";

/** 付费类型联合类型 */
export type PaymentType = "预付费" | "后付费";

/** 账户抵扣联合类型 */
export type AccountDeductionType = "是" | "否";

/** 手机缴费联合类型 */
export type MobilePaymentType = "是" | "否";

/** 进位方式联合类型 */
export type RoundingModeType = "四舍五入" | "向上取整" | "向下取整";

/** 保留小数位联合类型 */
export type DecimalPlacesType = "取整" | "1位" | "2位" | "3位" | "4位";

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface ExpenseItemSettingFormVO {
	feeType: FeeType;
	expenseItem: string;
	expenseIdentifier: ExpenseIdentifierType;
	paymentType: PaymentType;
	/**
	 * 费用类型为 押金 时，该表单隐藏
	 */
	paymentCycle?: string;
	/**
	 * 费用类型为 煤气费 时，该表单隐藏
	 */
	prepaymentPeriod?: string;
	unit: string;
	accountDeduction: AccountDeductionType;
	mobilePayment: MobilePaymentType;
	roundingMode: RoundingModeType;
	decimalPlaces: DecimalPlacesType;
	status: string;
	formula: string;
	billingUnitPrice: string;
	fixedFee: string | `${number}` | number;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ExpenseItemSettingFormVO = {
	feeType: "物业费",
	expenseItem: "",
	expenseIdentifier: "周期性费用",
	paymentType: "预付费",
	paymentCycle: "1",
	prepaymentPeriod: "30",
	unit: "元/平方米·月",
	accountDeduction: "是",
	mobilePayment: "是",
	roundingMode: "四舍五入",
	decimalPlaces: "2位",
	status: "启用",
	formula: "",
	billingUnitPrice: "",
	fixedFee: "",
};

/**
 * 费用项设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ExpenseItemSettingFormProps {
	/** 表单数据 */
	form: ExpenseItemSettingFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ExpenseItemSettingFormVO;
}
