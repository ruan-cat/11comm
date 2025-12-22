import type { SystemConfigListItem } from "@01s-11comm/type";

/** 系统配置表单数据类型 */
export interface SystemConfigFormVO extends Partial<SystemConfigListItem> {
	/** 标题名称 Title name */
	title: string;
	/** 副标题 Subtitle */
	subtitle: string;
	/** 简写名称 Short name */
	shortName: string;
	/** 公司名称 Company name */
	companyName: string;
	/** Logo地址 Logo URL */
	logoUrl: string;
	/** 静态URL Static URL */
	staticUrl: string;
	/** 默认小区编号 Default community code */
	defaultCommunityCode: string;
	/** 业主标题 Owner title */
	ownerTitle: string;
	/** 物业手机标题 Property mobile title */
	propertyMobileTitle: string;
	/** QQ地图Key QQ map key */
	qqMapKey: string;
	/** 商城地址 Mall URL */
	mallUrl: string;
}

/**
 * 系统配置表单组件 Props 类型
 * System config form component props type
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
