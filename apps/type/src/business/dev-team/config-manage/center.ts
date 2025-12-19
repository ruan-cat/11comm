/**
 * @file 配置中心类型定义
 * @description Configuration center types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 配置中心列表数据
 * Configuration center list item
 */
export interface ConfigCenterListItem {
	/** 配置项ID Config item ID */
	configId: string;
	/** 配置项名称 Config item name */
	configName: string;
	/** 配置类型 Config type */
	configType: string;
	/** 配置键名 Config key */
	configKey: string;
	/** 配置值 Config value */
	configValue: string;
	/** 默认值 Default value */
	defaultValue: string;
	/** 配置描述 Config description */
	configDescription: string;
	/** 状态 Status */
	status: string;
	/** 排序号 Sort order */
	sortOrder: number;
	/** 备注 Remark */
	remark: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 创建人 Creator */
	creator: string;
	/** 更新人 Updater */
	updater: string;
}

/**
 * 配置中心查询参数
 * Configuration center query parameters
 */
export interface ConfigCenterQueryParams extends BaseListQueryParams {
	/** 配置项名称 Config item name */
	configName?: string;
	/** 配置类型 Config type */
	configType?: string;
	/** 状态 Status */
	status?: string;
	/** 配置键名 Config key */
	configKey?: string;
}

/**
 * 配置类型选项
 * Config type options
 */
export const configTypeOptions: OptionsType = [
	{ label: "系统配置", value: "system" },
	{ label: "业务配置", value: "business" },
	{ label: "接口配置", value: "api" },
	{ label: "数据库配置", value: "database" },
	{ label: "缓存配置", value: "cache" },
	{ label: "安全配置", value: "security" },
	{ label: "邮件配置", value: "email" },
	{ label: "文件配置", value: "file" },
];

/**
 * 配置状态选项
 * Config status options
 */
export const configStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];
