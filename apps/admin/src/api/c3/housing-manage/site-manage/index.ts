import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 场地添加参数
 */
export interface SpaceAddDTO {
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
export interface SpaceUpdateDTO extends SpaceAddDTO {
	/** 场地ID */
	spaceId: string;
}

/**
 * 场地列表项
 */
export interface CommunitySpaceMgrDTO {
	/** 场地编号 */
	space_id?: string;
	/** 场地名称 */
	name?: string;
	/** 开始时间 */
	start_time?: string;
	/** 结束时间 */
	end_time?: string;
	/** 每小时费用 */
	fee_money?: number;
	/** 管理员 */
	admin_name?: string;
	/** 管理员电话 */
	tel?: string;
	/** 可预约状态 */
	state?: string;
}

/**
 * 获取场地列表查询参数
 */
export interface QuerySpaceListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 场地编号 */
	space_id?: string;
	/** 场地名称 */
	name?: string;
	/** 可预约状态 */
	state?: string;
}

/**
 * 场地开放时间项
 */
export interface CommunitySpaceTimeMgrDTO {
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
 * 获取场地开放时间查询参数
 */
export interface QuerySpaceTimeParams {
	/** 场地编号 */
	space_id: string;
}

/**
 * 场馆信息
 */
export interface CommunityVenueDTO {
	/** 场馆名称 */
	name?: string;
	/** 备注／描述 */
	remark?: string;
	/** 开场时间 */
	startTime?: string;
	/** 关场时间 */
	endTime?: string;
	/** 场馆编号 */
	venueId?: string;
	/** 状态（可预约／不可预约） */
	statusCd?: string;
	/** 小区ID */
	communityId?: string;
	/** 关联业务ID */
	bId?: string;
}

/**
 * 新增场馆参数
 */
export interface CommunityVenueAddDTO {
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
export interface CommunityVenueModifyDTO extends CommunityVenueAddDTO {
	/** 场馆编号 */
	venueId: string;
}

/**
 * 获取场馆列表查询参数
 */
export interface QueryVenueListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 场馆名称 */
	name: string;
	/** 场馆ID */
	id: string;
}

// ==================== 接口函数 ====================

/**
 * 添加场地
 * @description 添加新的场地信息
 */
export function addSpace<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, SpaceAddDTO>({
		url: "/c3-pacemgr/add-venue",
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
		},
		options,
	});
}

/**
 * 修改场地
 * @description 修改现有场地信息
 */
export function modifySpace<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, SpaceUpdateDTO>({
		url: "/c3-pacemgr/modify-venue",
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
		},
		options,
	});
}

/**
 * 删除场地
 * @description 删除指定ID的场地
 */
export function removeSpace<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/c3-pacemgr/remove-venue",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}

/**
 * 获取场地列表
 * @description 分页获取场地列表，支持条件查询
 */
export function querySpaceList<T = PageDTO<CommunitySpaceMgrDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QuerySpaceListParams>({
		url: "/c3-pacemgr/query-space-page",
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
 * 获取场地开放时间
 * @description 获取指定场地的开放时间列表
 */
export function querySpaceTime<T = PageDTO<CommunitySpaceTimeMgrDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QuerySpaceTimeParams>({
		url: "/c3-pacemgr/query-time",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				space_id: "",
			},
		},
		options,
	});
}

/**
 * 修改场地开放时间
 * @description 修改指定场地的开放时间
 */
export function modifySpaceTime<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CommunitySpaceTimeMgrDTO>({
		url: "/c3-pacemgr/modify-time",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				space_id: "",
				hours: 0,
				is_open: "",
				time_id: "",
			},
		},
		options,
	});
}

/**
 * 获取场馆列表
 * @description 分页获取场馆列表，支持条件查询
 */
export function queryVenueList<T = PageDTO<CommunityVenueDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryVenueListParams>({
		url: "/c3-pacemgr/query-stadium-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "",
				id: "",
			},
		},
		options,
	});
}

/**
 * 新增场馆
 * @description 添加新的场馆信息
 */
export function addVenue<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CommunityVenueAddDTO>({
		url: "/c3-pacemgr/add-stadium",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				name: "",
				remark: "",
				startTime: "",
				endTime: "",
			},
		},
		options,
	});
}

/**
 * 修改场馆
 * @description 修改现有场馆信息
 */
export function modifyVenue<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CommunityVenueModifyDTO>({
		url: "/c3-pacemgr/modify-stadium",
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
		},
		options,
	});
}

/**
 * 删除场馆
 * @description 删除指定ID的场馆
 */
export function deleteVenue<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/c3-pacemgr/delete-stadium",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}
