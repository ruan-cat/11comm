import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { ParamsBodyKey, ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { AxiosRequestConfig } from "axios";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";

/**
 * 场地添加参数
 */
interface SpaceAddDTO {
	/** 场地名称 */
	name: string;
	/** 每小时费用 */
	feeMoney: number;
	/** 管理员 */
	adminName: string;
	/** 管理员电话 */
	tel: string;
	/** 数据状态 */
	state: string;
}

/**
 * 场地更新参数
 */
interface SpaceUpdateDTO extends SpaceAddDTO {
	/** 场地ID */
	spaceId: string;
}

/**
 * 场地列表项
 */
interface CommunitySpaceMgrDTO {
	/** 场地编号 */
	space_id: string;
	/** 场地名称 */
	name: string;
	/** 开始时间 */
	start_time: string;
	/** 结束时间 */
	end_time: string;
	/** 每小时费用 */
	fee_money: number;
	/** 管理员 */
	admin_name: string;
	/** 管理员电话 */
	tel: string;
	/** 可预约状态 */
	state: string;
}

/**
 * 场地开放时间项
 */
interface CommunitySpaceTimeMgrDTO {
	/** 场地编号 */
	space_id: string;
	/** 几时 */
	hours: number;
	/** 是否可预约 */
	is_open: string;
	/** 时间编号 */
	time_id: string;
}

/**
 * 场馆信息
 */
interface CommunityVenueDTO {
	/** 场馆名称 */
	name: string;
	/** 备注／描述 */
	remark: string;
	/** 开场时间 */
	startTime: string;
	/** 关场时间 */
	endTime: string;
	/** 场馆编号 */
	venueId: string;
	/** 状态（可预约／不可预约） */
	statusCd: string;
	/** 小区ID */
	communityId: string;
	/** 关联业务ID */
	bId: string;
}

/**
 * 新增场馆参数
 */
interface CommunityVenueAddDTO {
	/** 场馆名称 */
	name: string;
	/** 备注／描述 */
	remark: string;
	/** 开场时间 */
	startTime: string;
	/** 关场时间 */
	endTime: string;
}

/**
 * 修改场馆参数
 */
interface CommunityVenueModifyDTO extends CommunityVenueAddDTO {
	/** 场馆编号 */
	venueId: string;
}

/**
 * 场馆场地预约信息
 */
interface VenueReservationMgrDTO {
	/** 场地ID */
	spaceId: string;
	/** 场馆ID */
	venueId: string;
	/** 预约人 */
	personName: string;
	/** 预约电话 */
	personTel: string;
	/** 预约日期 */
	appointmentDate: string;
	/** 预约时间 */
	appointmentTime: string;
	/** 应收金额 */
	receivableAmount: number;
	/** 实收金额 */
	receivedAmount: number;
	/** 支付方式 */
	payWay: string;
	/** 状态 */
	state: string;
	/** 备注 */
	remark: string;
	/** 订单编号 */
	orderId: string;
	/** 创建时间 */
	createTime: string;
	/** 场馆名称 */
	venueName: string;
	/** 场地名称 */
	spaceName: string;
}

/**
 * 预约订单信息
 */
interface OrderDTO {
	/** 订单编号 */
	cspId: string;
	/** 场馆名 */
	venueName: string;
	/** 场地名 */
	spaceName: string;
	/** 预约人名字 */
	personName: string;
	/** 预约人电话 */
	personTel: string;
	/** 预约日期 */
	appointmentTime: string;
	/** 预约时间段 */
	times: string;
	/** 应收金额 */
	receivableAmount: string;
	/** 实收金额 */
	receivedAmount: string;
	/** 支付方式：1为现金 2为微信 3为支付宝 */
	payWay: string;
	/** 支付方式名称 */
	payWayName: string;
	/** 场馆场地预约订单状态：S为预约成功 F为预约失败 W为待审核 F为待支付 CL为已取消 */
	state: string;
	/** 状态名称 */
	stateName: string;
	/** 创建时间 */
	createTime: string;
	/** 备注 */
	remark: string;
}

/**
 * 订单ID参数
 */
interface OrderIdDTO {
	/** 订单编号 */
	cspId: string;
}

/**
 * 添加场地
 * @description
 * 添加新的场地信息
 */
export function addSpace<T = string>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, SpaceAddDTO>({
		url: "/c3-housemanagement/sitemanagement/add-venue",
		options,
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				name: "",
				feeMoney: 0,
				adminName: "",
				tel: "",
				state: "",
			},
			...options.config,
		},
	});
}

/**
 * 修改场地
 * @description
 * 修改现有场地信息
 */
export function modifySpace<T = string>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, SpaceUpdateDTO>({
		url: "/c3-housemanagement/sitemanagement/modify-venue",
		options,
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				name: "",
				feeMoney: 0,
				adminName: "",
				tel: "",
				state: "",
				spaceId: "",
			},
			...options.config,
		},
	});
}

/**
 * 删除场地
 * @description
 * 删除指定ID的场地
 */
export function removeSpace<T = string[]>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/c3-housemanagement/sitemanagement/remove-venue",
		options,
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: [],
			...options.config,
		},
	});
}

/**
 * 获取场地列表
 * @description
 * 分页获取场地列表，支持条件查询
 */
export function querySpaceList<T = PageDTO<CommunitySpaceMgrDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<CommunitySpaceMgrDTO>>({
		url: "/c3-housemanagement/communityspacemgr/query-space-page",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
				space_id: "",
				name: "",
				state: "",
			},
			...options.config,
		},
	});
}

/**
 * 获取场地开放时间
 * @description
 * 获取指定场地的开放时间列表
 */
export function querySpaceTime<T = PageDTO<CommunitySpaceTimeMgrDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<CommunitySpaceTimeMgrDTO>>({
		url: "/c3-housemanagement/communityspacemgr/query-time",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				space_id: "",
			},
			...options.config,
		},
	});
}

/**
 * 修改场地开放时间
 * @description
 * 修改指定场地的开放时间
 */
export function modifySpaceTime<T = string>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, CommunitySpaceTimeMgrDTO>({
		url: "/c3-housemanagement/communityspacemgr/modify-time",
		options,
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				space_id: "",
				hours: 0,
				is_open: "",
				time_id: "",
			},
			...options.config,
		},
	});
}

/**
 * 获取场馆列表
 * @description
 * 分页获取场馆列表，支持条件查询
 */
export function queryVenueList<T = PageDTO<CommunityVenueDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<CommunityVenueDTO>>({
		url: "/c3-housemanagement/sitemanagement/query-stadium-page",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
				name: "",
				id: "",
			},
			...options.config,
		},
	});
}

/**
 * 新增场馆
 * @description
 * 添加新的场馆信息
 */
export function addVenue<T = string>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, CommunityVenueAddDTO>({
		url: "/c3-housemanagement/sitemanagement/add-stadium",
		options,
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				name: "",
				remark: "",
				startTime: "",
				endTime: "",
			},
			...options.config,
		},
	});
}

/**
 * 修改场馆
 * @description
 * 修改现有场馆信息
 */
export function modifyVenue<T = string>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, CommunityVenueModifyDTO>({
		url: "/c3-housemanagement/sitemanagement/modify-stadium",
		options,
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				name: "",
				remark: "",
				startTime: "",
				endTime: "",
				venueId: "",
			},
			...options.config,
		},
	});
}

/**
 * 删除场馆
 * @description
 * 删除指定ID的场馆
 */
export function deleteVenue<T = string[]>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/c3-housemanagement/sitemanagement/delete-stadium",
		options,
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: [],
			...options.config,
		},
	});
}

/**
 * 获取场馆场地预约列表
 * @description
 * 分页获取场馆场地预约列表，支持条件查询
 */
export function queryVenueReservations<T = PageDTO<VenueReservationMgrDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<VenueReservationMgrDTO>>({
		url: "/c3-venueres/query-page",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
				appointmentTime: "",
			},
			...options.config,
		},
	});
}

/**
 * 添加预约
 * @description
 * 添加新的场馆场地预约信息
 */
export function addReservation<T = string>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, VenueReservationMgrDTO>({
		url: "/c3-venueres/add",
		options,
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				spaceId: "",
				venueId: "",
				personName: "",
				personTel: "",
				appointmentDate: "",
				appointmentTime: "",
				receivableAmount: 0,
				receivedAmount: 0,
				payWay: "",
				state: "",
				remark: "",
				orderId: "",
				createTime: "",
				venueName: "",
				spaceName: "",
			},
			...options.config,
		},
	});
}

/**
 * 获取预约订单列表
 * @description
 * 分页获取预约订单列表，支持条件查询
 */
export function queryOrderList<T = PageDTO<OrderDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<OrderDTO>>({
		url: "/c3-paceapp/query-order-page",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "",
				spaceId: "",
				state: "",
				personName: "",
				personTel: "",
				appointmentTime: "",
			},
			...options.config,
		},
	});
}

/**
 * 取消预约
 * @description
 * 取消指定订单编号的预约
 */
export function removeOrder<T = string>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsBodyKey, T, OrderIdDTO>({
		url: "/c3-paceapp/remove-order",
		options,
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				cspId: "",
			},
			...options.config,
		},
	});
}
