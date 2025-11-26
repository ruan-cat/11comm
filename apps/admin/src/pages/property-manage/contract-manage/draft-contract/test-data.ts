/** 合同类型选项 */
const contractTypeOptions = [
	{ label: "采购合同", value: "采购合同" },
	{ label: "销售合同", value: "销售合同" },
	{ label: "服务合同", value: "服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "装修合同", value: "装修合同" },
	{ label: "维护合同", value: "维护合同" },
];

/** 合同状态选项 */
const contractStatusOptions = [
	{ label: "草稿", value: "草稿" },
	{ label: "审批中", value: "审批中" },
	{ label: "已生效", value: "已生效" },
	{ label: "已终止", value: "已终止" },
	{ label: "已过期", value: "已过期" },
];

/** 业务受理列表数据接口 */
export interface 合同草稿_列表数据 {
	合同名称: string;
	合同编号: string;
	父合同编号: string;
	合同类型: string;
	经办人: string;
	合同金额: string;
	开始时间: string;
	结束时间: string;
	状态: string;
}

/** 合同类型列表查询VO */
export interface 合同类型_列表查询_VO {
	合同名称?: string;
	合同编号?: string;
	合同类型?: string;
}

/** 选项类型 */
export type OptionsType = {
	label: string;
	value: string;
};

/** 导出选项数据 */
export const contractTypeOptionsData: OptionsType[] = contractTypeOptions;
export const contractStatusOptionsData: OptionsType[] = contractStatusOptions;

/** 生成模拟数据的辅助函数 */
function generateMockData(index: number): 合同草稿_列表数据 {
	const contractTypes = contractTypeOptions.map((item) => item.value);
	const statuses = contractStatusOptionsData.map((item) => item.value);

	const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
	const getRandomDate = (start: Date, end: Date) => {
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0];
	};

	const startDate = new Date("2024-01-01");
	const endDate = new Date("2025-12-31");

	const contractNames = [
		"物业管理系统采购合同", "园区安保服务合同", "电梯维护保养合同", "停车场管理合同",
		"清洁服务外包合同", "绿化养护合同", "消防设备维护合同", "智能化系统集成合同",
		"物业管理服务合同", "设备采购合同", "维修服务合同", "装修工程合同",
		"安防监控合同", "供水系统维护合同", "供电系统维护合同", "垃圾清运合同"
	];

	const contractManagers = [
		"王经理", "李主管", "张主任", "赵科长", "陈助理", "刘专员",
		"孙总监", "周秘书", "吴顾问", "郑代表"
	];

	const companyNames = [
		"万科物业有限公司", "碧桂园物业", "恒大物业集团", "保利物业",
		"绿城服务", "金地物业", "中海物业", "龙湖智慧服务"
	];

	return {
		合同名称: `${companyNames[index % companyNames.length]}${contractNames[index % contractNames.length]}${index.toString().padStart(3, "0")}`,
		合同编号: `HT${new Date().getFullYear()}${(index + 100).toString().padStart(4, "0")}`,
		父合同编号:
			index % 4 === 0 ? `FHT${new Date().getFullYear() - 1}${(index + 50).toString().padStart(4, "0")}` : "",
		合同类型: getRandomElement(contractTypes),
		经办人: contractManagers[index % contractManagers.length],
		合同金额: `¥${(Math.random() * 500000 + 50000).toFixed(2)}`,
		开始时间: getRandomDate(startDate, endDate),
		结束时间: getRandomDate(new Date("2025-01-01"), new Date("2027-12-31")),
		状态: getRandomElement(statuses),
	};
}

/** 生成35条模拟数据 */
export const tableData: 合同草稿_列表数据[] = Array.from({ length: 35 }, (_, index) => generateMockData(index + 1));
