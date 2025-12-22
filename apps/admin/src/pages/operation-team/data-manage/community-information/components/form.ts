import type { Mode } from "@/composables/use-mode";
import type { CommunityInformation } from "@01s-11comm/type";

/**
 * 小区信息表单数据类型
 */
export interface CommunityInformationFormVO extends Partial<CommunityInformation> {
	communityName: string;
	communityCode: string;
	region: string;
	address: string;
	propertyCompany: string;
	status: string;
}

/**
 * 小区信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityInformationFormProps {
	/** 表单数据 */
	form: CommunityInformationFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CommunityInformationFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/**
 * 默认表单数据
 */
export const defaultForm: CommunityInformationFormVO = {
	communityName: "",
	communityCode: "",
	region: "",
	address: "",
	propertyCompany: "",
	status: "",
};
