import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * @description 小区配置信息
 * Community configuration
 */
export interface CommunityConfiguration {
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
 * @description 小区配置列表查询参数
 * Community configuration list query parameters
 */
export interface CommunityConfigurationListQuery extends BaseListQueryParams {
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
 * @description 设置类型选项
 * Setting type options
 */
export const settingTypeOptions: OptionsType = [
	{ label: "系统设置", value: "系统设置" },
	{ label: "业务设置", value: "业务设置" },
	{ label: "界面设置", value: "界面设置" },
	{ label: "功能设置", value: "功能设置" },
	{ label: "安全设置", value: "安全设置" },
];

/**
 * @description 小区配置状态选项
 * Community configuration status options
 */
export const communityConfigStatusOptions: OptionsType = [
	{ label: "启用", value: "0" },
	{ label: "禁用", value: "1" },
	{ label: "待审核", value: "2" },
];

/**
 * @description 设置管理小区配置表单对象
 * Setting management community configuration form value object
 */
export interface SettingCommunityConfigFormVO {
	/** 配置ID */
	csId: string;
	/** 小区ID */
	communityId: string;
	/** 小区名称 */
	communityName: string;
	/** 设置名称 */
	settingName: string;
	/** 设置值 */
	settingValue: string;
	/** 设置类型 */
	settingType: string;
	/** 状态编码 */
	statusCd: string;
	/** 备注 */
	remark: string;
}