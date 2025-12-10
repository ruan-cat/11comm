import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 业主缴费明细_搜索_VO {
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用大类: string;
	费用项: string;
	小区: string;
	年度: string;
}

/** 业主缴费明细_表格数据 */
export interface 业主缴费明细_表格数据 {
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用大类: string;
	费用项: string;
	小区: string;
	年度: string;
	一月: string;
	二月: string;
	三月: string;
	四月: string;
	五月: string;
	六月: string;
	七月: string;
	八月: string;
	九月: string;
	十月: string;
	十一月: string;
	十二月: string;
	合计: string;
	应收: string;
	预收: string;
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

/** 费用大类选项 */
export const 收费大类Options: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "租赁费", value: "租赁费" },
	{ label: "停车费", value: "停车费" },
	{ label: "公共服务费", value: "公共服务费" },
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

/** 年度选项 */
export const 年度Options: OptionsType = [
	{ label: "2023", value: "2023" },
	{ label: "2024", value: "2024" },
	{ label: "2025", value: "2025" },
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

function monthAmount(base: number, offset: number) {
	return (base + offset * 20).toFixed(2);
}

/** 表格假数据 */
export const tableData: 业主缴费明细_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const community = 小区Options[index % 小区Options.length].value as string;
	const owner = 业主列表[index % 业主列表.length];
	const house = 房号列表[index % 房号列表.length];
	const phone = `1${(3600000000 + index * 19).toString().padStart(10, "0").slice(1)}`;
	const feeType = 费用项Options[index % 费用项Options.length].value as string;
	const chargeType = 收费大类Options[index % 收费大类Options.length].value as string;
	const year = 年度Options[index % 年度Options.length].value as string;

	const base = 180 + (index % 5) * 30;
	const months = Array.from({ length: 12 }).map((_, mIdx) => monthAmount(base, mIdx + (index % 3)));
	const total = months.reduce((sum, v) => sum + Number(v), 0);
	const receivable = total + 120;
	const advance = 80 + (index % 4) * 30;

	return {
		房屋编号合同名称: house,
		业主名称: owner,
		业主手机号: phone,
		费用大类: chargeType,
		费用项: feeType,
		小区: community,
		年度: year,
		一月: months[0],
		二月: months[1],
		三月: months[2],
		四月: months[3],
		五月: months[4],
		六月: months[5],
		七月: months[6],
		八月: months[7],
		九月: months[8],
		十月: months[9],
		十一月: months[10],
		十二月: months[11],
		合计: total.toFixed(2),
		应收: receivable.toFixed(2),
		预收: advance.toFixed(2),
	};
});
