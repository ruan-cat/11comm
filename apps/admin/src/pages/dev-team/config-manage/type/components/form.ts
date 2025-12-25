/**
 * @file 字典类型表单类型定义
 * @description Dictionary type form types
 */

import { type Mode } from "@/composables/use-mode";

/**
 * 字典类型表单数据类型
 * Dictionary type form data type
 */
export interface DictionaryTypeFormVO {
	/** 字典编号 Dictionary number */
	dictionaryNumber: string;
	/** 字典名称 Dictionary name */
	dictionaryName: string;
	/** 字典类型 Dictionary type */
	dictionaryType: string;
	/** 字典分类 Dictionary category */
	dictionaryCategory: string;
	/** 数据类型 Data type */
	dataType: string;
	/** 默认值 Default value */
	defaultValue: string;
	/** 是否必填 Is required */
	isRequired: string;
	/** 验证规则 Validation rule */
	validationRule: string;
	/** 显示顺序 Display order */
	displayOrder: number;
	/** 字典状态 Dictionary status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

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
