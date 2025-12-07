import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 费用明细表_搜索_VO {
	房屋编号合同名称: string;
	业主名称: string;
	费用类型: string;
	费用项: string;
	小区: string;
	费用状态: string;
	支付方式: string;
	开始日期: string;
	结束日期: string;
}

/** 费用明细表_表格数据 */
export interface 费用明细表_表格数据 {
	房屋编号合同名称: string;
	业主名称: string;
	小区: string;
	费用类型: string;
	费用项: string;
	费用状态: string;
	支付方式: string;
	应收金额: string;
	已收金额: string;
	未收金额: string;
	账期: string;
	开始日期: string;
	结束日期: string;
	计费面积: string;
	车位: string;
}

/** 费用类型选项 */
export const 费用类型Options: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "租赁费", value: "租赁费" },
	{ label: "停车费", value: "停车费" },
	{ label: "公共服务费", value: "公共服务费" },
];

/** 费用项选项 */
export const 费用项Options: OptionsType = [
	{ label: "物业费当期", value: "物业费当期" },
	{ label: "物业费历史欠费", value: "物业费历史欠费" },
	{ label: "租赁费用", value: "租赁费用" },
	{ label: "停车月卡", value: "停车月卡" },
	{ label: "停车临停", value: "停车临停" },
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

/** 费用状态选项 */
export const 费用状态Options: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "欠费", value: "欠费" },
	{ label: "退费中", value: "退费中" },
	{ label: "已退费", value: "已退费" },
];

/** 支付方式选项 */
export const 支付方式Options: OptionsType = [
	{ label: "现金", value: "现金" },
	{ label: "POS刷卡", value: "POS刷卡" },
	{ label: "微信二维码", value: "微信二维码" },
	{ label: "支付宝二维码", value: "支付宝二维码" },
	{ label: "微信公众号支付", value: "微信公众号支付" },
	{ label: "微信小程序支付", value: "微信小程序支付" },
	{ label: "转账", value: "转账" },
];

const 房屋列表 = [
	"A-1-101/王静",
	"A-1-201/李雷",
	"A-2-301/韩梅",
	"B-1-102/陈晓",
	"B-2-202/赵云",
	"C-1-1801/孙权",
	"C-2-601/周瑜",
	"D-3-901/张伟",
	"E-1-501/刘强",
	"F-2-1201/高圆",
];

const 车位号列表 = ["P101", "P205", "P308", "P412", "P509", "P618", "P726", "P832", "P940", "P1050"];

function amount(base: number, delta: number) {
	return (base + delta).toFixed(2);
}

/** 表格假数据 */
export const tableData: 费用明细表_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const community = 小区Options[index % 小区Options.length].value as string;
	const houseOwner = 房屋列表[index % 房屋列表.length];
	const [house, owner] = houseOwner.split("/");
	const feeType = 费用类型Options[index % 费用类型Options.length].value as string;
	const feeItem = 费用项Options[index % 费用项Options.length].value as string;
	const status = 费用状态Options[index % 费用状态Options.length].value as string;
	const payWay = 支付方式Options[index % 支付方式Options.length].value as string;

	const start = dayjs("2025-04-01 09:00:00").add(index, "day");
	const end = start.add(30, "day");
	const billingCycle = start.format("YYYY-MM");

	const shouldReceive = 320 + (index % 6) * 40;
	const received = shouldReceive - (index % 3) * 30;
	const unreceived = shouldReceive - received;
	const area = 95 + (index % 4) * 12;

	return {
		房屋编号合同名称: house,
		业主名称: owner,
		小区: community,
		费用类型: feeType,
		费用项: feeItem,
		费用状态: status,
		支付方式: payWay,
		应收金额: amount(shouldReceive, 0),
		已收金额: amount(received, 0),
		未收金额: amount(unreceived, 0),
		账期: billingCycle,
		开始日期: start.format("YYYY-MM-DD HH:mm:ss"),
		结束日期: end.format("YYYY-MM-DD HH:mm:ss"),
		计费面积: amount(area, 0),
		车位: index % 2 === 0 ? 车位号列表[index % 车位号列表.length] : "",
	};
});
