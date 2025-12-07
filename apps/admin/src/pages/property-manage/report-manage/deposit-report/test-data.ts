import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 押金报表_搜索_VO {
	楼栋: string;
	单元: string;
	房屋编号: string;
	费用id: string;
	费用项目名称: string;
	收费状态: string;
	收费对象类型: string;
	费用创建开始时间: string;
	费用创建结束时间: string;
	退费状态: string;
}

/** 押金报表_表格数据 */
export interface 押金报表_表格数据 {
	楼栋: string;
	单元: string;
	房号: string;
	费用ID: string;
	业主: string;
	费用类型: string;
	费用项: string;
	费用开始时间: string;
	费用结束时间: string;
	创建时间: string;
	付费对象类型: string;
	付款方ID: string;
	应收金额: string;
	状态: string;
	退费状态: string;
}

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
];

/** 费用项目名称选项 */
export const 费用项目名称Options: OptionsType = [
	{ label: "押金", value: "押金" },
	{ label: "装修押金", value: "装修押金" },
	{ label: "公共设施押金", value: "公共设施押金" },
	{ label: "停车押金", value: "停车押金" },
];

/** 收费状态选项 */
export const 收费状态Options: OptionsType = [
	{ label: "未收费", value: "未收费" },
	{ label: "已收费", value: "已收费" },
];

/** 收费对象类型选项 */
export const 收费对象类型Options: OptionsType = [
	{ label: "业主", value: "业主" },
	{ label: "租户", value: "租户" },
	{ label: "商户", value: "商户" },
];

/** 退费状态选项 */
export const 退费状态Options: OptionsType = [
	{ label: "未退费", value: "未退费" },
	{ label: "退费中", value: "退费中" },
	{ label: "已退费", value: "已退费" },
];

const 業主列表 = ["王静", "李雷", "韩梅", "陈晓", "赵云", "孙权", "周瑜", "张伟"];
const 费用类型列表 = ["押金", "装修押金", "设施押金"];
const 状态列表 = ["未收费", "已收费"];
const 退费列表 = ["未退费", "退费中", "已退费"];

/** 表格假数据 */
export const tableData: 押金报表_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const building = 楼栋Options[index % 楼栋Options.length].value as string;
	const unit = 单元Options[index % 单元Options.length].value as string;
	const owner = 業主列表[index % 業主列表.length];
	const payType = 收费对象类型Options[index % 收费对象类型Options.length].value as string;
	const feeType = 费用类型列表[index % 费用类型列表.length];
	const feeItem = 费用项目名称Options[index % 费用项目名称Options.length].value as string;
	const now = dayjs("2025-01-05 09:00:00").add(index, "day").add(index % 6, "hour");
	const start = now.subtract(10, "day");
	const end = now.add(20, "day");

	return {
		楼栋: building,
		单元: unit,
		房号: `${building}-${unit}-${(index % 18 + 1).toString().padStart(2, "0")}01`,
		费用ID: `FEE${20250100 + index}`,
		业主: `${owner} 1${(3600000000 + index).toString().slice(1)}`,
		费用类型: feeType,
		费用项: feeItem,
		费用开始时间: start.format("YYYY-MM-DD HH:mm:ss"),
		费用结束时间: end.format("YYYY-MM-DD HH:mm:ss"),
		创建时间: now.format("YYYY-MM-DD HH:mm:ss"),
		付费对象类型: payType,
		付款方ID: `PAYER${1000 + index}`,
		应收金额: (1500 + (index % 5) * 200 + (index % 3) * 80).toFixed(2),
		状态: 状态列表[index % 状态列表.length],
		退费状态: 退费列表[index % 退费列表.length],
	};
});

