import type { OptionsType } from "../../../common";

// ==================== 表单类型定义 ====================

/**
 * 巡检任务表单数据类型 / Patrol task form data type
 */
export interface PatrolTaskFormVO {
	/** 任务编码 / Task code */
	taskCode: string;
	/** 巡检计划 / Patrol plan */
	patrolPlan: string;
	/** 巡检人开始/结束时间 / Patrol person start/end time */
	patrolPersonTimeRange: string;
	/** 实际巡检时间 / Actual patrol time */
	actualPatrolTime: string;
	/** 计划巡检人 / Planned patrol person */
	plannedPatrolPerson: string;
	/** 当前巡检人 / Current patrol person */
	currentPatrolPerson: string;
	/** 转移描述 / Transfer description */
	transferDescription: string;
	/** 巡检方式 / Patrol method */
	patrolMethod: string;
	/** 巡检状态 / Patrol status */
	patrolStatus: string;
}

/**
 * 巡检任务表单 Props / Patrol task form props
 */
export interface PatrolTaskFormProps {
	/** 表单数据 / Form data */
	form: PatrolTaskFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: PatrolTaskFormVO;
}

// ==================== 原有类型定义 ====================

/**
 * @description task列表数据
 * Task list item
 */
export interface TaskListItem {
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
 * @description task列表查询参数
 * Task list query parameters
 */
export interface TaskQueryParams {
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
export const taskStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 默认表单对象 ====================

/** 默认表单 / Default form */
export const defaultPatrolTaskForm: PatrolTaskFormVO = {
	taskCode: "",
	patrolPlan: "",
	patrolPersonTimeRange: "",
	actualPatrolTime: "",
	plannedPatrolPerson: "",
	currentPatrolPerson: "",
	transferDescription: "",
	patrolMethod: "",
	patrolStatus: "",
};

// ==================== 向后兼容的类型别名 ====================

/** 向后兼容：巡检任务表单_VO / Backward compatibility: 巡检任务表单_VO */
export type 巡检任务表单_VO = PatrolTaskFormVO;
