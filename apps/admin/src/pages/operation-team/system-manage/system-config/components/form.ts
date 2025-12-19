import type { OptionsType } from "plus-pro-components";
import type {
	SystemConfigFormVO,
	SystemConfigFormProps,
	SystemConfigType,
	SystemConfigGroup,
	SystemConfigStatus,
} from "@01s-11comm/type";
import {
	systemConfigDefaultForm as defaultFormValues,
	systemConfigTypeOptionsAlias,
	configGroupOptions,
	systemConfigStatusOptionsCN as 状态Options,
} from "@01s-11comm/type";

/** FormVO类型别名 */
export type FormVO = SystemConfigFormVO;

// ==================== 常量定义 ====================

export { systemConfigTypeOptionsAlias, configGroupOptions, 状态Options };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 系统配置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export { SystemConfigFormProps };
