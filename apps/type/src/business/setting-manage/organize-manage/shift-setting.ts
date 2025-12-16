import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 班次设置信息
 */
export interface ShiftSetting {
	/** 班次ID */
	id: string;
	/** 班次名称 */
	name: string;
	/** 开始时间 */
	startTime: string;
	/** 结束时间 */
	endTime: string;
	/** 班次类型 */
	type: string;
	/** 描述 */
	description?: string;
	/** 是否启用 */
	enabled?: boolean;
}

/**
 * 班次设置列表查询参数
 */
export interface ShiftSettingListQuery extends BaseListQueryParams {
	/** 班次名称 */
	name?: string;
	/** 班次类型 */
	type?: string;
}

/**
 * 班次类型选项
 */
export const shiftTypeOptions: OptionsType = [
	{ label: "早班", value: "morning" },
	{ label: "中班", value: "afternoon" },
	{ label: "晚班", value: "evening" },
	{ label: "夜班", value: "night" },
	{ label: "全天", value: "full" },
];
