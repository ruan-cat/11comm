import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 系统配置
 */
export interface SystemConfig {
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
 * 系统配置列表查询参数
 */
export interface SystemConfigListQuery extends BaseListQueryParams {
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
 * 配置类型选项
 */
export const systemConfigTypeOptions: OptionsType = [
	{ label: "文本", value: "文本" },
	{ label: "数字", value: "数字" },
	{ label: "布尔", value: "布尔" },
	{ label: "JSON", value: "JSON" },
	{ label: "URL", value: "URL" },
];

/**
 * 启用状态选项
 */
export const systemConfigEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];

/**
 * 系统内置选项
 */
export const systemConfigSystemOptions: OptionsType = [
	{ label: "是", value: true },
	{ label: "否", value: false },
];

/**
 * 系统配置表单 VO
 */
export interface SystemConfigFormVO {
	/** 配置ID */
	id?: string;
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
}

