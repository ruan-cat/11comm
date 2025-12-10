import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 报修报表_搜索_VO {
	报修类型: string;
	报修状态: string;
	紧急程度: string;
	报修人: string;
	报修电话: string;
	小区: string;
	报修时间开始: string;
	报修时间结束: string;
	费用状态: string;
}

/** 报修报表_表格数据 */
export interface 报修报表_表格数据 {
	报修单号: string;
	报修类型: string;
	紧急程度: string;
	报修人: string;
	报修电话: string;
	报修地址: string;
	小区: string;
	报修时间: string;
	受理人: string;
	处理人: string;
	费用状态: string;
	报修状态: string;
	异常数: number;
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

/** 收费状态选项 */
export const 收费状态Options: OptionsType = [
	{ label: "未收费", value: "未收费" },
	{ label: "收费中", value: "收费中" },
	{ label: "已收费", value: "已收费" },
];

const 报修人列表 = ["王静", "李雷", "韩梅", "陈晓", "赵云", "孙权", "周瑜", "张伟"];
const 受理人列表 = ["客服A", "客服B", "客服C"];
const 处理人列表 = ["工程师1", "工程师2", "工程师3", "工程师4"];

/** 表格假数据 */
export const tableData: 报修报表_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const type = 报修类型Options[index % 报修类型Options.length].value as string;
	const status = 报修状态Options[index % 报修状态Options.length].value as string;
	const level = 紧急程度Options[index % 紧急程度Options.length].value as string;
	const reporter = 报修人列表[index % 报修人列表.length];
	const phone = `1${(3600000000 + index * 23).toString().padStart(10, "0").slice(1)}`;
	const community = 小区Options[index % 小区Options.length].value as string;
	const acceptor = 受理人列表[index % 受理人列表.length];
	const handler = 处理人列表[index % 处理人列表.length];
	const feeStatus = 收费状态Options[index % 收费状态Options.length].value as string;
	const time = dayjs("2025-03-15 08:00:00")
		.add(index, "day")
		.add(index % 6, "hour");
	const abnormal = index % 5 === 0 ? 2 : index % 3;

	return {
		报修单号: `WX${20250300 + index}`,
		报修类型: type,
		紧急程度: level,
		报修人: reporter,
		报修电话: phone,
		报修地址: `${community} ${100 + (index % 30)}栋${(index % 6) + 1}单元${(index % 18) + 1}0${index % 10}`,
		小区: community,
		报修时间: time.format("YYYY-MM-DD HH:mm:ss"),
		受理人: acceptor,
		处理人: handler,
		费用状态: feeStatus,
		报修状态: status,
		异常数: abnormal,
	};
});
