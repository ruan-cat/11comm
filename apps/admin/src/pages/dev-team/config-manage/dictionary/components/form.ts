// ==================== 表单类型定义 ====================

/**
 * 字典表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DictionaryFormProps {
	/** 表单数据 */
	form: 字典表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 字典表单_VO;
}

/**
 * 字典表单数据类型
 */
export interface 字典表单_VO {
	/** 字典名称 */
	字典名称: string;
	/** 字典编码 */
	字典编码: string;
	/** 字典类型 */
	字典类型: string;
	/** 字典描述 */
	字典描述: string;
	/** 是否启用 */
	是否启用: string;
	/** 备注 */
	备注: string;
}

// ==================== 默认表单数据 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 字典表单_VO = {
	字典名称: "",
	字典编码: "",
	字典类型: "",
	字典描述: "",
	是否启用: "",
	备注: "",
};
