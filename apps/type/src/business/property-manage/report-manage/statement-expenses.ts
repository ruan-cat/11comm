/**
 * @file 费用明细表类型定义
 * @description Statement expenses types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 费用明细表列表数据
 * Statement expenses list item
 */
export interface StatementExpensesListItem {
	/** ID */
	id: string;
	/** 小区 Community */
	community: string;
	/** 房屋编号/合同名称 House number/contract name */
	houseContractName: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 费用类型 Expense type */
	expenseType: string;
	/** 费用项 Expense item */
	expenseItem: string;
	/** 费用状态 Expense status */
	expenseStatus: string;
	/** 支付方式 Payment method */
	paymentMethod: string;
	/** 应收金额 Receivable amount */
	receivableAmount: number;
	/** 已收金额 Received amount */
	receivedAmount: number;
	/** 未收金额 Unpaid amount */
	unpaidAmount: number;
	/** 账期 Billing period */
	billingPeriod: string;
	/** 开始日期 Start date */
	startDate: string;
	/** 结束日期 End date */
	endDate: string;
	/** 计费面积 Billing area */
	billingArea: number;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * 费用明细表查询参数
 * Statement expenses query parameters
 */
export interface StatementExpensesQueryParams extends BaseListQueryParams {
	/** 小区 Community */
	community?: string;
	/** 房屋编号/合同名称 House number/contract name */
	houseContractName?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 费用类型 Expense type */
	expenseType?: string;
	/** 费用项 Expense item */
	expenseItem?: string;
	/** 费用状态 Expense status */
	expenseStatus?: string;
	/** 支付方式 Payment method */
	paymentMethod?: string;
	/** 账期 Billing period */
	billingPeriod?: string;
}

/**
 * 费用类型选项
 * Expense type options
 */
const expenseTypeOptions: OptionsType = [
	{ label: "物业管理费", value: "物业管理费" },
	{ label: "停车费", value: "停车费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "燃气费", value: "燃气费" },
	{ label: "维修费", value: "维修费" },
	{ label: "其他费用", value: "其他费用" },
];

/**
 * 费用项选项
 * Expense item options
 */
const expenseItemOptions: OptionsType = [
	{ label: "基础物业费", value: "基础物业费" },
	{ label: "车位租赁费", value: "车位租赁费" },
	{ label: "公共能耗费", value: "公共能耗费" },
	{ label: "电梯使用费", value: "电梯使用费" },
	{ label: "二次供水费", value: "二次供水费" },
];

/**
 * 费用状态选项
 * Expense status options
 */
const expenseStatusOptions: OptionsType = [
	{ label: "未缴费", value: "未缴费" },
	{ label: "部分缴费", value: "部分缴费" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "逾期", value: "逾期" },
];

/**
 * 支付方式选项
 * Payment method options
 */
const paymentMethodOptions: OptionsType = [
	{ label: "现金", value: "现金" },
	{ label: "支付宝", value: "支付宝" },
	{ label: "微信", value: "微信" },
	{ label: "银行转账", value: "银行转账" },
	{ label: "POS机", value: "POS机" },
];

/**
 * 小区选项
 * Community options
 */
export const statementExpensesCommunityOptions: OptionsType = [
	{ label: "阳光小区", value: "阳光小区" },
	{ label: "和谐家园", value: "和谐家园" },
	{ label: "幸福社区", value: "幸福社区" },
	{ label: "美丽家园", value: "美丽家园" },
];
