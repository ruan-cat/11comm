import type { OptionsType } from "../../../common";

/**
 * @description 注册协议列表数据
 * Register protocol list item
 */
export interface RegisterProtocolListItem {
	/** 协议ID Protocol ID */
	protocolId: string;
	/** 协议名称 Protocol name */
	protocolName: string;
	/** 协议类型 Protocol type */
	protocolType: string;
	/** 协议版本 Protocol version */
	protocolVersion: string;
	/** 状态 Status */
	status: string;
	/** 是否强制同意 Is mandatory */
	isMandatory: string;
	/** 协议摘要 Protocol summary */
	summary: string;
	/** 协议内容 Protocol content */
	content: string;
	/** 生效日期 Effective date */
	effectiveDate: string;
	/** 失效日期 Expiration date */
	expirationDate: string;
	/** 排序权重 Sort weight */
	sortOrder: number;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * @description 注册协议列表查询参数
 * Register protocol list query parameters
 */
export interface RegisterProtocolQueryParams {
	/** 协议名称 Protocol name */
	protocolName?: string;
	/** 协议类型 Protocol type */
	protocolType?: string;
	/** 状态 Status */
	status?: string;
	/** 是否强制同意 Is mandatory */
	isMandatory?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 协议类型选项
 * Protocol type options
 */
export const protocolTypeOptions: OptionsType = [
	{ label: "用户注册协议", value: "用户注册协议" },
	{ label: "隐私政策", value: "隐私政策" },
	{ label: "服务条款", value: "服务条款" },
	{ label: "社区规则", value: "社区规则" },
	{ label: "免责声明", value: "免责声明" },
];

/**
 * @description 状态选项
 * Status options
 */
export const registerProtocolStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
	{ label: "草稿", value: "草稿" },
];

/**
 * @description 是否强制同意选项
 * Is mandatory options
 */
export const isMandatoryOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];
