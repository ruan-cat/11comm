/**
 * @file 合同乙方类型定义
 * @description Contract second party types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 合同乙方列表数据
 * Contract second party list item
 */
export interface SecondPartyListItem {
	/** ID ID */
	id: string;
	/** 乙方名称 Party B name */
	partyB: string;
	/** 乙方联系人 Contact person */
	contactPerson: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 地址 Address */
	address: string;
	/** 统一社会信用代码 Unified social credit code */
	creditCode: string;
	/** 成立日期 Establishment date */
	establishmentDate: string;
	/** 法定代表人 Legal representative */
	legalRepresentative: string;
	/** 经营范围 Business scope */
	businessScope: string;
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
 * 合同乙方查询参数
 * Contract second party query parameters
 */
export interface SecondPartyQueryParams extends BaseListQueryParams {
	/** 乙方名称 Party B name */
	partyB?: string;
	/** 乙方联系人 Contact person */
	contactPerson?: string;
	/** 联系电话 Contact phone */
	contactPhone?: string;
	/** 法定代表人 Legal representative */
	legalRepresentative?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * 状态选项
 * Status options
 */
export const secondPartyStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
