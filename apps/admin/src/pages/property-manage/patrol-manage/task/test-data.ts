import type { OptionsType } from "plus-pro-components";

/** 选项项类型 */
interface OptionItem {
	label: string;
	value: string;
}

/** 巡检任务 列表数据 */
export interface 巡检任务_列表数据 {
	任务编码: string;
	巡检计划: string;
	"巡检人开始/结束时间": string;
	实际巡检时间: string;
	计划巡检人: string;
	当前巡检人: string;
	转移描述: string;
	巡检方式: string;
	巡检状态: string;
	操作: string;
}

/** 巡检任务 列表查询_VO */
export interface 巡检任务_列表查询_VO {
	执行人?: string;
	巡检开始时间?: string;
	巡检结束时间?: string;
	巡检状态?: string;
}

/** 巡检状态选项 */
export const 巡检状态Options: OptionItem[] = [
	{
		label: "未开始",
		value: "未开始",
	},
	{
		label: "巡检中",
		value: "巡检中",
	},
	{
		label: "巡检完成",
		value: "巡检完成",
	},
	{
		label: "已超时",
		value: "已超时",
	},
	{
		label: "缺勤",
		value: "缺勤",
	},
];

/** 生成单个巡检任务数据 */
function generateRandomPatrolTask(index: number): 巡检任务_列表数据 {
	const 巡检状态Values = 巡检状态Options.map(option => option.value);
	const randomStatus = 巡检状态Values[Math.floor(Math.random() * 巡检状态Values.length)];

	return {
		任务编码: `T${String(index).padStart(6, "0")}`,
		巡检计划: `巡检计划${index}`,
		"巡检人开始/结束时间": `2024-10-${String(index % 28 + 1).padStart(2, "0")} 09:00:00`,
		实际巡检时间: `2024-10-${String(index % 28 + 1).padStart(2, "0")} 10:30:00`,
		计划巡检人: `张三${index}`,
		当前巡检人: `李四${index}`,
		转移描述: `转移描述${index}`,
		巡检方式: index % 2 === 0 ? "步行" : "乘车",
		巡检状态: randomStatus,
		操作: "操作",
	};
}

/** 表格假数据 */
export const tableData: 巡检任务_列表数据[] = Array.from({ length: 35 }, (_, index) => generateRandomPatrolTask(index + 1));