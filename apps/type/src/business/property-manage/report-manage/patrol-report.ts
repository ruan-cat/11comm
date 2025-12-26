import type { OptionsType } from "../../../common";

/**
 * @description 巡检报表列表数据
 * Patrol report list item
 */
export interface PatrolReportListItem {
	/** ID */
	id: string;
	/** 小区 Community */
	community: string;
	/** 巡检编号 Patrol number */
	patrolNumber: string;
	/** 巡检名称 Patrol name */
	patrolName: string;
	/** 巡检类型 Patrol type */
	patrolType: string;
	/** 巡检级别 Patrol level */
	patrolLevel: string;
	/** 负责人 Responsible person */
	responsiblePerson: string;
	/** 巡检时间 Patrol time */
	patrolTime: string;
	/** 状态 Status */
	status: string;
	/** 异常数 Abnormal count */
	abnormalCount: number;
}

/**
 * @description 巡检报表列表查询参数
 * Patrol report list query parameters
 */
export interface PatrolReportQueryParams {
	/** 巡检名称 Patrol name */
	patrolName?: string;
	/** 巡检类型 Patrol type */
	patrolType?: string;
	/** 巡检级别 Patrol level */
	patrolLevel?: string;
	/** 负责人 Responsible person */
	responsiblePerson?: string;
	/** 状态 Status */
	status?: string;
	/** 小区 Community */
	community?: string;
	/** 巡检时间开始 Patrol time start */
	patrolTimeStart?: string;
	/** 巡检时间结束 Patrol time end */
	patrolTimeEnd?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
