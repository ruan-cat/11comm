import type { BaseListQueryParams } from "../../../common";

/**
 * @description expense-summary-table列表数据
 * ExpenseSummaryTable list item
 */
export interface ExpenseSummaryTableListItem {
	/** ID */
	id: string;
	/** 时间 */
	time: string;
	/** 费用项ID */
	expenseItemId: string;
	/** 费用项名称 */
	expenseItemName: string;
	/** 应收金额 */
	receivableAmount: string;
	/** 实收金额 */
	actualAmount: string;
	/** 状态 */
	status: "enabled" | "disabled";
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description expense-summary-table列表查询参数
 * ExpenseSummaryTable list query parameters
 */
export interface ExpenseSummaryTableQueryParams extends BaseListQueryParams {
	/** 时间 */
	time?: string;
	/** 费用项ID */
	expenseItemId?: string;
	/** 费用项名称 */
	expenseItemName?: string;
	/** 状态 */
	status?: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const expenseSummaryTableStatusOptions = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
] as const;
