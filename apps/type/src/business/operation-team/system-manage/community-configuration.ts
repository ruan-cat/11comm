import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 小区配置
 */
export interface CommunityConfiguration {
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
	/** 状态 */
	statusCd: string;
	/** 备注 */
	remark: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 小区配置列表查询参数
 */
export interface CommunityConfigurationListQuery extends BaseListQueryParams {
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	communityName?: string;
	/** 设置名称 */
	settingName?: string;
	/** 设置类型 */
	settingType?: string;
	/** 状态 */
	status?: string;
}

// 从公共选项文件导入
export {
	/** 设置类型选项 */
	settingTypeOptions,
	/** 状态选项 */
	communityConfigStatusOptions,
} from "../../../common/business-options";

/**
 * 小区配置列表项
 * @deprecated 请使用 CommunityConfiguration
 */
export type CommunityConfigListItem = CommunityConfiguration;

/**
 * 小区配置列表查询参数
 * @deprecated 请使用 CommunityConfigurationListQuery
 */
export type CommunityConfigQueryParams = CommunityConfigurationListQuery;
