import { type OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 欠费催缴表单数据类型
 */
export interface 欠费催缴表单_VO {
	/** 业主名称 */
	业主名称: string;
	/** 付费对象 */
	付费对象: string;
	/** 费用名称 */
	费用名称: string;
	/** 催缴金额 */
	催缴金额: string;
	/** 欠费时间段 */
	欠费时间段: string;
	/** 催缴方式 */
	催缴方式: string;
	/** 状态 */
	状态: string;
	/** 说明 */
	说明: string;
}

// ==================== 常量定义 ====================

/**
 * 催缴方式选项
 */
export const 催缴方式Options: OptionsType = [
	{ label: "短信", value: "短信" },
	{ label: "电话", value: "电话" },
	{ label: "上门", value: "上门" },
	{ label: "邮件", value: "邮件" },
];

/**
 * 催缴状态选项
 */
export const 催缴状态Options: OptionsType = [
	{ label: "待催缴", value: "待催缴" },
	{ label: "催缴中", value: "催缴中" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "催缴失败", value: "催缴失败" },
];

// ==================== 默认表单 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 欠费催缴表单_VO = {
	业主名称: "",
	付费对象: "",
	费用名称: "",
	催缴金额: "",
	欠费时间段: "",
	催缴方式: "",
	状态: "",
	说明: "",
};

// ==================== 表单 Props 类型 ====================

/**
 * 欠费催缴表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReminderForOverduePaymentsFormProps {
	/** 表单数据 */
	form: 欠费催缴表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 欠费催缴表单_VO;
}