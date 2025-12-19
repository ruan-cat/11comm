import { type Mode } from "@/composables/use-mode";
import type {
	PropertyManagementCompanyFormVO,
	PropertyManagementCompanyFormProps,
} from "@01s-11comm/type";
import {
	propertyManagementCompanyDefaultForm as defaultFormValues,
} from "@01s-11comm/type";

/** FormVO类型别名 */
export type FormVO = PropertyManagementCompanyFormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 物业公司表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export { PropertyManagementCompanyFormProps };
