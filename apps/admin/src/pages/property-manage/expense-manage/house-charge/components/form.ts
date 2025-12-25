import type { HouseChargeFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// ==================== 类型定义 ====================

/**
 * 费用项设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HouseChargeFormProps {
	/** 表单数据 */
	form: HouseChargeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: HouseChargeFormVO;
	/** 表单模式 */
	mode?: Mode;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HouseChargeFormVO = {
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
