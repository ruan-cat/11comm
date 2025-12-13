import type { OptionsType } from "../../../common";

/**
 * @description house-charge列表数据
 * HouseCharge list item
 */
export interface HouseChargeListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description house-charge列表查询参数
 * HouseCharge list query parameters
 */
export interface HouseChargeQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const houseChargeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 费用标识选项
 * Expense identifier options
 */
export const 费用标识Options: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
];

/**
 * @description 房屋收费类型选项
 * House charge type options
 */
export const 房屋收费类型选项: OptionsType = [
	{ label: "基础费用", value: "基础费用" },
	{ label: "增值服务费", value: "增值服务费" },
];

/**
 * @description 状态选项
 * Status options
 */
export const 状态Options: OptionsType = [
	{ label: "未缴费", value: "未缴费" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "逾期", value: "逾期" },
];
