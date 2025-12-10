import type { OptionsType } from "plus-pro-components";

/** 电话报修 列表数据 */
export interface 电话报修_列表数据 {
	工单编号: string;
	位置: string;
	报修类型: string;
	报修人: string;
	联系方式: string;
	预约时间: string;
	超时时间: string;
	提交时间: string;
	状态: string;
	备注: string;
}

/** 电话报修 列表查询_VO */
export interface 电话报修_列表查询_VO {
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
	{ label: "已完成", value: "已完成" },
	{ label: "已取消", value: "已取消" },
];

/** 生成单条电话报修数据 */
function generateRandomPhoneRepair(index: number): 电话报修_列表数据 {
	const repairTypes = (Array.isArray(报修类型Options) ? 报修类型Options : []).map((item) => String(item.value));
	const statusTypes = (Array.isArray(报修状态Options) ? 报修状态Options : []).map((item) => String(item.value));
	const randomRepairType = repairTypes[Math.floor(Math.random() * repairTypes.length)];
	const randomStatus = statusTypes[Math.floor(Math.random() * statusTypes.length)];

	const startDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
	const appointmentDate = new Date(startDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
	const timeoutDate = new Date(appointmentDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);

	return {
		工单编号: `PR${String(index).padStart(6, "0")}`,
		位置: `B栋${Math.floor(Math.random() * 8) + 1}单元${Math.floor(Math.random() * 18) + 1}03室`,
		报修类型: randomRepairType,
		报修人: `李${index}先生`,
		联系方式: `139${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		预约时间: appointmentDate.toISOString().split("T")[0],
		超时时间: timeoutDate.toISOString().split("T")[0],
		提交时间: startDate.toISOString().replace("T", " ").slice(0, 19),
		状态: randomStatus,
		备注: `备注信息${index}`,
	};
}

/** 表格假数据 */
export const tableData: 电话报修_列表数据[] = Array.from({ length: 35 }, (_, index) =>
	generateRandomPhoneRepair(index + 1),
);
