/**
 * @file 字典表单类型定义
 * @description Dictionary form types
 */

import { type Mode } from "@/composables/use-mode";
import type { DictionaryFormVO } from "@01s-11comm/type";

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
