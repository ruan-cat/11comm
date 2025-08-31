import { type OptionsType } from "plus-pro-components";

/** 商户管理员列表数据类型 */
export interface 商户管理员_列表数据 {
	物业名称: string;
	管理员: string;
	管理员电话: string;
	管理员ID: string;
	状态: string;
	创建时间: string;
}

/** 商户管理员列表查询VO */
export interface 商户管理员_列表查询_VO {
	物业名称?: string;
	管理员?: string;
	联系电话?: string;
}

/** 状态选项 */
export const 状态选项: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "禁用", value: "禁用" },
	{ label: "待审核", value: "待审核" },
];

/** 表格数据 */
export const tableData: 商户管理员_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		物业名称: `阳光物业${index + 1}`,
		管理员: `张经理${index + 1}`,
		管理员电话: `1388888${String(index + 1).padStart(4, "0")}`,
		管理员ID: `ADMIN${String(index + 1).padStart(4, "0")}`,
		状态: index % 3 === 0 ? "正常" : index % 3 === 1 ? "禁用" : "待审核",
		创建时间: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")} ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
	}));