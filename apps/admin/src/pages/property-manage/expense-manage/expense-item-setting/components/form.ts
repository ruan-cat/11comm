import type { ExpenseItemSettingFormVO } from "@01s-11comm/type";

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
