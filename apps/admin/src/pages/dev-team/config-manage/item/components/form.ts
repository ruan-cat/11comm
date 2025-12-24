/**
 * @file 配置项表单类型定义
 * @description Config item form types
 */

import type { Mode } from "@/composables/use-mode";
import type { ConfigItemFormVO } from "@01s-11comm/type";

/** 配置项表单 VO */
export type { ConfigItemFormVO };

import { configItemTypeOptions, itemEnableStatusOptions } from "@01s-11comm/type";

/** 向后兼容的类型别名 */

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ConfigItemFormVO = {
	configItemName: "",
	configItemCode: "",
	configItemType: "",
	configItemValue: "",
	configItemDescription: "",
	isEnabled: "",
	remark: "",
};

/**
 * 配置项表单 Props
 * @description Config item form props
 */
export interface ConfigItemFormProps {
	/** 表单数据 / Form data */
	form: ConfigItemFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: ConfigItemFormVO;
}

/** 导出选项供表单使用 Export options for form use */
export { configItemTypeOptions, itemEnableStatusOptions };
