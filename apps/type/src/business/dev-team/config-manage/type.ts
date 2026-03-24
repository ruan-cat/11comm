/**
 * @file 字典类型管理类型定义
 * @description Dictionary type management types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";
import type { DtConfigType } from "../../setting-manage/dictionary-manage/schema";

/**
 * 配置类型列表数据
 * Config type list item
 */
export type DictionaryTypeListItem = Omit<DtConfigType, "createTime" | "updateTime" | "deletedAt"> & {
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
};

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
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/**
 * 字典分类选项
 * Dictionary category options
 */
export const dictionaryCategoryOptions: OptionsType = [
	{ label: "系统字典", value: "system" },
	{ label: "业务字典", value: "business" },
	{ label: "自定义字典", value: "custom" },
	{ label: "第三方字典", value: "thirdParty" },
];

/**
 * 数据类型选项
 * Data type options
 */
export const dataTypeOptions: OptionsType = [
	{ label: "字符串", value: "string" },
	{ label: "数字", value: "number" },
	{ label: "布尔值", value: "boolean" },
	{ label: "日期", value: "date" },
	{ label: "时间", value: "time" },
	{ label: "日期时间", value: "datetime" },
	{ label: "JSON对象", value: "json" },
	{ label: "数组", value: "array" },
	{ label: "文件", value: "file" },
	{ label: "邮箱", value: "email" },
	{ label: "手机号", value: "phone" },
	{ label: "URL", value: "url" },
	{ label: "密码", value: "password" },
];

/**
 * 是否必填选项
 * Required options
 */
export const requiredOptions: OptionsType = [
	{ label: "是", value: "true" },
	{ label: "否", value: "false" },
];

/**
 * 字典类型表单数据类型
 * Dictionary type form data type
 */
export interface DictionaryTypeFormVO {
	/** 字典编号 Dictionary number */
	dictionaryNumber: string;
	/** 字典名称 Dictionary name */
	dictionaryName: string;
	/** 字典类型 Dictionary type */
	dictionaryType: string;
	/** 字典分类 Dictionary category */
	dictionaryCategory: string;
	/** 数据类型 Data type */
	dataType: string;
	/** 默认值 Default value */
	defaultValue: string;
	/** 是否必填 Is required */
	isRequired: string;
	/** 验证规则 Validation rule */
	validationRule: string;
	/** 显示顺序 Display order */
	displayOrder: number;
	/** 字典状态 Dictionary status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * 配置类型详情数据
 * Dictionary type detail item
 */
export type DictionaryTypeDetailItem = Omit<DtConfigType, "createTime" | "updateTime" | "deletedAt"> & {
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
};
