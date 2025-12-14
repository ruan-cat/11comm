import type { 发票抬头表单_VO } from "@01s-11comm/type";
import { invoiceTypeOptions, invoiceTitleDefaultForm as defaultForm } from "@01s-11comm/type";

// ==================== 表单Props类型定义 ====================

/**
 * 发票抬头表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InvoiceTitleFormProps {
	/** 表单数据 */
	form: 发票抬头表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 发票抬头表单_VO;
}

// ==================== 导出表单相关 ====================

export { defaultForm, invoiceTypeOptions };
