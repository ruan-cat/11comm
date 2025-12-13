import type { OptionsType } from "../../../common";

/**
 * @description plan列表数据
 * Plan list item
 */
export interface PlanListItem {
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
 * @description plan列表查询参数
 * Plan list query parameters
 */
export interface PlanQueryParams {
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
export const planStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 巡检计划表单VO
 * Patrol plan form VO
 */
export interface PatrolPlanFormVO {
	/** 计划名称 Plan name */
	planName: string;
	/** 计划路线 Plan route */
	planRoute: string;
	/** 计划周期 Plan cycle */
	planCycle: string;
	/** 签到方式 Check-in method */
	checkInMethod: string;
	/** 日期范围 Date range */
	dateRange: string;
	/** 时间范围 Time range */
	timeRange: {
		/** 开始时间 Start time */
		startTime: string;
		/** 结束时间 End time */
		endTime: string;
	};
	/** 任务提前(分钟) Task advance (minutes) */
	taskAdvanceMinutes: string;
	/** 制定人 Planner */
	planner: string;
	/** 制定时间 Plan time */
	planTime: string;
	/** 状态 Status */
	status: string;
	/** 巡检人员 Patrol staff */
	patrolStaff: string;
}
