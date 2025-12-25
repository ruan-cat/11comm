import type { SystemConfigListItem } from "@01s-11comm/type";

/**
 * 系统配置表单数据类型
 * System config form data type
 */
export interface SystemConfigFormProps {
	/** 表单数据 Form data */
	form: SystemConfigListItem;
	/** 默认值 Default values */
	defaultValues: SystemConfigListItem;
	/** 表单模式 */
	mode?: Mode;
}

/**
 * 默认表单对象
 * Default form object
 */
export const defaultForm: SystemConfigListItem = {
	configId: "",
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
