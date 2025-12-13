import type { OptionsType } from "../../../common";

/**
 * @description path列表数据
 * Path list item
 */
export interface PathListItem {
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
 * @description path列表查询参数
 * Path list query parameters
 */
export interface PathQueryParams {
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
export const pathStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 巡检路线表单数据
 * Patrol path form data
 */
export interface PatrolPathFormData {
	/** 巡检点ID Patrol point ID */
	patrolPointId: string;
	/** 巡检点名称 Patrol point name */
	patrolPointName: string;
	/** 巡检点类型 Patrol point type */
	patrolPointType: string;
	/** 巡检位置 Patrol location */
	patrolLocation: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 排序 Sort order */
	sortOrder: string;
}
