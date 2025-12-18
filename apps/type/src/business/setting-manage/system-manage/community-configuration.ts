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