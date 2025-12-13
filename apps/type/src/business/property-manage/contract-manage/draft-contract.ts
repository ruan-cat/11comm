import type { OptionsType } from "../../../common";

/**
 * @description draft-contract列表数据
 * DraftContract list item
 */
export interface DraftContractListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
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
export interface DraftContractQueryParams {
	/** 名称 Name */
	name?: string;
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
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 合同草稿类型选项
 * Draft contract type options
 */
export const 合同草稿类型Options: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];

/**
 * @description 合同类型选项别名
 * Contract type options alias
 */
export const contractTypeOptionsData = 合同草稿类型Options;

/**
 * @description 合同草稿状态选项
 * Draft contract status options
 */
export const 合同草稿状态Options: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 合同草稿_列表数据 类型（兼容性）
 * Draft contract list data type (for compatibility)
 */
export type 合同草稿_列表数据 = DraftContractListItem[];

/**
 * @description 合同类型_列表查询_VO 类型（兼容性）
 * Contract type list query VO type (for compatibility)
 */
export type 合同类型_列表查询_VO = DraftContractQueryParams;
