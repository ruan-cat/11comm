import type { OptionsType } from "plus-pro-components";

/** 欠费明细 列表数据 */
export interface 欠费明细_列表数据 {
	费用编号: string;
	房号: string;
	业主: string;
	业主电话: string;
	面积: string;
	费用项: string;
	开始时间: string;
	结束时间: string;
	欠费时长: string;
	欠费金额: string;
}

/** 欠费明细 列表查询_VO */
export interface 欠费明细_列表查询_VO {
	费用大类?: string;
	填写房屋编号?: string;
	开始时间?: string;
	结束时间?: string;
	小区?: string;
	填写业主名称?: string;
}

/** 费用大类选项 */
export const 费用大类Options: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "押金", value: "押金" },
	{ label: "停车费", value: "停车费" },
	{ label: "煤气费", value: "煤气费" },
	{ label: "服务费", value: "服务费" },
	{ label: "其他", value: "其他" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "公摊费", value: "公摊费" },
	{ label: "系统费用", value: "系统费用" },
	{ label: "租金", value: "租金" },
];

/** 小区选项 */
export const 小区Options: OptionsType = [
	{ label: "一期", value: "一期" },
	{ label: "二期", value: "二期" },
	{ label: "三期", value: "三期" },
];

/** 生成单条欠费明细数据 */
function generateRandomArrears(index: number): 欠费明细_列表数据 {
	const startDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
	const endDate = new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
	const days = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
	const amount = (Math.random() * 900 + 100).toFixed(2);

	return {
		费用编号: `AR${String(index).padStart(6, "0")}`,
		房号: `${Math.floor(Math.random() * 20) + 1}栋${Math.floor(Math.random() * 4) + 1}单元${Math.floor(Math.random() * 30) + 1}01`,
		业主: `业主${index}`,
		业主电话: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		面积: (80 + Math.random() * 60).toFixed(2),
		费用项: "物业费",
		开始时间: startDate.toISOString().split("T")[0],
		结束时间: endDate.toISOString().split("T")[0],
		欠费时长: `${days}天`,
		欠费金额: amount,
	};
}

/** 表格假数据 */
export const tableData: 欠费明细_列表数据[] = Array.from({ length: 35 }, (_, index) => generateRandomArrears(index + 1));

