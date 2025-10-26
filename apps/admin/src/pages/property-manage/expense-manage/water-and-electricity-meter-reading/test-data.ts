import { type OptionsType } from "plus-pro-components";

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

/** 生成单条假数据 */
function generateMockItem(): 水电抄表_列表数据 {
	const 表类型List = ["水表", "电表", "抄表"];
	const 随机表类型 = 表类型List[Math.floor(Math.random() * 表类型List.length)];

	return {
		表ID: `M${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
		表类型: 随机表类型,
		对象名称: `${随机表类型 === "水表" ? "水" : 随机表类型 === "电表" ? "电" : "综"}表${Math.floor(Math.random() * 20) + 1}号`,
		上期度数: String(Math.floor(Math.random() * 1000) + 100),
		本期度数: String(Math.floor(Math.random() * 1500) + 200),
		上期读表时间: "2024-12-01 00:00:00",
		本期读表时间: "2025-01-01 00:00:00",
		创建时间: "2025-01-26 10:30:00",
	};
}

/** 生成35条假数据 */
export const tableData: 水电抄表_列表数据[] = Array(35)
	.fill(null)
	.map(() => generateMockItem());