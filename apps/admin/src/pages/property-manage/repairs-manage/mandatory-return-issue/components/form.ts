/** 强制回单表单_VO */
export interface 强制回单表单_VO {
	工单编号: string;
	位置: string;
	报修类型: string;
	报修人: string;
	联系方式: string;
	预约时间: string;
	提交时间: string;
	状态: string;
	备注: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 强制回单表单_VO = {
	工单编号: "",
	位置: "",
	报修类型: "",
	报修人: "",
	联系方式: "",
	预约时间: "",
	提交时间: "",
	状态: "",
	备注: "",
};

/**
 * 强制回单表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface MandatoryReturnIssueFormProps {
	/** 表单数据 */
	form: 强制回单表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 强制回单表单_VO;
}