/** 系统配置表单数据类型 */
export interface SystemConfigForm {
	/** 标题名称 */
	title?: string;
	/** 副标题 */
	subtitle?: string;
	/** 简写标题 */
	shortName?: string;
	/** 公司名称 */
	companyName?: string;
	/** logo地址 */
	logoUrl?: string;
	/** 静态url */
	staticUrl?: string;
	/** 默认小区编号 */
	defaultCommunityCode?: string;
	/** 业主标题 */
	ownerTitle?: string;
	/** 物业手机标题 */
	propertyMobileTitle?: string;
	/** qq地图key */
	qqMapKey?: string;
	/** 商城地址 */
	mallUrl?: string;
}

/** 系统配置表单组件Props类型 */
export interface SystemConfigFormProps {
	/** 表单数据 */
	form: SystemConfigForm;
	/** 默认值 */
	defaultValues: SystemConfigForm;
}

/** 默认表单对象 */
export const defaultForm: SystemConfigForm = {
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
