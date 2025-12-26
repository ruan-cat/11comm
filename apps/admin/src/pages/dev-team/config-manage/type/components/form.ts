/**
 * @file 字典类型表单类型定义
 * @description Dictionary type form types
 */

import { type Mode } from "@/composables/use-mode";
import type { DictionaryTypeFormVO } from "@01s-11comm/type";

/** 默认表单 Default form */
export const defaultForm: DictionaryTypeFormVO = {
	dictionaryNumber: "",
	dictionaryName: "",
	dictionaryType: "",
	dictionaryCategory: "业务字典",
	dataType: "字符串",
	defaultValue: "",
	isRequired: "否",
	validationRule: "",
	displayOrder: 0,
	status: "启用",
	remark: "",
};

/**
 * 字典类型表单 props
 * @description Dictionary type form props
 */
export interface DictionaryTypeFormProps {
	/** 表单数据 Form data */
	form: DictionaryTypeFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: DictionaryTypeFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
