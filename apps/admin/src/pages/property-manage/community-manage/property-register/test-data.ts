import { type OptionsType } from "plus-pro-components";

/** 产权登记-列表数据 */
export interface 产权登记_列表数据 {
	房屋产权ID: string;
	房屋ID: string;
	房屋编号: string;
	姓名: string;
	联系方式: string;
	身份证号: string;
	地址: string;
	状态: string;
}

/** 产权登记-列表查询VO */
export interface 产权登记_列表查询_VO {
	房屋ID?: string;
	房屋编号?: string;
	姓名?: string;
	联系方式?: string;
	身份证号?: string;
	地址?: string;
	审核状态?: string;
	楼栋?: string;
	单元?: string;
}

/** 产权登记-表单VO */
export interface 产权登记表单_VO {
	房屋产权ID?: string;
	房屋ID: string;
	房屋编号: string;
	姓名: string;
	联系方式: string;
	身份证号: string;
	地址: string;
	状态: string;
}

/** 单条表格数据 */
const tableDataItem: 产权登记_列表数据 = {
	房屋产权ID: "FR2024001",
	房屋ID: "H001",
	房屋编号: "1-101",
	姓名: "张三",
	联系方式: "13800138000",
	身份证号: "320101199001011234",
	地址: "江苏省南京市某某街道某某号1-101",
	状态: "审核通过",
};

/** 审核状态选项 */
export const 审核状态Options: OptionsType[] = [
	{
		label: "未审核",
		value: "未审核",
	},
	{
		label: "审核通过",
		value: "审核通过",
	},
	{
		label: "审核不通过",
		value: "审核不通过",
	},
];

/** 楼栋选项 */
export const 楼栋Options: OptionsType[] = [
	{
		label: "一楼",
		value: "一楼",
	},
	{
		label: "二楼",
		value: "二楼",
	},
	{
		label: "三楼",
		value: "三楼",
	},
	{
		label: "四楼",
		value: "四楼",
	},
	{
		label: "五楼",
		value: "五楼",
	},
	{
		label: "六楼",
		value: "六楼",
	},
];

/** 单元选项 */
export const 单元Options: OptionsType[] = [
	{
		label: "一单元",
		value: "一单元",
	},
	{
		label: "二单元",
		value: "二单元",
	},
	{
		label: "三单元",
		value: "三单元",
	},
	{
		label: "四单元",
		value: "四单元",
	},
];

/** 表格数据 */
export const tableData: 产权登记_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		房屋产权ID: `FR2024${String(index + 1).padStart(3, "0")}`,
		房屋ID: `H${String(Math.floor(index / 20) + 1).padStart(3, "0")}`,
		房屋编号: `${String(Math.floor(index / 4) + 1)}-${String((index % 4) + 1).padStart(2, "0")}${String(Math.floor(index / 8) + 1)}`,
		姓名: ["张三", "李四", "王五", "赵六", "孙七", "周八", "吴九", "郑十"][index % 8] +
					(["", "小", "大", "老"][index % 4]) +
					(["伟", "芳", "强", "丽", "华", "明", "红", "军"][index % 8]),
		联系方式: `1${3 + Math.floor(Math.random() * 7)}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}`,
		身份证号: `${3 + Math.floor(Math.random() * 2)}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}${String(Math.floor(Math.random() * 10))}`,
		地址: `江苏省${["南京市", "苏州市", "无锡市", "常州市", "南通市", "连云港市", "淮安市", "盐城市"][index % 8]}某某街道某某号${String(Math.floor(index / 4) + 1)}-${String((index % 4) + 1).padStart(2, "0")}${String(Math.floor(index / 8) + 1)}`,
		状态: ["未审核", "审核通过", "审核不通过"][index % 3],
	}));

/** 默认表单数据 */
export const defaultForm: 产权登记表单_VO = {
	房屋产权ID: "",
	房屋ID: "",
	房屋编号: "",
	姓名: "",
	联系方式: "",
	身份证号: "",
	地址: "",
	状态: "未审核",
};