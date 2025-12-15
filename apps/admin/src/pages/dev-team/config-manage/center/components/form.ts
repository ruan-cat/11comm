/**
 * @file 配置中心表单类型定义
 * @description Configuration center form types
 */

import { configTypeOptions, configStatusOptions } from "@01s-11comm/type";

/** 配置中心表单数据类型 Form data type */
export interface ConfigCenterFormVO {
	/** 配置项名称 Config item name */
	configName: string;
	/** 配置类型 Config type */
	configType: string;
	/** 配置键名 Config key */
	configKey: string;
	/** 配置值 Config value */
	configValue: string;
	/** 默认值 Default value */
	defaultValue: string;
	/** 配置描述 Config description */
	configDescription: string;
	/** 状态 Status */
	status: string;
	/** 排序号 Sort order */
	sortOrder: number;
	/** 备注 Remark */
	remark: string;
}

/** 默认表单 Default form */
export const defaultForm: ConfigCenterFormVO = {
	configName: "",
	configType: "系统配置",
	configKey: "",
	configValue: "",
	defaultValue: "",
	configDescription: "",
	status: "启用",
	sortOrder: 0,
	remark: "",
};

/**
 * 配置中心表单 props
 * @description Configuration center form props
 */
export interface ConfigCenterFormProps {
	/** 表单数据 Form data */
	form: ConfigCenterFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: ConfigCenterFormVO;
}

/** 导出选项供表单使用 Export options for form use */
export { configTypeOptions, configStatusOptions };
