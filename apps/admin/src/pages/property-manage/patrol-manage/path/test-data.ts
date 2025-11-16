import type { OptionsType } from "plus-pro-components";

/** 巡检路线列表数据 */
export interface 巡检路线_列表数据 {
	巡检点ID: string;
	巡检点名称: string;
	巡检点类型: string;
	巡检位置: string;
	开始时间: string;
	结束时间: string;
	排序: string;
}

/** 巡检路线表单数据 */
export interface 巡检路线_表单数据 {
	巡检点ID: string;
	巡检点名称: string;
	巡检点类型: string;
	巡检位置: string;
	开始时间: string;
	结束时间: string;
	排序: string;
}

/** 巡检路线列表查询VO */
export interface 巡检路线_列表查询_VO {
	巡检路线?: string;
}

/** 巡检点类型选项 */
export const 巡检点类型Options: OptionsType = [
	{ label: "大门", value: "大门" },
	{ label: "消防通道", value: "消防通道" },
	{ label: "停车场", value: "停车场" },
	{ label: "绿化带", value: "绿化带" },
	{ label: "垃圾站", value: "垃圾站" },
	{ label: "游乐设施", value: "游乐设施" },
	{ label: "健身器材", value: "健身器材" },
	{ label: "监控室", value: "监控室" },
];

/** 生成表格数据 */
const generateTableData = (): 巡检路线_列表数据[] => {
	const types = ["大门", "消防通道", "停车场", "绿化带", "垃圾站", "游乐设施", "健身器材", "监控室"];
	const locations = [
		"东区主入口",
		"西区侧门",
		"南大门",
		"北门消防通道",
		"A区停车场",
		"B区停车场",
		"中心花园",
		"儿童乐园",
		"老年活动中心",
		"地下车库入口",
		"1号楼前",
		"2号楼后",
		"3号楼侧面",
		"社区广场",
		"物业楼前",
		"配电房",
		"水泵房",
		"电梯间",
		"楼道",
		"天台",
	];

	const data: 巡检路线_列表数据[] = [];

	for (let i = 1; i <= 35; i++) {
		const typeIndex = (i - 1) % types.length;
		const locationIndex = Math.floor(Math.random() * locations.length);

		data.push({
			巡检点ID: `P${String(i).padStart(3, "0")}`,
			巡检点名称: `${types[typeIndex]}${i}号位`,
			巡检点类型: types[typeIndex],
			巡检位置: locations[locationIndex],
			开始时间: `${String(8 + Math.floor(Math.random() * 4)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
			结束时间: `${String(17 + Math.floor(Math.random() * 3)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
			排序: String(i * 10),
		});
	}

	return data;
};

/** 表格数据 */
export const tableData = generateTableData();
