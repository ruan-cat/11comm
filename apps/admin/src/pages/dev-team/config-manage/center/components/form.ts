/**
 * @file 配置中心表单类型定义
 * @description Configuration center form types
 */

import { type Mode } from "@/composables/use-mode";
import type { ConfigCenterFormVO } from "@01s-11comm/type";

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
	/** 表单模式 Form mode */
	mode?: Mode;
}
