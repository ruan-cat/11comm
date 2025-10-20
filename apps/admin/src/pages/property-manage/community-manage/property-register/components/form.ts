/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 产权登记表单_VO = {
	房屋产权ID: "",
	房屋ID: "",
	房屋编号: "",
	姓名: "",
	联系方式: "",
	身份证号: "",
	地址: "",
	状态: "未审核",
};

/**
 * 产权登记表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyRegisterFormProps {
	/** 表单数据 */
	form: 产权登记表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 产权登记表单_VO;
}