import type { OrganizationTreeNode, OrganizationType } from "@01s-11comm/type";

/** 组织信息表单业务接口 */
export interface OrganizationInfoFormVO extends Partial<OrganizationTreeNode> {
	/** 组织名称 */
	name: string;
	/** 组织类型 */
	type: OrganizationType;
	/** 组织编码 */
	code: string;
	/** 负责人姓名 */
	leaderName: string;
	/** 联系电话 */
	phone: string;
	/** 组织描述 */
	description: string;
	/** 是否启用 */
	enabled: boolean;
}

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
