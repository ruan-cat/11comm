import type { OptionsType } from "../../../common";

/**
 * @description invoice列表数据
 * Invoice list item
 */
export interface InvoiceListItem {
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
 * @description invoice列表查询参数
 * Invoice list query parameters
 */
export interface InvoiceQueryParams {
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
export const invoiceStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 发票表单VO
 * Invoice form VO
 */
export interface 发票表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 发票表单默认值
 * Invoice form default values
 */
export const invoiceDefaultForm: 发票表单_VO = {
	name: "",
	status: "启用",
	remark: "",
};

/**
 * @description 发票类型选项
 * Invoice type options
 */
export const invoiceTypeOptions: OptionsType = [
	{ label: "普通发票", value: "普通发票" },
	{ label: "专用发票", value: "专用发票" },
	{ label: "电子发票", value: "电子发票" },
];

/**
 * @description 发票审核状态选项
 * Invoice audit status options
 */
export const invoiceAuditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];

// ==================== 兼容旧中文名称 ====================

/**
 * @description 发票类型选项（兼容性）
 * Invoice type options (for compatibility)
 */
export const 发票类型Options = invoiceTypeOptions;

/**
 * @description 发票审核状态选项（兼容性）
 * Invoice audit status options (for compatibility)
 */
export const 发票审核状态Options = invoiceAuditStatusOptions;
