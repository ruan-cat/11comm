/** 导入类型和默认值供其他文件使用 */
import type { PropertyRegisterFormVO } from "@01s-11comm/type";
import { auditStatusOptions, defaultForm } from "@01s-11comm/type";

/**
 * 产权登记表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyRegisterFormProps {
	/** 表单数据 */
	form: PropertyRegisterFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PropertyRegisterFormVO;
}

/** 导出类型和默认值供其他文件使用 */
export type { PropertyRegisterFormVO };
export { defaultForm };
export { auditStatusOptions };
