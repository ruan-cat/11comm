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
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerMemberFormProps {
	/** 表单数据 */
	form: OwnerMemberFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OwnerMemberFormVO;
}

export type { OwnerMemberFormVO };
