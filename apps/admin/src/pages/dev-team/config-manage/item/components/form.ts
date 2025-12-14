// ==================== 表单类型定义 ====================

/**
 * 配置项表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ConfigItemFormProps {
	/** 表单数据 */
	form: ConfigItemFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ConfigItemFormVO;
}

/**
 * 配置项表单数据类型
 */
export interface ConfigItemFormVO {
	/** 配置项名称 */
	configItemName: string;
	/** 配置项编码 */
	configItemCode: string;
	/** 配置项类型 */
	configItemType: string;
	/** 配置项值 */
	configItemValue: string;
	/** 配置项描述 */
	configItemDescription: string;
	/** 是否启用 */
	isEnabled: string;
	/** 备注 */
	remark: string;
}

// ==================== 类型别名 ====================

/** 配置项表单数据类型（中文别名） */
export type 配置项表单_VO = ConfigItemFormVO;

// ==================== Options 导出 ====================

import { configItemTypeOptions, itemEnableStatusOptions } from "@01s-11comm/type";

/** configItemTypeOptions */
export { configItemTypeOptions };

/** enableStatusOptions */
export { itemEnableStatusOptions };

// ==================== 默认表单数据 ====================

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
