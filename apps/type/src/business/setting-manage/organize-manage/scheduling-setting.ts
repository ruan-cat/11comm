import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 排班设置信息
 */
export interface SchedulingSetting {
	/** 设置ID */
	id: string;
	/** 班次名称 */
	name: string;
	/** 排班类型 */
	type: string;
	/** 排班周期 */
	cycle: string;
	/** 生效时间 */
	effectiveTime: string;
	/** 人员 */
	staff: string;
	/** 状态 */
	status: string;
	/** 创建时间 */
	createTime?: string;
}

/**
 * 排班设置列表查询参数
 */
export interface SchedulingSettingListQuery extends BaseListQueryParams {
	/** 排班名称 */
	name?: string;
	/** 状态 */
	status?: string;
}

/**
 * 排班类型选项
 */
export const schedulingTypeOptions: OptionsType = [
	{ label: "固定排班", value: "fixed" },
	{ label: "轮班排班", value: "rotation" },
	{ label: "自由排班", value: "flexible" },
];

/**
 * 排班周期选项
 */
export const schedulingCycleOptions: OptionsType = [
	{ label: "每天", value: "daily" },
	{ label: "每周", value: "weekly" },
	{ label: "每月", value: "monthly" },
];

/**
 * 状态选项
 */
export const schedulingStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/** 排班设置表单 */
export interface SchedulingSettingFormVO extends Partial<SchedulingSetting> {
	/** 班次名称 */
	name: string;
	/** 排班类型 */
	type: string;
	/** 排班周期 */
	cycle: string;
	/** 生效时间 */
	effectiveTime: string;
	/** 人员 */
	staff: string;
	/** 状态 */
	status: string;
}
