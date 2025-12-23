import type { OptionsType } from "plus-pro-components";
import type { Mode } from "@/composables/use-mode";
import type {
	SystemConfigFormVO,
	SystemConfigType,
	SystemConfigGroup,
	SystemConfigStatus,
} from "@01s-11comm/type";
import {
	systemConfigDefaultForm as defaultFormValues,
	systemConfigTypeOptionsAlias,
	configGroupOptions,
	systemConfigStatusOptionsCN,
} from "@01s-11comm/type";


export { systemConfigTypeOptionsAlias, configGroupOptions, systemConfigStatusOptionsCN };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 系统配置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface SystemConfigFormProps {
	/** 表单数据 */
	form: SystemConfigFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: SystemConfigFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
