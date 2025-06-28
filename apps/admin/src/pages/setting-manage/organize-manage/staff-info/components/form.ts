/** 员工信息表单数据类型 */
export interface 员工信息表单数据 {
	员工名称: string;
	员工性别: string;
	员工岗位: string;
	员工邮箱: string;
	手机: string;
	家庭住址: string;
	关联组织: string;
	照片?: string;
}

/** 员工信息表单组件Props */
export interface StaffInfoFormProps {
	form: 员工信息表单数据;
	defaultValues: 员工信息表单数据;
}

/** 默认表单数据 */
export const defaultForm: 员工信息表单数据 = {
	员工名称: "",
	员工性别: "",
	员工岗位: "",
	员工邮箱: "",
	手机: "",
	家庭住址: "",
	关联组织: "",
	照片: "",
};
