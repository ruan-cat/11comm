import type { OverduePaymentInformationFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OverduePaymentInformationFormVO = {
	chargeObject: "",
	ownerName: "",
	phoneNumber: "",
	startTime: "",
	endTime: "",
	overdueTimeRange: ["", ""],
	overdueAmount: "",
	overdueDescription: "",
	paymentStatus: "未缴费",
	contactAddress: "",
};

/**
 * 欠费信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OverduePaymentInformationFormProps {
	/** 表单数据 */
	form: OverduePaymentInformationFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OverduePaymentInformationFormVO;
	/** 表单模式 */
	mode?: Mode;
}
