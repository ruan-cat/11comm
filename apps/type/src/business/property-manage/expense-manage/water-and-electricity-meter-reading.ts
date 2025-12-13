import type { OptionsType } from "../../../common";

/**
 * @description water-and-electricity-meter-reading列表数据
 * WaterAndElectricityMeterReading list item
 */
export interface WaterAndElectricityMeterReadingListItem {
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
 * @description water-and-electricity-meter-reading列表查询参数
 * WaterAndElectricityMeterReading list query parameters
 */
export interface WaterAndElectricityMeterReadingQueryParams {
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
export const waterAndElectricityMeterReadingStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 表类型选项
 * Meter type options
 */
export const 表类型Options: OptionsType = [
	{ label: "水表", value: "水表" },
	{ label: "电表", value: "电表" },
];
