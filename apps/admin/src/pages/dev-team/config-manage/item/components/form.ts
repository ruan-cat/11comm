/**
 * @file 配置项表单类型定义
 * @description Config item form types
 */

import type { ConfigItemFormVO } from "@01s-11comm/type";
import { type Mode } from "@/composables/use-mode";

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
	/** 表单模式 */
	mode?: Mode;
}
