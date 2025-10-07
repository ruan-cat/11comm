import { type OptionsType } from "plus-pro-components";

/** 业务受理-列表数据 */
export interface 业务受理_列表数据 {
	费用项目: string;
	费用标识: string;
	费用类型: string;
	应收金额: string;
	建账时间: string;
	应收时间段: string;
	说明: string;
	状态: string;
}

/** 业务受理-列表查询VO */
export interface 业务受理_列表查询_VO {
	费用项目?: string;
	费用标识?: string;
	费用类型?: string;
	状态?: string;
	建账开始时间?: string;
	建账结束时间?: string;
	建账时间范围?: [string, string];
}

/** 单条表格数据 */
const tableDataItem: 业务受理_列表数据 = {
	费用项目: "物业费",
	费用标识: "FWY2024001",
	费用类型: "周期费用",
	应收金额: "285.50",
	建账时间: "2024-01-15 09:30:00",
	应收时间段: "2024-01-01 至 2024-01-31",
	说明: "1月份物业管理费",
	状态: "待缴费",
};

/** 费用类型选项 */
export const 费用类型Options: OptionsType[] = [
	{
		label: "周期费用",
		value: "周期费用",
	},
	{
		label: "临时费用",
		value: "临时费用",
	},
	{
		label: "押金",
		value: "押金",
	},
	{
		label: "违约金",
		value: "违约金",
	},
];

/** 状态选项 */
export const 状态Options: OptionsType[] = [
	{
		label: "待缴费",
		value: "待缴费",
	},
	{
		label: "已缴费",
		value: "已缴费",
	},
	{
		label: "已逾期",
		value: "已逾期",
	},
	{
		label: "已减免",
		value: "已减免",
	},
	{
		label: "已作废",
		value: "已作废",
	},
];

/** 表格数据 */
export const tableData: 业务受理_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		费用项目: ["物业费", "水费", "电费", "燃气费", "停车费", "垃圾处理费", "维修费"][index % 7],
		费用标识: `FWY2024${String(index + 1).padStart(3, "0")}`,
		费用类型: ["周期费用", "临时费用", "押金", "违约金"][index % 4],
		应收金额: (Math.random() * 1000 + 50).toFixed(2),
		建账时间: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")} ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
		应收时间段: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")} 至 2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}`,
		说明: ["费用说明", "缴费通知", "账单明细", "费用调整"][index % 4] + (index + 1),
		状态: ["待缴费", "已缴费", "已逾期", "已减免", "已作废"][index % 5],
	}));