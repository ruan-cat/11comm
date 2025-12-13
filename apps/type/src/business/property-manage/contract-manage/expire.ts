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
