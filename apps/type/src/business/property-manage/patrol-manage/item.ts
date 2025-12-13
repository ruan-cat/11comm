import type { OptionsType } from "../../../common";

/**
 * @description item列表数据
 * Item list item
 */
export interface ItemListItem {
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
 * @description item列表查询参数
 * Item list query parameters
 */
export interface ItemQueryParams {
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
export const itemStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 巡检项目表单VO
 * Patrol item form VO
 */
export interface PatrolItemFormVO {
	/** 编号 Code */
	code: string;
	/** 巡检项目 Patrol item */
	patrolItem: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 备注 Remark */
	remark: string;
}
