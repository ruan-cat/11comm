import type { ReprintVoucherFormVO } from "@01s-11comm/type";

export type { ReprintVoucherFormVO };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReprintVoucherFormVO = {
	receiptId: "",
	receiptNumber: "",
	feeType: "",
	feeItem: "",
	house: "",
	owner: "",
	parkingSpace: "",
	totalAmount: "",
	paymentTime: "",
	printCopies: 1,
	printRemark: "",
};

/**
 * 补打收据表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReprintVoucherFormProps {
	/** 表单数据 */
	form: ReprintVoucherFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReprintVoucherFormVO;
	/** 表单模式 */
	mode?: Mode;
}
