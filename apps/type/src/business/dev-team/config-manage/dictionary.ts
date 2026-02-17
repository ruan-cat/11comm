/**
 * @file 字典管理类型定义
 * @description Dictionary management types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";
import type { DtDictionary } from "../../setting-manage/dictionary-manage/schema";

/**
 * 字典列表数据
 * Dictionary list item
 */
export type DictionaryListItem = Omit<DtDictionary, "createTime" | "updateTime" | "deletedAt"> & {
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
};

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
	{ label: "系统字典", value: "system" },
	{ label: "业务字典", value: "business" },
	{ label: "地区字典", value: "region" },
	{ label: "状态字典", value: "status" },
	{ label: "配置字典", value: "config" },
];

/**
 * 启用状态选项
 * Enable status options
 */
export const enableStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/**
 * 字典表单数据类型
 * Dictionary form data type
 */
export interface DictionaryFormVO {
	/** 字典名称 Dictionary name */
	dictionaryName: string;
	/** 字典编码 Dictionary code */
	dictionaryCode: string;
	/** 字典类型 Dictionary type */
	dictionaryType: string;
	/** 字典描述 Dictionary description */
	dictionaryDescription: string;
	/** 是否启用 Is enabled */
	isEnabled: string;
	/** 备注 Remark */
	remark: string;
}
