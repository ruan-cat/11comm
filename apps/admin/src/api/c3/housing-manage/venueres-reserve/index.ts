import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 场馆场地预约信息
 */
export interface VenueReservationMgrDTO {
	/** 场地ID */
	spaceId?: string;
	/** 场馆ID */
	venueId?: string;
	/** 预约人 */
	personName?: string;
	/** 预约电话 */
	personTel?: string;
	/** 预约日期 */
	appointmentDate?: string;
	/** 预约时间 */
	appointmentTime?: string;
	/** 应收金额 */
	receivableAmount?: number;
	/** 实收金额 */
	receivedAmount?: number;
	/** 支付方式 */
	payWay?: string;
	/** 状态 */
	state?: string;
	/** 备注 */
	remark?: string;
	/** 订单编号 */
	orderId?: string;
	/** 创建时间 */
	createTime?: string;
	/** 场馆名称 */
	venueName?: string;
	/** 场地名称 */
	spaceName?: string;
}

/**
 * 获取场馆场地预约列表查询参数
 */
export interface QueryVenueReservationsParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 预约时间 */
	appointmentTime?: string;
}

/**
 * 添加预约参数
 */
export interface AddVenueReservationDTO {
	/** 场地ID */
	spaceId?: string;
	/** 场馆ID */
	venueId?: string;
	/** 预约人 */
	personName: string;
	/** 预约电话 */
	personTel: string;
	/** 预约日期 */
	appointmentDate?: string;
	/** 预约时间 */
	appointmentTime: string;
	/** 应收金额 */
	receivableAmount?: number;
	/** 实收金额 */
	receivedAmount?: number;
	/** 支付方式 */
	payWay: string;
	/** 状态 */
	state?: string;
	/** 备注 */
	remark: string;
	/** 订单编号 */
	orderId?: string;
	/** 创建时间 */
	createTime?: string;
	/** 场馆名称 */
	venueName?: string;
	/** 场地名称 */
	spaceName?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取场馆场地预约列表
 * @description 分页获取场馆场地预约列表，支持条件查询
 */
export function queryVenueReservations<T = PageDTO<VenueReservationMgrDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryVenueReservationsParams>({
		url: "/c3-venueres/query-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 添加预约
 * @description 添加新的场馆场地预约信息
 */
export function addVenueReservation<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddVenueReservationDTO>({
		url: "/c3-venueres/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				personName: "",
				personTel: "",
				appointmentTime: "",
				payWay: "",
				remark: "",
			},
		},
		options,
	});
}
