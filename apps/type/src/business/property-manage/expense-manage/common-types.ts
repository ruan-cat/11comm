import type { OptionsType, BaseListQueryParams } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

// ==================== 通用选项定义 ====================

/** 费用类型选项 Expense type options */
export const expenseTypeOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "燃气费", value: "燃气费" },
	{ label: "停车费", value: "停车费" },
	{ label: "维修费", value: "维修费" },
	{ label: "垃圾费", value: "垃圾费" },
	{ label: "其他费用", value: "其他费用" },
];

/** 审核状态选项 Audit status options */
export const auditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];

/** 费用标识选项 Expense identifier options */
export const expenseIdentifierOptions: OptionsType = [
	{ label: "收入", value: "收入" },
	{ label: "支出", value: "支出" },
];

/** 付费类型选项 Payment type options */
export const paymentTypeOptions: OptionsType = [
	{ label: "预付费", value: "预付费" },
	{ label: "后付费", value: "后付费" },
];

/** 账户抵扣选项 Account deduction options */
export const accountDeductionOptions: OptionsType = [
	{ label: "可抵扣", value: "可抵扣" },
	{ label: "不可抵扣", value: "不可抵扣" },
];

/** 自定义费用选项 Custom expense options */
export const customExpenseOptions: OptionsType = [
	{ label: "固定费用", value: "固定费用" },
	{ label: "计量费用", value: "计量费用" },
	{ label: "比例费用", value: "比例费用" },
];

/** 状态选项 Status options */
export const expenseStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/** 折扣类型选项 Discount type options */
export const discountTypeOptions: OptionsType = [
	{ label: "比例折扣", value: "比例折扣" },
	{ label: "固定折扣", value: "固定折扣" },
	{ label: "满减折扣", value: "满减折扣" },
];

/** 规则选项 Rule options */
export const ruleOptions: OptionsType = [
	{ label: "规则一", value: "规则一" },
	{ label: "规则二", value: "规则二" },
	{ label: "规则三", value: "规则三" },
];

/** 申请类型选项 Application type options */
export const applicationTypeOptions: OptionsType = [
	{ label: "个人申请", value: "个人申请" },
	{ label: "企业申请", value: "企业申请" },
	{ label: "特殊申请", value: "特殊申请" },
];

/** 使用状态选项 Usage status options */
export const usageStatusOptions: OptionsType = [
	{ label: "未使用", value: "未使用" },
	{ label: "已使用", value: "已使用" },
	{ label: "已过期", value: "已过期" },
];

/** 表类型选项 Meter type options */
export const meterTypeOptions: OptionsType = [
	{ label: "水表", value: "水表" },
	{ label: "电表", value: "电表" },
	{ label: "燃气表", value: "燃气表" },
];

/** 收费对象选项 Charge object options */
export const chargeObjectOptions: OptionsType = [
	{ label: "业主", value: "业主" },
	{ label: "租户", value: "租户" },
	{ label: "商户", value: "商户" },
];

/** 费用项目选项 Expense item options */
export const expenseItemOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "停车费", value: "停车费" },
];

/** 退费原因选项 Refund reason options */
export const refundReasonOptions: OptionsType = [
	{ label: "重复缴费", value: "重复缴费" },
	{ label: "计算错误", value: "计算错误" },
	{ label: "服务取消", value: "服务取消" },
	{ label: "其他原因", value: "其他原因" },
];

/** 催缴方式选项 Reminder method options */
export const reminderMethodOptions: OptionsType = [
	{ label: "短信", value: "短信" },
	{ label: "电话", value: "电话" },
	{ label: "邮件", value: "邮件" },
	{ label: "上门", value: "上门" },
];

/** 催缴状态选项 Reminder status options */
export const reminderStatusOptions: OptionsType = [
	{ label: "未催缴", value: "未催缴" },
	{ label: "催缴中", value: "催缴中" },
	{ label: "已催缴", value: "已催缴" },
	{ label: "已缴费", value: "已缴费" },
];

/** 车位状态选项 Parking space status options */
export const parkingSpaceStatusOptions: OptionsType = [
	{ label: "空闲", value: "空闲" },
	{ label: "已售", value: "已售" },
	{ label: "已租", value: "已租" },
	{ label: "预留", value: "预留" },
];

/** 费用项名称选项 Expense item name options */
export const expenseItemNameOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水电费", value: "水电费" },
	{ label: "停车费", value: "停车费" },
	{ label: "维修费", value: "维修费" },
];

// ==================== 兼容旧中文名称 ====================

/** 费用类型选项（兼容性） */
export const 费用类型Options = expenseTypeOptions;

/** 审核状态选项（兼容性） */
export const 审核状态Options = auditStatusOptions;

/** 费用标识选项（兼容性） */
export const 费用标识Options = expenseIdentifierOptions;

/** 付费类型选项（兼容性） */
export const 付费类型Options = paymentTypeOptions;

/** 账户抵扣选项（兼容性） */
export const 账户抵扣Options = accountDeductionOptions;

/** 自定义费用选项（兼容性） */
export const 自定义费用Options = customExpenseOptions;

/** 规则选项（兼容性） */
export const 规则Options = ruleOptions;

/** 申请类型选项（兼容性） */
export const 申请类型Options = applicationTypeOptions;

/** 使用状态选项（兼容性） */
export const 使用状态Options = usageStatusOptions;

/** 表类型选项（兼容性） */
export const 表类型Options = meterTypeOptions;

/** 收费对象选项（兼容性） */
export const 收费对象Options = chargeObjectOptions;

/** 费用项目选项（兼容性） */
export const 费用项目Options = expenseItemOptions;

/** 退费原因选项（兼容性） */
export const 退费原因Options = refundReasonOptions;

/** 催缴方式选项（兼容性） */
export const 催缴方式Options = reminderMethodOptions;

/** 催缴状态选项（兼容性） */
export const 催缴状态Options = reminderStatusOptions;

/** 车位状态选项（兼容性） */
export const 车位状态Options = parkingSpaceStatusOptions;

/** 费用项名称选项（兼容性） */
export const 费用项名称Options = expenseItemNameOptions;

// ==================== 通用类型定义 ====================

/** 退费审核表单 VO */
export interface 退费审核表单_VO {
	/** 退费金额 */
	refundAmount: number;
	/** 退费原因 */
	refundReason: string;
	/** 审核状态 */
	auditStatus: string;
	/** 审核意见 */
	auditComment?: string;
}

/** 补打收据表单 VO */
export interface 补打收据表单_VO {
	/** 收据编号 */
	receiptNumber: string;
	/** 补打原因 */
	reprintReason: string;
	/** 申请人 */
	applicant: string;
	/** 申请时间 */
	applicationTime: string;
}

/** 抄表类型 VO */
export interface 抄表类型_VO {
	/** 表类型名称 */
	meterTypeName: string;
	/** 表单位 */
	meterUnit: string;
	/** 计费方式 */
	billingMethod: string;
	/** 单价 */
	unitPrice: number;
	/** 状态 */
	status: string;
}

// ==================== 通用列表数据类型 ====================

/**
 * 通用列表数据项接口
 */
export interface CommonListItem {
	/** ID */
	id: string;
	/** 名称 */
	name: string;
	/** 状态 */
	status: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 备注 */
	remark?: string;
}

/**
 * 通用查询参数接口
 */
export interface CommonQueryParams extends BaseListQueryParams {
	/** 名称 */
	name?: string;
	/** 状态 */
	status?: string;
}
