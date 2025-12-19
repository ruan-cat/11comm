/**
 * @file 合同归档类型定义
 * @description Contract archive types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * 合同归档列表数据
 * Contract archive list item
 */
export interface ArchiveListItem {
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
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 归档时间 Archive time */
	archiveTime: string;
	/** 归档人 Archivist */
	archivist: string;
	/** 归档编号 Archive number */
	archiveNumber: string;
	/** 存放位置 Storage location */
	storageLocation: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * 合同归档查询参数
 * Contract archive query parameters
 */
export interface ArchiveQueryParams extends BaseListQueryParams {
	/** 合同名称 Contract name */
	contractName?: string;
	/** 合同编号 Contract number */
	contractNumber?: string;
	/** 合同类型 Contract type */
	contractType?: string;
	/** 甲方 Party A */
	partyA?: string;
	/** 乙方 Party B */
	partyB?: string;
	/** 归档编号 Archive number */
	archiveNumber?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * 归档状态选项
 * Archive status options
 */
export const archiveStatusOptions: OptionsType = [
	{ label: "已归档", value: "已归档" },
	{ label: "借阅中", value: "借阅中" },
	{ label: "已销毁", value: "已销毁" },
];

/**
 * 合同归档类型选项
 * Archive contract type options
 */
export const archiveContractTypeOptions = contractTypeOptions;
