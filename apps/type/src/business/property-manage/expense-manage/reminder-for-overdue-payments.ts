import type { OptionsType } from "../../../common";
import { reminderMethodOptions, reminderStatusOptions } from "../../../common/business-options";

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
 * @description 欠费催缴表单VO
 * Reminder for overdue payments form VO
 */
export interface ReminderForOverduePaymentsFormVO {
	/** 业主名称 Owner name */
	ownerName: string;
	/** 付费对象 Payment object */
	paymentObject: string;
	/** 费用名称 Fee name */
	feeName: string;
	/** 催缴金额 Reminder amount */
	reminderAmount: string;
	/** 催缴方式 Reminder method */
	reminderMethod: string;
	/** 催缴状态 Reminder status */
	reminderStatus: string;
	/** 催缴时间 Reminder time */
	reminderTime: string;
	/** 催缴备注 Reminder remark */
	reminderRemark?: string;
}

// 注意：reminderMethodOptions 和 reminderStatusOptions 已从 "../../../common/business-options" 导入
