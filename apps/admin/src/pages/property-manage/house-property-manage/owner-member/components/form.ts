import type { Mode } from "@/composables/use-mode";
import type { OwnerMemberFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OwnerMemberFormVO = {
	memberFace: "",
	name: "",
	gender: "",
	type: "",
	idCard: "",
	contact: "",
	homeAddress: "",
	creator: "",
	remark: "",
	accessKey: "",
};

/**
 * 业主成员表单 props
 * Owner member form props
 */
export interface OwnerMemberFormProps {
	/** 表单数据 Form data */
	form: OwnerMemberFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: OwnerMemberFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

