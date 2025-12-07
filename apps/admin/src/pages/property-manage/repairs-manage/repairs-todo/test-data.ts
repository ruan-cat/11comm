import type { OptionsType } from "plus-pro-components";

/** 报修待办 列表数据 */
export interface 报修待办_列表数据 {
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

/** 报修待办 列表查询_VO */
export interface 报修待办_列表查询_VO {
	工单编号?: string;
	报修人?: string;
	报修电话?: string;
	报修类型?: string;
	报修状态?: string;
}

/** 报修类型选项 */
export const 报修类型Options: OptionsType = [
	{ label: "水管维修", value: "水管维修" },
	{ label: "电路维修", value: "电路维修" },
	{ label: "家电维修", value: "家电维修" },
	{ label: "门窗维修", value: "门窗维修" },
	{ label: "公共设施维修", value: "公共设施维修" },
];

/** 报修状态选项 */
export const 报修状态Options: OptionsType = [
	{ label: "待处理", value: "待处理" },
	{ label: "待指派", value: "待指派" },
	{ label: "处理中", value: "处理中" },
	{ label: "待回单", value: "待回单" },
	{ label: "暂停", value: "暂停" },
];

/** 维修类型选项 */
export const 维修类型Options: OptionsType = [
	{ label: "有偿服务", value: "有偿服务" },
	{ label: "无偿服务", value: "无偿服务" },
	{ label: "需要用料", value: "需要用料" },
	{ label: "无需用料", value: "无需用料" },
];

/** 生成单条报修待办数据 */
function generateRandomTodo(index: number): 报修待办_列表数据 {
	const repairTypes = (Array.isArray(报修类型Options) ? 报修类型Options : []).map((item) => String(item.value));
	const statusTypes = (Array.isArray(报修状态Options) ? 报修状态Options : []).map((item) => String(item.value));
	const maintainTypes = (Array.isArray(维修类型Options) ? 维修类型Options : []).map((item) => String(item.value));

	const randomRepairType = repairTypes[Math.floor(Math.random() * repairTypes.length)];
	const randomStatus = statusTypes[Math.floor(Math.random() * statusTypes.length)];
	const randomMaintainType = maintainTypes[Math.floor(Math.random() * maintainTypes.length)];

	const startDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
	const appointmentDate = new Date(startDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);

	return {
		工单编号: `TD${String(index).padStart(6, "0")}`,
		位置: `D栋${Math.floor(Math.random() * 5) + 1}单元${Math.floor(Math.random() * 12) + 1}05室`,
		报修类型: randomRepairType,
		维修类型: randomMaintainType,
		报修人: `赵${index}先生`,
		联系方式: `136${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		预约时间: appointmentDate.toISOString().split("T")[0],
		状态: randomStatus,
		备注: `待办事项说明${index}`,
	};
}

/** 表格假数据 */
export const tableData: 报修待办_列表数据[] = Array.from({ length: 35 }, (_, index) => generateRandomTodo(index + 1));

