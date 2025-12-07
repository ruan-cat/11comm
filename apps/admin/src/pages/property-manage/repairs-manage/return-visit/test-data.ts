import type { OptionsType } from "plus-pro-components";

/** 报修回访 列表数据 */
export interface 报修回访_列表数据 {
	工单编号: string;
	位置: string;
	报修类型: string;
	报修人: string;
	联系方式: string;
	预约时间: string;
	回访状态: string;
	备注: string;
}

/** 报修回访 列表查询_VO */
export interface 报修回访_列表查询_VO {
	工单编号?: string;
	报修类型?: string;
	报修人?: string;
	报修电话?: string;
	回访状态?: string;
}

/** 报修类型选项 */
export const 报修类型Options: OptionsType = [
	{ label: "水管维修", value: "水管维修" },
	{ label: "电路维修", value: "电路维修" },
	{ label: "家电维修", value: "家电维修" },
	{ label: "门窗维修", value: "门窗维修" },
	{ label: "公共设施维修", value: "公共设施维修" },
];

/** 回访状态选项 */
export const 回访状态Options: OptionsType = [
	{ label: "待回访", value: "待回访" },
	{ label: "已回访", value: "已回访" },
	{ label: "回访失败", value: "回访失败" },
	{ label: "无需回访", value: "无需回访" },
];

/** 生成单条报修回访数据 */
function generateRandomReturnVisit(index: number): 报修回访_列表数据 {
	const repairTypes = (Array.isArray(报修类型Options) ? 报修类型Options : []).map((item) => String(item.value));
	const visitTypes = (Array.isArray(回访状态Options) ? 回访状态Options : []).map((item) => String(item.value));

	const randomRepairType = repairTypes[Math.floor(Math.random() * repairTypes.length)];
	const randomVisitType = visitTypes[Math.floor(Math.random() * visitTypes.length)];

	const startDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);

	return {
		工单编号: `RV${String(index).padStart(6, "0")}`,
		位置: `E栋${Math.floor(Math.random() * 6) + 1}单元${Math.floor(Math.random() * 18) + 1}06室`,
		报修类型: randomRepairType,
		报修人: `钱${index}女士`,
		联系方式: `135${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		预约时间: startDate.toISOString().split("T")[0],
		回访状态: randomVisitType,
		备注: `回访记录${index}`,
	};
}

/** 表格假数据 */
export const tableData: 报修回访_列表数据[] = Array.from({ length: 35 }, (_, index) => generateRandomReturnVisit(index + 1));

