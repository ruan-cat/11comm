import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/** 协议类型枚举 */
export type 协议类型枚举 = "用户注册协议" | "隐私政策" | "服务条款" | "社区规则" | "免责声明";

/** 状态枚举 */
export type 状态枚举 = "启用" | "禁用" | "草稿";

/** 是否强制同意枚举 */
export type 是否强制同意枚举 = "是" | "否";

// ==================== 表单类型 ====================

/**
 * 注册协议表单 VO
 */
export interface 注册协议表单_VO {
	/** 协议名称 */
	协议名称: string;
	/** 协议类型 */
	协议类型: 协议类型枚举;
	/** 协议版本 */
	协议版本: string;
	/** 状态 */
	状态: 状态枚举;
	/** 是否强制同意 */
	是否强制同意: 是否强制同意枚举;
	/** 协议摘要 */
	协议摘要?: string;
	/** 协议内容 */
	协议内容: string;
	/** 生效日期 */
	生效日期: string;
	/** 失效日期 */
	失效日期?: string;
	/** 排序权重 */
	排序权重?: number;
}

/** 默认表单 @description 用于初始化表单数据 */
export const defaultForm: 注册协议表单_VO = {
	协议名称: "",
	协议类型: "用户注册协议",
	协议版本: "v1.0.0",
	状态: "草稿",
	是否强制同意: "是",
	协议摘要: "",
	协议内容: "",
	生效日期: "",
	失效日期: "",
	排序权重: 0,
};

/**
 * 注册协议表单 props
 * @description
 * 这个表单需要的参数，具体每个参数的含义，请参考每个参数的注释
 */
export interface RegisterProtocolFormProps {
	/** 表单数据 */
	form: 注册协议表单_VO;
	/** 表单默认值重置对象（必填） */
	defaultValues: 注册协议表单_VO;
}

// ==================== 选项类型 ====================

/**
 * 协议类型选项
 */
export const 协议类型Options: OptionsType = [
	{
		label: "用户注册协议",
		value: "用户注册协议",
	},
	{
		label: "隐私政策",
		value: "隐私政策",
	},
	{
		label: "服务条款",
		value: "服务条款",
	},
	{
		label: "社区规则",
		value: "社区规则",
	},
	{
		label: "免责声明",
		value: "免责声明",
	},
];

/**
 * 状态选项
 */
export const 状态Options: OptionsType = [
	{
		label: "启用",
		value: "启用",
	},
	{
		label: "禁用",
		value: "禁用",
	},
	{
		label: "草稿",
		value: "草稿",
	},
];

/**
 * 是否强制同意选项
 */
export const 是否强制同意Options: OptionsType = [
	{
		label: "是",
		value: "是",
	},
	{
		label: "否",
		value: "否",
	},
];
