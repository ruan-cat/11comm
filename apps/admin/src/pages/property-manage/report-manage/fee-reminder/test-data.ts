import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 费用提醒_搜索_VO {
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用项: string;
	小区: string;
	提醒类型: string;
}

/** 费用提醒_表格数据 */
export interface 费用提醒_表格数据 {
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用项: string;
	小区: string;
	提醒类型: string;
	到期时间: string;
	应收金额: string;
	状态: string;
}

/** 费用项选项 */
export const 费用项Options: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "押金", value: "押金" },
	{ label: "停车费", value: "停车费" },
	{ label: "煤气费", value: "煤气费" },
	{ label: "服务费", value: "服务费" },
	{ label: "其他", value: "其他" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "公摊费", value: "公摊费" },
	{ label: "租金", value: "租金" },
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

/** 提醒类型选项 */
export const 提醒类型Options: OptionsType = [
	{ label: "预缴费提醒", value: "预缴费提醒" },
	{ label: "到期提醒", value: "到期提醒" },
];

const 房号列表 = [
	"A-1-101",
	"A-1-201",
	"A-2-301",
	"B-1-102",
	"B-2-202",
	"C-1-1801",
	"C-2-601",
	"D-3-901",
	"E-1-501",
	"F-2-1201",
];

const 业主列表 = ["王静", "李雷", "韩梅", "陈晓", "赵云", "孙权", "周瑜", "张伟", "刘强", "高圆"];
const 状态列表 = ["待缴费", "即将到期", "已提醒"];

/** 表格假数据 */
export const tableData: 费用提醒_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const house = 房号列表[index % 房号列表.length];
	const owner = 业主列表[index % 业主列表.length];
	const phone = `1${(3600000000 + index * 27).toString().padStart(10, "0").slice(1)}`;
	const feeItem = 费用项Options[index % 费用项Options.length].value as string;
	const community = 小区Options[index % 小区Options.length].value as string;
	const remindType = 提醒类型Options[index % 提醒类型Options.length].value as string;
	const due = dayjs("2025-02-01 09:00:00")
		.add(index, "day")
		.add(index % 6, "hour");
	const amount = 150 + (index % 8) * 30 + (index % 3) * 12;

	return {
		房屋编号合同名称: house,
		业主名称: owner,
		业主手机号: phone,
		费用项: feeItem,
		小区: community,
		提醒类型: remindType,
		到期时间: due.format("YYYY-MM-DD HH:mm:ss"),
		应收金额: amount.toFixed(2),
		状态: 状态列表[index % 状态列表.length],
	};
});
