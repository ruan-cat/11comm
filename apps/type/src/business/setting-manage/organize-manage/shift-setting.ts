import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 班次设置信息
 * Shift setting information
 */
export interface ShiftSetting {
	/** 班次ID Shift ID */
	id: string;
	/** 班次名称 Shift name */
	name: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 班次类型 Shift type */
	type: string;
	/** 描述 Description */
	description?: string;
	/** 是否启用 Enabled */
	enabled?: boolean;
}

/**
 * 班次设置列表查询参数
 * Shift setting list query parameters
 */
export interface ShiftSettingListQuery extends BaseListQueryParams {
	/** 班次名称 Shift name */
	name?: string;
	/** 班次类型 Shift type */
	type?: string;
}

/**
 * 班次类型选项
 * Shift type options
 */
export const shiftTypeOptions: OptionsType = [
	{ label: "早班", value: "morning" },
	{ label: "中班", value: "afternoon" },
	{ label: "晚班", value: "evening" },
	{ label: "夜班", value: "night" },
	{ label: "全天", value: "full" },
];
