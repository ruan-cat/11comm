import type { OptionsType } from "plus-pro-components";

/** 水电抄表 列表数据 */
export interface 水电抄表_列表数据 {
	表ID: string;
	表类型: string;
	对象名称: string;
	上期度数: string;
	本期度数: string;
	上期读表时间: string;
	本期读表时间: string;
	创建时间: string;
}

/** 水电抄表 列表查询_VO */
export interface 水电抄表_列表查询_VO {
	表类型?: string;
	表ID?: string;
}

/** 表类型选项 */
export const 表类型Options: OptionsType = [
	{ label: "水表", value: "水表" },
	{ label: "电表", value: "电表" },
	{ label: "抄表", value: "抄表" },
];

/** 业主姓名列表 */
const 业主姓名列表 = [
	"张三",
	"李四",
	"王五",
	"赵六",
	"陈七",
	"刘八",
	"周九",
	"吴十",
	"郑先生",
	"孙女士",
	"杨先生",
	"何女士",
	"朱先生",
	"秦女士",
	"许先生",
	"林女士",
];

/** 小区名称列表 */
const 小区名称列表 = [
	"万科城市花园",
	"恒大名都",
	"碧桂园凤凰城",
	"保利香槟国际",
	"华润置地橡树湾",
	"龙湖滟澜山",
	"中海国际社区",
	"金地格林春岸",
	"招商雍景湾",
	"绿城百合花园",
];

/** 生成随机日期 */
function generateRandomDate(start: string, end: string): string {
	const startDate = new Date(start);
	const endDate = new Date(end);
	const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
	return new Date(randomTime).toISOString().replace("T", " ").substring(0, 19);
}

/** 生成真实的水表度数 */
function generateWaterMeterReading(): number {
	const baseReading = Math.floor(Math.random() * 5000) + 1000;
	return Math.floor(baseReading + Math.random() * 100);
}

/** 生成真实的电表度数 */
function generateElectricMeterReading(): number {
	const baseReading = Math.floor(Math.random() * 10000) + 5000;
	return Math.floor(baseReading + Math.random() * 200);
}

/** 生成单条假数据 */
function generateMockItem(): 水电抄表_列表数据 {
	const 表类型List = ["水表", "电表"];
	const 随机表类型 = 表类型List[Math.floor(Math.random() * 表类型List.length)];
	const 楼栋号 = Math.floor(Math.random() * 20) + 1;
	const 单元号 = Math.floor(Math.random() * 4) + 1;
	const 房号 = Math.floor(Math.random() * 18) + 1;
	const 业主姓名 = 业主姓名列表[Math.floor(Math.random() * 业主姓名列表.length)];
	const 小区名称 = 小区名称列表[Math.floor(Math.random() * 小区名称列表.length)];

	let 上期度数: number;
	let 本期度数: number;

	if (随机表类型 === "水表") {
		上期度数 = generateWaterMeterReading();
		本期度数 = 上期度数 + Math.floor(Math.random() * 50) + 5;
	} else {
		上期度数 = generateElectricMeterReading();
		本期度数 = 上期度数 + Math.floor(Math.random() * 150) + 20;
	}

	const now = new Date();
	const 本年一月 = new Date(now.getFullYear(), 0, 1);
	const 上期读表时间 = generateRandomDate("2024-01-01", "2024-12-31");
	const 本期读表时间 = generateRandomDate(本年一月.toISOString().substring(0, 10), now.toISOString().substring(0, 10));

	return {
		表ID: `${随机表类型 === "水表" ? "W" : "E"}${String(楼栋号).padStart(2, "0")}${String(单元号).padStart(2, "0")}${String(房号).padStart(3, "0")}`,
		表类型: 随机表类型,
		对象名称: `${小区名称}${楼栋号}栋${单元号}单元${房号}室 (${业主姓名})`,
		上期度数: String(上期度数),
		本期度数: String(本期度数),
		上期读表时间: 上期读表时间,
		本期读表时间: 本期读表时间,
		创建时间: generateRandomDate("2025-01-01", now.toISOString().substring(0, 10)),
	};
}

/** 生成35条假数据 */
export const tableData: 水电抄表_列表数据[] = Array(35)
	.fill(null)
	.map(() => generateMockItem());
