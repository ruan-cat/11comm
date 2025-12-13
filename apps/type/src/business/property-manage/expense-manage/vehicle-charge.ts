import type { OptionsType } from "../../../common";

/**
 * @description vehicle-charge列表数据
 * VehicleCharge list item
 */
export interface VehicleChargeListItem {
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
 * @description vehicle-charge列表查询参数
 * VehicleCharge list query parameters
 */
export interface VehicleChargeQueryParams {
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
export const vehicleChargeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 车位状态选项
 * Parking space status options
 */
export const 车位状态Options: OptionsType = [
	{ label: "空闲", value: "空闲" },
	{ label: "已占用", value: "已占用" },
	{ label: "维修中", value: "维修中" },
];
