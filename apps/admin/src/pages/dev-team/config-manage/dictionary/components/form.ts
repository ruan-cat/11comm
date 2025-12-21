/**
 * @file 字典表单类型定义
 * @description Dictionary form types
 */

import type { Mode } from "@/composables/use-mode";
import { dictionaryTypeOptions, enableStatusOptions } from "@01s-11comm/type";

/**
 * 字典表单数据类型
 * Dictionary form data type
 */
export interface DictionaryFormVO {
	/** 字典名称 Dictionary name */
	dictionaryName: string;
	/** 字典编码 Dictionary code */
	dictionaryCode: string;
	/** 字典类型 Dictionary type */
	dictionaryType: string;
	/** 字典描述 Dictionary description */
	dictionaryDescription: string;
	/** 是否启用 Is enabled */
	isEnabled: string;
	/** 备注 Remark */
	remark: string;
}

/** 默认表单 Default form */
export const defaultForm: DictionaryFormVO = {
	dictionaryName: "",
	dictionaryCode: "",
	dictionaryType: "",
	dictionaryDescription: "",
	isEnabled: "",
	remark: "",
};

/**
 * 字典表单 props
 * @description Dictionary form props
 */
export interface DictionaryFormProps {
	/** 表单数据 Form data */
	form: DictionaryFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: DictionaryFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/** 导出选项供表单使用 Export options for form use */
export { dictionaryTypeOptions, enableStatusOptions };
