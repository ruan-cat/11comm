/**
 * @file 合同打印类型定义
 * @description Contract print types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * 合同打印列表数据
 * Contract print list item
 */
export interface PrintListItem {
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
	/** 打印次数 Print count */
	printCount: number;
	/** 最近打印时间 Last print time */
	lastPrintTime: string;
	/** 最近打印人 Last printer */
	lastPrinter: string;
	/** 打印状态 Print status */
	printStatus: string;
	/** 创建时间 Create time */
	createTime: string;
}

/**
 * 合同打印查询参数
 * Contract print query parameters
 */
export interface PrintQueryParams extends BaseListQueryParams {
	/** 合同名称 Contract name */
	contractName?: string;
	/** 合同编号 Contract number */
	contractNumber?: string;
	/** 合同类型 Contract type */
	contractType?: string;
	/** 打印状态 Print status */
	printStatus?: string;
}

/**
 * 打印状态选项
 * Print status options
 */
export const printStatusOptions: OptionsType = [
	{ label: "未打印", value: "未打印" },
	{ label: "已打印", value: "已打印" },
	{ label: "打印中", value: "打印中" },
];

/**
 * 合同打印类型选项
 * Print contract type options
 */
export const printContractTypeOptions = contractTypeOptions;
