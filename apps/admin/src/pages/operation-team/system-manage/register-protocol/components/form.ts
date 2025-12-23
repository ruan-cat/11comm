import type { Mode } from "@/composables/use-mode";
import type { OptionsType } from "plus-pro-components";
export { auditStatusOptions } from "@01s-11comm/type";

// ==================== 表单类型 ====================

/**
 * 注册协议表单 VO
 */
export interface RegisterProtocolFormVO {
	/** 协议名称 */
	protocolName: string;
	/** 协议类型 */
	protocolType: string;
	/** 协议版本 */
	protocolVersion: string;
	/** 状态 */
	status: string;
	/** 是否强制同意 */
	isMandatory: string;
	/** 协议摘要 */
	protocolSummary?: string;
	/** 协议内容 */
	protocolContent: string;
	/** 生效日期 */
	effectiveDate: string;
	/** 失效日期 */
	expirationDate?: string;
	/** 排序权重 */
	sortWeight?: number;
}

/** 默认表单 @description 用于初始化表单数据 */
export const defaultForm: RegisterProtocolFormVO = {
	protocolName: "",
	protocolType: "UserRegistrationProtocol",
	protocolVersion: "v1.0.0",
	status: "Draft",
	isMandatory: "Yes",
	protocolSummary: "",
	protocolContent: "",
	effectiveDate: "",
	expirationDate: "",
	sortWeight: 0,
};

/**
 * 注册协议表单 props
 * @description
 * 这个表单需要的参数，具体每个参数的含义，请参考每个参数的注释
 */
export interface RegisterProtocolFormProps {
	/** 表单数据 */
	form: RegisterProtocolFormVO;
	/** 表单默认值重置对象（必填） */
	defaultValues: RegisterProtocolFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

// ==================== 选项类型 ====================

/**
 * 协议类型选项
 */
export const protocolTypeOptions: OptionsType = [
	{
		label: "用户注册协议",
		value: "UserRegistrationProtocol",
	},
	{
		label: "隐私政策",
		value: "PrivacyPolicy",
	},
	{
		label: "服务条款",
		value: "TermsOfService",
	},
	{
		label: "社区规则",
		value: "CommunityRules",
	},
	{
		label: "免责声明",
		value: "Disclaimer",
	},
];

/**
 * 状态选项
 */
export const statusOptions: OptionsType = [
	{
		label: "启用",
		value: "Enabled",
	},
	{
		label: "禁用",
		value: "Disabled",
	},
	{
		label: "草稿",
		value: "Draft",
	},
];

/**
 * 是否强制同意选项
 */
export const isMandatoryOptions: OptionsType = [
	{
		label: "是",
		value: "Yes",
	},
	{
		label: "否",
		value: "No",
	},
];
