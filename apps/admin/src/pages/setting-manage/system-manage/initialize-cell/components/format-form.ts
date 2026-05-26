/** 初始化格式化确认表单数据 */
export interface FormatConfirmationFormVO {
	/** 开发者密码，用于二次确认高风险格式化动作。 */
	developerPassword: string;
}

/**
 * 初始化格式化确认默认表单
 * @description form/defaultValues 共同服务弹窗提交和关闭前脏数据判断。
 */
export const defaultForm: FormatConfirmationFormVO = {
	developerPassword: "",
};

/**
 * 初始化格式化确认表单 props
 * @description
 * 使用较长类型名，避免与其它页面的全局表单类型冲突。
 */
export interface FormatFormProps {
	/** 表单数据 */
	form: FormatConfirmationFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: FormatConfirmationFormVO;
	/** 当前初始化项目，仅用于确认弹窗展示，不进入格式化提交 payload。 */
	initItem: string;
	/** 当前初始化状态，仅用于确认弹窗展示，不进入格式化提交 payload。 */
	initStatus: string;
}
