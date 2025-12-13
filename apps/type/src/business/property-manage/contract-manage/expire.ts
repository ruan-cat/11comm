import type { OptionsType } from "../../../common";

/**
 * @description expire列表数据
 * Expire list item
 */
export interface ExpireListItem {
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
 * @description expire列表查询参数
 * Expire list query parameters
 */
export interface ExpireQueryParams {
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
export const expireStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 到期合同处理状态选项
 * Expire contract processing status options
 */
export const 到期合同处理状态Options: OptionsType = [
	{ label: "未处理", value: "未处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已处理", value: "已处理" },
];

/**
 * @description 到期合同类型选项
 * Expire contract type options
 */
export const 到期合同类型Options: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 到期合同_列表数据 类型（兼容性）
 * Expire contract list data type (for compatibility)
 */
export type 到期合同_列表数据 = ExpireListItem[];

/**
 * @description 到期合同_列表查询_VO 类型（兼容性）
 * Expire contract list query VO type (for compatibility)
 */
export type 到期合同_列表查询_VO = ExpireQueryParams;

/**
 * @description 合同类型选项（兼容性）
 * Contract type options (for compatibility)
 */
export const 合同类型Options = 到期合同类型Options;

/**
 * @description 处理状态选项（兼容性）
 * Processing status options (for compatibility)
 */
export const 处理状态Options = 到期合同处理状态Options;
