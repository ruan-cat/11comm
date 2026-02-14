import type { BaseListQueryParams } from "./index";

/**
 * 运营团队小区配置
 */
export interface OperationTeamCommunityConfiguration {
	/** 配置ID */
	id: string;
	/** 小区ID */
	cellId: string;
	/** 小区名称 */
	cellName: string;
	/** 配置项 */
	configItem: string;
	/** 配置键 */
	configKey: string;
	/** 配置值 */
	configValue: string;
	/** 配置类型 */
	configType: string;
	/** 分组 */
	group: string;
	/** 是否启用 */
	isEnabled: boolean;
	/** 描述 */
	description: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 运营团队小区配置列表查询参数
 */
export interface OperationTeamCommunityConfigurationListQuery extends BaseListQueryParams {
	/** 小区ID */
	cellId?: string;
	/** 小区名称 */
	cellName?: string;
	/** 配置项 */
	configItem?: string;
	/** 配置键 */
	configKey?: string;
	/** 分组 */
	group?: string;
	/** 是否启用 */
	isEnabled?: boolean;
}

/**
 * 设置管理小区配置
 */
export interface SettingManagementCommunityConfiguration {
	/** 主键ID Config ID */
	csId: string;
	/** 小区ID Community ID */
	communityId: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 设置名称 Setting name */
	settingName: string;
	/** 设置值 Setting value */
	settingValue: string;
	/** 设置类型 Setting type */
	settingType: string;
	/** 数据状态 Status code */
	statusCd: string;
	/** 状态文本 Status text */
	statusText: string;
	/** 备注信息 Remark */
	remark: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * 设置管理小区配置列表查询参数
 */
export interface SettingManagementCommunityConfigurationListQuery extends BaseListQueryParams {
	/** 小区ID Community ID */
	communityId?: string;
	/** 小区名称 Community name */
	communityName?: string;
	/** 设置名称 Setting name */
	settingName?: string;
	/** 设置类型 Setting type */
	settingType?: string;
	/** 数据状态 Status code */
	statusCd?: string;
}

/**
 * 运营团队注册协议
 */
export interface OperationTeamRegisterProtocol {
	/** 协议ID */
	id: string;
	/** 协议标题 */
	title: string;
	/** 协议类型 */
	protocolType: string;
	/** 协议版本 */
	version: string;
	/** 协议内容 */
	content: string;
	/** 是否启用 */
	isEnabled: boolean;
	/** 是否必读 */
	isRequired: boolean;
	/** 生效时间 */
	effectiveTime: string;
	/** 失效时间 */
	expireTime: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
	/** 备注 */
	remark: string;
}

/**
 * 运营团队注册协议列表查询参数
 */
export interface OperationTeamRegisterProtocolListQuery extends BaseListQueryParams {
	/** 协议标题 */
	title?: string;
	/** 协议类型 */
	protocolType?: string;
	/** 是否启用 */
	isEnabled?: boolean;
	/** 是否必读 */
	isRequired?: boolean;
	/** 生效时间范围 */
	effectiveTimeRange?: [string, string];
}

/**
 * 设置管理注册协议显示信息
 */
export interface SettingManagementRegisterProtocolDisplay {
	/** 协议ID */
	id: string;
	/** 协议标题 */
	title: string;
	/** 协议内容 */
	content: string;
	/** 版本号 */
	version: string;
	/** 状态 */
	status: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
}

/**
 * 设置管理注册协议列表查询参数
 */
export interface SettingManagementRegisterProtocolListQuery extends BaseListQueryParams {
	/** 协议标题 */
	title?: string;
}

/**
 * 运营团队系统配置
 */
export interface OperationTeamSystemConfig {
	/** 配置ID */
	id: string;
	/** 配置名称 */
	configName: string;
	/** 配置键 */
	configKey: string;
	/** 配置值 */
	configValue: string;
	/** 配置类型 */
	configType: string;
	/** 默认值 */
	defaultValue: string;
	/** 是否系统内置 */
	isSystem: boolean;
	/** 是否启用 */
	isEnabled: boolean;
	/** 描述 */
	description: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 运营团队系统配置列表查询参数
 */
export interface OperationTeamSystemConfigListQuery extends BaseListQueryParams {
	/** 配置名称 */
	configName?: string;
	/** 配置键 */
	configKey?: string;
	/** 配置类型 */
	configType?: string;
	/** 是否启用 */
	isEnabled?: boolean;
	/** 是否系统内置 */
	isSystem?: boolean;
}

/**
 * 设置管理基本信息列表数据
 */
export interface SettingManagementSystemBasicInfoListItem {
	/** 配置ID Config ID */
	configId: string;
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
 * 设置管理基本信息查询参数
 */
export interface SettingManagementSystemBasicInfoQueryParams extends BaseListQueryParams {
	/** 标题名称 Title name */
	title?: string;
	/** 简写名称 Short name */
	shortName?: string;
	/** 公司名称 Company name */
	companyName?: string;
	/** 默认小区编号 Default community code */
	defaultCommunityCode?: string;
}
