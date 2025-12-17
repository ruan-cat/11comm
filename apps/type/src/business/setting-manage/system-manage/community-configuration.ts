import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 小区配置信息
 */
export interface CommunityConfiguration {
	/** 主键ID */
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
	/** 数据状态 */
	statusCd: string;
	/** 状态文本 */
	statusText: string;
	/** 备注信息 */
	remark: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
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
	/** 数据状态 */
	statusCd?: string;
}

/**
 * 设置类型选项
 */
export const settingTypeOptions: OptionsType = [
	{ label: "基础配置", value: "1001" },
	{ label: "费用配置", value: "2002" },
	{ label: "公告配置", value: "3003" },
	{ label: "安防配置", value: "4004" },
	{ label: "服务配置", value: "5005" },
];

/**
 * 小区配置状态选项
 */
export const communityConfigStatusOptions: OptionsType = [
	{ label: "正常", value: "0" },
	{ label: "失效", value: "1" },
];