import type { ExpenseSummaryTableListItem } from "@01s-11comm/type";

/**
 * @description expense-summary-table模拟数据
 * ExpenseSummaryTable mock data
 */
export const mockExpenseSummaryTableData: ExpenseSummaryTableListItem[] = [
	{
		id: "1",
		time: "2024-01-01",
		expenseItemId: "E001",
		expenseItemName: "物业费",
		receivableAmount: "10000",
		actualAmount: "9800",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "这是示例数据1",
	},
	{
		id: "2",
		time: "2024-01-02",
		expenseItemId: "E002",
		expenseItemName: "水费",
		receivableAmount: "5000",
		actualAmount: "4900",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "这是示例数据2",
	},
	{
		id: "3",
		time: "2024-01-03",
		expenseItemId: "E003",
		expenseItemName: "电费",
		receivableAmount: "8000",
		actualAmount: "7800",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "这是示例数据3",
	},
	{
		id: "4",
		time: "2024-01-04",
		expenseItemId: "E004",
		expenseItemName: "燃气费",
		receivableAmount: "3000",
		actualAmount: "2900",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		id: "5",
		time: "2024-01-05",
		expenseItemId: "E005",
		expenseItemName: "停车费",
		receivableAmount: "6000",
		actualAmount: "5900",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "这是示例数据5",
	},
];
