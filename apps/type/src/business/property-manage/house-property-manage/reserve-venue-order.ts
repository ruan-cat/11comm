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
export const reservedVenueOptions: OptionsType = [
	{ label: "会议室", value: "会议室" },
	{ label: "健身房", value: "健身房" },
	{ label: "游泳池", value: "游泳池" },
	{ label: "羽毛球场", value: "羽毛球场" },
];

// ==================== 表单相关类型 ====================

/**
 * @description 场地预约订单表单数据类型
 * Reserve venue order form data type
 */
export interface ReserveVenueOrderFormVO {
	/** 订单编号 Order number */
	orderNumber: string;
	/** 场馆 Venue */
	venue: string;
	/** 场地 Site/Location */
	site: string;
	/** 预约人 Reserver name */
	reserver: string;
	/** 预约电话 Reservation phone */
	reservationPhone: string;
	/** 预约日期 Reservation date */
	reservationDate: string;
	/** 预约时间 Reservation time */
	reservationTime: string;
	/** 应收金额 Receivable amount */
	receivableAmount: string;
	/** 实收金额 Received amount */
	receivedAmount: string;
	/** 支付方式 Payment method */
	paymentMethod: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 备注 Remark */
	remark: string;
}

// ==================== 兼容旧中文名称 ====================

/**
 * @description 预约场地选项（兼容性）
 * Reserved venue options (for compatibility)
 */
export const 预约场地Options = reservedVenueOptions;

/**
 * @description 场地预约订单表单数据类型（兼容旧版本）
 * @deprecated 请使用 ReserveVenueOrderFormVO
 */
export type 场地预约订单_VO = ReserveVenueOrderFormVO;
