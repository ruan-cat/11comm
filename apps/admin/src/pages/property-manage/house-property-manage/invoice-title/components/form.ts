import type { InvoiceTitleFormVO } from "@01s-11comm/type";

/**
 * @description 发票抬头表单默认值
 * Invoice title form default values
 */
export const defaultForm: InvoiceTitleFormVO = {
	ownerName: "",
	invoiceType: "",
	invoiceTitle: "",
	taxpayerId: "",
	address: "",
	phone: "",
	bankAccount: "",
	remark: "",
};

// ==================== 表单Props类型定义 ====================

/**
 * 发票抬头表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InvoiceTitleFormProps {
	/** 表单数据 */
	form: InvoiceTitleFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: InvoiceTitleFormVO;
}
