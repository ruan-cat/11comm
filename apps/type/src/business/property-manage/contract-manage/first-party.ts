import type { OptionsType } from "../../../common";
import { 合同类型Options } from "../../../common/business-options";

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
 * @description 合同甲方类型选项
 * Contract first-party type options
 */
export const 合同甲方类型Options = 合同类型Options;

// ==================== 兼容旧类型定义 ====================

/**
 * @description 合同甲方_列表数据 类型（兼容性）
 * Contract first-party list data type (for compatibility)
 */
export type 合同甲方_列表数据 = FirstPartyListItem[];
