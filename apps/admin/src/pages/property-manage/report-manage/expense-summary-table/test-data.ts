import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 费用汇总表_搜索_VO {
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用项: string;
	小区: string;
}

/** 费用汇总表_表格数据 */
export interface 费用汇总表_表格数据 {
	小区: string;
	房屋编号合同名称: string;
	业主名称: string;
	业主手机号: string;
	费用项: string;
	总户数: string;
	收费户: string;
	欠费户: string;
	欠费: string;
	实缴: string;
	当期应收: string;
	当前实收: string;
	户收费率: string;
	收费率: string;
	清缴率: string;
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

function toPercent(value: number) {
	return `${(value * 100).toFixed(2)}%`;
}

/** 表格假数据 */
export const tableData: 费用汇总表_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const community = 小区Options[index % 小区Options.length].value as string;
	const owner = 业主列表[index % 业主列表.length];
	const house = 房号列表[index % 房号列表.length];
	const phone = `1${(3600000000 + index * 37).toString().padStart(10, "0").slice(1)}`;
	const feeItem = 费用项Options[index % 费用项Options.length].value as string;

	const totalHouse = 80 + (index % 6) * 10;
	const chargedHouse = totalHouse - (index % 10);
	const arrearsHouse = totalHouse - chargedHouse;
	const arrears = 5000 + (index % 7) * 800;
	const paid = 4200 + (index % 8) * 600;
	const receivable = 7800 + (index % 5) * 1200;
	const received = 5200 + (index % 6) * 900;
	const householdRate = chargedHouse / totalHouse;
	const chargeRate = received / receivable;
	const clearRate = paid / (paid + arrears);

	const now = dayjs("2025-01-10 09:00:00")
		.add(index, "day")
		.add(index % 5, "hour");

	return {
		小区: community,
		房屋编号合同名称: house,
		业主名称: owner,
		业主手机号: phone,
		费用项: feeItem,
		总户数: totalHouse.toString(),
		收费户: chargedHouse.toString(),
		欠费户: arrearsHouse.toString(),
		欠费: arrears.toFixed(2),
		实缴: paid.toFixed(2),
		当期应收: receivable.toFixed(2),
		当前实收: received.toFixed(2),
		户收费率: toPercent(householdRate),
		收费率: toPercent(chargeRate),
		清缴率: toPercent(clearRate),
		统计时间: now.format("YYYY-MM-DD HH:mm:ss"),
	};
});
