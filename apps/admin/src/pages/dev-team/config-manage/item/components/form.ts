/**
 * @file 配置项表单类型定义
 * @description Config item form types
 */

import type { Mode } from "@/composables/use-mode";
import type { ConfigItemFormVO as FormVO } from "@01s-11comm/type";
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
 * 配置项表单 Props
 * @description Config item form props
 */
export interface ConfigItemFormProps {
	/** 表单数据 / Form data */
	form: FormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: FormVO;
}

/** 导出选项供表单使用 Export options for form use */
export { configItemTypeOptions, itemEnableStatusOptions };

// 为了向后兼容，重新导出原始类型
export { FormVO as ConfigItemFormVO };
