import dayjs from "dayjs";
import { type OptionsType } from "plus-pro-components";

/** 表格搜索栏类型 */
export interface 报表管理_数据统计_搜索_VO {
	开始时间: string;
	结束时间: string;
	小区: string;
}

/** 报表管理_数据统计_表格数据 */
export interface 报表管理_数据统计_表格数据 {
	小区: string;
	房屋: string;
	业主: string;
	统计时间: string;
	欠费: string;
	实收: string;
	物业费: string;
	押金: string;
	停车费: string;
	煤气费: string;
	取暖费: string;
	维修费: string;
	服务费: string;
	其他: string;
	水费: string;
	电费: string;
	租金: string;
	公摊费: string;
}

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

const 社区列表 = 小区Options.map((item) => String(item.value));
const 业主列表 = ["王静", "李雷", "韩梅", "陈晓", "赵云", "孙权", "周瑜", "张伟"];

/** 表格假数据 */
export const tableData: 报表管理_数据统计_表格数据[] = Array.from({ length: 35 }).map((_, index) => {
	const community = 社区列表[index % 社区列表.length];
	const owner = 业主列表[index % 业主列表.length];
	const phone = (13560000000 + index).toString();
	const baseDate = dayjs("2025-01-01 08:00:00")
		.add(index, "day")
		.add(index % 6, "hour");

	return {
		小区: community,
		房屋: `${String.fromCharCode(65 + (index % 4))}-${(index % 3) + 1}-${(index % 8) + 1}0${(index % 4) + 1}`,
		业主: `${owner} ${phone}`,
		统计时间: baseDate.format("YYYY-MM-DD HH:mm:ss"),
		欠费: (120 + (index % 6) * 30).toFixed(2),
		实收: (820 + index * 12).toFixed(2),
		物业费: (180 + (index % 3) * 18).toFixed(2),
		押金: (index % 4 === 0 ? 500 : 0).toFixed(2),
		停车费: (90 + (index % 4) * 15).toFixed(2),
		煤气费: (60 + (index % 5) * 10).toFixed(2),
		取暖费: (index % 2 === 0 ? 150 + index * 2 : 0).toFixed(2),
		维修费: (index % 3 === 0 ? 80 + index : 45).toFixed(2),
		服务费: (40 + (index % 5) * 6).toFixed(2),
		其他: ((index % 7) * 12).toFixed(2),
		水费: (55 + (index % 4) * 8).toFixed(2),
		电费: (120 + (index % 6) * 9).toFixed(2),
		租金: (600 + (index % 4) * 100).toFixed(2),
		公摊费: (35 + (index % 3) * 5).toFixed(2),
	};
});
