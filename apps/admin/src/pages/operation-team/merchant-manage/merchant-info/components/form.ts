import type { Mode } from "@/composables/use-mode";
import type { MerchantInfoFormVO, MerchantType, BusinessStatus } from "@01s-11comm/type";
import {
	merchantInfoDefaultForm as defaultFormValues,
	merchantTypeOptions,
	businessStatusOptions,
} from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 商户信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export { MerchantType, BusinessStatus, merchantTypeOptions, businessStatusOptions };

/**
 * 商户信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface MerchantInfoFormProps {
	/** 表单数据 */
	form: MerchantInfoFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: MerchantInfoFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
