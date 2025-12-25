import type { StaffInfo } from "@01s-11comm/type";

/** 员工信息表单数据类型 */
export interface StaffInfoFormVO extends Partial<StaffInfo> {
	name: string;
	gender: string;
	position: string;
	email: string;
	phone: string;
	address: string;
	orgName: string;
	avatar?: string;
}

/** 员工信息表单组件Props */
export interface StaffInfoFormProps {
	form: StaffInfoFormVO;
	defaultValues: StaffInfoFormVO;
	/** 表单模式 */
	mode?: Mode;
}

/** 默认表单数据 */
export const defaultForm: StaffInfoFormVO = {
	name: "",
	gender: "",
	position: "",
	email: "",
	phone: "",
	address: "",
	orgName: "",
	avatar: "",
};
