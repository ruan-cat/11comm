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

/**
 * 字典分类选项
 * Dictionary category options
 */
export const dictionaryCategoryOptions: OptionsType = [
	{ label: "系统字典", value: "系统字典" },
	{ label: "业务字典", value: "业务字典" },
	{ label: "自定义字典", value: "自定义字典" },
	{ label: "第三方字典", value: "第三方字典" },
];

/**
 * 数据类型选项
 * Data type options
 */
export const dataTypeOptions: OptionsType = [
	{ label: "字符串", value: "字符串" },
	{ label: "数字", value: "数字" },
	{ label: "布尔值", value: "布尔值" },
	{ label: "日期", value: "日期" },
	{ label: "时间", value: "时间" },
	{ label: "日期时间", value: "日期时间" },
	{ label: "JSON对象", value: "JSON对象" },
	{ label: "数组", value: "数组" },
	{ label: "文件", value: "文件" },
	{ label: "邮箱", value: "邮箱" },
	{ label: "手机号", value: "手机号" },
	{ label: "URL", value: "URL" },
	{ label: "密码", value: "密码" },
];

/**
 * 是否必填选项
 * Required options
 */
export const requiredOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];
