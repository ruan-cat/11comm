import { type Mode } from "@/composables/use-mode";
import type {
	MerchantInfoFormVO,
	MerchantInfoFormProps,
	MerchantType,
	BusinessStatus,
} from "@01s-11comm/type";
import {
	merchantInfoDefaultForm as defaultFormValues,
	merchantTypeOptions,
	businessStatusOptions,
} from "@01s-11comm/type";

/** FormVO类型别名 */
export type FormVO = MerchantInfoFormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 商户信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export { MerchantInfoFormProps, MerchantType, BusinessStatus, merchantTypeOptions, businessStatusOptions };
