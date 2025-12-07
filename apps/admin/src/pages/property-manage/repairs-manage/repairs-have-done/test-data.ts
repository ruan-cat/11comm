import type { OptionsType } from "plus-pro-components";

/** 报修已办 列表数据 */
export interface 报修已办_列表数据 {
	工单编号: string;
	位置: string;
	报修类型: string;
	维修类型: string;
	报修人: string;
	联系方式: string;
	预约时间: string;
	状态: string;
	备注: string;
}

/** 报修已办 列表查询_VO */
export interface 报修已办_列表查询_VO {
	维修类型?: string;
	报修人?: string;
	报修电话?: string;
	报修类型?: string;
	报修状态?: string;
	工单编号?: string;
}

/** 报修类型选项 */
export const 报修类型Options: OptionsType = [
	{ label: "水管维修", value: "水管维修" },
	{ label: "电路维修", value: "电路维修" },
	{ label: "家电维修", value: "家电维修" },
	{ label: "门窗维修", value: "门窗维修" },
	{ label: "公共设施维修", value: "公共设施维修" },
];

/** 维修类型选项 */
export const 维修类型Options: OptionsType = [
	{ label: "有偿服务", value: "有偿服务" },
	{ label: "无偿服务", value: "无偿服务" },
	{ label: "需要用料", value: "需要用料" },
	{ label: "无需用料", value: "无需用料" },
];

/** 报修状态选项 */
export const 报修状态Options: OptionsType = [
	{ label: "已完成", value: "已完成" },
	{ label: "已回访", value: "已回访" },
	{ label: "已关闭", value: "已关闭" },
	{ label: "已评价", value: "已评价" },
	{ label: "已退款", value: "已退款" },
];

/** 生成单条报修已办数据 */
function generateRandomRepairDone(index: number): 报修已办_列表数据 {
	const repairTypes = (Array.isArray(报修类型Options) ? 报修类型Options : []).map((item) => String(item.value));
	const maintainTypes = (Array.isArray(维修类型Options) ? 维修类型Options : []).map((item) => String(item.value));
	const statusTypes = (Array.isArray(报修状态Options) ? 报修状态Options : []).map((item) => String(item.value));

	const randomRepairType = repairTypes[Math.floor(Math.random() * repairTypes.length)];
	const randomMaintainType = maintainTypes[Math.floor(Math.random() * maintainTypes.length)];
	const randomStatus = statusTypes[Math.floor(Math.random() * statusTypes.length)];

	const startDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
	const appointmentDate = new Date(startDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);

	return {
		工单编号: `HD${String(index).padStart(6, "0")}`,
		位置: `C栋${Math.floor(Math.random() * 6) + 1}单元${Math.floor(Math.random() * 15) + 1}02室`,
		报修类型: randomRepairType,
		维修类型: randomMaintainType,
		报修人: `王${index}女士`,
		联系方式: `137${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		预约时间: appointmentDate.toISOString().split("T")[0],
		状态: randomStatus,
		备注: `处理结果说明${index}`,
	};
}

/** 表格假数据 */
export const tableData: 报修已办_列表数据[] = Array.from({ length: 35 }, (_, index) => generateRandomRepairDone(index + 1));

