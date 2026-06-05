import type { OrganizationInfoFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OrganizationInfoFormVO = {
	name: "",
	type: "department",
	code: "",
	leaderName: "",
	phone: "",
	description: "",
	enabled: true,
};

/**
 * 组织信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OrganizationInfoFormProps {
	/** 表单数据 */
	form: OrganizationInfoFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OrganizationInfoFormVO;
	/** 表单模式 */
	mode?: Mode;
}
