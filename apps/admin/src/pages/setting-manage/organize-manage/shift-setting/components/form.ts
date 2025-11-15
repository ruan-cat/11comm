/** 班次设置表单 */
export interface 班次设置表单_VO {
	编号: string;
	班次名称: string;
	时段: string;
	状态: string;
	备注说明: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 班次设置表单_VO = {
	编号: "",
	班次名称: "",
	时段: "",
	状态: "启用",
	备注说明: "",
};

/**
 * 班次设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ShiftSettingFormProps {
	/** 表单数据 */
	form: 班次设置表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 班次设置表单_VO;
}