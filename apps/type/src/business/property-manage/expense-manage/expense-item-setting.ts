import type { OptionsType } from "../../../common";

/**
 * @description expense-item-setting列表数据
 * ExpenseItemSetting list item
 */
export interface ExpenseItemSettingListItem {
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
 * @description expense-item-setting列表查询参数
 * ExpenseItemSetting list query parameters
 */
export interface ExpenseItemSettingQueryParams {
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
export const expenseItemSettingStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 费用项设置标识选项
 * Expense item setting identifier options
 */
export const 费用项设置标识Options: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "燃气费", value: "燃气费" },
];

/**
 * @description 费用项设置付费类型选项
 * Expense item setting payment type options
 */
export const 费用项设置付费类型Options: OptionsType = [
	{ label: "按月付费", value: "按月付费" },
	{ label: "按年付费", value: "按年付费" },
	{ label: "一次性付费", value: "一次性付费" },
];

/**
 * @description 费用项设置抵扣选项
 * Expense item setting deduction options
 */
export const 费用项设置抵扣Options: OptionsType = [
	{ label: "支持", value: "支持" },
	{ label: "不支持", value: "不支持" },
];

/**
 * @description 费用项设置自定义选项
 * Expense item setting custom options
 */
export const 费用项设置自定义选项: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];
