import { PhoneRepairsFormVO, defaultPhoneRepairsForm } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// 为了向后兼容，创建类型别名
export type 电话报修表单_VO = PhoneRepairsFormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultPhoneRepairsForm;

/**
 * 电话报修表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PhoneRepairsFormProps {
	/** 表单数据 */
	form: PhoneRepairsFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PhoneRepairsFormVO;
	/** 表单模式 */
	mode?: Mode;
}
