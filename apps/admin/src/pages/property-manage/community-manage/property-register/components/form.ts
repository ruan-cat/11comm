/** 导入类型和默认值供其他文件使用 */
import type { 产权登记表单_VO } from "../test-data";
import { defaultForm } from "../test-data";

/**
 * 产权登记表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyRegisterFormProps {
	/** 表单数据 */
	form: 产权登记表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 产权登记表单_VO;
}

/** 导出类型和默认值供其他文件使用 */
export type { 产权登记表单_VO } from "../test-data";
export { defaultForm } from "../test-data";