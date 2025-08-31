import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 小区基础信息
 */
export interface CommunityData {
	/** 小区地址 */
	address: string;
	/** 城市编码 */
	cityCode: string;
	/** 每月单价 */
	feePrice: number;
	/** 小区名称 */
	name: string;
	/** 附近地标 */
	nearbyLandmarks: string;
	/** 缴费周期 */
	payFeeMonth: number;
	/** 客服电话 */
	tel: string;
	/** 社区编码 */
	value: string;
}

/**
 * 小区详情数据（包含ID）
 */
export interface CommunityDetailData extends CommunityData {
	/** 小区ID */
	communityId: string;
}

/**
 * 小区查询响应数据
 */
export interface CommunityQueryData {
	/** 小区地址 */
	address?: string;
	/** 城市编码 */
	cityCode?: string;
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	communityName?: string;
	/** 创建时间 */
	createTime?: string;
	/** 每月单价（保留两位小数) */
	feePrice?: number;
	/** 附近地标，如王府井北60米 */
	nearbyLandmarks?: string;
	/** 缴费周期 */
	payFeeMonth?: number;
	/** 物业公司名称 */
	propertyName?: string;
	/** 业务状态 1000 为待审核 1100为审核通过 1200审核拒绝 */
	state?: string;
	/** 客服电话 */
	tel?: string;
	/** 社区编码 */
	value?: string;
}

/**
 * 城市地名数据
 */
export interface CityAreaData {
	/** 城市编码 */
	areaCode?: string;
	/** 城市级别（101 省级 202 市州 303 区县） */
	areaLevel?: string;
	/** 城市名称 */
	areaName?: string;
	/** 城市地名主键ID */
	id?: number;
	/** 父级城市编码 */
	parentAreaCode?: string;
	/** 父级城市名称 */
	parentAreaName?: string;
}

/**
 * 未入驻物业小区数据
 */
export interface NotEnteredCommunityData {
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	name?: string;
}

/**
 * 添加小区参数
 */
export interface AddCommunityParams extends CommunityData {}

/**
 * 修改小区参数
 */
export interface ModifyCommunityParams extends CommunityDetailData {}

/**
 * 查询小区列表参数
 */
export interface QueryCommunityListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 城市编码 */
	cityCode?: string;
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	name?: string;
}

/**
 * 查询城市地名列表参数
 */
export interface QueryCityAreasParams {
	/** 需要获取的区域级别，101 省级 202 市州 303 区县 */
	areaLevel?: string;
	/** 需要获取的区域的父级城市编码，省级的父级为0 */
	parentAreaCode?: string;
}

/**
 * 删除小区参数
 */
export interface DeleteCommunityParams {
	/** 小区ID */
	communityId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加小区
 * @description 添加新的小区信息
 */
export function addCommunity<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddCommunityParams>({
		url: "/j5-info/community/add-community",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				address: "",
				cityCode: "",
				feePrice: 0,
				name: "",
				nearbyLandmarks: "",
				payFeeMonth: 12,
				tel: "",
				value: "",
			},
		},
		options,
	});
}

/**
 * 修改小区
 * @description 修改现有小区信息
 */
export function modifyCommunity<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyCommunityParams>({
		url: "/j5-info/community/modify-community",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				address: "",
				cityCode: "",
				communityId: "",
				feePrice: 0,
				name: "",
				nearbyLandmarks: "",
				payFeeMonth: 12,
				tel: "",
				value: "",
			},
		},
		options,
	});
}

/**
 * 获取小区列表（条件+分页）
 * @description 获取小区列表，支持按条件查询和分页
 */
export function queryCommunityList<T = PageDTO<CommunityQueryData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommunityListParams>({
		url: "/j5-info/community/query",
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
 * 获取城市地名列表
 * @description 获取指定级别的城市地名信息
 */
export function queryCityAreas<T = CityAreaData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCityAreasParams>({
		url: "/j5-info/community/query-areas",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 获取未入驻物业的小区名称列表
 * @description 获取尚未有物业公司入驻的小区列表
 */
export function queryNotEnteredCommunityList<T = NotEnteredCommunityData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j5-info/community/query-not-entered",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 删除小区
 * @description 删除指定的小区信息
 */
export function deleteCommunity<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteCommunityParams>({
		url: "/j5-info/community/remove-community/",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				communityId: "",
			},
		},
		options,
	});
}
