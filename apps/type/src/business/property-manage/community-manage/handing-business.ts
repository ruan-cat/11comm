import type { OptionsType } from "../../../common";
import { feeStatusOptions } from "../../../common/business-options";

// 重导出通用选项
export { feeStatusOptions };

/**
 * @description 费用类型
 * Fee type
 */
export type FeeType = "periodic" | "temporary" | "deposit" | "penalty";

/**
 * @description 费用状态
 * Fee status
 */
export type FeeStatus = "pending" | "paid" | "overdue" | "reduced" | "voided";

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
 * @description 业务受理费用类型选项
 * Handing business fee type options
 */
export const handingBusinessFeeTypeOptions: OptionsType = [
	{ label: "周期费用", value: "periodic" },
	{ label: "临时费用", value: "temporary" },
	{ label: "押金", value: "deposit" },
	{ label: "违约金", value: "penalty" },
];

// TODO: 应该删除
/**
 * @description 业务受理表单数据
 * Handing business form data
 */
export interface HandingBusinessFormVO {
	/** 费用项目 Fee item */
	feeItem: string;
	/** 费用标识 Fee ID */
	feeId: string;
	/** 费用类型 Fee type */
	feeType: string;
	/** 应收金额 Amount receivable */
	amountReceivable: string;
	/** 建账时间 Account creation time */
	accountCreationTime: string;
	/** 应收时间段 Receivable period */
	receivablePeriod: string;
	/** 说明 Description */
	description: string;
	/** 状态 Status */
	status: string;
}

/**
 * @description 业务处理状态选项
 * Business handling status options
 */
export const businessHandlingStatusOptions: OptionsType = [
	{ label: "待缴费", value: "待缴费" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "已逾期", value: "已逾期" },
	{ label: "已减免", value: "已减免" },
	{ label: "已作废", value: "已作废" },
];

/**
 * @description 列表数据转表单数据
 * Convert list data to form data
 */
export function handingBusinessListDataToFormData(listData: HandingBusinessListItem): HandingBusinessFormVO {
	return {
		feeItem: listData.feeItem,
		feeId: listData.feeId,
		feeType: listData.feeType,
		amountReceivable: listData.amountReceivable,
		accountCreationTime: listData.accountCreationTime,
		receivablePeriod: listData.receivablePeriod,
		description: listData.description,
		status: listData.status,
	};
}
