import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 物业公司新增和修改的条件
 */
export interface PropertyCompanyParams {
	/** 地址 */
	address: string;
	/** 成立日期 */
	createDate: string;
	/** 功能权限列表 */
	functions?: string[];
	/** 地标 */
	nearbyLandmarks: string;
	/** 开通小区标识 */
	openCommunityName?: string;
	/** 公司名称 */
	storeName: string;
	/** 联系电话 */
	tel: string;
	/** 公司法人 */
	userName: string;
}

/**
 * 菜单组
 */
export interface MenuGroup {
	/** 菜单组ID */
	gid?: string;
	/** 菜单组名称 */
	name: string;
	/** 状态码 */
	statusCd: string;
}

/**
 * 小区功能
 */
export interface CommunityFunction {
	/** 小区id */
	communityId: string;
	/** 小区名称 */
	communityName: string;
	/** 菜单组列表 */
	menuGroups: MenuGroup[];
}

/**
 * 物业公司查询返回结果
 */
export interface PropertyCompanyResult {
	/** 地址 */
	address: string;
	/** 管理员 */
	administrator: string;
	/** 成立日期 */
	createDate: string;
	/** 创建时间 */
	createTime: string;
	/** 地标 */
	nearbyLandmarks: string;
	/** 编号 */
	storeId: string;
	/** 名称 */
	storeName: string;
	/** 电话 */
	tel: string;
	/** 公司法人 */
	userName: string;
}

/**
 * 获取物业公司列表参数
 */
export interface GetCompanyListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 编号 */
	storeId?: string;
	/** 名称 */
	storeName?: string;
	/** 电话 */
	tel?: string;
}

/**
 * 加入小区列表
 */
export interface JoinCommunityList {
	/** 城市编码 */
	cityCode: string;
	/** 小区地址 */
	communityAddress: string;
	/** 小区id */
	communityId: string;
	/** 小区名称 */
	communityName: string;
	/** 状态 */
	state: string;
}

/**
 * 获取加入小区列表参数
 */
export interface GetJoinCommunityListParams {
	/** 小区id */
	communityId?: string;
	/** 物业id */
	communityMemberId: string;
	/** 小区名称 */
	communityName?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 小区功能菜单组
 */
export interface CommunityMenuGroup {
	/** 菜单组ID */
	gid?: string;
	/** 菜单组名称 */
	name: string;
	/** 状态码 */
	statusCd: string;
}

/**
 * 获取未加入小区列表参数
 */
export interface GetNoJoinCommunityListParams {
	/** 业务id */
	communityMemberId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加物业公司接口
 * @description 添加新的物业公司信息
 */
export function addPropertyCompany<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, PropertyCompanyParams>({
		url: "/j4-datamanager/addCompany",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				address: "",
				createDate: "",
				functions: [],
				nearbyLandmarks: "",
				openCommunityName: "",
				storeName: "",
				tel: "",
				userName: "",
			},
		},
		options,
	});
}

/**
 * 加入小区接口
 * @description 物业公司加入指定小区
 */
export function addJoinCommunity<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CommunityFunction>({
		url: "/j4-datamanager/addJoinCommunity",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				communityName: "",
				menuGroups: [],
			},
		},
		options,
	});
}

/**
 * 获取物业公司列表接口
 * @description 获取物业公司列表（条件+分页接口）
 */
export function getCompanyList<T = PageDTO<PropertyCompanyResult>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetCompanyListParams>({
		url: "/j4-datamanager/getCompanyList",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				storeId: "",
				storeName: "",
				tel: "",
			},
		},
		options,
	});
}

/**
 * 获取加入小区列表接口
 * @description 获取加入小区列表（条件+分页）
 */
export function getJoinCommunityList<T = PageDTO<JoinCommunityList>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetJoinCommunityListParams>({
		url: "/j4-datamanager/joinCommunityList",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				communityMemberId: "",
				communityName: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 修改物业公司接口
 * @description 修改物业公司信息
 */
export function modifyPropertyCompany<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, PropertyCompanyParams>({
		url: "/j4-datamanager/modifyCompany/{storeId}",
		httpParamWay: "path",
		upType: UpType.json,
		config: {
			url: "/j4-datamanager/modifyCompany/{storeId}",
			method: "PUT",
			data: {
				address: "",
				createDate: "",
				nearbyLandmarks: "",
				storeName: "",
				tel: "",
				userName: "",
			},
		},
		options,
	});
}

/**
 * 退出小区接口
 * @description 物业公司退出指定小区
 */
export function quitJoinCommunity<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, void>({
		url: "/j4-datamanager/quitJoinCommunity/{communityId}",
		httpParamWay: "path",
		config: {
			url: "/j4-datamanager/quitJoinCommunity/{communityId}",
			method: "PUT",
		},
		options,
	});
}

/**
 * 重置物业公司密码接口
 * @description 重置指定物业公司的密码
 */
export function resetCompanyPassword<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, void>({
		url: "/j4-datamanager/resetCompanyPassword/{storeId}",
		httpParamWay: "path",
		config: {
			url: "/j4-datamanager/resetCompanyPassword/{storeId}",
			method: "PUT",
		},
		options,
	});
}

/**
 * 删除物业公司接口
 * @description 删除指定的物业公司
 */
export function deleteCompany<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, void>({
		url: "/j4-datamanager/updateCompany/{storeId}",
		httpParamWay: "path",
		config: {
			url: "/j4-datamanager/updateCompany/{storeId}",
			method: "DELETE",
		},
		options,
	});
}

/**
 * 获取小区功能接口
 * @description 根据communityId获取小区功能菜单组
 */
export function getCommunityMenuGroupList<T = CommunityMenuGroup[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, void>({
		url: "/j4-datamanager/getCommunityMenuGroupList/{communityId}",
		httpParamWay: "path",
		config: {
			url: "/j4-datamanager/getCommunityMenuGroupList/{communityId}",
			method: "GET",
		},
		options,
	});
}

/**
 * 限制物业登录接口
 * @description 通过storeId和operate限制物业公司登录
 */
export function limitCompanyLogin<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, void>({
		url: "/j4-datamanager/limitCompanyLogin/{storeId}/operate/{operate}",
		httpParamWay: "path",
		config: {
			url: "/j4-datamanager/limitCompanyLogin/{storeId}/operate/{operate}",
			method: "PUT",
		},
		options,
	});
}

/**
 * 修改小区功能接口
 * @description 修改指定小区的功能菜单组
 */
export function updateCommunityMenuGroup<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CommunityFunction>({
		url: "/j4-datamanager/updateCommunityMenuGroup",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				communityName: "",
				menuGroups: [],
			},
		},
		options,
	});
}

/**
 * 获取未加入小区列表接口
 * @description 获取未加入小区列表
 */
export function getNoJoinCommunityList<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, GetNoJoinCommunityListParams>({
		url: "/j4-datamanager/noJoinCommunityList/{communityMemberId}",
		httpParamWay: "path",
		config: {
			url: "/j4-datamanager/noJoinCommunityList/{communityMemberId}",
			method: "GET",
			params: {
				communityMemberId: "",
			},
		},
		options,
	});
}
