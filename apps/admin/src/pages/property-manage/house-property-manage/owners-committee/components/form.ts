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
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnersCommitteeFormProps {
	/** 表单数据 */
	form: OwnersCommitteeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OwnersCommitteeFormVO;
}

export type { OwnersCommitteeFormVO };
