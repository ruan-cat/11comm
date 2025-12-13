import type { OptionsType } from "../../../common";

/**
 * @description reserve-venue-order列表数据
 * ReserveVenueOrder list item
 */
export interface ReserveVenueOrderListItem {
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
 * @description reserve-venue-order列表查询参数
 * ReserveVenueOrder list query parameters
 */
export interface ReserveVenueOrderQueryParams {
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
export const reserveVenueOrderStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 预约场地选项
 * Reservation venue options
 */
export const 预约场地Options: OptionsType = [
	{ label: "会议室", value: "会议室" },
	{ label: "健身房", value: "健身房" },
	{ label: "游泳池", value: "游泳池" },
	{ label: "羽毛球场", value: "羽毛球场" },
];
