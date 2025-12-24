import type { BaseListQueryParams } from "../../../common";

/**
 * 系统配置列表数据
 * System config list item
 */
export interface SystemConfigListItem {
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
 * 系统配置查询参数
 * System config query parameters
 */
export interface SystemConfigQueryParams extends BaseListQueryParams {
	/** 标题名称 Title name */
	title?: string;
	/** 简写名称 Short name */
	shortName?: string;
	/** 公司名称 Company name */
	companyName?: string;
	/** 默认小区编号 Default community code */
	defaultCommunityCode?: string;
}

/**
 * 设置管理系统的系统配置数据
 */
export type { SettingManagementSystemBasicInfoListItem as SettingManagementSystemConfig } from "../../../common/business-types";

/**
 * 设置管理系统配置列表查询参数
 */
export type { SettingManagementSystemBasicInfoQueryParams as SettingManagementSystemConfigListQuery } from "../../../common/business-types";
