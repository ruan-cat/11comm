import type { OptionsType, BaseListQueryParams } from "../../../common";
import { expenseItemNameOptions } from "../../../common/business-options";
import type { ExExpenseSummaryTable, NewExExpenseSummaryTable } from "./schema";

/**
 * @description expense-summary-table列表数据（前端类型）
 * ExpenseSummaryTable list item
 * 从 Schema 类型推导，转换时间字段为字符串格式
 */
export type ExpenseSummaryTableListItem = Omit<ExExpenseSummaryTable, "createTime" | "updateTime"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

/**
 * @description expense-summary-table列表查询参数
 * ExpenseSummaryTable list query parameters
 */
export interface ExpenseSummaryTableQueryParams extends BaseListQueryParams {
	/** 时间 Time */
	time?: string;
	/** 费用项ID Expense Item ID */
	expenseItemId?: string;
	/** 费用项名称 Expense Item Name */
	expenseItemName?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const expenseSummaryTableStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/** 费用项名称联合类型 */
export type ExpenseItemNameType =
	| "物业费"
	| "水费"
	| "电费"
	| "燃气费"
	| "停车费"
	| "电梯费"
	| "垃圾处理费"
	| "绿化费"
	| "安防费"
	| "维修基金";

/**
 * 费用汇总表表单数据类型
 * 基于 schema 的 insert 类型，用于新增表单
 */
export type ExpenseSummaryTableFormVO = Omit<NewExExpenseSummaryTable, "status" | "remark"> & {
	/** 费用项名称（使用联合类型约束） */
	expenseItemName: ExpenseItemNameType;
};

export { expenseItemNameOptions };
