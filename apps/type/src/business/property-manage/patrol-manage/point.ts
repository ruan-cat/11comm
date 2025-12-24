import type { OptionsType } from "../../../common";

/**
 * @description point列表数据
 * Point list item
 */
export interface PointListItem {
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
 * @description point列表查询参数
 * Point list query parameters
 */
export interface PointQueryParams {
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
export const pointStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 巡逻点列表数据
 * Patrol point list data (backward compatibility)
 */
export interface PatrolPointListData extends PointListItem {
	/** 任务详情ID */
	taskDetailId: string;
	/** 巡检点名称 */
	patrolPointName: string;
	/** 巡检计划名称 */
	patrolPlanName: string;
	/** 巡检路线名称 */
	patrolRouteName: string;
	/** 巡检人开始/结束时间 */
	patrolPersonTime: string;
	/** 巡检点开始/结束时间 */
	patrolPointTime: string;
	/** 实际巡检时间 */
	actualPatrolTime: string;
	/** 实际签到状态 */
	actualCheckInStatus: string;
	/** 计划巡检人 */
	planPatrolPerson: string;
	/** 实际巡检人 */
	actualPatrolPerson: string;
	/** 巡检方式 */
	patrolMethod: string;
	/** 任务状态 */
	taskStatus: string;
	/** 巡检点状态 */
	patrolPointStatus: string;
	/** 巡检情况 */
	patrolSituation: string;
	/** 巡检照片 */
	patrolPhotos: string;
	/** 位置信息 */
	locationInfo: string;
}

/**
 * @description 巡逻点列表查询参数
 * Patrol point list query parameters (backward compatibility)
 */
export interface PatrolPointListQueryVO {
	/** 巡检人 */
	patrolPerson?: string;
	/** 巡检开始时间 */
	patrolStartTime?: string;
	/** 巡检结束时间 */
	patrolEndTime?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
