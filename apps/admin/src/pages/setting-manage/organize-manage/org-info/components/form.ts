import type { FieldValues } from "plus-pro-components";

/** 组织信息表单业务接口 */
export interface 组织信息表单_VO {
	/** 组织名称 */
	组织名称: string;
	/** 组织类型 */
	组织类型: "company" | "department" | "group";
	/** 组织编码 */
	组织编码: string;
	/** 负责人姓名 */
	负责人姓名: string;
	/** 联系电话 */
	联系电话: string;
	/** 组织描述 */
	组织描述: string;
	/** 是否启用 */
	是否启用: boolean;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 组织信息表单_VO = {
	组织名称: "",
	组织类型: "department",
	组织编码: "",
	负责人姓名: "",
	联系电话: "",
	组织描述: "",
	是否启用: true,
};

/**
 * 组织信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OrganizationInfoFormProps {
	/** 表单数据 */
	form: 组织信息表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 组织信息表单_VO;
}