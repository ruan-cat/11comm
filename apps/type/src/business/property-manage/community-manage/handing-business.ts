import type { OptionsType } from "../../../common";

/**
 * @description 费用类型
 * Fee type
 */
export type FeeType = "周期费用" | "临时费用" | "押金" | "违约金";

/**
 * @description 费用状态
 * Fee status
 */
export type FeeStatus = "待缴费" | "已缴费" | "已逾期" | "已减免" | "已作废";

/**
 * @description 业务受理列表数据
 * Handing business list item
 */
export interface HandingBusinessListItem {
	/** 费用项目 Fee item */
	feeItem: string;
	/** 费用标识 Fee ID */
	feeId: string;
	/** 费用类型 Fee type */
	feeType: FeeType;
	/** 应收金额 Amount receivable */
	amountReceivable: string;
	/** 建账时间 Account creation time */
	accountCreationTime: string;
	/** 应收时间段 Receivable period */
	receivablePeriod: string;
	/** 说明 Description */
	description: string;
	/** 状态 Status */
	status: FeeStatus;
}

/**
 * @description 业务受理列表查询参数
 * Handing business list query parameters
 */
export interface HandingBusinessQueryParams {
	/** 费用项目 Fee item */
	feeItem?: string;
	/** 费用标识 Fee ID */
	feeId?: string;
	/** 费用类型 Fee type */
	feeType?: FeeType;
	/** 状态 Status */
	status?: FeeStatus;
	/** 建账开始时间 Account creation start time */
	accountCreationStartTime?: string;
	/** 建账结束时间 Account creation end time */
	accountCreationEndTime?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 费用类型选项（费用分类）
 * Fee category options
 */
export const feeCategoryOptions: OptionsType = [
	{ label: "周期费用", value: "周期费用" },
	{ label: "临时费用", value: "临时费用" },
	{ label: "押金", value: "押金" },
	{ label: "违约金", value: "违约金" },
];


/**
 * @description 费用状态选项
 * Fee status options
 */
export const feeStatusOptions: OptionsType = [
	{ label: "待缴费", value: "待缴费" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "已逾期", value: "已逾期" },
	{ label: "已减免", value: "已减免" },
	{ label: "已作废", value: "已作废" },
];

/**
 * @description 业务受理状态选项
 * Business handling status options
 */
export const businessHandlingStatusOptions = feeStatusOptions;

