/**
 * 格式化确认表单数据
 */
export interface 格式化确认表单_VO {
	/** 开发者密码 */
	开发者密码: string;
}

/**
 * 默认表单
 * @description 对外导出用于其他场景使用
 */
export const defaultForm: 格式化确认表单_VO = {
	开发者密码: "",
};

/**
 * 格式化确认表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface FormatFormProps {
	/** 表单数据 */
	form: 格式化确认表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 格式化确认表单_VO;
}