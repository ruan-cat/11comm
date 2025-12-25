import type { OptionsType } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description first-party列表数据
 * FirstParty list item
 */
export interface FirstPartyListItem {
	/** ID */
	id: string;
	/** 甲方 Party A */
	partyA: string;
	/** 甲方联系人 Contact Person */
	contactPerson: string;
	/** 联系电话 Contact Phone */
	contactPhone: string;
	/** 地址 Address */
	address: string;
	/** 统一社会信用代码 Unified Social Credit Code */
	creditCode: string;
	/** 成立日期 Establishment Date */
	establishmentDate: string;
	/** 法定代表人 Legal Representative */
	legalRepresentative: string;
	/** 经营范围 Business Scope */
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
 * @description first-party列表查询参数
 * FirstParty list query parameters
 */
export interface FirstPartyQueryParams {
	/** 甲方 Party A */
	partyA?: string;
	/** 甲方联系人 Contact Person */
	contactPerson?: string;
	/** 联系电话 Contact Phone */
	contactPhone?: string;
	/** 法定代表人 Legal Representative */
	legalRepresentative?: string;
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
export const firstPartyStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 合同甲方类型选项（使用公共合同类型）
 * Contract first-party type options (using common contract type options)
 */
export const contractFirstPartyTypeOptions = contractTypeOptions;

/**
 * 合同甲方表单数据结构定义
 * Contract first party form VO
 */
export interface FirstPartyFormVO {
	/** 甲方名称 Party A */
	partyA: string;
	/** 甲方联系人 Contact person */
	contactPerson: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 地址 Address */
	address: string;
	/** 统一社会信用代码 Credit code */
	creditCode: string;
	/** 成立日期 Establishment date */
	establishmentDate: string;
	/** 法定代表人 Legal representative */
	legalRepresentative: string;
	/** 经营范围 Business scope */
	businessScope: string;
}
