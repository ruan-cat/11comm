import { type OptionsType } from "plus-pro-components";

/** 巡检计划 签到方式 */
export type 签到方式 = "二维码" | "NFC" | "蓝牙" | "WiFi";

/** 巡检计划 时间范围 */
export interface 时间范围 {
	开始时间: string;
	结束时间: string;
}

/** 巡检计划 列表数据 */
export interface 巡检计划_列表数据 {
	计划名称: string;
	计划路线: string;
	计划周期: string;
	签到方式: 签到方式;
	日期范围: string;
	时间范围: 时间范围;
	"任务提前(分钟)": string;
	制定人: string;
	制定时间: string;
	状态: string;
	巡检人员: string;
}

/** 巡检计划 列表查询 VO */
export interface 巡检计划_列表查询_VO {
	计划ID?: string;
	计划名称?: string;
	巡检人?: string;
	巡检状态?: string;
}

/** 巡检计划 表单 VO */
export interface 巡检计划表单_VO {
	计划名称: string;
	计划路线: string;
	计划周期: string;
	签到方式: 签到方式;
	日期范围: string;
	时间范围: 时间范围;
	"任务提前(分钟)": string;
	制定人: string;
	制定时间: string;
	状态: string;
	巡检人员: string;
}

/** 签到方式选项 */
export const 签到方式Options: OptionsType = [
	{ label: "二维码", value: "二维码" },
	{ label: "NFC", value: "NFC" },
	{ label: "蓝牙", value: "蓝牙" },
	{ label: "WiFi", value: "WiFi" },
];

/** 状态选项 */
export const 状态Options: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "停用", value: "停用" },
];

/** 默认的巡检计划数据 */
const defaultItem: 巡检计划_列表数据 = {
	计划名称: "日常巡检计划",
	计划路线: "A区-B区-C区",
	计划周期: "每日",
	签到方式: "二维码",
	日期范围: "2024-01-01 至 2024-12-31",
	时间范围: {
		开始时间: "08:00",
		结束时间: "18:00",
	},
	"任务提前(分钟)": "15",
	制定人: "张三",
	制定时间: "2024-01-01 09:00:00",
	状态: "启用",
	巡检人员: "李四、王五",
};

/** 生成35条假数据 */
export const tableData: 巡检计划_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		...defaultItem,
		计划名称: `${defaultItem.计划名称}${index + 1}`,
		计划路线: `${defaultItem.计划路线}${index % 3 === 0 ? "A线" : index % 3 === 1 ? "B线" : "C线"}`,
		制定人: ["张三", "李四", "王五", "赵六"][index % 4],
		制定时间: `2024-01-${String(index + 1).padStart(2, "0")} 09:00:00`,
		状态: index % 2 === 0 ? "启用" : "停用",
		巡检人员: `巡检员${index + 1}`,
	}));