import type { BaseListQueryParams, OptionsType } from "../../../common";

// 从公共选项文件导入原始名称
import {
	operationRegisterProtocolTypeOptions,
	operationRegisterProtocolEnabledOptions,
	registerProtocolStatusOptions,
	operationRegisterProtocolRequiredOptions,
} from "../../../common/business-options";

/**
 * 运营团队注册协议列表查询参数
 * 从 business-types.ts 导入
 */
export type { OperationTeamRegisterProtocolListQuery } from "../../../common/business-types";

/**
 * 运营团队注册协议
 * 从 business-types.ts 导入
 */
export type { OperationTeamRegisterProtocol } from "../../../common/business-types";

/**
 * 注册协议表单 VO
 * Register protocol form VO
 */
export interface RegisterProtocolFormVO {
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
	protocolSummary?: string;
	/** 协议内容 Protocol content */
	protocolContent: string;
	/** 生效日期 Effective date */
	effectiveDate: string;
	/** 失效日期 Expiration date */
	expirationDate?: string;
	/** 排序权重 Sort weight */
	sortWeight?: number;
}

/**
 * 协议类型选项别名
 */
export const protocolTypeOptions = operationRegisterProtocolTypeOptions;

/**
 * 是否必读选项别名
 */
export const isMandatoryOptions = operationRegisterProtocolRequiredOptions;

/**
 * 必读状态选项
 */
export const registerProtocolRequiredOptions: OptionsType = [
	{ label: "必读", value: true },
	{ label: "选读", value: false },
];

/**
 * 注册协议状态选项别名
 * Register protocol status options alias
 */
export const registerProtocolStatusOptionsAlias = registerProtocolStatusOptions;
