import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 欠费催缴表单数据类型
 */
export interface ReminderForOverduePaymentsFormVO {
	/** 业主名称 */
	ownerName: string;
	/** 付费对象 */
	paymentObject: string;
	/** 费用名称 */
	feeName: string;
	/** 催缴金额 */
	reminderAmount: string;
	/** 欠费时间段 */
	overduePeriod: [string, string] | string;
	/** 催缴方式 */
	reminderMethod: string;
	/** 状态 */
	status: string;
	/** 说明 */
	description: string;
}

// ==================== 常量定义 ====================

/**
 * 催缴方式选项
 */
export const reminderMethodOptions: OptionsType = [
	{ label: "短信", value: "短信" },
	{ label: "电话", value: "电话" },
	{ label: "上门", value: "上门" },
	{ label: "邮件", value: "邮件" },
];

/**
 * 催缴状态选项
 */
export const reminderStatusOptions: OptionsType = [
	{ label: "待催缴", value: "待催缴" },
	{ label: "催缴中", value: "催缴中" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "催缴失败", value: "催缴失败" },
];

// ==================== 默认表单 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReminderForOverduePaymentsFormVO = {
	ownerName: "",
	paymentObject: "",
	feeName: "",
	reminderAmount: "",
	overduePeriod: "",
	reminderMethod: "",
	status: "",
	description: "",
};

// ==================== 表单 Props 类型 ====================

/**
 * 欠费催缴表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReminderForOverduePaymentsFormProps {
	/** 表单数据 */
	form: ReminderForOverduePaymentsFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReminderForOverduePaymentsFormVO;
}
