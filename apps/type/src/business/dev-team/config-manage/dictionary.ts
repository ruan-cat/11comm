/**
 * @file 字典管理类型定义
 * @description Dictionary management types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 字典列表数据
 * Dictionary list item
 */
export interface DictionaryListItem {
	/** 字典ID Dictionary ID */
	id: number;
	/** 字典名称 Dictionary name */
	dictionaryName: string;
	/** 字典编码 Dictionary code */
	dictionaryCode: string;
	/** 字典类型 Dictionary type */
	dictionaryType: string;
	/** 字典项数量 Dictionary item count */
	itemCount: number;
	/** 字典描述 Dictionary description */
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
 * 字典查询参数
 * Dictionary query parameters
 */
export interface DictionaryQueryParams extends BaseListQueryParams {
	/** 字典名称 Dictionary name */
	dictionaryName?: string;
	/** 字典编码 Dictionary code */
	dictionaryCode?: string;
	/** 字典类型 Dictionary type */
	dictionaryType?: string;
	/** 是否启用 Is enabled */
	isEnabled?: string;
}

/**
 * 字典类型选项
 * Dictionary type options
 */
export const dictionaryTypeOptions: OptionsType = [
	{ label: "系统字典", value: "系统字典" },
	{ label: "业务字典", value: "业务字典" },
	{ label: "地区字典", value: "地区字典" },
	{ label: "状态字典", value: "状态字典" },
	{ label: "配置字典", value: "配置字典" },
];

/**
 * 启用状态选项
 * Enable status options
 */
export const enableStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
