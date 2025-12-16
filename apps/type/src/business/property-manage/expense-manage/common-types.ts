import type { OptionsType, BaseListQueryParams } from "../../../common";
import {
	contractTypeOptions,
	auditStatusOptions,
	expenseIdentifierOptions,
	paymentTypeOptions,
	accountDeductionOptions,
	statusOptions,
	parkingSpaceStatusOptions,
	expenseItemOptions,
	discountTypeOptions,
	ruleOptions,
	applicationTypeOptions,
	meterTypeOptions,
	chargeObjectOptions,
	refundReasonOptions,
	reminderMethodOptions,
	reminderStatusOptions,
} from "../../../common/business-options";

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

/** 自定义费用选项 Custom expense options */
export const customExpenseOptions: OptionsType = [
	{ label: "固定费用", value: "固定费用" },
	{ label: "计量费用", value: "计量费用" },
	{ label: "比例费用", value: "比例费用" },
];

/** 使用状态选项 Usage status options */
export const usageStatusOptions: OptionsType = [
	{ label: "未使用", value: "未使用" },
	{ label: "已使用", value: "已使用" },
	{ label: "已过期", value: "已过期" },
];

/** 状态选项 Status options */
export const expenseStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
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

/** 使用状态选项（兼容性） */
export const 使用状态Options = usageStatusOptions;

/** 费用项名称选项（兼容性） */
export const 费用项名称Options = expenseItemNameOptions;

// 注意：公共选项已移至 business-options.ts，请从该文件导入

// ==================== 兼容旧中文名称的选项 ====================

/** 费用类型选项（兼容性） */
export const feeTypeOptions = expenseTypeOptions;

/** 发票类型选项（兼容性） */
export const 发票类型Options = [
	{ label: "普通发票", value: "普通发票" },
	{ label: "增值税专用发票", value: "增值税专用发票" },
	{ label: "电子发票", value: "电子发票" },
];

/** 性别选项（兼容性） */
export const 性别Options = [
	{ label: "男", value: "男" },
	{ label: "女", value: "女" },
];

/** 成员类型选项（兼容性） */
export const 成员类型Options = [
	{ label: "家人", value: "家人" },
	{ label: "租户", value: "租户" },
	{ label: "使用人", value: "使用人" },
];

/** 人员类型选项（兼容性） */
export const 人员类型Options = [
	{ label: "业主", value: "业主" },
	{ label: "家人", value: "家人" },
	{ label: "租户", value: "租户" },
	{ label: "使用人", value: "使用人" },
];

/** 人员角色选项（兼容性） */
export const 人员角色Options = [
	{ label: "产权人", value: "产权人" },
	{ label: "联系人", value: "联系人" },
	{ label: "使用人", value: "使用人" },
];

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
