import { type OptionsType } from "plus-pro-components";

/** 场地管理 表格数据类型 */
export interface 场地管理_列表数据 {
	编号: string;
	名称: string;
	开场时间: string;
	关场时间: string;
	每小时费用: string;
	管理员: string;
	管理员电话: string;
	状态: string;
}

/** 场地管理 表单数据类型 */
export interface 场地管理_VO {
	编号: string;
	名称: string;
	开场时间: string;
	关场时间: string;
	每小时费用: string;
	管理员: string;
	管理员电话: string;
	状态: string;
}

/** 场地管理 列表查询类型 */
export interface 场地管理_列表查询_VO {
	场地编号?: string;
	场地类型?: string;
	场地状态?: string;
}

/** 场地状态选项 */
export const 场地状态Options: OptionsType = [
	{
		label: "可预约",
		value: "可预约"
	},
	{
		label: "不可预约",
		value: "不可预约"
	},
	{
		label: "维护中",
		value: "维护中"
	},
	{
		label: "已关闭",
		value: "已关闭"
	}
];

/** 场地类型选项 */
export const 场地类型Options: OptionsType = [
	{
		label: "篮球馆",
		value: "篮球馆"
	},
	{
		label: "羽毛球馆",
		value: "羽毛球馆"
	},
	{
		label: "乒乓球馆",
		value: "乒乓球馆"
	},
	{
		label: "健身房",
		value: "健身房"
	},
	{
		label: "游泳池",
		value: "游泳池"
	},
	{
		label: "网球场",
		value: "网球场"
	},
	{
		label: "会议室",
		value: "会议室"
	},
	{
		label: "多功能厅",
		value: "多功能厅"
	}
];

/** 单个表格数据项 */
const tableDataItem: 场地管理_列表数据 = {
	编号: "102025051289880227",
	名称: "篮球馆",
	开场时间: "06:00",
	关场时间: "22:00",
	每小时费用: "50.00",
	管理员: "张三",
	管理员电话: "13232323232",
	状态: "可预约"
};

/** 表格组件假数据 */
export const tableData: 场地管理_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		...tableDataItem,
		编号: `102025051289880${String(index + 1).padStart(3, "0")}`,
		名称: ["篮球馆", "羽毛球馆", "乒乓球馆", "健身房", "游泳池", "网球场", "会议室", "多功能厅"][index % 8],
		开场时间: ["06:00", "07:00", "08:00"][index % 3],
		关场时间: ["21:00", "22:00", "23:00"][index % 3],
		每小时费用: [30, 40, 50, 60, 80, 100][index % 6].toString() + ".00",
		管理员: `管理员${index + 1}`,
		管理员电话: `138${String(1000 + index).padStart(4, "0")}${String(1000 + index * 2).padStart(4, "0")}`,
		状态: ["可预约", "不可预约", "维护中", "已关闭"][index % 4] as string
	}));