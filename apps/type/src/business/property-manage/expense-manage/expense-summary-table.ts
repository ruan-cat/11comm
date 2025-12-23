import type { OptionsType } from "../../../common";
import { expenseItemNameOptions } from "../../../common/business-options";

/**
 * @description expense-summary-table列表数据
 * ExpenseSummaryTable list item
 */
export interface ExpenseSummaryTableListItem {
	/** ID */
	id: string;
	/** 时间 Time */
	time: string;
	/** 费用项ID Expense Item ID */
	expenseItemId: string;
	/** 费用项名称 Expense Item Name */
	expenseItemName: string;
	/** 应收金额 Receivable Amount */
	receivableAmount: string;
	/** 实收金额 Actual Amount */
	actualAmount: string;
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
 * @description expense-summary-table列表查询参数
 * ExpenseSummaryTable list query parameters
 */
export interface ExpenseSummaryTableQueryParams {
	/** 时间 Time */
	time?: string;
	/** 费用项ID Expense Item ID */
	expenseItemId?: string;
	/** 费用项名称 Expense Item Name */
	expenseItemName?: string;
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
export const expenseSummaryTableStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

export { expenseItemNameOptions };
