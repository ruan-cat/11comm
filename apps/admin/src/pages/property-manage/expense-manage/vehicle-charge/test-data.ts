import { type OptionsType } from "plus-pro-components";

/** 车辆收费表格数据类型 */
export interface 车辆收费_列表数据 {
	车牌号: string;
	"停车场(单位:号)": string;
	"车位(单位:号)": string;
	业主名称: string;
	联系方式: string;
	车位状态: string;
}

/** 车位状态选项 */
export const 车位状态Options: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "欠费", value: "欠费" },
	{ label: "车费释放", value: "车费释放" },
];

/** 生成35条车辆收费假数据 */
const tableDataItem: 车辆收费_列表数据 = {
	车牌号: "京A12345",
	"停车场(单位:号)": "1号停车场",
	"车位(单位:号)": "A-101",
	业主名称: "张三",
	联系方式: "13800138000",
	车位状态: "正常",
};

/** 表格数据 */
export const tableData: 车辆收费_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		车牌号: `京A${String(12345 + index).padStart(5, "0")}`,
		"停车场(单位:号)": `${Math.floor(index / 10) + 1}号停车场`,
		"车位(单位:号)": `${String.fromCharCode(65 + Math.floor(index / 10))}-${String((index % 10) + 1).padStart(3, "0")}`,
		业主名称: `业主${index + 1}`,
		联系方式: `138${String(10000000 + index).padStart(8, "0")}`,
		车位状态: 车位状态Options[index % 3].value,
	}));