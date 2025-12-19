/**
 * @file 合同审核类型定义
 * @description Contract review types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * 合同审核列表数据
 * Contract review list item
 */
export interface ReviewListItem {
	/** ID ID */
	id: string;
	/** 合同名称 Contract name */
	contractName: string;
	/** 合同编号 Contract number */
	contractNumber: string;
	/** 合同类型 Contract type */
	contractType: string;
	/** 甲方 Party A */
	partyA: string;
	/** 乙方 Party B */
	partyB: string;
	/** 合同金额 Contract amount */
	contractAmount: string;
	/** 提交人 Submitter */
	submitter: string;
	/** 提交时间 Submit time */
	submitTime: string;
	/** 审核人 Reviewer */
	reviewer: string;
	/** 审核时间 Review time */
	reviewTime: string;
	/** 审核状态 Review status */
	reviewStatus: string;
	/** 审核意见 Review opinion */
	reviewOpinion?: string;
	/** 当前审核节点 Current review node */
	currentNode: string;
}

/**
 * 合同审核查询参数
 * Contract review query parameters
 */
export interface ReviewQueryParams extends BaseListQueryParams {
	/** 合同名称 Contract name */
	contractName?: string;
	/** 合同编号 Contract number */
	contractNumber?: string;
	/** 合同类型 Contract type */
	contractType?: string;
	/** 审核状态 Review status */
	reviewStatus?: string;
	/** 提交人 Submitter */
	submitter?: string;
}

/**
 * 审核状态选项
 * Review status options
 */
export const reviewStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "审核中", value: "审核中" },
	{ label: "已通过", value: "已通过" },
	{ label: "已驳回", value: "已驳回" },
	{ label: "已撤回", value: "已撤回" },
];

/**
 * 合同审核类型选项
 * Review contract type options
 */
export const reviewContractTypeOptions = contractTypeOptions;
