/**
 * @file 配置项表单类型定义
 * @description Config item form types
 */

import type {
	ConfigItemFormVO as FormVO,
	ConfigItemFormProps,
} from "@01s-11comm/type";
import {
	configItemDefaultForm as defaultFormValues,
	configItemTypeOptions,
	itemEnableStatusOptions,
} from "@01s-11comm/type";

/** 向后兼容的类型别名 */
export type ConfigItemFormVO_Original = FormVO;

/** 默认表单 Default form */
export const defaultForm = defaultFormValues;

/**
 * 配置项表单 props
 * @description Config item form props
 */
export { ConfigItemFormProps };

/** 导出选项供表单使用 Export options for form use */
export { configItemTypeOptions, itemEnableStatusOptions };

// 为了向后兼容，重新导出原始类型
export { FormVO as ConfigItemFormVO };
