import type { Mode } from "@/composables/use-mode";
import type { PropertyManagementCompanyFormVO } from "@01s-11comm/type";

/** 物业公司表单 VO */
export type { PropertyManagementCompanyFormVO };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PropertyManagementCompanyFormVO = {
	code: "",
	name: "",
	address: "",
	phone: "",
	administrator: "",
	legalRepresentative: "",
	establishmentDate: "",
	landmark: "",
	communityCount: 0,
	companyType: "",
	serviceLevel: "",
	operationStatus: "",
	remarks: "",
};

/**
 * 物业公司表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyManagementCompanyFormProps {
	/** 表单数据 */
	form: PropertyManagementCompanyFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PropertyManagementCompanyFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
