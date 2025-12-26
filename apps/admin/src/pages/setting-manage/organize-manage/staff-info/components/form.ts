import type { StaffInfo, StaffInfoFormVO } from "@01s-11comm/type";

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
