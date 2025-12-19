import type {
	CommunityInformationFormVO as FormVO,
	CommunityInformationFormProps,
} from "@01s-11comm/type";
import {
	communityInformationDefaultForm as defaultFormValues,
} from "@01s-11comm/type";

/** 向后兼容的类型别名 */
export type 小区信息表单_VO = FormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 小区信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export { CommunityInformationFormProps };
