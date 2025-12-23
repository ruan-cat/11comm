import type { SystemConfigListItem, SystemConfigFormVO } from "@01s-11comm/type";

/**
 * 系统配置表单数据类型
 * System config form data type
 */
export interface SystemConfigFormProps {
	/** 表单数据 Form data */
	form: SystemConfigFormVO;
	/** 默认值 Default values */
	defaultValues: SystemConfigFormVO;
}

/**
 * 默认表单对象
 * Default form object
 */
export const defaultForm: SystemConfigFormVO = {
	title: "",
	subtitle: "",
	shortName: "",
	companyName: "",
	logoUrl: "",
	staticUrl: "",
	defaultCommunityCode: "",
	ownerTitle: "",
	propertyMobileTitle: "",
	qqMapKey: "",
	mallUrl: "",
};
