import type { OptionsType } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description draft-contract列表数据
 * DraftContract list item
 */
export interface DraftContractListItem {
	/** ID */
	id: string;
	/** 合同名称 Contract Name */
	contractName: string;
	/** 合同编号 Contract Number */
	contractNumber: string;
	/** 父合同编号 Parent Contract Number */
	parentContractNumber?: string;
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
 * @description draft-contract列表查询参数
 * DraftContract list query parameters
 */
export type DraftContractQueryParamsType = DraftContractQueryParams;

/** DraftContractQueryParams */
export interface DraftContractQueryParams {
	/** 合同名称 Contract Name */
	contractName?: string;
	/** 合同编号 Contract Number */
	contractNumber?: string;
	/** 合同类型 Contract Type */
	contractType?: string;
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
export const draftContractStatusOptions: OptionsType = [
	{ label: "草稿", value: "draft" },
	{ label: "审批中", value: "pending" },
	{ label: "已生效", value: "active" },
	{ label: "已终止", value: "terminated" },
];

/**
 * @description 合同草稿类型选项
 * Draft contract type options
 */
export const draftContractTypeOptions = contractTypeOptions;


