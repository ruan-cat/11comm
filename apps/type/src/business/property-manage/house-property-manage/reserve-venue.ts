import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * @description reserve-venue列表数据
 * ReserveVenue list item
 */
export interface ReserveVenueListItem {
	/** ID */
	id: string;
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
	remark?: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * @description reserve-venue列表查询参数
 * ReserveVenue list query parameters
 */
export interface ReserveVenueQueryParams extends BaseListQueryParams {
	/** 预约人 Reserver */
	reserver?: string;
	/** 联系电话 Contact phone */
	contactPhone?: string;
	/** 场地类型 Venue type */
	venueType?: string;
	/** 预约状态 Reservation status */
	reservationStatus?: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const reserveVenueStatusOptions: OptionsType = [
	{ label: "待预约", value: "待预约" },
	{ label: "已预约", value: "已预约" },
	{ label: "已取消", value: "已取消" },
	{ label: "已完成", value: "已完成" },
];

/**
 * 场地预约表单VO
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
