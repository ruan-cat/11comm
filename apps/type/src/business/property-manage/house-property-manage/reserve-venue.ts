import type { OptionsType } from "../../../common";

/**
 * @description reserve-venue列表数据
 * ReserveVenue list item
 */
export interface ReserveVenueListItem {
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
 * @description reserve-venue列表查询参数
 * ReserveVenue list query parameters
 */
export interface ReserveVenueQueryParams {
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
export const reserveVenueStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 场地预约表单VO
 * Reserve venue form VO
 */
export interface ReserveVenueFormVO {
	/** 预约人 Reserver */
	reserver: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 预约时间 Reservation time */
	reservationTime: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 场地类型 Venue type */
	venueType: string;
	/** 预约状态 Reservation status */
	reservationStatus: string;
	/** 使用人数 Number of users */
	numberOfUsers: number;
	/** 备注 Remark */
	remark: string;
}
