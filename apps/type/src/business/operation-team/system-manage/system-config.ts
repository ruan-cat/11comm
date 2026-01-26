import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 运营团队系统配置列表查询参数
 * 从 business-types.ts 导入
 */
export type { OperationTeamSystemConfigListQuery } from "../../../common/business-types";

/**
 * 运营团队系统配置
 * 从 business-types.ts 导入
 */
export type { OperationTeamSystemConfig } from "../../../common/business-types";

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
 * 运营团队系统配置表单 VO
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
	/** 分组 */
	configGroup: string;
	/** 默认值 */
	defaultValue: string;
	/** 是否系统内置 */
	isSystem: boolean;
	/** 状态 */
	status: string;
	/** 描述 */
	description: string;
}
