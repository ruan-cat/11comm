/** 合同类型选项 */
const contractTypeOptions = [
	{ label: "采购合同", value: "采购合同" },
	{ label: "销售合同", value: "销售合同" },
	{ label: "服务合同", value: "服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
];

/** 合同状态选项 */
const contractStatusOptions = [
	{ label: "草稿", value: "草稿" },
	{ label: "审批中", value: "审批中" },
	{ label: "已生效", value: "已生效" },
	{ label: "已终止", value: "已终止" },
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

	return {
		合同名称: `${getRandomElement(["年度采购", "项目开发", "技术服务", "系统集成"])}合同${index.toString().padStart(3, "0")}`,
		合同编号: `HT${Date.now().toString().slice(-8)}${index.toString().padStart(3, "0")}`,
		父合同编号:
			index % 5 === 0 ? `FHT${Date.now().toString().slice(-8)}${(index - 1).toString().padStart(3, "0")}` : "",
		合同类型: getRandomElement(contractTypes),
		经办人: getRandomElement(["张三", "李四", "王五", "赵六", "陈七", "刘八"]),
		合同金额: `¥${(Math.random() * 1000000 + 10000).toFixed(2)}`,
		开始时间: getRandomDate(startDate, endDate),
		结束时间: getRandomDate(new Date("2025-01-01"), new Date("2026-12-31")),
		状态: getRandomElement(statuses),
	};
}

/** 生成35条模拟数据 */
export const tableData: 合同草稿_列表数据[] = Array.from({ length: 35 }, (_, index) => generateMockData(index + 1));
