import type { OptionsType, BaseListQueryParams } from "../../../common";

// ==================== 联合类型定义 ====================

/** 巡检方式联合类型 / Patrol method union type */
export type PatrolMethodType = "walking" | "cycling" | "driving" | "video";

/** 任务状态联合类型 / Task status union type */
export type TaskStatusType = "pending" | "in_progress" | "completed" | "overdue" | "cancelled";

/** 巡检点状态联合类型 / Patrol point status union type */
export type PatrolPointStatusType = "normal" | "abnormal" | "pending";

// ==================== 表单类型定义 ====================

/**
 * 巡查明细表单数据类型 / Patrol detail form data type
 */
export interface PatrolDetailFormVO {
	/** 巡检点名称 / Patrol point name */
	patrolPointName: string;
	/** 巡检计划名称 / Patrol plan name */
	patrolPlanName: string;
	/** 巡检路线名称 / Patrol route name */
	patrolRouteName: string;
	/** 计划巡检人 / Planned patrol person */
	plannedPatrolPerson: string;
	/** 巡检方式 / Patrol method */
	patrolMethod: PatrolMethodType | "";
	/** 位置信息 / Location information */
	location: string;
	/** 巡检情况 / Patrol situation */
	patrolSituation: string;
}

// ==================== 原有类型定义 ====================

/**
 * @description detail列表数据
 * Detail list item
 */
export interface DetailListItem {
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
 * @description detail列表查询参数
 * Detail list query parameters
 */
export interface DetailQueryParams {
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
export const detailStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

// ==================== 默认表单对象 ====================

/** 默认表单 / Default form */
export const defaultPatrolDetailForm: PatrolDetailFormVO = {
	patrolPointName: "",
	patrolPlanName: "",
	patrolRouteName: "",
	plannedPatrolPerson: "",
	patrolMethod: "walking",
	location: "",
	patrolSituation: "",
};

// ==================== 列表相关类型 ====================

/**
 * @description 巡检明细列表数据
 * Patrol detail list data
 */
export interface PatrolDetailListItem extends DetailListItem {
	/** 任务详情ID / Task detail ID */
	taskDetailId: string;
	/** 巡检点名称 / Patrol point name */
	patrolPointName: string;
	/** 巡检计划名称 / Patrol plan name */
	patrolPlanName: string;
	/** 巡检路线名称 / Patrol route name */
	patrolRouteName: string;
	/** 巡检人开始结束时间 / Patrol person start and end time */
	patrolPersonStartEndTime: string;
	/** 巡检点开始结束时间 / Patrol point start and end time */
	patrolPointStartEndTime: string;
	/** 实际巡检时间 / Actual patrol time */
	actualPatrolTime: string;
	/** 实际签到状态 / Actual check-in status */
	actualCheckInStatus: string;
	/** 计划巡检人 / Planned patrol person */
	plannedPatrolPerson: string;
	/** 实际巡检人 / Actual patrol person */
	actualPatrolPerson: string;
	/** 巡检方式 / Patrol method */
	patrolMethod: PatrolMethodType | string;
	/** 任务状态 / Task status */
	taskStatus: TaskStatusType | string;
	/** 巡检点状态 / Patrol point status */
	patrolPointStatus: PatrolPointStatusType | string;
	/** 巡检情况 / Patrol situation */
	patrolSituation: string;
	/** 巡检照片 / Patrol photos */
	patrolPhotos: string;
	/** 位置信息 / Location info */
	locationInfo: string;
}

/**
 * @description 巡检明细列表查询参数
 * Patrol detail list query parameters
 */
export interface PatrolDetailQueryParams extends BaseListQueryParams {
	/** 巡检人 / Patrol person */
	patrolPerson?: string;
	/** 巡检开始时间 / Patrol start time */
	patrolStartTime?: string;
	/** 巡检结束时间 / Patrol end time */
	patrolEndTime?: string;
	/** 巡检方式 / Patrol method */
	patrolMethod?: PatrolMethodType | string;
	/** 任务状态 / Task status */
	taskStatus?: TaskStatusType | string;
	/** 巡检点状态 / Patrol point status */
	patrolPointStatus?: PatrolPointStatusType | string;
}
