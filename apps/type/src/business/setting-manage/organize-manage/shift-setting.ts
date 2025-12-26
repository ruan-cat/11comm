/**
 * @file 班次设置类型定义
 * @description Shift setting types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 班次设置列表数据
 * Shift setting list item
 */
export interface ShiftSettingListItem {
	/** 班次ID Shift ID */
	id: string;
	/** 班次名称 Shift name */
	name: string;
	/** 班次类型 Shift type */
	type: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 是否启用 Enabled status */
	enabled: boolean;
	/** 描述 Description */
	description: string;
}

/**
 * 班次设置查询参数
 * Shift setting query parameters
 */
export interface ShiftSettingQueryParams extends BaseListQueryParams {
	/** 班次名称 Shift name */
	name?: string;
	/** 班次类型 Shift type */
	type?: string;
	/** 开始时间 Start time */
	startTime?: string;
	/** 结束时间 End time */
	endTime?: string;
	/** 是否启用 Enabled status */
	enabled?: boolean;
	/** 描述 Description */
	description?: string;
}

/**
 * 班次设置表单VO
 * Shift setting form VO
 */
export interface ShiftSettingFormVO {
	/** 班次名称 Shift name */
	name: string;
	/** 班次类型 Shift type */
	type: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 是否启用 Enabled status */
	enabled: boolean;
	/** 描述 Description */
	description: string;
}

/**
 * 班次设置类型
 * Shift setting type alias
 */
export type ShiftSetting = ShiftSettingListItem;

/**
 * 班次设置列表查询参数
 * Shift setting list query parameters alias
 */
export type ShiftSettingListQuery = ShiftSettingQueryParams;

/**
 * 班次类型选项
 * Shift type options
 */
export const shiftTypeOptions: OptionsType = [
	{ label: "白班", value: "白班" },
	{ label: "夜班", value: "夜班" },
	{ label: "中班", value: "中班" },
	{ label: "全天", value: "全天" },
];
