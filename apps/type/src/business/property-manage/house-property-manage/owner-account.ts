import type { OptionsType } from "../../../common";

/**
 * @description 业主账户列表数据
 * OwnerAccount list item
 */
export interface OwnerAccountListItem {
	/** 账户编号 Account number */
	accountNo: string;
	/** 账户名称 Account name */
	accountName: string;
	/** 身份证号 ID card */
	idCard: string;
	/** 手机号 Phone */
	phone: string;
	/** 账户类型 Account type */
	accountType: string;
	/** 账户金额 Account balance */
	accountBalance: string;
	/** 扣款房号 Deduct house number */
	deductHouseNo: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description 业主账户列表查询参数
 * OwnerAccount list query parameters
 */
export interface OwnerAccountQueryParams {
	/** 账户名称 Account name */
	accountName?: string;
	/** 身份证号 ID card */
	idCard?: string;
	/** 手机号 Phone */
	phone?: string;
	/** 账户类型 Account type */
	accountType?: string;
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
export interface OwnerAccountFormVO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 业主账户表单VO
 * Owner account form VO
 */
export interface OwnerAccountFormVO {
	/** 账户类型 Account type */
	accountType: string;
	/** 业主手机 Owner phone */
	ownerPhone: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 预存金额 Prepaid amount */
	prepaidAmount: string;
	/** 支付方式 Payment method */
	paymentMethod: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 业主账户表单VO（兼容性中文名称）
 * Owner account form VO (for compatibility with Chinese names)
 */
export interface 业主账户表单_VO {
	/** 账户类型 Account type */
	accountType: string;
	/** 业主手机 Owner phone */
	ownerPhone: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 预存金额 Prepaid amount */
	prepaidAmount: string;
	/** 支付方式 Payment method */
	paymentMethod: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 账户类型选项
 * Account type options
 */
export const accountTypeOptions: OptionsType = [
	{ label: "通用账户", value: "通用账户" },
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
	accountType: "通用账户",
	ownerPhone: "",
	ownerName: "",
	prepaidAmount: "",
	paymentMethod: "现金",
	remark: "",
};
