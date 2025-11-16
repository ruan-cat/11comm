import type { OptionsType } from "plus-pro-components";

/** 选项项类型 */
interface OptionItem {
	label: string;
	value: string;
}

/** 强制回单 列表数据 */
export interface 强制回单_列表数据 {
	工单编号: string;
	位置: string;
	报修类型: string;
	报修人: string;
	联系方式: string;
	预约时间: string;
	提交时间: string;
	状态: string;
	备注: string;
}

/** 强制回单 列表查询_VO */
export interface 强制回单_列表查询_VO {
	报修类型?: string;
	报修人?: string;
	报修电话?: string;
}

/** 报修类型选项 */
export const 报修类型Options: OptionsType = [
	{
		label: "水管维修",
		value: "水管维修",
	},
	{
		label: "电路维修",
		value: "电路维修",
	},
	{
		label: "家电维修",
		value: "家电维修",
	},
	{
		label: "门窗维修",
		value: "门窗维修",
	},
	{
		label: "公共设施维修",
		value: "公共设施维修",
	},
];

/** 状态选项 */
export const 状态Options: OptionsType = [
	{
		label: "待处理",
		value: "待处理",
	},
	{
		label: "处理中",
		value: "处理中",
	},
	{
		label: "已完成",
		value: "已完成",
	},
	{
		label: "已取消",
		value: "已取消",
	},
	{
		label: "待回单",
		value: "待回单",
	},
];

/** 生成单个强制回单数据 */
function generateRandomIssue(index: number): 强制回单_列表数据 {
	const 报修类型Values = (报修类型Options as OptionItem[]).map((option) => option.value);
	const 状态Values = (状态Options as OptionItem[]).map((option) => option.value);

	const random报修类型 = 报修类型Values[Math.floor(Math.random() * 报修类型Values.length)];
	const random状态 = 状态Values[Math.floor(Math.random() * 状态Values.length)];

	const startDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
	const appointmentDate = new Date(startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);

	return {
		工单编号: `WO${String(index).padStart(6, "0")}`,
		位置: `A栋${Math.floor(Math.random() * 10) + 1}单元${Math.floor(Math.random() * 20) + 1}01室`,
		报修类型: random报修类型,
		报修人: `张${index}先生`,
		联系方式: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		预约时间: appointmentDate.toISOString().split("T")[0],
		提交时间: startDate.toISOString().replace("T", " ").slice(0, 19),
		状态: random状态,
		备注: `备注信息${index}`,
	};
}

/** 表格假数据 */
export const tableData: 强制回单_列表数据[] = Array.from({ length: 35 }, (_, index) => generateRandomIssue(index + 1));
