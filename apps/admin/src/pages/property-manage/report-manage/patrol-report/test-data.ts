import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 巡检报表_搜索_VO {
	巡检名称: string;
	巡检类型: string;
	巡检级别: string;
	负责人: string;
	状态: string;
	小区: string;
	巡检时间开始: string;
	巡检时间结束: string;
}

/** 巡检报表_表格数据 */
export interface 巡检报表_表格数据 {
	巡检编号: string;
	巡检名称: string;
	巡检类型: string;
	巡检级别: string;
	负责人: string;
	小区: string;
	巡检时间: string;
	状态: string;
	异常数: number;
}

/** 巡检类型选项 */
export const 巡检类型Options: OptionsType = [
	{ label: "日常巡检", value: "日常巡检" },
	{ label: "专项巡检", value: "专项巡检" },
	{ label: "临时巡检", value: "临时巡检" },
];

/** 巡检级别选项 */
export const 巡检级别Options: OptionsType = [
	{ label: "高", value: "高" },
	{ label: "中", value: "中" },
	{ label: "低", value: "低" },
];

/** 小区选项 */
export const 小区Options: OptionsType = [
	{ label: "雅居乐一期", value: "雅居乐一期" },
	{ label: "滨江花园", value: "滨江花园" },
	{ label: "天鹅堡", value: "天鹅堡" },
	{ label: "锦绣城", value: "锦绣城" },
	{ label: "碧桂园星辰", value: "碧桂园星辰" },
	{ label: "中海国际", value: "中海国际" },
	{ label: "万象城社区", value: "万象城社区" },
	{ label: "银湖山庄", value: "银湖山庄" },
];

/** 状态选项 */
export const 状态Options: OptionsType = [
	{ label: "进行中", value: "进行中" },
	{ label: "已完成", value: "已完成" },
	{ label: "已终止", value: "已终止" },
];

const 巡检名称列表 = ["公共区域巡检", "消防设备巡检", "绿化巡检", "电梯巡检", "安防巡检", "临时专项巡检"];
const 负责人列表 = ["王静", "李雷", "韩梅", "陈晓", "赵云", "孙权", "周瑜", "张伟"];

/** 表格假数据 */
export const tableData: 巡检报表_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const name = 巡检名称列表[index % 巡检名称列表.length];
	const type = 巡检类型Options[index % 巡检类型Options.length].value as string;
	const level = 巡检级别Options[index % 巡检级别Options.length].value as string;
	const leader = 负责人列表[index % 负责人列表.length];
	const community = 小区Options[index % 小区Options.length].value as string;
	const status = 状态Options[index % 状态Options.length].value as string;
	const patrolTime = dayjs("2025-03-01 08:00:00")
		.add(index, "day")
		.add(index % 5, "hour");
	const abnormal = index % 4 === 0 ? 2 : index % 3;

	return {
		巡检编号: `XJ${20250000 + index}`,
		巡检名称: name,
		巡检类型: type,
		巡检级别: level,
		负责人: leader,
		小区: community,
		巡检时间: patrolTime.format("YYYY-MM-DD HH:mm:ss"),
		状态: status,
		异常数: abnormal,
	};
});
