import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 缴费明细表_搜索_VO {
	缴费开始时间: string;
	缴费结束时间: string;
	支付方式: string;
	费用状态: string;
	费用类型: string;
	费用项: string;
	房屋编号车牌号: string;
	小区: string;
}

/** 缴费明细表_表格数据 */
export interface 缴费明细表_表格数据 {
	订单号: string;
	小区: string;
	房号业主: string;
	费用类型: string;
	费用项: string;
	费用状态: string;
	支付方式: string;
	缴费时间: string;
	收银员: string;
	应缴金额: string;
	应收金额: string;
	实收金额: string;
	账户抵扣: string;
	优惠减免金额: string;
	赠送金额: string;
	滞纳金: string;
	面积: string;
	车位: string;
	说明: string;
}

/** 支付方式选项 */
export const 支付方式Options: OptionsType = [
	{ label: "现金", value: "现金" },
	{ label: "POS刷卡", value: "POS刷卡" },
	{ label: "微信二维码", value: "微信二维码" },
	{ label: "支付宝二维码", value: "支付宝二维码" },
	{ label: "微信公众号支付", value: "微信公众号支付" },
	{ label: "微信小程序支付", value: "微信小程序支付" },
	{ label: "转账", value: "转账" },
	{ label: "押金退款到账户", value: "押金退款到账户" },
];

/** 费用状态选项 */
export const 费用状态Options: OptionsType = [
	{ label: "退费中", value: "退费中" },
	{ label: "已退费", value: "已退费" },
	{ label: "退费失败", value: "退费失败" },
	{ label: "正常", value: "正常" },
	{ label: "欠费", value: "欠费" },
];

/** 费用类型选项 */
export const 费用类型Options: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "租赁费", value: "租赁费" },
	{ label: "停车费", value: "停车费" },
	{ label: "公共服务费", value: "公共服务费" },
];

/** 费用项选项 */
export const 费用项Options: OptionsType = [
	{ label: "物业费历史欠费", value: "物业费历史欠费" },
	{ label: "物业费当期", value: "物业费当期" },
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

const 房号列表 = [
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

const 收银员列表 = ["王静", "李雷", "韩梅", "陈晓", "赵云", "孙权", "周瑜", "张伟"];

function amount(base: number, delta: number) {
	return (base + delta).toFixed(2);
}

/** 表格假数据 */
export const tableData: 缴费明细表_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const community = 小区Options[index % 小区Options.length].value as string;
	const houseOwner = 房号列表[index % 房号列表.length];
	const [house, owner] = houseOwner.split("/");
	const feeType = 费用类型Options[index % 费用类型Options.length].value as string;
	const feeItem = 费用项Options[index % 费用项Options.length].value as string;
	const status = 费用状态Options[index % 费用状态Options.length].value as string;
	const payMethod = 支付方式Options[index % 支付方式Options.length].value as string;
	const cashier = 收银员列表[index % 收银员列表.length];
	const start = dayjs("2025-04-01 09:00:00").add(index, "day");
	const end = start.add(30, "day");

	const shouldPay = 320 + (index % 5) * 40;
	const shouldReceive = shouldPay + (index % 3) * 20;
	const actual = shouldReceive - (index % 2) * 30;
	const deduct = (index % 2) * 10;
	const discount = (index % 3) * 5;
	const gift = (index % 4) * 3;
	const lateFee = index % 3 === 0 ? 8 : 0;

	return {
		订单号: `PAY${20250400 + index}`,
		小区: community,
		房号业主: `${house}/${owner}`,
		费用类型: feeType,
		费用项: feeItem,
		费用状态: status,
		支付方式: payMethod,
		缴费时间: `${start.format("YYYY-MM-DD HH:mm:ss")} ~ ${end.format("YYYY-MM-DD HH:mm:ss")}`,
		收银员: cashier,
		应缴金额: amount(shouldPay, 0),
		应收金额: amount(shouldReceive, 0),
		实收金额: amount(actual, 0),
		账户抵扣: amount(deduct, 0),
		优惠减免金额: amount(discount, 0),
		赠送金额: amount(gift, 0),
		滞纳金: amount(lateFee, 0),
		面积: amount(95 + (index % 4) * 12, 0),
		车位: index % 2 === 0 ? `P${100 + index}` : "",
		说明: index % 3 === 0 ? "提前缴费享受折扣" : "",
	};
});
