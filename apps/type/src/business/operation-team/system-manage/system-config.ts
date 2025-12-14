import type { OptionsType } from "../../../common";

/**
 * @description 配置类型
 * Config type
 */
export type SystemConfigType = "文本" | "数字" | "布尔值" | "JSON" | "日期时间" | "文件路径" | "URL";

/**
 * @description 配置分组
 * Config group
 */
export type SystemConfigGroup = "系统基础" | "业务配置" | "第三方服务" | "安全设置" | "通知设置" | "日志配置" | "缓存配置";

/**
 * @description 配置状态
 * Config status
 */
export type SystemConfigStatus = "启用" | "禁用";

/**
 * @description 系统配置列表数据
 * System config list item
 */
export interface SystemConfigListItem {
	/** 配置ID Config ID */
	configId: string;
	/** 配置名称 Config name */
	configName: string;
	/** 配置值 Config value */
	configValue: string;
	/** 配置类型 Config type */
	configType: SystemConfigType;
	/** 配置分组 Config group */
	configGroup: SystemConfigGroup;
	/** 状态 Status */
	status: SystemConfigStatus;
	/** 描述 Description */
	description: string;
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
 * @description 系统配置列表查询参数
 * System config list query parameters
 */
export interface SystemConfigQueryParams {
	/** 配置名称 Config name */
	configName?: string;
	/** 配置类型 Config type */
	configType?: SystemConfigType;
	/** 配置分组 Config group */
	configGroup?: SystemConfigGroup;
	/** 状态 Status */
	status?: SystemConfigStatus;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 配置类型选项
 * Config type options
 */
export const systemConfigTypeOptions: OptionsType = [
	{ label: "文本", value: "文本" },
	{ label: "数字", value: "数字" },
	{ label: "布尔值", value: "布尔值" },
	{ label: "JSON", value: "JSON" },
	{ label: "日期时间", value: "日期时间" },
	{ label: "文件路径", value: "文件路径" },
	{ label: "URL", value: "URL" },
];

/**
 * @description 配置分组选项
 * Config group options
 */
export const systemConfigGroupOptions: OptionsType = [
	{ label: "系统基础", value: "系统基础" },
	{ label: "业务配置", value: "业务配置" },
	{ label: "第三方服务", value: "第三方服务" },
	{ label: "安全设置", value: "安全设置" },
	{ label: "通知设置", value: "通知设置" },
	{ label: "日志配置", value: "日志配置" },
	{ label: "缓存配置", value: "缓存配置" },
];

/**
 * @description 状态选项
 * Status options
 */
export const systemConfigStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 系统配置类型选项
 * System config type options
 */
export const systemConfigTypeOptionsAlias: OptionsType = [
	{ label: "系统配置", value: "系统配置" },
	{ label: "业务配置", value: "业务配置" },
	{ label: "接口配置", value: "接口配置" },
];

/**
 * @description 配置分组选项
 * Config group options
 */
export const configGroupOptions: OptionsType = [
	{ label: "基础配置", value: "基础配置" },
	{ label: "高级配置", value: "高级配置" },
	{ label: "安全配置", value: "安全配置" },
];

// ==================== 兼容旧中文名称 ====================

/**
 * @description 配置类型选项（兼容性）
 * Config type options (for compatibility)
 */
export const 配置类型Options = systemConfigTypeOptionsAlias;

/**
 * @description 配置分组选项（兼容性）
 * Config group options (for compatibility)
 */
export const 配置分组Options = configGroupOptions;
