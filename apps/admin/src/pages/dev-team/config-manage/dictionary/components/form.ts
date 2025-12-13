// ==================== 表单类型定义 ====================

/**
 * 字典表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DictionaryFormProps {
	/** 表单数据 */
	form: DictionaryFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: DictionaryFormVO;
}

/**
 * 字典表单数据类型
 */
export interface DictionaryFormVO {
	/** 字典名称 */
	dictionaryName: string;
	/** 字典编码 */
	dictionaryCode: string;
	/** 字典类型 */
	dictionaryType: string;
	/** 字典描述 */
	dictionaryDescription: string;
	/** 是否启用 */
	isEnabled: string;
	/** 备注 */
	remark: string;
}

// ==================== 默认表单数据 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: DictionaryFormVO = {
	dictionaryName: "",
	dictionaryCode: "",
	dictionaryType: "",
	dictionaryDescription: "",
	isEnabled: "",
	remark: "",
};
