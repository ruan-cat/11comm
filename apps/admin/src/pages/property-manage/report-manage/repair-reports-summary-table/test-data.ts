import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 报修汇总表_搜索_VO {
	报修类型: string;
	报修状态: string;
	紧急程度: string;
	小区: string;
	统计开始时间: string;
	统计结束时间: string;
}

/** 报修汇总表_表格数据 */
export interface 报修汇总表_表格数据 {
	报修类型: string;
	小区: string;
	报修数量: number;
	处理中: number;
	已完成: number;
	未完成: number;
	待回访: number;
	不满意: number;
	紧急工单: number;
	统计时间: string;
	报修状态标签: string;
	紧急程度标签: string;
}

/** 报修类型选项 */
export const 报修类型Options: OptionsType = [
	{ label: "设施维修", value: "设施维修" },
	{ label: "环境卫生", value: "环境卫生" },
	{ label: "治安巡检", value: "治安巡检" },
	{ label: "绿化维护", value: "绿化维护" },
	{ label: "公共照明", value: "公共照明" },
];

/** 报修状态选项 */
export const 报修状态Options: OptionsType = [
	{ label: "待分派", value: "待分派" },
	{ label: "处理中", value: "处理中" },
	{ label: "待回访", value: "待回访" },
	{ label: "已完成", value: "已完成" },
];

/** 紧急程度选项 */
export const 紧急程度Options: OptionsType = [
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

const 报修类型列表 = 报修类型Options.map((item) => item.value as string);
const 状态列表 = ["处理中", "已完成", "未完成", "待回访", "不满意"];

/** 表格假数据 */
export const tableData: 报修汇总表_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const repairType = 报修类型列表[index % 报修类型列表.length];
	const community = 小区Options[index % 小区Options.length].value as string;
	const total = 30 + (index % 10);
	const processing = 10 + (index % 5);
	const done = 12 + (index % 6);
	const unfinished = total - processing - done;
	const revisit = 4 + (index % 3);
	const unhappy = 2 + (index % 2);
	const urgent = 3 + (index % 4);
	const status = 状态列表[index % 状态列表.length];
	const level = 紧急程度Options[index % 紧急程度Options.length].value as string;
	const statTime = dayjs("2025-04-01 09:00:00")
		.add(index, "day")
		.add(index % 5, "hour");

	return {
		报修类型: repairType,
		小区: community,
		报修数量: total,
		处理中: processing,
		已完成: done,
		未完成: unfinished > 0 ? unfinished : 1,
		待回访: revisit,
		不满意: unhappy,
		紧急工单: urgent,
		统计时间: statTime.format("YYYY-MM-DD HH:mm:ss"),
		报修状态标签: status,
		紧急程度标签: level,
	};
});
