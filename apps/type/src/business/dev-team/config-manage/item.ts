/**
 * @file 配置项管理类型定义
 * @description Config item management types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 配置项列表数据
 * Config item list item
 */
export interface ConfigItemListItem {
	/** 配置项ID Config item ID */
	id: number;
	/** 配置项名称 Config item name */
	configName: string;
	/** 配置项编码 Config item code */
	configCode: string;
	/** 配置项类型 Config item type */
	configType: string;
	/** 配置项值 Config item value */
	configValue: string;
	/** 配置项描述 Config item description */
	description: string;
	/** 是否启用 Is enabled */
	isEnabled: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 创建人 Creator */
	creator: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * 配置项查询参数
 * Config item query parameters
 */
export interface ConfigItemQueryParams extends BaseListQueryParams {
	/** 配置项名称 Config item name */
	configName?: string;
	/** 配置项编码 Config item code */
	configCode?: string;
	/** 配置项类型 Config item type */
	configType?: string;
	/** 是否启用 Is enabled */
	isEnabled?: string;
}

/**
 * 配置项类型选项
 * Config item type options
 */
export const configItemTypeOptions: OptionsType = [
	{ label: "系统配置", value: "system" },
	{ label: "业务配置", value: "business" },
	{ label: "接口配置", value: "api" },
	{ label: "数据库配置", value: "database" },
	{ label: "缓存配置", value: "cache" },
	{ label: "日志配置", value: "log" },
	{ label: "安全配置", value: "security" },
	{ label: "通知配置", value: "notification" },
];

/**
 * 启用状态选项
 * Enable status options
 */
export const itemEnableStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/**
 * @description 配置项表单数据类型 Config item form data type
 */
export interface ConfigItemFormVO {
	/** 配置项名称 Config item name */
	configItemName: string;
	/** 配置项编码 Config item code */
	configItemCode: string;
	/** 配置项类型 Config item type */
	configItemType: string;
	/** 配置项值 Config item value */
	configItemValue: string;
	/** 配置项描述 Config item description */
	configItemDescription: string;
	/** 是否启用 Is enabled */
	isEnabled: string;
	/** 备注 Remark */
	remark: string;
}
