/**
 * 选项类型，用于下拉框、单选框等组件
 * Option type for dropdowns, radio buttons, etc.
 */
export interface OptionItem {
	/** 选项显示文本 Label text */
	label: string;
	/** 选项值 Value */
	value: string | number | boolean;
	/** 是否禁用 Disabled */
	disabled?: boolean;
}

/**
 * 选项数组类型
 * Options array type
 */
export type OptionsType = OptionItem[];
