import type { InvoiceFormVO } from "@01s-11comm/type";

/**
 * @description 发票表单 props
 * Invoice form props
 */
export interface InvoiceFormProps {
	/** 表单数据 Form data */
	form: InvoiceFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: InvoiceFormVO;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: InvoiceFormVO = {
	code: "",
	invoiceType: "",
	ownerName: "",
	applicant: "",
	invoiceTitle: "",
	taxpayerId: "",
	applicationAmount: "",
	invoiceNumber: "",
	auditStatus: "",
	applicationTime: "",
	remark: "",
};
