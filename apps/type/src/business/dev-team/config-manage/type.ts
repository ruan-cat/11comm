/**
 * @file 字典类型管理类型定义
 * @description Dictionary type management types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 字典类型列表数据
 * Dictionary type list item
 */
export interface DictionaryTypeListItem {
	/** 字典编号 Dictionary number */
	dictionaryNumber: string;
	/** 字典名称 Dictionary name */
	dictionaryName: string;
	/** 字典类型 Dictionary type */
	dictionaryType: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * 字典类型查询参数
 * Dictionary type query parameters
 */
export interface DictionaryTypeQueryParams extends BaseListQueryParams {
	/** 字典编号 Dictionary number */
	dictionaryNumber?: string;
	/** 字典名称 Dictionary name */
	dictionaryName?: string;
	/** 字典类型 Dictionary type */
	dictionaryType?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * 状态选项
 * Status options
 */
export const dictionaryTypeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

