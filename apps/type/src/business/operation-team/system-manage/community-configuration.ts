import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 小区配置
 */
export interface CommunityConfiguration {
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
 * 小区配置列表查询参数
 */
export interface CommunityConfigurationListQuery extends BaseListQueryParams {
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
 * 配置类型选项
 */
export const communityConfigurationTypeOptions: OptionsType = [
	{ label: "文本", value: "文本" },
	{ label: "数字", value: "数字" },
	{ label: "布尔", value: "布尔" },
	{ label: "JSON", value: "JSON" },
	{ label: "URL", value: "URL" },
];

/**
 * 分组选项
 */
export const communityConfigurationGroupOptions: OptionsType = [
	{ label: "基础配置", value: "基础配置" },
	{ label: "安全配置", value: "安全配置" },
	{ label: "通知配置", value: "通知配置" },
	{ label: "支付配置", value: "支付配置" },
	{ label: "界面配置", value: "界面配置" },
];

/**
 * 启用状态选项
 */
export const communityConfigurationEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];
