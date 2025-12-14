// ==================== 联合类型定义 ====================

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

// ==================== 接口定义 ====================

/**
 * 费用汇总表表单数据类型
 */
export interface ExpenseSummaryTableFormVO {
	/** 时间 */
	time: string;
	/** 费用项ID */
	expenseItemId: string;
	/** 费用项名称 */
	expenseItemName: ExpenseItemNameType;
	/** 应收金额 */
	receivableAmount: string;
	/** 实收金额 */
	actualAmount: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ExpenseSummaryTableFormVO = {
	time: "",
	expenseItemId: "",
	expenseItemName: "物业费",
	receivableAmount: "",
	actualAmount: "",
};

/**
 * 费用汇总表表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ExpenseSummaryTableFormProps {
	/** 表单数据 */
	form: ExpenseSummaryTableFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ExpenseSummaryTableFormVO;
}
