import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 注册协议
 */
export interface RegisterProtocol {
	/** 协议ID */
	id: string;
	/** 协议标题 */
	title: string;
	/** 协议类型 */
	protocolType: string;
	/** 协议版本 */
	version: string;
	/** 协议内容 */
	content: string;
	/** 是否启用 */
	isEnabled: boolean;
	/** 是否必读 */
	isRequired: boolean;
	/** 生效时间 */
	effectiveTime: string;
	/** 失效时间 */
	expireTime: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
	/** 备注 */
	remark: string;
}

/**
 * 注册协议列表查询参数
 * 从 business-types.ts 导入
 */
export type { OperationTeamRegisterProtocolListQuery as RegisterProtocolListQuery } from "../../../common/business-types";

/**
 * 协议类型选项
 */
export const registerProtocolTypeOptions: OptionsType = [
	{ label: "用户协议", value: "用户协议" },
	{ label: "隐私政策", value: "隐私政策" },
	{ label: "服务条款", value: "服务条款" },
	{ label: "免责声明", value: "免责声明" },
];

/**
 * 启用状态选项
 */
export const registerProtocolEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];

/**
 * 必读状态选项
 */
export const registerProtocolRequiredOptions: OptionsType = [
	{ label: "必读", value: true },
	{ label: "选读", value: false },
];
