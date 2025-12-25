import type { Mode } from "@/composables/use-mode";
import type { InvoiceTitleFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
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

/**
 * 发票抬头表单 props
 * Invoice title form props
 */
export interface InvoiceTitleFormProps {
	/** 表单数据 Form data */
	form: InvoiceTitleFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: InvoiceTitleFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
