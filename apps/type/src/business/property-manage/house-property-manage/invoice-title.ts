import type { OptionsType } from "../../../common";

/**
 * @description 发票抬头列表数据
 * InvoiceTitle list item
 */
export interface InvoiceTitleListItem {
	/** ID */
	id: string;
	/** 编号 Code */
	code: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 发票类型 Invoice type */
	invoiceType: string;
	/** 发票名头 Invoice title */
	invoiceTitle: string;
	/** 纳税人识别号 Taxpayer ID */
	taxpayerId: string;
	/** 地址 Address */
	address: string;
	/** 电话 Phone */
	phone: string;
	/** 开户行及账号 Bank and account */
	bankAccount: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description 发票抬头列表查询参数
 * InvoiceTitle list query parameters
 */
export interface InvoiceTitleQueryParams {
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 发票类型 Invoice type */
	invoiceType?: string;
	/** 发票名头 Invoice title */
	invoiceTitle?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const invoiceTitleStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 发票抬头表单VO
 * Invoice title form VO
 */
export interface InvoiceTitleFormVO {
	/** 业主名称 Owner name */
	ownerName: string;
	/** 发票类型 Invoice type */
	invoiceType: string;
	/** 发票名头 Invoice title */
	invoiceTitle: string;
	/** 纳税人识别号 Taxpayer ID */
	taxpayerId: string;
	/** 地址 Address */
	address: string;
	/** 电话 Phone */
	phone: string;
	/** 开户行及账号 Bank and account */
	bankAccount: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 发票类型选项
 * Invoice type options
 */
export const invoiceTitleTypeOptions: OptionsType = [
	{ label: "增值税专用发票", value: "增值税专用发票" },
	{ label: "增值税普通发票", value: "增值税普通发票" },
	{ label: "电子普通发票", value: "电子普通发票" },
];

// ==================== 兼容旧中文名称 ====================

/**
 * @description 发票抬头列表数据（兼容性中文名称）
 * InvoiceTitle list item (for compatibility with Chinese names)
 */
export type 发票抬头_列表数据 = InvoiceTitleListItem;

/**
 * @description 发票抬头列表查询参数（兼容性中文名称）
 * InvoiceTitle query parameters (for compatibility with Chinese names)
 */
export type 发票抬头_列表查询_VO = InvoiceTitleQueryParams;

/**
 * @description 发票类型选项（兼容性中文名称）
 * Invoice type options (for compatibility with Chinese names)
 */
export const 发票类型选项 = invoiceTitleTypeOptions;
