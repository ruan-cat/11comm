import type { OptionsType } from "../../../common";

/**
 * @description invoice-title列表数据
 * InvoiceTitle list item
 */
export interface InvoiceTitleListItem {
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
 * @description invoice-title列表查询参数
 * InvoiceTitle list query parameters
 */
export interface InvoiceTitleQueryParams {
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
export const invoiceTitleStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// TODO: 不应该写成中文变量名 对应的更改admin管理后台项目的代码名称
/**
 * @description 发票抬头表单VO
 * Invoice title form VO
 */
export interface 发票抬头表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 发票类型选项
 * Invoice type options
 */
export const 发票类型选项: OptionsType = [
	{ label: "增值税专用发票", value: "增值税专用发票" },
	{ label: "增值税普通发票", value: "增值税普通发票" },
	{ label: "电子普通发票", value: "电子普通发票" },
];

/**
 * @description 发票抬头表单默认值
 * Invoice title form default values
 */
export const invoiceTitleDefaultForm: 发票抬头表单_VO = {
	name: "",
	status: "启用",
	remark: "",
};
