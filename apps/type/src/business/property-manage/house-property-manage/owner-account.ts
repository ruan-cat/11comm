import type { OptionsType } from "../../../common";

/**
 * @description owner-account列表数据
 * OwnerAccount list item
 */
export interface OwnerAccountListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description owner-account列表查询参数
 * OwnerAccount list query parameters
 */
export interface OwnerAccountQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const ownerAccountStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 业主账户表单VO
 * Owner account form VO
 */
export interface 业主账户表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 账户类型选项
 * Account type options
 */
export const accountTypeOptions: OptionsType = [
	{ label: "微信", value: "微信" },
	{ label: "支付宝", value: "支付宝" },
	{ label: "银行卡", value: "银行卡" },
	{ label: "现金", value: "现金" },
];

/**
 * @description 支付方式选项
 * Payment method options
 */
export const paymentMethodOptions: OptionsType = [
	{ label: "微信支付", value: "微信支付" },
	{ label: "支付宝支付", value: "支付宝支付" },
	{ label: "银行转账", value: "银行转账" },
	{ label: "现金支付", value: "现金支付" },
	{ label: "刷卡支付", value: "刷卡支付" },
];

/**
 * @description 业主账户表单默认值
 * Owner account form default values
 */
export const ownerAccountDefaultForm: 业主账户表单_VO = {
	name: "",
	status: "启用",
	remark: "",
};
