import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 单个我的小区数据展示模型
 */
export interface MyCommunityData {
	/** 小区地址 */
	address?: string;
	/** 城市编码 */
	cityCode?: string;
	/** 小区面积 */
	communityArea?: number;
	/** 小区所在的市 */
	communityCity?: string;
	/** 小区所在的区/县 */
	communityCounty?: string;
	/** 小区编码 */
	communityId?: string;
	/** 小区所在的省份 */
	communityProvince?: string;
	/** 结束时间 */
	endTime?: string;
	/** 地区X坐标 */
	mapX?: string;
	/** 地区Y坐标 */
	mapY?: string;
	/** 小区名称 */
	name?: string;
	/** 小区地标 */
	nearbyLandmarks?: string;
	/** 客服二维码 */
	qrCode?: string;
	/** 开始时间 */
	startTime?: string;
	/** 状态 1000为待审核 1100为审核成功 1200为审核拒绝 */
	state?: string;
	/** 客服电话 */
	tel?: string;
}

/**
 * 修改我的小区参数
 */
export interface ModifyMyCommunityParams {
	/** 小区面积 */
	communityArea?: number;
	/** 小区id */
	communityId: string;
	/** 客服二维码 */
	qrCode?: string;
	/** 客服电话 */
	tel?: string;
}

/**
 * 查看入驻小区参数
 */
export interface QueryMyCommunityParams {
	/** 小区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

// ==================== 接口函数 ====================

/**
 * 修改入驻小区（部分信息）
 * @description 修改当前入驻小区的部分信息
 */
export function modifyMyCommunity<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyMyCommunityParams>({
		url: "/j5-community/mycommunity/modify-my-community",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
			},
		},
		options,
	});
}

/**
 * 查看入驻小区
 * @description 查看当前入驻的小区详细信息
 */
export function queryMyCommunity<T = PageDTO<MyCommunityData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryMyCommunityParams>({
		url: "/j5-community/mycommunity/query-my-community",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}
