/** 巡检管理模块 - 类型定义 */

import type { PatrolDetailListItem, PatrolTaskListItem } from "@01s-11comm/type";

// --- PatrolItem / ptPatrolItems ---

export interface AdminPatrolItemListItem {
	id: string;
	itemName: string;
	checkStandard: string | null;
	checkMethod: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListPatrolItemsParams {
	pageIndex: number;
	pageSize: number;
	itemName?: string;
}

// --- PatrolPath / ptPatrolPaths ---

export interface AdminPatrolPathListItem {
	id: string;
	planId: string;
	pathName: string;
	pathDescription: string | null;
	estimatedDuration: number | null;
	createTime: string;
	updateTime: string;
}

export interface ListPatrolPathsParams {
	pageIndex: number;
	pageSize: number;
	pathName?: string;
	planId?: string;
}

// --- PatrolPlan / ptPatrolPlans ---

export interface AdminPatrolPlanListItem {
	id: string;
	communityId: string | null;
	planName: string;
	patrolType: string | null;
	patrolLevel: string | null;
	planDescription: string | null;
	frequency: string | null;
	startDate: string | null;
	endDate: string | null;
	executionTimeSlot: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListPatrolPlansParams {
	pageIndex: number;
	pageSize: number;
	planName?: string;
	patrolType?: string;
}

// --- PatrolPoint / ptPatrolPoints ---

export interface AdminPatrolPointListItem {
	id: string;
	pathId: string;
	pointName: string;
	location: string | null;
	qrCodeOrNfc: string | null;
	sortOrder: number | null;
	createTime: string;
	updateTime: string;
}

export interface ListPatrolPointsParams {
	pageIndex: number;
	pageSize: number;
	pointName?: string;
	pathId?: string;
}

// --- PatrolTask / ptPatrolTasks ---

export type AdminPatrolTaskListItem = PatrolTaskListItem;

export interface ListPatrolTasksParams {
	pageIndex: number;
	pageSize: number;
	taskCode?: string;
	taskName?: string;
	patrolStatus?: string;
	patrolMethod?: string;
	currentPatrolPerson?: string;
	sortBy?: "createTime" | "updateTime" | "plannedStartTime";
	sortOrder?: "asc" | "desc";
}

// --- PatrolDetail / ptPatrolTaskDetails ---

export type AdminPatrolDetailListItem = PatrolDetailListItem;

export interface ListPatrolDetailsParams {
	pageIndex: number;
	pageSize: number;
	taskStatus?: string;
	patrolMethod?: string;
	sortBy?: "createTime" | "updateTime";
	sortOrder?: "asc" | "desc";
}
