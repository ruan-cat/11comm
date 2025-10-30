import { type OptionsType } from "plus-pro-components";

/** 场地预约订单 表格数据类型 */
export interface 场地预约订单_列表数据 {
	订单编号: string;
	场馆: string;
	场地: string;
	预约人: string;
	预约电话: string;
	预约日期: string;
	预约时间: string;
	应收金额: string;
	实收金额: string;
	支付方式: string;
	状态: string;
	创建时间: string;
	备注: string;
}

/** 场地预约订单 表单数据类型 */
export interface 场地预约订单_VO {
	订单编号: string;
	场馆: string;
	场地: string;
	预约人: string;
	预约电话: string;
	预约日期: string;
	预约时间: string;
	应收金额: string;
	实收金额: string;
	支付方式: string;
	状态: string;
	创建时间: string;
	备注: string;
}

/** 场地预约订单 列表查询类型 */
export interface 场地预约订单_列表查询_VO {
	预约时间?: string;
	预约人?: string;
	预约电话?: string;
	选择状态?: string;
	预约场地?: string;
}

/** 预约状态选项 */
export const 预约状态Options: OptionsType = [
	{
		label: "预约成功",
		value: "预约成功"
	},
	{
		label: "预约失败",
		value: "预约失败"
	},
	{
		label: "待审核",
		value: "待审核"
	},
	{
		label: "待支付",
		value: "待支付"
	}
];

/** 预约场地选项 */
export const 预约场地Options: OptionsType = [
	{
		label: "健身房",
		value: "健身房"
	},
	{
		label: "第三会议室",
		value: "第三会议室"
	},
	{
		label: "高新健身房",
		value: "高新健身房"
	},
	{
		label: "会议室",
		value: "会议室"
	},
	{
		label: "篮球馆",
		value: "篮球馆"
	},
	{
		label: "羽毛球馆",
		value: "羽毛球馆"
	},
	{
		label: "棒球馆",
		value: "棒球馆"
	},
	{
		label: "乒乓球馆",
		value: "乒乓球馆"
	}
];

/** 单个表格数据项 */
const tableDataItem: 场地预约订单_列表数据 = {
	订单编号: "102025052255590204",
	场馆: "室内体育馆",
	场地: "羽毛球馆",
	预约人: "张三",
	预约电话: "18909711234",
	预约日期: "2025-05-22",
	预约时间: "11,13,",
	应收金额: "360.00",
	实收金额: "360.00",
	支付方式: "微信",
	状态: "预约成功",
	创建时间: "2025-05-22 00:10:27",
	备注: "54"
};

/** 表格组件假数据 */
export const tableData: 场地预约订单_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		...tableDataItem,
		订单编号: `102025052255590${String(index + 1).padStart(3, "0")}`,
		预约人: `用户${index + 1}`,
		预约电话: `1890971${String(1000 + index).padStart(4, "0")}`,
		预约日期: `2025-05-${String(20 + (index % 10)).padStart(2, "0")}`,
		状态: ["预约成功", "预约失败", "待审核", "待支付"][index % 4] as string,
		场地: ["羽毛球馆", "篮球馆", "乒乓球馆", "健身房", "会议室"][index % 5] as string
	}));