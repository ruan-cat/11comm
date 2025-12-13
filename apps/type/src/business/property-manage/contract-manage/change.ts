import type { OptionsType } from "../../../common";

/**
 * @description change列表数据
 * Change list item
 */
export interface ChangeListItem {
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
 * @description change列表查询参数
 * Change list query parameters
 */
export interface ChangeQueryParams {
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
export const changeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 合同类型选项
 * Contract type options
 */
export const 合同类型Options: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 业务受理_列表数据 类型（兼容性）
 * Business handling list data type (for compatibility)
 */
export type 业务受理_列表数据 = ChangeListItem[];

/**
 * @description 合同类型_列表查询_VO 类型（兼容性）
 * Contract type list query VO type (for compatibility)
 */
export type 合同类型_列表查询_VO = ChangeQueryParams;
