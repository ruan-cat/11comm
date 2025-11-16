import { type 发票表单_VO, defaultForm } from "../test-data";

/**
 * 发票表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InvoiceFormProps {
	/** 表单数据 */
	form: 发票表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 发票表单_VO;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export { defaultForm };
