/** 场地管理 表单数据类型 */
export interface 场地管理_VO {
	编号: string;
	名称: string;
	开场时间: string;
	关场时间: string;
	每小时费用: string;
	管理员: string;
	管理员电话: string;
	状态: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 场地管理_VO = {
	编号: "",
	名称: "",
	开场时间: "",
	关场时间: "",
	每小时费用: "",
	管理员: "",
	管理员电话: "",
	状态: "可预约",
};

/**
 * 场地管理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface SiteManagementFormProps {
	/** 表单数据 */
	form: 场地管理_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 场地管理_VO;
}
