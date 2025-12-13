
/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 抄表类型_VO = {
	名称: "",
	说明: "",
};

/**
 * 抄表类型表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface MeterTypeFormProps {
	/** 表单数据 */
	form: 抄表类型_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 抄表类型_VO;
}
