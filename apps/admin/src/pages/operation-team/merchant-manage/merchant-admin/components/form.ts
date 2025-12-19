import { type Mode } from "@/composables/use-mode";
import type {
	MerchantAdminFormVO as FormVO,
	MerchantAdminFormProps,
} from "@01s-11comm/type";
import {
	merchantAdminDefaultForm as defaultFormValues,
	propertyCompanyOptions,
} from "@01s-11comm/type";

/** 向后兼容的类型别名 */
export type 商户管理员表单_VO = FormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 商户管理员表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export { MerchantAdminFormProps, propertyCompanyOptions };
