/**
 * @file 配置项表单类型定义
 * @description Config item form types
 */

import { configItemTypeOptions, itemEnableStatusOptions } from "@01s-11comm/type";

/**
 * 配置项表单数据类型
 * Config item form data type
 */
export interface ConfigItemFormVO {
	/** 配置项名称 Config item name */
	configItemName: string;
	/** 配置项编码 Config item code */
	configItemCode: string;
	/** 配置项类型 Config item type */
	configItemType: string;
	/** 配置项值 Config item value */
	configItemValue: string;
	/** 配置项描述 Config item description */
	configItemDescription: string;
	/** 是否启用 Is enabled */
	isEnabled: string;
	/** 备注 Remark */
	remark: string;
}

/** 默认表单 Default form */
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
 * 配置项表单 props
 * @description Config item form props
 */
export interface ConfigItemFormProps {
	/** 表单数据 Form data */
	form: ConfigItemFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: ConfigItemFormVO;
}

/** 导出选项供表单使用 Export options for form use */
export { configItemTypeOptions, itemEnableStatusOptions };
