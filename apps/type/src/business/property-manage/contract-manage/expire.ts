import type { OptionsType } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description expire列表数据
 * Expire list item
 */
export interface ExpireListItem {
	/** ID */
	id: string;
	/** 合同名称 Contract Name */
	contractName: string;
	/** 合同编号 Contract Number */
	contractNumber: string;
	/** 合同类型 Contract Type */
	contractType: string;
	/** 甲方 Party A */
	partyA: string;
	/** 乙方 Party B */
	partyB: string;
	/** 经办人 Handler */
	handler: string;
	/** 合同金额 Contract Amount */
	contractAmount: string;
	/** 开始时间 Start Time */
	startTime: string;
	/** 结束时间 End Time */
	endTime: string;
	/** 签订时间 Signing Time */
	signingTime: string;
	/** 状态 Status */
	status: string;
	/** 处理状态 Processing Status */
	processingStatus: string;
	/** 处理人 Processor */
	processor: string;
	/** 处理时间 Process Time */
	processTime: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description expire列表查询参数
 * Expire list query parameters
 */
export interface ExpireQueryParams {
	/** 合同名称 Contract Name */
	contractName?: string;
	/** 合同编号 Contract Number */
	contractNumber?: string;
	/** 合同类型 Contract Type */
	contractType?: string;
	/** 处理状态 Processing Status */
	processingStatus?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const expireStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 到期合同处理状态选项
 * Expire contract processing status options
 */
export const expiredContractHandlingStatusOptions: OptionsType = [
	{ label: "未处理", value: "未处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已处理", value: "已处理" },
];

/**
 * @description 到期合同类型选项
 * Expire contract type options
 */
export const expiredContractTypeOptions = contractTypeOptions;

/**
 * 到期处理类型
 * Processing type
 */
export type ProcessingType = "续签" | "终止";

/**
 * 合同类型
 * Contract type
 */
export type ContractType = "采购合同" | "销售合同" | "服务合同" | "租赁合同" | "劳务合同" | "技术合同";

/**
 * 合同到期表单接口
 * Contract expire form VO
 */
export interface ContractExpireFormVO {
	/** 合同名称 Contract name */
	contractName: string;
	/** 合同编号 Contract number */
	contractNumber: string;
	/** 合同类型 Contract type */
	contractType: ContractType;
	/** 甲方 Party A */
	partyA: string;
	/** 甲方联系人 Party A contact */
	partyAContact: string;
	/** 甲方电话 Party A phone */
	partyAPhone: string;
	/** 乙方 Party B */
	partyB: string;
	/** 乙方联系人 Party B contact */
	partyBContact: string;
	/** 乙方电话 Party B phone */
	partyBPhone: string;
	/** 经办人 Handler */
	handler: string;
	/** 经办人电话 Handler phone */
	handlerPhone: string;
	/** 合同金额 Contract amount */
	contractAmount: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 签订时间 Signing time */
	signingTime: string;
	/** 到期处理类型 Processing type */
	processingType: ProcessingType;
	/** 处理人 Processor */
	processor: string;
	/** 说明 Description */
	description: string;
	/** 附件 Attachments */
	attachments?: any[];
}
