import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * @description 排班类型
 * Schedule type
 */
export type ScheduleType = "morning" | "afternoon" | "evening" | "night" | "full_day";

/**
 * 排班表信息
 */
export interface WorkingSchedule {
	/** 排班ID */
	id: string;
	/** 排班名称 */
	name: string;
	/** 排班类型 */
	type: ScheduleType;
	/** 开始时间 */
	startTime: string;
	/** 结束时间 */
	endTime: string;
	/** 星期几（1-7） */
	weekday: number;
	/** 负责人姓名 */
	managerName: string;
	/** 联系电话 */
	phone: string;
	/** 是否启用 */
	enabled: boolean;
	/** 排班描述 */
	description?: string;
}

/**
 * 排班表列表查询参数
 */
export interface WorkingScheduleListQuery extends BaseListQueryParams {
	/** 排班名称 */
	name?: string;
	/** 排班类型 */
	type?: ScheduleType;
}

/**
 * 星期几选项
 */
export const weekdayOptions: OptionsType = [
	{ label: "周一", value: 1 },
	{ label: "周二", value: 2 },
	{ label: "周三", value: 3 },
	{ label: "周四", value: 4 },
	{ label: "周五", value: 5 },
	{ label: "周六", value: 6 },
	{ label: "周日", value: 7 },
];

/**
 * 排班类型选项
 */
export const scheduleTypeOptions: OptionsType = [
	{ label: "早班", value: "morning" },
	{ label: "中班", value: "afternoon" },
	{ label: "晚班", value: "evening" },
	{ label: "夜班", value: "night" },
	{ label: "全天", value: "full_day" },
];
