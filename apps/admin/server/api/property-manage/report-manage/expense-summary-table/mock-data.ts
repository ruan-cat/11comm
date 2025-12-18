import type { ExpenseSummaryTableListItem } from "@01s-11comm/type";

/**
 * @description 费用汇总表模拟数据
 * Expense summary table mock data
 */
export const mockExpenseSummaryTableData: ExpenseSummaryTableListItem[] = [
	{
		id: "EST001",
		time: "2024-01",
		expenseItemId: "EI001",
		expenseItemName: "物业费",
		receivableAmount: "100000.00",
		actualAmount: "98000.00",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "1月份物业费汇总",
	},
	{
		id: "EST002",
		time: "2024-01",
		expenseItemId: "EI002",
		expenseItemName: "水费",
		receivableAmount: "50000.00",
		actualAmount: "50000.00",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "1月份水费汇总",
	},
	{
		id: "EST003",
		time: "2024-01",
		expenseItemId: "EI003",
		expenseItemName: "电费",
		receivableAmount: "80000.00",
		actualAmount: "78000.00",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "1月份电费汇总",
	},
	{
		id: "EST004",
		time: "2024-01",
		expenseItemId: "EI004",
		expenseItemName: "燃气费",
		receivableAmount: "30000.00",
		actualAmount: "30000.00",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		id: "EST005",
		time: "2024-01",
		expenseItemId: "EI005",
		expenseItemName: "停车费",
		receivableAmount: "60000.00",
		actualAmount: "60000.00",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "1月份停车费汇总",
	},
];
