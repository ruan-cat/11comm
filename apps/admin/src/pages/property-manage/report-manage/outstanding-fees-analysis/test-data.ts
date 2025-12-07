import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 欠费分析_搜索_VO {
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用项: string;
	小区: string;
	楼栋: string;
	单元: string;
}

/** 欠费分析_表格数据 */
export interface 欠费分析_表格数据 {
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用项: string;
	小区: string;
	楼栋: string;
	单元: string;
	总未收金额: string;
	当期未收金额: string;
	历史未收金额: string;
	最近应收月份: string;
	统计时间: string;
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

/** 楼栋选项 */
export const 楼栋Options: OptionsType = [
	{ label: "1栋", value: "1栋" },
	{ label: "2栋", value: "2栋" },
	{ label: "3栋", value: "3栋" },
	{ label: "5栋", value: "5栋" },
];

/** 单元选项 */
export const 单元Options: OptionsType = [
	{ label: "1单元", value: "1单元" },
	{ label: "2单元", value: "2单元" },
	{ label: "3单元", value: "3单元" },
	{ label: "5单元", value: "5单元" },
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
const 最近月份 = ["2025-05", "2025-04", "2025-03", "2025-02"];

/** 表格假数据 */
export const tableData: 欠费分析_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const community = 小区Options[index % 小区Options.length].value as string;
	const building = 楼栋Options[index % 楼栋Options.length].value as string;
	const unit = 单元Options[index % 单元Options.length].value as string;
	const owner = 业主列表[index % 业主列表.length];
	const house = 房号列表[index % 房号列表.length];
	const phone = `1${(3600000000 + index * 33).toString().padStart(10, "0").slice(1)}`;
	const feeItem = 费用项Options[index % 费用项Options.length].value as string;

	const total = 3200 + (index % 7) * 400 + (index % 3) * 120;
	const current = 800 + (index % 5) * 150;
	const history = total - current;
	const month = 最近月份[index % 最近月份.length];
	const statTime = `2025-05-${(index % 28) + 1} 09:00:00`;

	return {
		房屋编号合同名称: house,
		业主名称: owner,
		业主手机号: phone,
		费用项: feeItem,
		小区: community,
		楼栋: building,
		单元: unit,
		总未收金额: total.toFixed(2),
		当期未收金额: current.toFixed(2),
		历史未收金额: history.toFixed(2),
		最近应收月份: month,
		统计时间: statTime,
	};
});

