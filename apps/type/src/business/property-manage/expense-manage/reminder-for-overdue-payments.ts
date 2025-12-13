import type { OptionsType } from "../../../common";

/**
 * @description reminder-for-overdue-payments列表数据
 * ReminderForOverduePayments list item
 */
export interface ReminderForOverduePaymentsListItem {
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
 * @description reminder-for-overdue-payments列表查询参数
 * ReminderForOverduePayments list query parameters
 */
export interface ReminderForOverduePaymentsQueryParams {
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
export const reminderForOverduePaymentsStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 催缴方式选项
 * Collection method options
 */
export const 催缴方式Options: OptionsType = [
	{ label: "短信", value: "短信" },
	{ label: "电话", value: "电话" },
	{ label: "上门", value: "上门" },
];

/**
 * @description 催缴状态选项
 * Collection status options
 */
export const 催缴状态Options: OptionsType = [
	{ label: "待催缴", value: "待催缴" },
	{ label: "催缴中", value: "催缴中" },
	{ label: "已完成", value: "已完成" },
];
