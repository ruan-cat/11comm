import { type Mode } from "@/composables/use-mode";
import type {
	MerchantInfoFormVO as FormVO,
	MerchantInfoFormProps,
	MerchantType,
	BusinessStatus,
} from "@01s-11comm/type";
import {
	merchantInfoDefaultForm as defaultFormValues,
	merchantTypeOptions,
	businessStatusOptions,
} from "@01s-11comm/type";

// ==================== 联合类型定义 ====================

/** 商户类型联合类型 */
export type 商户类型 = MerchantType;

/** 经营状态联合类型 */
export type 经营状态 = BusinessStatus;

/** 向后兼容的类型别名 */
export type 商户信息_表单_VO = FormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 商户信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export { MerchantInfoFormProps, merchantTypeOptions, businessStatusOptions };
