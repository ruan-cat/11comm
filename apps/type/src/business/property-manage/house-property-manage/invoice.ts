import type { OptionsType } from "../../../common";
import { invoiceTypeOptions, auditStatusOptions } from "../../../common/business-options";

/**
 * @description 发票列表数据
 * Invoice list item
 */
export interface InvoiceListItem {
	/** ID */
	id: string;
	/** 编号 Code */
	code: string;
	/** 发票类型 Invoice type */
	invoiceType: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 申请人 Applicant */
	applicant: string;
	/** 发票名头 Invoice title */
	invoiceTitle: string;
	/** 纳税人识别号 Taxpayer ID */
	taxpayerId: string;
	/** 申请金额 Application amount */
	applicationAmount: string;
	/** 发票号 Invoice number */
	invoiceNumber: string;
	/** 审核状态 Audit status */
	auditStatus: string;
	/** 申请时间 Application time */
	applicationTime: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description 发票列表查询参数
 * Invoice list query parameters
 */
export interface InvoiceQueryParams {
	/** 编号 Code */
	code?: string;
	/** 发票类型 Invoice type */
	invoiceType?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 申请人 Applicant */
	applicant?: string;
	/** 审核状态 Audit status */
	auditStatus?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const invoiceStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 发票表单VO
 * Invoice form VO
 */
export interface InvoiceFormVO {
	/** 编号 Code */
	code: string;
	/** 发票类型 Invoice type */
	invoiceType: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 申请人 Applicant */
	applicant: string;
	/** 发票名头 Invoice title */
	invoiceTitle: string;
	/** 纳税人识别号 Taxpayer ID */
	taxpayerId: string;
	/** 申请金额 Application amount */
	applicationAmount: string;
	/** 发票号 Invoice number */
	invoiceNumber: string;
	/** 审核状态 Audit status */
	auditStatus: string;
	/** 申请时间 Application time */
	applicationTime: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 发票表单默认值
 * Invoice form default values
 */
export const invoiceDefaultForm: InvoiceFormVO = {
	code: "",
	invoiceType: "",
	ownerName: "",
	applicant: "",
	invoiceTitle: "",
	taxpayerId: "",
	applicationAmount: "",
	invoiceNumber: "",
	auditStatus: "",
	applicationTime: "",
	remark: "",
};

/**
 * @description 发票审核状态选项
 * Invoice audit status options
 */
export const invoiceAuditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];

// Re-export options for convenience
export { invoiceTypeOptions };

// ==================== 兼容旧中文名称 ====================

/**
 * @description 发票列表数据（兼容性中文名称）
 * Invoice list item (for compatibility with Chinese names)
 */
export type 发票_列表数据 = InvoiceListItem;

/**
 * @description 发票列表查询参数（兼容性中文名称）
 * Invoice query parameters (for compatibility with Chinese names)
 */
export type 发票_列表查询_VO = InvoiceQueryParams;

/**
 * @description 发票表单VO（兼容性中文名称）
 * Invoice form VO (for compatibility with Chinese names)
 */
export type 发票表单_VO = InvoiceFormVO;

/**
 * @description 发票类型选项（兼容性中文名称）
 * Invoice type options (for compatibility with Chinese names)
 */
export const 发票类型Options = invoiceTypeOptions;

/**
 * @description 发票审核状态选项（兼容性中文名称）
 * Invoice audit status options (for compatibility with Chinese names)
 */
export const 发票审核状态Options = invoiceAuditStatusOptions;
