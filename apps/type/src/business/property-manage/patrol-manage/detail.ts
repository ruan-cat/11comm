import type { OptionsType } from "../../../common";

// ==================== 联合类型定义 ====================

/** 巡检方式联合类型 / Patrol method union type */
export type PatrolMethodType = "步行巡检" | "骑车巡检" | "驾车巡检" | "视频巡检";

/** 任务状态联合类型 / Task status union type */
export type TaskStatusType = "待执行" | "执行中" | "已完成" | "已逾期" | "已取消";

/** 巡检点状态联合类型 / Patrol point status union type */
export type PatrolPointStatusType = "正常" | "异常" | "待检查";

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

/**
 * 巡查明细表单 Props / Patrol detail form props
 */
export interface PatrolDetailFormProps {
	/** 表单数据 / Form data */
	form: PatrolDetailFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: PatrolDetailFormVO;
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
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 默认表单对象 ====================

/** 默认表单 / Default form */
export const defaultPatrolDetailForm: PatrolDetailFormVO = {
	patrolPointName: "",
	patrolPlanName: "",
	patrolRouteName: "",
	plannedPatrolPerson: "",
	patrolMethod: "步行巡检",
	location: "",
	patrolSituation: "",
};

// ==================== 向后兼容的类型别名 ====================

/** 向后兼容：巡检方式 / Backward compatibility: PatrolMethodType */
export type 巡检方式 = PatrolMethodType;

/** 向后兼容：任务状态 / Backward compatibility: TaskStatusType */
export type 任务状态 = TaskStatusType;

/** 向后兼容：巡检点状态 / Backward compatibility: PatrolPointStatusType */
export type 巡检点状态 = PatrolPointStatusType;

/** 向后兼容：巡查明细表单_VO / Backward compatibility: 巡查明细表单_VO */
export type 巡查明细表单_VO = PatrolDetailFormVO;

/** 向后兼容：巡查明细表单Props / Backward compatibility: 巡查明细表单Props */
export type 巡查明细表单Props = PatrolDetailFormProps;
