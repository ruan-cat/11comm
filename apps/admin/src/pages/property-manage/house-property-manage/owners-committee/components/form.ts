import type { Mode } from "@/composables/use-mode";
import type { OwnersCommitteeFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OwnersCommitteeFormVO = {
	fullName: "",
	gender: "",
	phone: "",
	idNumber: "",
	address: "",
	position: "",
	post: "",
	postDescription: "",
	term: "",
	tenure: "",
	status: "",
	remark: "",
};

/**
 * 业委会表单 props
 * Owners committee form props
 */
export interface OwnersCommitteeFormProps {
	/** 表单数据 Form data */
	form: OwnersCommitteeFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: OwnersCommitteeFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

